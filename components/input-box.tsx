"use client"
import React, { useState } from "react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Paperclip, Search } from "lucide-react";

interface InputBoxProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}


interface Message {
    id: string
    content: string
    isUser: boolean
}

export const InputBox: React.FC<InputBoxProps> = ({
    inputValue,
    setInputValue,
    placeholder = "Type your message...",
    disabled = false,
}) => {
    const [messages, setMessages] = useState<Message[]>([])
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
        <div className="p-4">
            <form onSubmit={handleSendMessage} className="relative">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="pr-24 py-6 bg-muted border-border"
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            >
                                <span className="text-sm text-muted-foreground">Gemini 2.5 Flash</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="end">
                            <DropdownMenuItem>Gemini 2.5 Flash</DropdownMenuItem>
                            <DropdownMenuItem>GPT-4 Turbo</DropdownMenuItem>
                            <DropdownMenuItem>Claude 3 Opus</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

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
    );
};

export default InputBox;
