import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  color?: "primary" | "student" | "teacher" | "admin";
  size?: "default" | "large";
  className?: string;
}

const colorStyles = {
  primary: {
    gradient: "from-primary to-secondary",
    hover: "hover:shadow-soft",
  },
  student: {
    gradient: "from-student to-orange-400",
    hover: "hover:shadow-soft",
  },
  teacher: {
    gradient: "from-teacher to-blue-400",
    hover: "hover:shadow-soft",
  },
  admin: {
    gradient: "from-admin to-purple-400",
    hover: "hover:shadow-soft",
  },
};

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  onClick,
  color = "primary",
  size = "default",
  className,
}: QuickActionCardProps) {
  const styles = colorStyles[color];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300",
        "bg-gradient-to-br text-white",
        "hover:-translate-y-1 hover:shadow-elevated active:scale-[0.98]",
        styles.gradient,
        size === "large" && "p-6",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white" />
        <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white" />
      </div>

      <div className="relative z-10">
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3",
            size === "large" && "w-14 h-14"
          )}
        >
          <Icon className={cn("w-6 h-6", size === "large" && "w-7 h-7")} />
        </div>
        <h3
          className={cn(
            "font-display font-bold",
            size === "default" ? "text-lg" : "text-xl"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-white/80 mt-1">{description}</p>
        )}
      </div>
    </button>
  );
}
