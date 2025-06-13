"use client";

import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function LLMsPage() {
  const [models, setModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listModelsAction = useAction(api.llms.listModels);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setIsLoading(true);
        const result = await listModelsAction(); // Call without arguments
        setModels(result || []); // Ensure result is not undefined/null
        setError(null);
      } catch (e: any) {
        console.error("Failed to fetch models:", e);
        setError("Failed to load models. Please try again later.");
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [listModelsAction]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading models...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Language Models</h1>
      {models.length > 0 ? (
        <ul className="list-disc pl-5">
          {models.map((modelId) => (
            <li key={modelId} className="mb-2">
              {modelId}
            </li>
          ))}
        </ul>
      ) : (
        <p>No models available at the moment.</p>
      )}
    </div>
  );
}
