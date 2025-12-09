import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export function ActionButton({ icon, label, onClick, className, style }: ActionButtonProps) {
    return (
        <Button
            variant="action"
            onClick={onClick}
            className={cn('min-h-[100px] w-full', className)}
            style={style}
        >
            <span className="text-primary mb-1">{icon}</span>
            <span className="text-sm font-medium text-foreground text-center leading-tight">
                {label}
            </span>
        </Button>
    );
}
