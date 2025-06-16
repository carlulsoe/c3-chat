import {
  PersistentTextStreaming,
  StreamId,
  StreamIdValidator,
} from "@convex-dev/persistent-text-streaming";
import { api, components, internal } from "./_generated/api";
import { v } from "convex/values";
import {
  httpAction,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { google } from "@ai-sdk/google";
import {
  openrouter as defaultOpenrouter,
  createOpenRouter,
} from "@openrouter/ai-sdk-provider";
import { generateObject, streamText } from "ai";
import z from "zod";
import { Doc } from "./_generated/dataModel";
import { GenericActionCtx, paginationOptsValidator } from "convex/server";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming,
);

// Create a new chat thread
export const createThread = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const now = Date.now();
    const threadId = await ctx.db.insert("thread", {
      messages: [],
      createdAt: now,
      updatedAt: now,
      userId: user.subject,
      title: "...",
      pinned: false,
    });
    await ctx.scheduler.runAfter(0, internal.chat.generateThreadTitle, {
      threadId,
      message: args.message,
    });
    return threadId;
  },
});

// update thread title
export const generateThreadTitle = internalAction({
  args: {
    threadId: v.id("thread"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      system: "Generate a title for a new chat",
      messages: [
        {
          role: "user",
          content: args.message,
        },
      ],
      schema: z.object({
        title: z.string(),
      }),
    });
    await ctx.runMutation(internal.chat.updateThreadTitle, {
      threadId: args.threadId,
      title: object.title,
    });
  },
});

// update thread title
export const updateThreadTitle = internalMutation({
  args: {
    threadId: v.id("thread"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, {
      title: args.title,
    });
  },
});

// Add a message to a thread and (optionally) stream AI response
export const addMessage = mutation({
  args: {
    threadId: v.id("thread"),
    message: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    // Insert message
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    // check if user is the owner of the thread
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== user.subject) {
      throw new Error("User not authorized to add message to this thread");
    }
    const streamId = await persistentTextStreaming.createStream(ctx);
    const messageId = await ctx.db.insert("threadMessage", {
      threadId: args.threadId,
      message: args.message,
      role: args.role,
      streamId: streamId,
      model: args.model,
    });
    // Update thread's messages array
    if (thread) {
      await ctx.db.patch(args.threadId, {
        messages: [...thread.messages, { role: args.role, messageId }],
        updatedAt: Date.now(),
      });
    }
    return messageId;
  },
});

// Fetch all messages for a thread
export const getMessages = query({
  args: { threadId: v.id("thread") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const thread = await ctx.db.get(args.threadId);
    if (!thread) return [];
    if (thread?.userId !== user.subject) {
      throw new Error("User not authorized to get messages from this thread");
    }
    // Fetch all messages by their IDs
    const messages = await Promise.all(
      thread.messages.map(async (m) => {
        const msg = await ctx.db.get(m.messageId);
        return msg ? { ...msg, role: m.role } : null;
      }),
    );
    return messages.filter(Boolean);
  },
});

// Create a query that returns the chat body.
export const getChatBody = query({
  args: {
    streamId: StreamIdValidator,
  },
  handler: async (ctx, args) => {
    return await persistentTextStreaming.getStreamBody(
      ctx,
      args.streamId as StreamId,
    );
  },
});

export const getUserThreads = query({
  args: { paginationOpts: paginationOptsValidator },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const threads = await ctx.db
      .query("thread")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("pinned"), false))
      .order("desc")
      .paginate(args.paginationOpts);

    return threads;
  },
});

export const getPinnedUserThreads = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const threads = await ctx.db
      .query("thread")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .filter((q) => q.eq(q.field("pinned"), true))
      .order("desc")
      .collect();
    return threads;
  },
});

