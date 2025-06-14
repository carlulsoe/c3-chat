"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    // Mock saving the API key
    console.log("API Key saved:", apiKey);
    alert("API Key saved (mocked)");
  };

  return (
    <div className="flex flex-col items-center p-4"> {/* Centering content */}
      <div className="w-full max-w-lg"> {/* Constraining width */}
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Configure your application settings below. Your Open Router API key is stored securely.
        </p>
        <div className="flex flex-col gap-3"> {/* Increased gap slightly */}
          <div>
            <label htmlFor="apiKey" className="text-sm font-medium block mb-1"> {/* Label styling */}
              Open Router API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Open Router API Key"
              className="w-full" // Ensure input takes full width of its container
            />
          </div>
          <Button onClick={handleSave} className="mt-2 w-fit self-start"> {/* Align button to start */}
            Save API Key
          </Button>
        </div>
      </div>
    </div>
  );
}
