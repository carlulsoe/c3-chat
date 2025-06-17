export const models: Model[] = [
  {
    model: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    isOpenRouter: false,
  },
  {
    model: "gemini-2.5-flash-lite-preview-06-17",
    name: "Gemini 2.5 Flash Lite",
    isOpenRouter: false,
  },
  {
    model: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    isOpenRouter: false,
  },
  {
    model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    name: "DeepSeek R1 8b (Free)",
    isOpenRouter: true,
  },
  {
    model: "deepseek/deepseek-r1-0528",
    name: "DeepSeek R1 671B",
    isOpenRouter: true,
  },
  {
    model: "openai/o4-mini",
    name: "o4-mini",
    isOpenRouter: true,
  },
  {
    model: "openai/o3",
    name: "o3",
    isOpenRouter: true,
  },
  {
    model: "google/gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro",
    isOpenRouter: true,
  },
  {
    model: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    isOpenRouter: true,
  },
].sort((a, b) => a.name.localeCompare(b.name));

export interface Model {
  model: string;
  name: string;
  isOpenRouter: boolean;
}
