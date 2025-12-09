"use client";

import { Bell, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TopBarProps {
    onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!user) return null;

    return (
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
            <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
                <div className="flex items-center gap-3">
                    {onMenuClick && (
                        <Button variant="ghost" size="icon" onClick={onMenuClick} className="h-10 w-10">
                            <Menu size={20} />
                        </Button>
                    )}
                    <div
                        className="cursor-pointer"
                        onClick={() => router.push('/profile')}
                    >
                        <p className="text-sm text-muted-foreground">Hello,</p>
                        <h1 className="text-base font-semibold leading-tight">{user.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-10 w-10 relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => router.push('/profile')}>
                        <User size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleLogout}>
                        <LogOut size={20} />
                    </Button>
                </div>
            </div>
        </header>
    );
}
