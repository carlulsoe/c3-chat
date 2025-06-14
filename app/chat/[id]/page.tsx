"use client"
import ChatInterface from "@/components/chat-interface";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function ChatIdPage() {
    const params = useParams();
    let id: Id<"thread">;
    try {
        id = params?.id as Id<"thread">;
    } catch (error) {
        return <div>Invalid thread id</div>;
    }
    const messages = useQuery(api.chat.getMessages, { threadId: id });
    if (!messages) {
        return <div>Loading...</div>;
    }

    return (
        <ChatInterface messages={messages.filter((message) => message !== null) as Doc<"threadMessage">[]} />
    );
}
