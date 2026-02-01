import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface SuggestedQuestionProps {
  question: string;
  onClick?: () => void;
  className?: string;
}

export function SuggestedQuestion({
  question,
  onClick,
  className,
}: SuggestedQuestionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl",
        "bg-accent/50 border border-accent",
        "hover:bg-accent hover:border-primary/20 hover:-translate-y-0.5",
        "transition-all duration-200 text-left",
        className
      )}
    >
      <Sparkles className="w-4 h-4 text-primary shrink-0" />
      <span className="text-sm text-foreground">{question}</span>
    </button>
  );
}
