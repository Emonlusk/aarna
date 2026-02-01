import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "student" | "teacher" | "admin" | "success" | "warning";
  className?: string;
}

const colorStyles = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    icon: "bg-primary/20 text-primary",
  },
  student: {
    bg: "bg-student/10",
    text: "text-student",
    icon: "bg-student/20 text-student",
  },
  teacher: {
    bg: "bg-teacher/10",
    text: "text-teacher",
    icon: "bg-teacher/20 text-teacher",
  },
  admin: {
    bg: "bg-admin/10",
    text: "text-admin",
    icon: "bg-admin/20 text-admin",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    icon: "bg-success/20 text-success",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    icon: "bg-warning/20 text-warning",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
  className,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <Card variant="stat" className={cn("p-4 group", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-foreground">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
            styles.icon
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
