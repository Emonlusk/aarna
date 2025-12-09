import React from 'react';

export type UserRole = 'teacher' | 'student' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    className?: string;
    avatar?: string;
}

export interface QuickStat {
    label: string;
    value: number | string;
    icon: React.ReactNode;
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded' | 'completed' | 'overdue';
    grade?: string;
}

export interface LibraryItem {
    id: string;
    title: string;
    subject: string;
    grade: string;
    type: 'worksheet' | 'visual' | 'quiz';
    createdAt: string;
}

export interface ActivityItem {
    id: string;
    message: string;
    timestamp: string;
    type: 'generated' | 'submitted' | 'assigned';
}
