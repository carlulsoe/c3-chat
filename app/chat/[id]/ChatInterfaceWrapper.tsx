"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ChatInterface from "@/components/chat-interface";
import { Doc } from "@/convex/_generated/dataModel";

export default function ChatInterfaceWrapper({
    preloadedMessages,
}: {
    preloadedMessages: Preloaded<typeof api.chat.getMessages>;
}) {
    const messages = usePreloadedQuery(preloadedMessages);
    if (!messages) {
        return <div>Loading...</div>;
    }
    return (
        <ChatInterface
            messages={
                messages as Doc<"threadMessage">[]
            }
        />
    );
} 