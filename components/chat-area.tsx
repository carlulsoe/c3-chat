"use client"

import type React from "react"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/nextjs"
import ChatBox from "./chat-box"
import { api } from "@/convex/_generated/api"
import { useMutation } from 'convex/react';
import { Id } from "@/convex/_generated/dataModel"
import { useNavigate } from "react-router"
import { Doc } from "@/convex/_generated/dataModel"
import { MessagePair } from "./messages/message-pair"
import { ExampleQuestions } from "./example-questions"

/**
 * Props for the ChatArea component.
 */
interface ChatAreaProps {
    /**
     * An array of messages to be displayed in the chat area.
     * Each message is a Convex document of type "threadMessage".
     */
    messages: Doc<"threadMessage">[]
}

/**
 * ChatArea is responsible for displaying the list of chat messages
 * and includes the ChatBox component for user input.
 */
export function ChatArea({ messages }: ChatAreaProps) {
    const [inputValue, setInputValue] = useState("")
    const user = useUser()
    const addMessage = useMutation(api.chat.addMessage)
    const createThread = useMutation(api.chat.createThread)
    const navigate = useNavigate()

    const handleSendMessage = async (prompt: string, model: string) => {
        // if inputValue is empty, return
        if (prompt.length === 0) {
            return
        }
        let threadId: Id<"thread">
        // if there are no messages, create a new thread
        if (messages.length === 0) {
            threadId = await createThread({ message: prompt })
            await addMessage({ threadId, message: prompt, role: "user", model: model })
            navigate(`/chat/${threadId}`)
        }
        // if there are messages, add message to thread
        if (messages.length > 0) {
            threadId = messages[0].threadId as Id<"thread">
            await addMessage({ threadId, message: prompt, role: "user", model: model })
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
