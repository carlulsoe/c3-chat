import { NavLink } from "react-router";

import { SidebarMenuButton } from "./ui/sidebar";
import { Doc } from "@/convex/_generated/dataModel";
import { PinButton } from "./pin-button";

interface SidebarChatButtonProps {
    selectedChat: string;
    thread: Doc<"thread">;
    isPinned: boolean;
}

export function SidebarChatButton({ selectedChat, thread, isPinned }: SidebarChatButtonProps) {
    return (
        <SidebarMenuButton
            asChild
            isActive={selectedChat === thread._id.toString()}
        >
            <div className="relative w-full">
                <NavLink
                    to={`/chat/${thread._id.toString()}`}
                    className="flex items-center w-full pr-6 py-2 truncate text-left"
                >
                    <span className="truncate">{thread.title}</span>
                </NavLink>
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    <PinButton threadId={thread._id} isPinned={isPinned} />
                </div>
            </div>
        </SidebarMenuButton>
    )
}
