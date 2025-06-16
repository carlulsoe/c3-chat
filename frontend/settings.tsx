import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const storedApiKey = useQuery(api.settings.getApiKey);
  const updateApiKey = useMutation(api.settings.updateApiKey);
  const clearApiKey = useMutation(api.settings.clearApiKey);
  const navigate = useNavigate();
  useEffect(() => {
    if (storedApiKey !== undefined && apiKey === "") {
      setApiKey(storedApiKey ?? "");
    }
  }, [storedApiKey, apiKey]);

  const handleSave = async () => {
    await updateApiKey({ apiKey });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = async () => {
    // Show a modal to confirm clearing the API key
    if (!window.confirm("Are you sure you want to clear your Open Router API key? This action cannot be undone.")) {
      return;
    }
    await clearApiKey({});
    setApiKey("");
  };

  // Handlers for hold-to-show
  const handleShowDown = () => setShowApiKey(true);
  const handleShowUp = () => setShowApiKey(false);

  return (
    <div className="relative min-h-screen w-full bg-background">
      {/* Back button in top-left, outside centering flex */}
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => navigate("/")}
          className="mb-2">
          <span className="mr-2">←</span> Back
        </Button>
      </div>
      {/* Centered settings card */}
      <div className="flex items-center justify-center min-h-screen w-full">
        <div className="w-full max-w-lg bg-card rounded-lg shadow-lg p-8 flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Configure your application settings below. Your Open Router API key is stored in plain text. I hope convex is secure enough.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <div>
              <label htmlFor="apiKey" className="text-sm font-medium block mb-1">
                Open Router API Key
              </label>
              <div className="flex items-center gap-2 w-full">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Enter your Open Router API Key"
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={showApiKey ? "Hide API Key" : "Show API Key"}
                  onMouseDown={handleShowDown}
                  onMouseUp={handleShowUp}
                  onMouseLeave={handleShowUp}
                  onTouchStart={handleShowDown}
                  onTouchEnd={handleShowUp}
                  onTouchCancel={handleShowUp}
                  tabIndex={-1}
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 w-full justify-between">
              <Button onClick={handleSave} className=" w-fit self-start">
                Save API Key
              </Button>
              {saved && (
                <span className="text-sm text-green-600 mt-2 ml-2">Saved!</span>
              )}
              <Button
                variant="destructive"
                className="w-fit self-start"
                onClick={handleClear}
              >
                Clear API Key
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
