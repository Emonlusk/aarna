import React from "react";
import { cn } from "@/lib/utils";
import { GraduationCap, BookOpen, Shield, ChevronRight } from "lucide-react";

interface RoleSelectorProps {
  onSelect: (role: "student" | "teacher" | "admin") => void;
}

const roles = [
  {
    id: "student" as const,
    title: "Student",
    description: "Access assignments, chat with Learning Buddy, and view your gallery",
    icon: GraduationCap,
    color: "student",
    gradient: "from-student to-orange-400",
    bgLight: "bg-student/5",
    borderColor: "border-student/20",
  },
  {
    id: "teacher" as const,
    title: "Teacher",
    description: "Create content, manage classes, and use AI teaching tools",
    icon: BookOpen,
    color: "teacher",
    gradient: "from-teacher to-blue-400",
    bgLight: "bg-teacher/5",
    borderColor: "border-teacher/20",
  },
  {
    id: "admin" as const,
    title: "Administrator",
    description: "Manage users, settings, and monitor school activity",
    icon: Shield,
    color: "admin",
    gradient: "from-admin to-purple-400",
    bgLight: "bg-admin/5",
    borderColor: "border-admin/20",
  },
];

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      {roles.map((role, index) => {
        const Icon = role.icon;
        return (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className={cn(
              "w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left group",
              "hover:shadow-elevated hover:-translate-y-1",
              role.bgLight,
              role.borderColor,
              "animate-fade-in opacity-0"
            )}
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  `bg-gradient-to-br ${role.gradient}`
                )}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-lg text-foreground">
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {role.description}
                </p>
              </div>
              <ChevronRight className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-200",
                "group-hover:translate-x-1",
                `group-hover:text-${role.color}`
              )} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
