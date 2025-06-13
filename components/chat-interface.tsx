"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"

export default function ChatInterface() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null)

    return (
        <div className="flex h-screen bg-background">
            <Sidebar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
            <ChatArea selectedChat={selectedChat} />
        </div>
    )
}
