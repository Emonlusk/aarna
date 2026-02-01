import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { SuggestedQuestion } from "@/components/chat/SuggestedQuestion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { aiApi } from "@/lib/api";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const suggestedQuestions = [
  "What is photosynthesis?",
  "Help me with fractions",
  "Explain the water cycle",
  "How do volcanoes work?",
];

export default function StudentBuddy() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your Learning Buddy. I'm here to help you understand anything from your classes. Ask me a question or pick one below!`,
      isBot: true,
      timestamp: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: text.trim(),
      isBot: false,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call real AI API
      const response = await aiApi.chat(text.trim(), 'student');
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.response,
        isBot: true,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Fallback response on error
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Oops! I'm having trouble thinking right now. 🤔 Please try again in a moment, or ask your teacher for help!",
        isBot: true,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const userName = user?.name || "Student";

  return (
    <MobileLayout role="student" userName={userName} schoolName="Lincoln Elementary">
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-foreground">
                Learning Buddy
              </h1>
              <p className="text-xs text-muted-foreground">
                Always here to help! 📚
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-4 py-4 border-b border-border/50 bg-accent/30">
            <p className="text-sm text-muted-foreground mb-3">
              Try asking me:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question) => (
                <SuggestedQuestion
                  key={question}
                  question={question}
                  onClick={() => handleSend(question)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && <ChatBubble message="" isBot isLoading />}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                placeholder="Type your question..."
                className="pr-12 rounded-xl border-border/50 bg-muted/30"
              />
            </div>
            <Button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim()}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
