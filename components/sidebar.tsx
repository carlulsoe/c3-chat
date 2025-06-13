"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Search, PinIcon, Menu } from "lucide-react"

interface SidebarProps {
    onSelectChat: (chatId: string) => void
    selectedChat: string | null
}

interface ChatItem {
    id: string
    title: string
    isPinned?: boolean
    lastUpdated: Date
}

export function Sidebar({ onSelectChat, selectedChat }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true)

    // Mock data for chat threads
    const pinnedChats: ChatItem[] = [
        { id: "1", title: "Starfinder Mechanic Class Q...", isPinned: true, lastUpdated: new Date() },
        { id: "2", title: "Dreading work tomorrow", isPinned: true, lastUpdated: new Date() },
    ]

    const recentChats: ChatItem[] = [
        { id: "3", title: "Invincible Great Purge to Ca...", lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { id: "4", title: "Trouble setting up VM enviro...", lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { id: "5", title: "Myostatin Inhibitor Explanati...", lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
        { id: "6", title: "Myostatin Inhibitor Explanati...", lastUpdated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
        { id: "7", title: "AI Goal to Plan Tool with Nex...", lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    ]

    const olderChats: ChatItem[] = [
        { id: "8", title: "SaaS Business Brainstorming...", lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        { id: "9", title: "Excel formula for compound i...", lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        {
            id: "10",
            title: "Nextjs default layout with cu...",
            lastUpdated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        },
        { id: "11", title: "Convex schema to Zod sche...", lastUpdated: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
        { id: "12", title: "AI Business Recommendations", lastUpdated: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000) },
        {
            id: "13",
            title: "AI Consultation for Workflow ...",
            lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
    ]

    return (
        <div
            className={`border-r border-gray-800 flex flex-col ${isOpen ? "w-60" : "w-0"} transition-all duration-300`}
        >
            {isOpen && (
                <>
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-white">T3.chat</h1>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="px-4 pb-2">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">New Chat</Button>
                    </div>

                    <div className="px-4 py-2 relative">
                        <Search className="absolute left-6 top-[14px] h-4 w-4 text-gray-400" />
                        <Input placeholder="Search your threads..." className="pl-8 bg-background/20 border-gray-700" />
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="px-2">
                            <div className="py-2">
                                <div className="flex items-center px-2 py-1 text-xs text-gray-400">
                                    <PinIcon className="h-3 w-3 mr-1" /> Pinned
                                </div>
                                {pinnedChats.map((chat) => (
                                    <Button
                                        key={chat.id}
                                        variant={selectedChat === chat.id ? "secondary" : "ghost"}
                                        className="w-full justify-start text-sm font-normal py-2 h-auto"
                                        onClick={() => onSelectChat(chat.id)}
                                    >
                                        <span className="truncate">{chat.title}</span>
                                    </Button>
                                ))}
                            </div>

                            <div className="py-2">
                                <div className="px-2 py-1 text-xs text-gray-400">Last 7 Days</div>
                                {recentChats.map((chat) => (
                                    <Button
                                        key={chat.id}
                                        variant={selectedChat === chat.id ? "secondary" : "ghost"}
                                        className="w-full justify-start text-sm font-normal py-2 h-auto"
                                        onClick={() => onSelectChat(chat.id)}
                                    >
                                        <span className="truncate">{chat.title}</span>
                                    </Button>
                                ))}
                            </div>

                            <div className="py-2">
                                <div className="px-2 py-1 text-xs text-gray-400">Last 30 Days</div>
                                {olderChats.map((chat) => (
                                    <Button
                                        key={chat.id}
                                        variant={selectedChat === chat.id ? "secondary" : "ghost"}
                                        className="w-full justify-start text-sm font-normal py-2 h-auto"
                                        onClick={() => onSelectChat(chat.id)}
                                    >
                                        <span className="truncate">{chat.title}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center">
                            <Avatar className="h-8 w-8 bg-primary text-white">
                                <span>C</span>
                            </Avatar>
                            <div className="ml-2">
                                <div className="text-sm font-medium">Carl U. Christensen</div>
                                <div className="text-xs text-gray-400">Pro</div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!isOpen && (
                <Button variant="ghost" size="icon" className="m-2" onClick={() => setIsOpen(true)}>
                    <Menu className="h-5 w-5" />
                </Button>
            )}
        </div>
    )
}
