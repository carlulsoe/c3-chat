import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { UserMessage } from "./user-message";
import { AiMessage } from "./ai-message";


interface MessagePairProps {
    userMessage: Doc<"threadMessage">
    aiMessage: Doc<"threadMessage">
}

export function MessagePair({ userMessage, aiMessage }: MessagePairProps) {

    return (
        <div className="flex flex-col gap-4" key={userMessage._id}>
            {userMessage && <UserMessage message={userMessage} />}
            {aiMessage && <AiMessage message={aiMessage} />}
        </div>
    )
}