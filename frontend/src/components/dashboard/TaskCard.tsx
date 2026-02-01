import React from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCardProps {
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  priority?: "low" | "medium" | "high";
  grade?: number;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    borderColor: "border-l-warning",
  },
  submitted: {
    label: "Submitted",
    variant: "default" as const,
    borderColor: "border-l-teacher",
  },
  graded: {
    label: "Graded",
    variant: "default" as const,
    borderColor: "border-l-success",
  },
};

const subjectColors: Record<string, string> = {
  Math: "bg-blue-100 text-blue-700",
  Science: "bg-green-100 text-green-700",
  English: "bg-purple-100 text-purple-700",
  History: "bg-amber-100 text-amber-700",
  Art: "bg-pink-100 text-pink-700",
  default: "bg-muted text-muted-foreground",
};

export function TaskCard({
  title,
  subject,
  dueDate,
  status,
  priority,
  grade,
  onClick,
  className,
}: TaskCardProps) {
  const config = statusConfig[status];
  const subjectColor = subjectColors[subject] || subjectColors.default;

  const isOverdue =
    status === "pending" && new Date(dueDate) < new Date();

  return (
    <button
      onClick={onClick}
      className={cn(
        "task-card w-full text-left",
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", subjectColor)}>
              {subject}
            </span>
            {priority === "high" && (
              <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-destructive/10 text-destructive">
                Urgent
              </span>
            )}
          </div>
          <h4 className="font-medium text-foreground truncate">{title}</h4>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className={cn(isOverdue && "text-destructive font-medium")}>
                {dueDate}
              </span>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-1 text-destructive">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium">Overdue</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={config.variant} className="shrink-0">
            {config.label}
          </Badge>
          {status === "graded" && grade !== undefined && (
            <span className="text-lg font-bold text-success">{grade}%</span>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </button>
  );
}
