"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, Bot, Sparkles, Brain, Zap, DollarSign, Info } from "lucide-react"
import { models } from "@/lib/models"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

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
 * Get the appropriate icon for a given model
 */
const getModelIcon = (modelName: string) => {
    const name = modelName.toLowerCase()
    if (name.includes('gemini')) return <Sparkles className="h-4 w-4" />
    if (name.includes('deepseek')) return <Zap className="h-4 w-4" />
    if (name.includes('claude')) return <Bot className="h-4 w-4" />
    if (name.includes('o3') || name.includes('o4')) return <Brain className="h-4 w-4" />
    return <Bot className="h-4 w-4" />
}

/**
 * Get provider name from model string
 */
const getProviderName = (model: string) => {
    if (model.includes('/')) {
        const provider = model.split('/')[0]
        return provider.charAt(0).toUpperCase() + provider.slice(1)
    }
    return 'Google'
}

const defaultModel = "gemini-2.0-flash"

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
    const [selectedModel, setSelectedModel] = useState(availableModels.find((m) => m.model === defaultModel))

    // Ensure selected model is always one of the available models
    useEffect(() => {
        if (!availableModels.find((m) => m.model === selectedModel?.model)) {
            setSelectedModel(availableModels.find((m) => m.model === defaultModel))
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 h-auto">
                                        <span className="text-sm">{selectedModel?.name}</span>
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" align="start" className="bg-background border-border w-80">
                                    {availableModels?.map((model) => (
                                        <DropdownMenuItem
                                            key={model.name}
                                            className="text-primary hover:bg-primary/10 px-3 py-3 cursor-pointer"
                                            onClick={() => setSelectedModel(model)}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                        {getModelIcon(model.name)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{model.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {getProviderName(model.model)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {selectedModel?.model === model.model && (
                                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                    )}
                                                    {model.isOpenRouter ? (
                                                        <DollarSign className="h-4 w-4" />
                                                    ) : (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="h-4 w-4 flex items-center justify-center text-muted-foreground cursor-pointer">
                                                                    <Info className="h-4 w-4" />
                                                                </span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right" className="text-xs">
                                                                Free but rate limited
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </div>
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
