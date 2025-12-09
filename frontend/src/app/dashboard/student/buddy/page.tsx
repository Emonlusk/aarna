"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ai } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const suggestedQuestions = [
    "What is photosynthesis?",
    "How do fractions work?",
    "Why is the sky blue?",
    "What causes earthquakes?",
];

export default function LearningBuddy() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'buddy'; message: string }[]>([
        {
            role: 'buddy',
            message: "Hi there! 👋 I'm your Learning Buddy! Ask me anything about your studies, and I'll help you understand it in a fun way!",
        },
    ]);

    const handleSend = async (text: string = message) => {
        if (!text.trim()) return;

        setChatHistory((prev) => [...prev, { role: 'user', message: text }]);
        setMessage('');
        setIsTyping(true);

        try {
            const res = await ai.chat({ message: text, role: 'student' });
            setChatHistory((prev) => [...prev, { role: 'buddy', message: res.data.response }]);
        } catch (error) {
            toast({ title: "Error", description: "Learning Buddy is taking a nap. Try again later!", variant: "destructive" });
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-card border-b border-border">
                <div className="flex items-center gap-3 h-14 px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft size={20} />
                    </Button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                            <Brain size={18} className="text-accent" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight">Learning Buddy</h1>
                            <p className="text-xs text-muted-foreground">Always here to help!</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((chat, i) => (
                    <div
                        key={i}
                        className={cn(
                            'flex',
                            chat.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        <div
                            className={cn(
                                'max-w-[85%] p-3 rounded-2xl animate-fade-in',
                                chat.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                                    : 'bg-secondary text-secondary-foreground rounded-bl-sm'
                            )}
                        >
                            {chat.message}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-sm">Learning Buddy is typing...</span>
                    </div>
                )}
            </div>

            {/* Suggested Questions */}
            {chatHistory.length === 1 && (
                <div className="px-4 pb-2">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Sparkles size={12} />
                        Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((q) => (
                            <Button
                                key={q}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => handleSend(q)}
                            >
                                {q}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="sticky bottom-0 bg-card border-t border-border p-4 safe-bottom">
                <div className="flex gap-2">
                    <Input
                        placeholder="Ask me anything..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1"
                    />
                    <Button onClick={() => handleSend()} disabled={!message.trim() || isTyping}>
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
