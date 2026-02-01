import React from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const mockTasks = [
  {
    id: 1,
    title: "Write a short story about your summer vacation",
    subject: "English",
    dueDate: "Dec 15, 2024",
    status: "pending" as const,
    priority: "high" as const,
  },
  {
    id: 2,
    title: "Complete math worksheet: Fractions",
    subject: "Math",
    dueDate: "Dec 12, 2024",
    status: "submitted" as const,
  },
  {
    id: 3,
    title: "Science project: Water cycle diagram",
    subject: "Science",
    dueDate: "Dec 10, 2024",
    status: "graded" as const,
    grade: 92,
  },
  {
    id: 4,
    title: "Read Chapter 5 and answer questions",
    subject: "History",
    dueDate: "Dec 18, 2024",
    status: "pending" as const,
  },
  {
    id: 5,
    title: "Draw your favorite animal",
    subject: "Art",
    dueDate: "Dec 8, 2024",
    status: "graded" as const,
    grade: 98,
  },
];

type FilterType = "all" | "pending" | "submitted" | "graded";

export default function StudentTasks() {
  const navigate = useNavigate();
  const [filter, setFilter] = React.useState<FilterType>("all");

  const filteredTasks =
    filter === "all"
      ? mockTasks
      : mockTasks.filter((task) => task.status === filter);

  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: "All", value: "all", count: mockTasks.length },
    {
      label: "Pending",
      value: "pending",
      count: mockTasks.filter((t) => t.status === "pending").length,
    },
    {
      label: "Submitted",
      value: "submitted",
      count: mockTasks.filter((t) => t.status === "submitted").length,
    },
    {
      label: "Graded",
      value: "graded",
      count: mockTasks.filter((t) => t.status === "graded").length,
    },
  ];

  return (
    <MobileLayout role="student" userName="Emma Wilson" schoolName="Lincoln Elementary">
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-2xl font-display font-bold text-foreground">
            Your Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay on top of your schoolwork
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in stagger-1">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className={cn(
                "shrink-0 gap-2",
                filter === f.value && "shadow-soft"
              )}
            >
              {f.label}
              <Badge
                variant={filter === f.value ? "secondary" : "outline"}
                className="px-1.5 py-0 text-xs"
              >
                {f.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-3 animate-fade-in stagger-2">
          {filteredTasks.map((task, index) => (
            <div
              key={task.id}
              className="animate-fade-in opacity-0"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "forwards",
              }}
            >
              <TaskCard
                title={task.title}
                subject={task.subject}
                dueDate={task.dueDate}
                status={task.status}
                priority={task.priority}
                grade={task.grade}
                onClick={() => navigate(`/student/task/${task.id}`)}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="font-display font-semibold text-foreground">
              No assignments found
            </h3>
            <p className="text-muted-foreground mt-1">
              Great job! You're all caught up.
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
