'use client'

import Link from "next/link";

export default function Error({ error }: { error: Error }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center mx-auto">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-lg text-muted-foreground mb-4">
                {error?.message || "An unexpected error occurred in this chat."}
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