export const updateMessageStatus = internalMutation({
  args: {
    streamId: StreamIdValidator,
    status: v.union(
      v.literal("pending"),
      v.literal("streaming"),
      v.literal("done"),
      v.literal("error"),
    ),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db
      .query("threadMessage")
      .withIndex("by_streamId", (q) =>
        q.eq("streamId", args.streamId as StreamId),
      )
      .first();
    if (!message) {
      throw new Error("Message not found");
    }
    await ctx.db.patch(message._id, {
      status: args.status,
    });
  },
});

// Streaming logic (unchanged for now)
export const streamChat = httpAction(async (ctx, request) => {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const body = (await request.json()) as { streamId: string };
  const generateChat = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: GenericActionCtx<any>,
    request: Request,
    streamId: string,
    chunkAppender: (chunk: string) => Promise<void>,
  ) => {
    const threadId = await ctx.runQuery(internal.chat.getThreadIdFromStreamId, {
      streamId: streamId,
    });
    if (!threadId) {
      throw new Error("Thread not found");
    }
    const rawMessages: (Doc<"threadMessage"> | null)[] = await ctx.runQuery(
      api.chat.getMessages,
      { threadId },
    );
    const messages = rawMessages
      .filter((m) => m !== null)
      .map((m) => ({
        role: m.role,
        content: m.message,
      }));
    // get the model from the last message
    const model = rawMessages?.[rawMessages.length - 1]?.model;

    // Fetch user-specific OpenRouter API key
    const userApiKey = await ctx.runQuery(api.settings.getApiKey, {});

    // Decide which OpenRouter provider instance to use
    const openrouterProvider = userApiKey
      ? createOpenRouter({ apiKey: userApiKey, compatibility: "strict" })
      : defaultOpenrouter;

    const modelProvider =
      model && model.startsWith("gemini")
        ? google(model)
        : model
          ? openrouterProvider.chat(model)
          : google("gemini-2.0-flash");

    try {
      const { textStream } = streamText({
        system:
          "You are C3 Chat, an intelligent and friendly AI assistant. You are participating in a conversation with a user and have access to the full chat thread for context. Carefully read the conversation history and provide thoughtful, relevant, and concise responses to the user's latest message. Always reply in the same language as the user's message. If the user asks a question, answer it clearly and helpfully. If the context is unclear, politely ask for clarification. Avoid making up information, and keep your responses helpful and engaging.",
        model: modelProvider,
        messages,
      });

      for await (const chunk of textStream) {
        await chunkAppender(chunk);
      }

      await ctx.runMutation(internal.chat.updateMessageStatus, {
        streamId: streamId,
        status: "done",
      });
    } catch (error) {
      // Log for debugging, but ensure graceful degradation for user
      console.error("Error generating chat response:", error);

      // Update message status to error
      await ctx.runMutation(internal.chat.updateMessageStatus, {
        streamId: streamId,
        status: "error",
      });

      // Attempt to send an error message back to the stream so the UI can display it
      try {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        await chunkAppender(`Error: ${errorMessage}`);
      } catch {
        // Ignore any errors while sending the error message
      }
    }
  };

  const response = await persistentTextStreaming.stream(
    ctx,
    request,
    body.streamId as StreamId,
    generateChat,
  );

  // Set CORS headers appropriately based on environment.
  const origin =
    process.env.ENV !== "PRODUCTION"
      ? "http://localhost:3000"
      : "https://chat.carlulsoe.com";
  console.log(origin);
  console.log(process.env.NODE_ENV);
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Vary", "Origin");
  return response;
});

export const getThreadIdFromStreamId = internalQuery({
  args: {
    streamId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the threadMessage with the given streamId
    const message = await ctx.db
      .query("threadMessage")
      .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
      .first();

    if (!message) {
      return null;
    }

    return message.threadId;
  },
});

// Mutation to pin or unpin a thread
export const setThreadPinned = mutation({
  args: {
    threadId: v.id("thread"),
    pinned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const thread = await ctx.db.get(args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== user.subject) {
      throw new Error("User not authorized to pin/unpin this thread");
    }
    await ctx.db.patch(args.threadId, {
      pinned: args.pinned,
      updatedAt: Date.now(),
    });
    return { success: true };
  },
});
