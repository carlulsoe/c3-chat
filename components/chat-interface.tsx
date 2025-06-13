"use client"

import { useState } from "react"
import { ChatArea } from "@/components/chat-area"
import { AppSidebar } from "@/components/sidebar"
import { SidebarTrigger } from "./ui/sidebar"

export default function ChatInterface() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null)

    return (
        <div className="flex h-screen bg-background">
            <AppSidebar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
            <SidebarTrigger />
            <ChatArea selectedChat={selectedChat} />
        </div>
    )
}
