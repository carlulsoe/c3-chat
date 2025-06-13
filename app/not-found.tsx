"use client"

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center mx-auto">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition"
            >
                Go back home
            </Link>
        </div>
    );
}
