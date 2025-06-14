"use client"

import { ChatArea } from "@/components/chat-area"
import { AppSidebar } from "@/components/sidebar"
import { SidebarTrigger, useSidebar } from "./ui/sidebar"
import { Doc } from "@/convex/_generated/dataModel"


export default function ChatInterface({ messages }: { messages: Doc<"threadMessage">[] }) {
    const { open } = useSidebar()
    return (
        <div className="flex h-screen w-full bg-background">
            <AppSidebar />
            <div className="flex flex-col w-full h-full">
                <SidebarTrigger hidden={open} />
                <ChatArea messages={messages} />
            </div>
        </div>
    )
}
