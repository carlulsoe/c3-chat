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
import { Button } from "@/components/ui/button"
import { PinIcon, Search } from "lucide-react"
import React, { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { thread } from '../convex/schema';


interface ChatItem {
    id: string
    title: string
    isPinned?: boolean
    lastUpdated: Date
}

export function AppSidebar() {
    const { user } = useUser()
    const router = useRouter()
    const params = useParams()

    const selectedChat = params.id as string
    // Fetch threads if user is loaded
    const threads = useQuery(api.chat.getUserThreads, user ? undefined : "skip")

    const handleSelectChat = (threadId: string) => {
        router.push(`/chat/${threadId}`)
    }

    const pinnedThreads: ChatItem[] = (threads ?? []).filter((chat) => chat.pinned).map((chat) => ({
        id: chat._id.toString(),
        title: chat.title,
        isPinned: chat.pinned,
        lastUpdated: new Date(chat.updatedAt),
    }))

    const recentThreads: ChatItem[] = (threads ?? []).filter((chat) => !chat.pinned).filter((chat) => new Date(chat.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).map((chat) => ({
        id: chat._id.toString(),
        title: chat.title,
        isPinned: chat.pinned,
        lastUpdated: new Date(chat.updatedAt),
    }))

    const olderThreads: ChatItem[] = (threads ?? []).filter((chat) => !chat.pinned).filter((chat) => new Date(chat.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).map((chat) => ({
        id: chat._id.toString(),
        title: chat.title,
        isPinned: chat.pinned,
        lastUpdated: new Date(chat.updatedAt),
    }))


    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-between pr-2 py-1">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold text-foreground">C3 Chat</h1>
                    {/* You can add a trigger or logo here if needed */}
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white mt-2">
                    <Link href="/">New Chat</Link>
                </Button>
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
                            {pinnedThreads.map((thread) => (
                                <SidebarMenuItem key={thread.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={selectedChat === thread.id}
                                    >
                                        <button onClick={() => handleSelectChat(thread.id)}>
                                            <span className="truncate">{thread.title}</span>
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
                            {recentThreads?.map((thread) => (
                                <SidebarMenuItem key={thread.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={selectedChat === thread.id}
                                    >
                                        <button onClick={() => handleSelectChat(thread.id)}>
                                            <span className="truncate">{thread.title}</span>
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
                            {olderThreads.map((thread) => (
                                <SidebarMenuItem key={thread.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={selectedChat === thread.id}
                                    >
                                        <button onClick={() => handleSelectChat(thread.id)}>
                                            <span className="truncate">{thread.title}</span>
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
                    <UserButton />
                    <div className="ml-2">
                        <div className="text-sm font-medium">{user?.fullName}</div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar;
