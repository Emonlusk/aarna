"use client";

import { Home, BookOpen, Bot, User, Settings } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

export function BottomNavigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    const teacherNav: NavItem[] = [
        { icon: <Home size={22} />, label: 'Home', path: '/dashboard/teacher' },
        { icon: <Bot size={22} />, label: 'AI Assistant', path: '/dashboard/teacher/ai' },
        { icon: <BookOpen size={22} />, label: 'Library', path: '/dashboard/teacher/library' },
        { icon: <User size={22} />, label: 'Profile', path: '/profile' },
    ];

    const studentNav: NavItem[] = [
        { icon: <Home size={22} />, label: 'Home', path: '/dashboard/student' },
        { icon: <Bot size={22} />, label: 'Learning Buddy', path: '/dashboard/student/buddy' },
        { icon: <BookOpen size={22} />, label: 'My Tasks', path: '/dashboard/student/tasks' },
        { icon: <User size={22} />, label: 'Profile', path: '/profile' },
    ];

    const adminNav: NavItem[] = [
        { icon: <Home size={22} />, label: 'Dashboard', path: '/dashboard/admin' },
        { icon: <User size={22} />, label: 'Users', path: '/dashboard/admin/users' },
        { icon: <BookOpen size={22} />, label: 'Content', path: '/dashboard/admin/content' },
        { icon: <Settings size={22} />, label: 'Settings', path: '/dashboard/admin/settings' },
    ];

    const getNavItems = () => {
        switch (user?.role) {
            case 'teacher':
                return teacherNav;
            case 'student':
                return studentNav;
            case 'admin':
                return adminNav;
            default:
                return [];
        }
    };

    const navItems = getNavItems();

    if (!user) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
            <div className="flex items-center justify-around h-16 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={cn(
                                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors duration-200',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <span className={cn(isActive && 'scale-110 transition-transform')}>
                                {item.icon}
                            </span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
