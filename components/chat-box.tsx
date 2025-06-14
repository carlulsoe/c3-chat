"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, Paperclip, Search } from "lucide-react"
import { models } from "@/lib/models"

interface ChatBoxProps {
    inputValue: string
    setInputValue: (value: string) => void
    onSendMessage: (message: string) => void
    placeholder?: string
}

const ChatBox: React.FC<ChatBoxProps> = ({ inputValue, setInputValue, onSendMessage, placeholder = "Type your message here..." }) => {
    const [selectedModel, setSelectedModel] = useState(models[0])
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        const cleanedInput = inputValue.trim()
        if (cleanedInput) {
            onSendMessage(cleanedInput)
            setInputValue("")
        }
    }

    return (
        <div className="p-6 bg-background w-full max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
                <div className="bg-background rounded-lg border border-border">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-none outline-none resize-none text-primary placeholder-primary/50 p-4 text-base h-20"
                        rows={4}
                    />

                    <div className="flex items-center justify-between p-4 pt-0">
                        <div className="flex items-center gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 h-auto">
                                        <span className="text-sm">{selectedModel?.name}</span>
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" align="start" className="bg-background border-border">
                                    {models?.map((model) => (
                                        <DropdownMenuItem key={model.name} className="text-primary hover:bg-primary/10" onClick={() => setSelectedModel(model)}>
                                            {model.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80 hover:bg-primary/10 px-3 py-2 h-auto"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                <span className="text-sm">Search</span>
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80 hover:bg-primary/10 px-3 py-2 h-auto"
                            >
                                <Paperclip className="h-4 w-4 mr-2" />
                                <span className="text-sm">Attach</span>
                            </Button>

                            <Button
                                type="submit"
                                size="icon"
                                className="bg-primary hover:bg-primary/80 text-primary-foreground ml-2"
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
