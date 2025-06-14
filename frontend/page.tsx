"use client";

import {
  Authenticated,
} from "convex/react";

import ChatInterface from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 w-full h-full">
      <Authenticated>
        <ChatInterface messages={[]} />
      </Authenticated>
    </main>
  );
}