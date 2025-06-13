import {
  PersistentTextStreaming,
  StreamId,
  StreamIdValidator,
} from "@convex-dev/persistent-text-streaming";
import { components } from "./_generated/api";
import { v } from "convex/values";
import { httpAction, mutation, query } from "./_generated/server";

const persistentTextStreaming = new PersistentTextStreaming(
  components.persistentTextStreaming,
);

// Create a stream using the component and store the id in the database with
// our chat message.
export const createChat = mutation({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const streamId = await persistentTextStreaming.createStream(ctx);
    const id = await ctx.db.insert("thread", {
      message: args.prompt,
      role: "user",
      threadId: streamId,
    });
    return id;
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

// Create an HTTP action that generates chunks of the chat body
// and uses the component to stream them to the client and save them to the database.
export const streamChat = httpAction(async (ctx, request) => {
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
