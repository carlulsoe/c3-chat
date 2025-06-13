"use client"

import { useState } from "react"
import { ChatArea } from "@/components/chat-area"
import { AppSidebar } from "@/components/sidebar"
import { SidebarTrigger } from "./ui/sidebar"
import { Doc } from "@/convex/_generated/dataModel"


export default function ChatInterface({ messages }: { messages: Doc<"threadMessage">[] }) {
    return (
        <div className="flex h-screen w-full bg-background">
            <div className="pl-2 py-3">
                <SidebarTrigger />
            </div>
            <div className="flex flex-col w-full h-full">
                <AppSidebar />
                <ChatArea messages={messages} />
            </div>
        </div>
    )
}
