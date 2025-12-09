import { cn } from '@/lib/utils';
import React from 'react';

interface QuickStatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function QuickStatCard({ label, value, icon, className, style }: QuickStatCardProps) {
    return (
        <div
            className={cn(
                'flex items-center gap-3 bg-card rounded-xl p-3 border border-border shadow-sm',
                className
            )}
            style={style}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}
