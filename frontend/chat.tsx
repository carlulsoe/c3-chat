
import ChatInterface from "@/components/chat-interface";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams } from "react-router";
import { useStableLocalStorageQuery } from "@/hooks/useStableQuery";

export default function Chat() {
    const data = useParams();
    const { id } = data;
    const messages = useStableLocalStorageQuery(api.chat.getMessages, {
        threadId: id as Id<"thread">,
    });
    if (!id) {
        return <div>Invalid thread id</div>;
    }
    if (!messages) {
        return <div>Loading...</div>;
    }
    return (

        <ChatInterface messages={messages as Doc<"threadMessage">[]} />

    )
}