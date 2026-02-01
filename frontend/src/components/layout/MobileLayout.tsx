import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  ClipboardList,
  MessageCircle,
  Image,
  User,
  Sparkles,
  Users,
  BookOpen,
  Settings,
  LayoutDashboard,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileLayoutProps {
  children: React.ReactNode;
  role: "student" | "teacher" | "admin";
  userName?: string;
  schoolName?: string;
}

const studentNav = [
  { icon: Home, label: "Home", path: "/student" },
  { icon: ClipboardList, label: "Tasks", path: "/student/tasks" },
  { icon: MessageCircle, label: "Buddy", path: "/student/buddy" },
  { icon: Image, label: "Gallery", path: "/student/gallery" },
  { icon: User, label: "Profile", path: "/student/profile" },
];

const teacherNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/teacher" },
  { icon: Sparkles, label: "AI Tools", path: "/teacher/ai" },
  { icon: Users, label: "Classes", path: "/teacher/classes" },
  { icon: BookOpen, label: "Library", path: "/teacher/library" },
  { icon: User, label: "Profile", path: "/teacher/profile" },
];

const adminNav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: BookOpen, label: "Content", path: "/admin/content" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
  { icon: User, label: "Profile", path: "/admin/profile" },
];

const roleColors = {
  student: "text-student",
  teacher: "text-teacher",
  admin: "text-admin",
};

const roleBgColors = {
  student: "bg-student/10",
  teacher: "bg-teacher/10",
  admin: "bg-admin/10",
};

export function MobileLayout({
  children,
  role,
  userName = "User",
  schoolName = "School Hub",
}: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems =
    role === "student" ? studentNav : role === "teacher" ? teacherNav : adminNav;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-lg",
                roleBgColors[role],
                roleColors[role]
              )}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{userName}</p>
              <p className="text-xs text-muted-foreground">{schoolName}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border safe-bottom z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "nav-item flex-1 max-w-[72px]",
                  isActive && "nav-item-active"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? roleColors[role] : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? roleColors[role] : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
