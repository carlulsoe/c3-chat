"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp } from "lucide-react"
import { models } from "@/lib/models"

/**
 * Props for the ChatBox component.
 */
interface ChatBoxProps {
    /** The current value of the input field. */
    inputValue: string
    /** Function to update the input field's value. */
    setInputValue: (value: string) => void
    /** Function to call when a message is sent. It takes the message string and the selected model string as arguments. */
    onSendMessage: (message: string, model: string) => void
    /** Optional placeholder text for the input field. Defaults to "Type your message here...". */
    placeholder?: string
}

/**
 * ChatBox is the component that provides the text input area for users to type and send messages.
 * It also includes options for selecting a model and attaching files (though file attachment is a placeholder).
 */
const ChatBox: React.FC<ChatBoxProps> = ({ inputValue, setInputValue, onSendMessage, placeholder = "Type your message here..." }) => {
    const [selectedModel, setSelectedModel] = useState(models[0])

    // Extracted send logic to be reusable
    const sendMessage = () => {
        const cleanedInput = inputValue.trim()
        if (cleanedInput) {
            onSendMessage(cleanedInput, selectedModel.model)
            setInputValue("")
        }
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            // Check if input is not empty before sending, mirroring the Button's disabled logic.
            // sendMessage itself also checks, but this prevents calling preventDefault unnecessarily if input is empty.
            if (inputValue.trim()) {
                sendMessage()
            }
        }
    }

    return (
        <div className="py-6 bg-background w-full max-w-3xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative">
                <div className="bg-background rounded-lg border border-border">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
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
