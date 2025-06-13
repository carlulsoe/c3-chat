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
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const threadMessage = defineTable({
  threadId: v.id("thread"),
  message: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant")),
});

export default defineSchema({
  thread,
  threadMessage,
});
