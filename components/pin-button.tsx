import { Button } from "./ui/button";
import { PinIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function PinButton({ threadId, isPinned }: { threadId: string, isPinned?: boolean }) {
    const setThreadPinned = useMutation(api.chat.setThreadPinned)

    return (
        <Button
            type="button"
            variant="ghost"
            className="hover:bg-primary/10 rounded-full p-0"
            title={isPinned ? "Unpin" : "Pin"}
            onClick={async (e) => {
                e.stopPropagation();
                await setThreadPinned({ threadId: threadId as Id<'thread'>, pinned: !isPinned })
            }}
        >
            <PinIcon className={`h-3 w-3 ${isPinned ? "fill-primary text-primary" : "text-gray-400"}`} />
        </Button>
    )
}