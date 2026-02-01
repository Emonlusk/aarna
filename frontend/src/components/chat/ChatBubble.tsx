import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
  timestamp?: string;
  isLoading?: boolean;
}

export function ChatBubble({
  message,
  isBot = false,
  timestamp,
  isLoading = false,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isBot ? "flex-row" : "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          isBot
            ? "bg-primary/10 text-primary"
            : "bg-student/10 text-student"
        )}
      >
        {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>

      {/* Message */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3",
          isBot
            ? "bg-card border border-border rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        )}
      >
        {isLoading ? (
          <div className="flex gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-current opacity-60 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed">{message}</p>
            {timestamp && (
              <p
                className={cn(
                  "text-xs mt-1.5",
                  isBot ? "text-muted-foreground" : "text-primary-foreground/70"
                )}
              >
                {timestamp}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
