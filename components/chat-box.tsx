"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, Paperclip, Search } from "lucide-react"

interface ChatBoxProps {
    inputValue: string
    setInputValue: (value: string) => void
    onSendMessage: (message: string) => void
    placeholder?: string
}

const ChatBox: React.FC<ChatBoxProps> = ({ inputValue, setInputValue, onSendMessage, placeholder = "Type your message here..." }) => {

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
            onSendMessage(inputValue)
            setInputValue("")
        }
    }

    return (
        <div className="p-6 bg-background w-[50%] mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
                <div className="bg-background rounded-lg border border-border">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none outline-none resize-none text-primary placeholder-primary/50 p-4 min-h-[120px] text-base"
                        rows={4}
                    />

                    <div className="flex items-center justify-between p-4 pt-0">
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 h-auto">
                                        <span className="text-sm">Gemini 2.5 Flash</span>
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" align="start" className="bg-background border-border">
                                    <DropdownMenuItem className="text-primary hover:bg-primary/10">Gemini 2.5 Flash</DropdownMenuItem>
                                    <DropdownMenuItem className="text-primary hover:bg-primary/10">GPT-4 Turbo</DropdownMenuItem>
                                    <DropdownMenuItem className="text-primary hover:bg-primary/10">Claude 3 Opus</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80 px-3 py-2 h-auto"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                <span className="text-sm">Search</span>
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80 px-3 py-2 h-auto"
                            >
                                <Paperclip className="h-4 w-4 mr-2" />
                                <span className="text-sm">Attach</span>
                            </Button>

                            <Button
                                type="submit"
                                size="icon"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground ml-2"
                                disabled={!inputValue.trim()}
                            >
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ChatBox
