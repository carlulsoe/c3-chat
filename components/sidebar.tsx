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
import { PinIcon, Search, SettingsIcon } from "lucide-react"
import React, { useRef, useEffect } from "react"
import { UserButton, useUser } from "@clerk/nextjs"
import { useParams } from "react-router"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { NavLink } from "react-router"
import { Doc } from "@/convex/_generated/dataModel"
import { useStableLocalStoragePaginatedQuery } from "@/hooks/useStableQuery"
import { SidebarChatButton } from "./sidebar-chat-button"


export function AppSidebar() {
    const { user } = useUser()
    const params = useParams()
    const selectedChat = params.id as string
    // Fetch threads if user is loaded
    const { results, status, loadMore } = useStableLocalStoragePaginatedQuery(api.chat.getUserThreads, user ? { paginationOpts: { numItems: 20 } } : "skip", {
        initialNumItems: 20,
    })
    const pinnedThreads = useQuery(api.chat.getPinnedUserThreads)

    const recentThreads: Doc<"thread">[] = (results ?? []).filter((chat) => new Date(chat.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

    const olderThreads: Doc<"thread">[] = (results ?? []).filter((chat) => new Date(chat.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))

    const sidebarContentRef = useRef<HTMLDivElement>(null)

    // Infinite scroll: call loadMore when near bottom
    useEffect(() => {
        const handleScroll = () => {
            const el = sidebarContentRef.current
            if (!el) return
            const threshold = 100 // px from bottom
            if (el.scrollHeight - el.scrollTop - el.clientHeight < threshold) {
                if (status === "CanLoadMore") {
                    loadMore(20)
                }
            }
        }
        const el = sidebarContentRef.current
        if (el) {
            el.addEventListener("scroll", handleScroll)
        }
        return () => {
            if (el) {
                el.removeEventListener("scroll", handleScroll)
            }
        }
    }, [status, loadMore])



    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center justify-between pr-2 py-1">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold text-foreground">C3 Chat</h1>
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white mt-2">
                    <NavLink to="/">New Chat</NavLink>
                </Button>
                <div className="relative mt-2">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <SidebarInput placeholder="Search your threads..." className="pl-8" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div ref={sidebarContentRef} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <div className="flex items-center text-xs text-gray-400">
                                <PinIcon className="h-3 w-3 mr-1" /> Pinned
                            </div>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {pinnedThreads?.map((thread) => (
                                    <SidebarMenuItem key={thread._id.toString()}>
                                        <SidebarChatButton selectedChat={selectedChat} thread={thread} isPinned={thread.pinned} />
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
                                    <SidebarMenuItem key={thread._id.toString()}>
                                        <SidebarChatButton selectedChat={selectedChat} thread={thread} isPinned={thread.pinned} />
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
                                    <SidebarMenuItem key={thread._id.toString()}>
                                        <SidebarChatButton selectedChat={selectedChat} thread={thread} isPinned={thread.pinned} />
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div>
            </SidebarContent>
            <SidebarFooter>
                {user && (
                    <SidebarMenuButton asChild>
                        <NavLink to="/settings">
                            <SettingsIcon className="h-4 w-4 mr-2" />
                            Settings
                        </NavLink>
                    </SidebarMenuButton>
                )}
                <div className="flex items-center mt-2"> {/* Added mt-2 for spacing */}
                    <UserButton />
                    <div className="ml-2">
                        <div className="text-sm font-medium">{user?.fullName}</div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar >
    )
}

export default AppSidebar;
