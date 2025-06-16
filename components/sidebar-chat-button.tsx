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
            <div className="flex items-center justify-between w-full">
                <NavLink to={`/chat/${thread._id.toString()}`} className="flex-1 truncate text-left my-0">
                    <span>{thread.title}</span>
                </NavLink>
                <PinButton threadId={thread._id} isPinned={isPinned} />
            </div>
        </SidebarMenuButton>
    )
}
