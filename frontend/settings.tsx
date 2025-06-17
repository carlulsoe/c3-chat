import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
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
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClear = async () => {
    setShowClearDialog(false);
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
        <Button variant="ghost" onMouseDown={() => navigate("/")}
          className="mb-2 cursor-pointer">
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
                  className="cursor-pointer"
                >
                  {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
            <div className="flex flex-row items-center gap-3 w-full justify-between">
              <Button
                onMouseDown={handleSave}
                className={`w-fit self-start cursor-pointer`}
              >
                {saved ? "Saved!" : "Save API Key"}
              </Button>
              <Button
                variant="destructive"
                className="w-fit self-start cursor-pointer"
                onMouseDown={() => setShowClearDialog(true)}
              >
                <Trash2 size={16} className="mr-2" />
                Clear API Key
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear API Key Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Clear API Key</DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to clear your Open Router API key? This action cannot be undone and you&apos;ll need to re-enter your key to continue using the application.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="justify-between w-full flex flex-row gap-2">

            <div className="flex-1 flex justify-start">
              <Button
                variant="destructive"
                onClick={handleClear} // Should be onClick since it is a destructive action
                className="w-full sm:w-auto cursor-pointer"
              >
                <Trash2 size={16} className="mr-2" />
                Clear API Key
              </Button>
            </div>
            <DialogClose asChild>
              <Button
                variant="outline"
                onMouseDown={() => setShowClearDialog(false)}
                className="w-full sm:w-auto cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
