"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Compass, Sparkles } from "lucide-react";

interface ExampleQuestionsProps {
    onSelect: (question: string) => void;
    firstName?: string | null;
}

const categorizedQuestions = {
    Create: [
        "Draft a short story about a futuristic city",
        "Write a poem about nature",
        "Design a logo for a new tech startup",
    ],
    Explore: [
        "What are the latest discoveries in space?",
        "Tell me about the history of ancient Egypt.",
        "What are some interesting facts about the human brain?",
    ],
    Code: [
        "Explain the concept of recursion in programming.",
        "How does a Redux store work?",
        "Write a Python script to sort a list of numbers.",
    ],
    Learn: [
        "Teach me about quantum physics.",
        "How can I learn a new language effectively?",
        "Explain the basics of machine learning.",
    ],
};

export function ExampleQuestions({ onSelect, firstName }: ExampleQuestionsProps) {
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof categorizedQuestions>("Create");
    const [displayedQuestions, setDisplayedQuestions] = useState(categorizedQuestions[selectedCategory]);

    useEffect(() => {
        setDisplayedQuestions(categorizedQuestions[selectedCategory]);
    }, [selectedCategory]);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8">How can I help you{firstName ? `, ${firstName}` : ""}?</h1>

            <div className="flex gap-4 mb-12">
                <Button variant={selectedCategory === "Create" ? "default" : "outline"} className="flex flex-col h-20 w-24 items-center justify-center gap-2 cursor-pointer" onMouseDown={() => setSelectedCategory("Create")}>
                    <Sparkles className="h-5 w-5" />
                    <span>Create</span>
                </Button>
                <Button variant={selectedCategory === "Explore" ? "default" : "outline"} className="flex flex-col h-20 w-24 items-center justify-center gap-2 cursor-pointer" onMouseDown={() => setSelectedCategory("Explore")}>
                    <Compass className="h-5 w-5" />
                    <span>Explore</span>
                </Button>
                <Button variant={selectedCategory === "Code" ? "default" : "outline"} className="flex flex-col h-20 w-24 items-center justify-center gap-2 cursor-pointer" onMouseDown={() => setSelectedCategory("Code")}>
                    <Code className="h-5 w-5" />
                    <span>Code</span>
                </Button>
                <Button variant={selectedCategory === "Learn" ? "default" : "outline"} className="flex flex-col h-20 w-24 items-center justify-center gap-2 cursor-pointer" onMouseDown={() => setSelectedCategory("Learn")}>
                    <BookOpen className="h-5 w-5" />
                    <span>Learn</span>
                </Button>
            </div>

            <div className="space-y-4 w-full max-w-md mx-auto p-4">
                {displayedQuestions.map((question, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-foreground hover:bg-muted cursor-pointer"
                        onMouseDown={() => {
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
