"use client"

import { useState } from "react"
import { ChatArea } from "@/components/chat-area"
import { AppSidebar } from "@/components/sidebar"
import { SidebarTrigger } from "./ui/sidebar"

export default function ChatInterface() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null)
    return (
        <div className="flex h-screen w-full bg-background">
            <div className="pl-2 py-3">
                <SidebarTrigger />
            </div>
            <AppSidebar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
            <ChatArea selectedChat={selectedChat} />
        </div>
    )
}
