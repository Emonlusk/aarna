"use client";
import { useState } from "react";

interface AIChatProps {
    context: "worksheet" | "visual" | "student_companion";
    title: string;
}

export default function AIChat({ context, title }: AIChatProps) {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.content, context }),
                credentials: "include"
            });

            const data = await res.json();
            if (res.ok) {
                setMessages((prev) => [...prev, { role: "model", content: data.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "model", content: "Error: " + (data.error || "Failed to get response") }]);
            }
        } catch (err) {
            setMessages((prev) => [...prev, { role: "model", content: "Error: Failed to connect" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-md border border-slate-200">
            <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <h3 className="font-semibold text-slate-800">{title}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && <div className="text-slate-500 text-sm italic">AI is thinking...</div>}
            </div>

            <div className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your request..."
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
