"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PinIcon, Search } from "lucide-react"
import React from "react"

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

export function AppSidebar({ onSelectChat, selectedChat }: SidebarProps) {
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
        <Sidebar>
            <SidebarHeader>
                <SidebarTrigger />
                <div className="flex items-center justify-between px-2 py-1">
                    <h1 className="text-lg font-semibold text-white">C3 Chat</h1>
                    {/* You can add a trigger or logo here if needed */}
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-2">New Chat</Button>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <SidebarInput placeholder="Search your threads..." className="pl-8" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <div className="flex items-center text-xs text-gray-400">
                            <PinIcon className="h-3 w-3 mr-1" /> Pinned
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {pinnedChats.map((chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={selectedChat === chat.id}
                                    >
                                        <button onClick={() => onSelectChat(chat.id)}>
                                            <span className="truncate">{chat.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Last 7 Days</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {recentChats.map((chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={selectedChat === chat.id}
                                    >
                                        <button onClick={() => onSelectChat(chat.id)}>
                                            <span className="truncate">{chat.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Last 30 Days</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {olderChats.map((chat) => (
                                <SidebarMenuItem key={chat.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={selectedChat === chat.id}
                                    >
                                        <button onClick={() => onSelectChat(chat.id)}>
                                            <span className="truncate">{chat.title}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center">
                    <Avatar className="h-8 w-8 bg-primary text-white">
                        <span>C</span>
                    </Avatar>
                    <div className="ml-2">
                        <div className="text-sm font-medium">Carl U. Christensen</div>
                        <div className="text-xs text-gray-400">Pro</div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;
