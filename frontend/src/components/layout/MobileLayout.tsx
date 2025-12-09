"use client";

import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { TopBar } from './TopBar';

interface MobileLayoutProps {
    children: ReactNode;
    showNav?: boolean;
}

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
            <TopBar />
            <main className="flex-1 pb-20 overflow-y-auto">
                {children}
            </main>
            {showNav && <BottomNavigation />}
        </div>
    );
}
