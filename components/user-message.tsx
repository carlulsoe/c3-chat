"use client"
import { Doc } from "@/convex/_generated/dataModel";
import React from "react";


interface UserMessageProps {
    message: Doc<"threadMessage">
}

export function UserMessage({ message }: UserMessageProps) {


    return (
        <div key={message._id + "_user"} className={`flex justify-end`}>
            <div
                className={`max-w-[80%] p-5 rounded-lg bg-muted text-foreground justify-start`}
            >
                {message.message}
            </div>
        </div>
    )
}