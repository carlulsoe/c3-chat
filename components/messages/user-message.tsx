"use client"
import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import Markdown from "react-markdown";

interface UserMessageProps {
    message: Doc<"threadMessage">
}

export function UserMessage({ message }: UserMessageProps) {
    return (
        <div key={message._id + "_user"} className={`flex justify-end`}>
            <div
                className={`max-w-[80%] p-5 rounded-lg bg-muted text-foreground justify-start break-words whitespace-pre-wrap`}
            >
                <Markdown>{message.message}</Markdown>
            </div>
        </div>
    )
}