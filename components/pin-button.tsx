import { Button } from "./ui/button";
import { PinIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export function PinButton({ threadId, isPinned }: { threadId: string, isPinned?: boolean }) {
    const setThreadPinned = useMutation(api.chat.setThreadPinned).withOptimisticUpdate((localStore, args) => {
        const notPinnedThreads = localStore.getQuery(api.chat.getUserThreads, { paginationOpts: { numItems: 1000, cursor: null } })
        const pinnedThreads = localStore.getQuery(api.chat.getPinnedUserThreads)

        if (notPinnedThreads && pinnedThreads) {
            if (args.pinned) {
                // Pinning: move thread from notPinned to pinned
                const threadToPin = notPinnedThreads.page.find(thread => thread._id === args.threadId);
                if (threadToPin) {
                    // Remove from notPinned threads
                    const updatedNotPinned = {
                        ...notPinnedThreads,
                        page: notPinnedThreads.page.filter(thread => thread._id !== args.threadId)
                    };
                    localStore.setQuery(api.chat.getUserThreads, { paginationOpts: { numItems: 1000, cursor: null } }, updatedNotPinned);

                    // Add to pinned threads with updated pinned status
                    const updatedPinned = [{ ...threadToPin, pinned: true, updatedAt: Date.now() }, ...pinnedThreads];
                    localStore.setQuery(api.chat.getPinnedUserThreads, {}, updatedPinned);
                }
            } else {
                // Unpinning: move thread from pinned to notPinned
                const threadToUnpin = pinnedThreads.find(thread => thread._id === args.threadId);
                if (threadToUnpin) {
                    // Remove from pinned threads
                    const updatedPinned = pinnedThreads.filter(thread => thread._id !== args.threadId);
                    localStore.setQuery(api.chat.getPinnedUserThreads, {}, updatedPinned);

                    // Add to notPinned threads with updated pinned status
                    const updatedNotPinned = {
                        ...notPinnedThreads,
                        page: [{ ...threadToUnpin, pinned: false, updatedAt: Date.now() }, ...notPinnedThreads.page]
                    };
                    localStore.setQuery(api.chat.getUserThreads, { paginationOpts: { numItems: 1000, cursor: null } }, updatedNotPinned);
                }
            }
        }
    })

    return (
        <Button
            type="button"
            variant="ghost"
            className="hover:bg-primary/10 rounded-full p-0 m-0"
            title={isPinned ? "Unpin" : "Pin"}
            onMouseDown={async (e) => {
                e.stopPropagation();
                await setThreadPinned({ threadId: threadId as Id<'thread'>, pinned: !isPinned })
            }}
        >
            <PinIcon className={`h-3 w-3 ${isPinned ? "fill-primary text-primary" : "text-gray-400"}`} />
        </Button>
    )
}