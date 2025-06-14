"use client"
import { Doc } from "@/convex/_generated/dataModel";
import React, { useEffect, useState } from "react";
import { useStream } from "@convex-dev/persistent-text-streaming/react";
import { api } from "@/convex/_generated/api";
import { StreamId } from "@convex-dev/persistent-text-streaming";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/nextjs";
import { getConvexSiteUrl } from "@/lib/utils";

interface StreamingAiMessageProps {
    message: Doc<"threadMessage">
}

function StreamingAiMessage({ message }: StreamingAiMessageProps) {
    const { getToken } = useAuth();
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const token = await getToken({ template: "convex" });
            setAuthToken(token);
        })();
    }, [getToken]);

    // Only start the stream if we have the token
    const shouldStream = (message.status === "pending" || message.status === "streaming" || message.status === undefined) && !!authToken;
    const { text } = useStream(
        api.chat.getChatBody,
        new URL(`${getConvexSiteUrl()}/chat-stream`),
        shouldStream,
        message.streamId as StreamId,
        {
            authToken: authToken,
        }
    );

    return (
        <div key={message._id + "_ai"} className={`flex justify-start`}>
            <div
                className={`max-w-[80%] p-5 rounded-lg bg-muted text-foreground justify-start`}
            >
                <Markdown>{text}</Markdown>
            </div>
        </div>
    )
}

export default StreamingAiMessage;