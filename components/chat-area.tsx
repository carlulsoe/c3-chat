"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, Search, Paperclip, Sparkles, Compass, Code, BookOpen, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { useUser } from "@clerk/nextjs"
import ChatBox from "./chat-box"
import { api } from "@/convex/_generated/api"
import { useMutation } from 'convex/react';
import { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { Doc } from "@/convex/_generated/dataModel"
import { MessagePair } from "./message-pair"
import { ExampleQuestions } from "./example-questions"

interface ChatAreaProps {
    messages: Doc<"threadMessage">[]
}

export function ChatArea({ messages }: ChatAreaProps) {
    const [inputValue, setInputValue] = useState("")
    const user = useUser()
    const addMessage = useMutation(api.chat.addMessage)
    const createThread = useMutation(api.chat.createThread)
    const router = useRouter()

    const handleSendMessage = async (prompt: string) => {
        // if inputValue is empty, return
        if (prompt.length === 0) {
            return
        }
        let threadId: Id<"thread">
        // if there are no messages, create a new thread
        if (messages.length === 0) {
            threadId = await createThread({ message: prompt })
            await addMessage({ threadId, message: prompt, role: "user" })
            router.push(`/chat/${threadId}`)
        }
        // if there are messages, add message to thread
        if (messages.length > 0) {
            threadId = messages[0].threadId as Id<"thread">
            await addMessage({ threadId, message: prompt, role: "user" })
        }
    }

    return (
        <div className="flex-1 flex flex-col w-full h-full pt-8" >
            <ScrollArea className="flex-1">
                {messages.length === 0 && inputValue.length === 0 ? (
                    <ExampleQuestions onSelect={setInputValue} firstName={user.user?.firstName} />
                ) : (
                    <div className="space-y-6 w-full max-w-3xl mx-auto">
                        {messages.map((message) => (
                            <MessagePair key={message._id} userMessage={message} aiMessage={message} />
                        ))}
                    </div>
                )}
            </ScrollArea >
            <ChatBox inputValue={inputValue} setInputValue={setInputValue} onSendMessage={handleSendMessage} />
        </div >
    )
}
