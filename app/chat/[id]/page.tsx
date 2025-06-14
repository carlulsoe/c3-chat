import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatInterfaceWrapper from "./ChatInterfaceWrapper";
import { auth } from "@clerk/nextjs/server";


export default async function ChatIdPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params
    let threadId: Id<"thread">;
    try {
        threadId = id as Id<"thread">;
    } catch {
        return <div>Invalid thread id</div>;
    }
    const { getToken } = await auth()
    const token = await getToken({ template: "convex" });
    if (!token) {
        return <div>Token not found</div>;
    }

    const preloadedMessages = await preloadQuery(api.chat.getMessages, {
        threadId,
    },
        { token: token }
    );

    return <ChatInterfaceWrapper preloadedMessages={preloadedMessages} />;
}
