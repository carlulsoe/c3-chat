"use client"
import { Doc } from "@/convex/_generated/dataModel";
import React, { useEffect, useMemo } from "react";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import { api } from "@/convex/_generated/api";
import { StreamId } from "@convex-dev/persistent-text-streaming";
import { getConvexSiteUrl } from "@/lib/utils";

interface AiMessageProps {
    message: Doc<"threadMessage">
}

export function AiMessage({ message }: AiMessageProps) {

    const { text } = useStream(
        api.chat.getChatBody, // The query to call for the full stream body
        new URL(`${getConvexSiteUrl()}/chat-stream`), // The HTTP endpoint for streaming
        message.status === "pending" || message.status === "streaming" || message.status === undefined,
        message.streamId as StreamId // The streamId from the chat database record
    );


    return (
        <div key={message._id + "_ai"} className={`flex justify-start`}>
            <div
                className={`max-w-[80%] p-5 rounded-lg bg-muted text-foreground justify-start`}
            >
                {text}
            </div>
        </div>
    )
}