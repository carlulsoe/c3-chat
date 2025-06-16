"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { models } from "@/lib/models"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ModelSelector, defaultModel } from "./model-selector"

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
    // Fetch the user's OpenRouter API key (null if not set, undefined while loading)
    const apiKey = useQuery(api.settings.getApiKey, {})

    // Determine which models should be available based on the presence of the key
    const availableModels = (apiKey ? models : models.filter((m) => !m.model.includes("/")))

    // Selected model state – default to the first available option
    const [selectedModel, setSelectedModel] = useState(availableModels.find((m) => m.model === defaultModel.model))

    // Ensure selected model is always one of the available models
    useEffect(() => {
        if (!availableModels.find((m) => m.model === selectedModel?.model)) {
            setSelectedModel(availableModels.find((m) => m.model === defaultModel.model))
        }
    }, [apiKey, availableModels, selectedModel?.model])

    // Extracted send logic to be reusable
    const sendMessage = () => {
        const cleanedInput = inputValue.trim()
        if (cleanedInput) {
            onSendMessage(cleanedInput, selectedModel?.model ?? "")
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
                            <ModelSelector selectedModel={selectedModel ?? defaultModel} setSelectedModel={setSelectedModel} />
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
