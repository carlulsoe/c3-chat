import { StreamIdValidator } from "@convex-dev/persistent-text-streaming";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export const thread = defineTable({
  messages: v.array(
    v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      messageId: v.id("threadMessage"),
    }),
  ),
  userId: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  title: v.string(),
  pinned: v.boolean(),
})
  .index("by_user", ["userId", "updatedAt"])
  .index("by_pinned", ["pinned"]);

export const threadMessage = defineTable({
  threadId: v.id("thread"),
  message: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant")),
  model: v.optional(v.string()),
  streamId: StreamIdValidator,
  status: v.optional(
    v.union(
      v.literal("pending"),
      v.literal("streaming"),
      v.literal("done"),
      v.literal("error"),
    ),
  ),
}).index("by_streamId", ["streamId"]);

export const settings = defineTable({
  userId: v.string(),
  apiKey: v.string(),
}).index("by_user", ["userId"]);

export default defineSchema({
  thread,
  threadMessage,
  settings,
});
