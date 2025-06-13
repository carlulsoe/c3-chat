import {
  PersistentTextStreaming,
  StreamId,
} from "@convex-dev/persistent-text-streaming";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { httpAction, mutation, query } from "./_generated/server";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming,
);

// Create a new chat thread
export const createThread = mutation({
  handler: async (ctx) => {
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
    });
    return threadId;
  },
});

// Add a message to a thread and (optionally) stream AI response
export const addMessage = mutation({
  args: {
    threadId: v.id("thread"),
    message: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
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
    const messageId = await ctx.db.insert("threadMessage", {
      threadId: args.threadId,
      message: args.message,
      role: args.role,
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

// Streaming logic (unchanged for now)
export const streamChat = httpAction(async (ctx, request) => {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const body = (await request.json()) as { streamId: string };
  const generateChat = async (
    ctx: any,
    request: any,
    streamId: any,
    chunkAppender: (arg0: string) => any,
  ) => {
    await chunkAppender("Hi there!");
    await chunkAppender("How are you?");
    await chunkAppender("Pretend I'm an AI or something!");
  };

  const response = await persistentTextStreaming.stream(
    ctx,
    request,
    body.streamId as StreamId,
    generateChat,
  );

  // Set CORS headers appropriately.
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Vary", "Origin");
  return response;
});
