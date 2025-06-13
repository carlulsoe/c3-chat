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
import { Search } from "lucide-react" // PinIcon removed
import React, { useState } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"


// Adjusted ChatItem interface - isPinned is removed, title might be derived differently
interface DisplayChatItem {
    id: string // maps to thread._id
    title: string
    lastUpdated: string // formatted date string
}

export function AppSidebar() {
    const { user, isLoaded: isUserLoaded } = useUser()
    const [selectedChat, setSelectedChat] = useState<string | null>(null)

    // Fetch threads if user is loaded
    const threads = useQuery(api.chat.getUserThreads, user ? undefined : "skip")

    const formattedThreads: DisplayChatItem[] = (threads ?? []).map((thread: Doc<"thread">) => ({
        id: thread._id,
        // For now, using thread ID as title. A more sophisticated title can be generated later.
        // Example: "Chat " + thread._id.substring(0, 5) + "..."
        // Or derive from the first message if available and loaded.
        title: `Thread ${thread._id.slice(-5)} (${new Date(thread.updatedAt).toLocaleDateString()})`,
        lastUpdated: new Date(thread.updatedAt).toLocaleDateString(),
    }));

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-between pr-2 py-1">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold text-foreground">C3 Chat</h1>
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
                    <SidebarGroupLabel>Recent Threads</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {!isUserLoaded || threads === undefined ? (
                            <div className="p-4 text-sm text-gray-500">Loading threads...</div>
                        ) : formattedThreads.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500">No threads yet.</div>
                        ) : (
                            <SidebarMenu>
                                {formattedThreads.map((chat) => (
                                    <SidebarMenuItem key={chat.id}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={selectedChat === chat.id}
                                        >
                                            <button onClick={() => setSelectedChat(chat.id)}>
                                                <span className="truncate">{chat.title}</span>
                                                {/*
                                                  Optionally, display lastUpdated if needed in the item itself
                                                  <span className="text-xs text-gray-400 ml-auto">
                                                      {chat.lastUpdated}
                                                  </span>
                                                */}
                                            </button>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        )}
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
