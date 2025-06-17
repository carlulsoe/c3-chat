"use client"

import { ChatArea } from "@/components/chat-area"
import { AppSidebar } from "@/components/sidebar"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { Doc } from "@/convex/_generated/dataModel"

/**
 * ChatInterface is the main component for the chat application.
 * It integrates the sidebar for navigation and the chat area for displaying messages and user input.
 */
export default function ChatInterface({ messages }: { messages: Doc<"threadMessage">[] }) {
    const { open } = useSidebar()
    return (
        <div className="flex h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex flex-col w-full h-full">
                <SidebarTrigger hidden={open} className="hover:bg-primary/10 ml-2 mt-3" />
                <ChatArea messages={messages} />
            </div>
        </div>
    )
}
