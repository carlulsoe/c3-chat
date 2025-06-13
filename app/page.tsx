"use client";

import {
  Authenticated,
  Unauthenticated,
} from "convex/react";

import { SignUpButton } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import ChatInterface from "@/components/chat-interface";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <main className="flex flex-col gap-4 w-full h-full">
      <Authenticated>
        <ChatInterface />
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </main>
  );
}

function SignInForm() {
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to chat with C3 chat, which is totally not a t3 chat clone for the cloneathon</p>
      <SignInButton mode="modal">
        <button className="bg-foreground text-background px-4 py-2 rounded-md">
          Sign in
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="bg-foreground text-background px-4 py-2 rounded-md">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}
