import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Bot, ChevronDown, DollarSign, Info, Zap, Sparkles, Brain } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Model, models } from "@/lib/models";

interface ModelSelectorProps {
    selectedModel: Model | null;
    setSelectedModel: (model: Model) => void;
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

export const defaultModel: Model = models.find((model) => model.model === "gemini-2.5-flash")!

export function ModelSelector({ selectedModel, setSelectedModel }: ModelSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 p-2 h-auto">
                    <span className="text-sm">{selectedModel?.name}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="bg-background border-border w-80">
                {models.map((model) => (
                    <DropdownMenuItem
                        key={model.name}
                        className="text-primary hover:bg-primary/10 px-3 py-3 cursor-pointer"
                        onMouseDown={() => setSelectedModel(model)}
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
        </DropdownMenu>)
}