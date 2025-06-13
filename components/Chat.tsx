import React, { useState, useRef, useEffect } from "react";

interface Message {
    id: number;
    sender: "user" | "ai";
    text: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage: Message = {
            id: Date.now(),
            sender: "user",
            text: input,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        // Mock AI response
        setTimeout(() => {
            const aiMessage: Message = {
                id: Date.now() + 1,
                sender: "ai",
                text: `You said: ${userMessage.text}`,
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 800);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[80vh] max-w-xl mx-auto border rounded-lg shadow bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs break-words text-sm shadow-sm ${msg.sender === "user"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-200 text-gray-900 rounded-bl-none"
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t bg-white flex gap-2">
                <input
                    type="text"
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={handleSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
