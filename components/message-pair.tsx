"use client"
import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { UserMessage } from "./user-message";
import dynamic from "next/dynamic";


interface MessagePairProps {
    userMessage: Doc<"threadMessage">
    aiMessage: Doc<"threadMessage">
}
const AiMessage = dynamic(() => import("./ai-message"), { ssr: false });

export function MessagePair({ userMessage, aiMessage }: MessagePairProps) {

    return (
        <div className="flex flex-col gap-4" key={userMessage._id}>
            {userMessage && <UserMessage message={userMessage} />}
            {aiMessage && <AiMessage message={aiMessage} />}
        </div>
    )
}