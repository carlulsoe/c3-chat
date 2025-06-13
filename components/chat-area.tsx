"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, Search, Paperclip, Sparkles, Compass, Code, BookOpen, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@radix-ui/react-dropdown-menu"
import { useUser } from "@clerk/nextjs"
import { InputBox } from "./input-box"

interface ChatAreaProps {
    selectedChat: string | null
}


interface Message {
    id: string
    content: string
    isUser: boolean
}

export function ChatArea({ selectedChat }: ChatAreaProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState("")
    const user = useUser()

    // Example questions shown in the UI
    const exampleQuestions = [
        "How does AI work?",
        "Are black holes real?",
        'How many Rs are in the word "strawberry"?',
        "What is the meaning of life?",
    ]



    return (
        <div className="flex-1 flex flex-col w-full h-full p-4 pt-8" >
            <ScrollArea className="flex-1">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold mb-8">How can I help you, {user.user?.firstName}?</h1>

                        <div className="flex gap-4 mb-12">
                            <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Create</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                                <Compass className="h-5 w-5" />
                                <span>Explore</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                                <Code className="h-5 w-5" />
                                <span>Code</span>
                            </Button>
                            <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                <span>Learn</span>
                            </Button>
                        </div>

                        <div className="space-y-4 w-full max-w-md">
                            {exampleQuestions.map((question, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    className="w-full justify-start text-foreground hover:bg-muted"
                                    onClick={() => {
                                        setInputValue(question)
                                    }}
                                >
                                    {question}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? "bg-primary text-foreground" : "bg-muted text-foreground"}`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
            <InputBox inputValue={inputValue} setInputValue={setInputValue} />
        </div>
    )
}
