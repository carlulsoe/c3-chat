import { action } from "./_generated/server";

const availableModels = [
  "openai:gpt-4o-mini",
  "anthropic:claude-3-haiku-20240307",
  "openai:gpt-4-turbo",
  "anthropic:claude-3-sonnet-20240229",
];

export const listModels = action({
  handler: async () => {
    return availableModels;
  },
});
