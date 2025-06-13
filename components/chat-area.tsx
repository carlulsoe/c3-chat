"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, Search, Paperclip, Sparkles, Compass, Code, BookOpen, ChevronDown } from "lucide-react"

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

    // Example questions shown in the UI
    const exampleQuestions = [
        "How does AI work?",
        "Are black holes real?",
        'How many Rs are in the word "strawberry"?',
        "What is the meaning of life?",
    ]

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        // Add user message
        const newUserMessage = {
            id: Date.now().toString(),
            content: inputValue,
            isUser: true,
        }

        setMessages([...messages, newUserMessage])
        setInputValue("")

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                content: `Here's a response to "${inputValue}"`,
                isUser: false,
            }
            setMessages((prev) => [...prev, aiResponse])
        }, 1000)
    }

    return (
        <div className="flex-1 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center">
                        <h1 className="text-2xl font-bold mb-8 text-white">How can I help you, Carl?</h1>

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
                                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
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
                                    className={`max-w-[80%] p-3 rounded-lg ${message.isUser ? "bg-primary text-white" : "bg-gray-800 text-white"}`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-4">
                <form onSubmit={handleSendMessage} className="relative">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message here..."
                        className="pr-24 py-6 bg-gray-800 border-gray-700"
                    />

                    <div className="absolute right-2 bottom-2 flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-gray-700 rounded-md px-2 py-1">
                            <span className="text-sm text-gray-300">Gemini 2.5 Flash</span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>

                        <Button type="button" size="icon" variant="ghost">
                            <Search className="h-5 w-5" />
                        </Button>

                        <Button type="button" size="icon" variant="ghost">
                            <Paperclip className="h-5 w-5" />
                        </Button>

                        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
                            <ChevronUp className="h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
