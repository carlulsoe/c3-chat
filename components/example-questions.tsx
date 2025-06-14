"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Compass, Sparkles } from "lucide-react";

interface ExampleQuestionsProps {
    onSelect: (question: string) => void;
    firstName?: string | null;
}


export function ExampleQuestions({ onSelect, firstName }: ExampleQuestionsProps) {
    // Example questions shown in the UI
    const exampleQuestions = [
        "How does AI work?",
        "Are black holes real?",
        'How many Rs are in the word "strawberry"?',
        "What is the meaning of life?",
    ]
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8">How can I help you{firstName ? `, ${firstName}` : ""}?</h1>

            <div className="flex gap-4 mb-12">
                <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Create</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                    <Compass className="h-5 w-5" />
                    <span>Explore</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                    <Code className="h-5 w-5" />
                    <span>Code</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 w-24 items-center justify-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Learn</span>
                </Button>
            </div>

            <div className="space-y-4 w-full max-w-md mx-auto p-4">
                {exampleQuestions.map((question, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:bg-muted"
                        onClick={() => {
                            onSelect(question)
                        }}
                    >
                        {question}
                    </Button>
                ))}
            </div>
        </div>
    );
}
