import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Mutation to update (or insert) the Open Router API key for a user.
 * If a settings row for the user exists, update it; otherwise, insert a new one.
 */
export const updateApiKey = mutation({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }
    if (!args.apiKey.trim()) {
      throw new Error("API key must not be empty");
    }

    // Try to find an existing settings row for this user
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user.subject))
      .first();

    if (existing) {
      // Update the existing settings row
      await ctx.db.patch(existing._id, { apiKey: args.apiKey });
      return { updated: true };
    } else {
      // Insert a new settings row
      await ctx.db.insert("settings", {
        userId: user.subject,
        apiKey: args.apiKey,
      });
      return { created: true };
    }
  },
});

/**
 * Query to get the Open Router API key for the current user.
 * Returns the apiKey if it exists, otherwise null.
 */
export const getApiKey = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user", (q) => q.eq("userId", user.subject))
      .first();

    if (!settings) return null;
    return settings.apiKey;
  },
});
