"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, FileText, Users, BookOpen, Send, Sparkles } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { QuickStatCard } from '@/components/dashboard/QuickStatCard';
import { ActionButton } from '@/components/dashboard/ActionButton';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ActivityItem } from '@/types';
import { classes, submissions } from '@/lib/api';

const mockActivities: ActivityItem[] = [
    {
        id: '1',
        message: 'You generated a Science worksheet yesterday',
        timestamp: '1 day ago',
        type: 'generated',
    },
    {
        id: '2',
        message: 'Class 5B submitted their math assignments',
        timestamp: '2 days ago',
        type: 'submitted',
    },
    {
        id: '3',
        message: 'New worksheet assigned to Class 4A',
        timestamp: '3 days ago',
        type: 'assigned',
    },
];

export default function TeacherDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState([
        { label: 'Classes', value: 0, icon: <Users size={20} /> },
        { label: 'To Grade', value: 0, icon: <FileText size={20} /> },
        { label: 'AI Credits', value: 150, icon: <Sparkles size={20} /> },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const classesRes = await classes.list();
                setStats(prev => prev.map(s =>
                    s.label === 'Classes' ? { ...s, value: classesRes.data.length } : s
                ));
                const pendingRes = await submissions.pending();
                setStats(prev => prev.map(s =>
                    s.label === 'To Grade' ? { ...s, value: pendingRes.data.length } : s
                ));
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    const actions = [
        {
            icon: <Bot size={28} />,
            label: 'AI Teaching Assistant',
            onClick: () => router.push('/dashboard/teacher/ai'),
        },
        {
            icon: <FileText size={28} />,
            label: 'Create Worksheet',
            onClick: () => router.push('/dashboard/teacher/ai?mode=worksheet'),
        },
        {
            icon: <Users size={28} />,
            label: 'My Classes',
            onClick: () => router.push('/dashboard/teacher/classes'),
        },
        {
            icon: <BookOpen size={28} />,
            label: 'My Library',
            onClick: () => router.push('/dashboard/teacher/library'),
        },
        {
            icon: <Send size={28} />,
            label: 'Post Assignment',
            onClick: () => router.push('/dashboard/teacher/assign'),
        },
        {
            icon: <Sparkles size={28} />,
            label: 'Visual Aid Generator',
            onClick: () => router.push('/dashboard/teacher/ai?mode=visual'),
        },
    ];

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2">
                    {stats.map((stat, index) => (
                        <QuickStatCard
                            key={stat.label}
                            {...stat}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                        />
                    ))}
                </div>

                {/* Action Center */}
                <section>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1 mb-3">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {actions.map((action, index) => (
                            <ActionButton
                                key={action.label}
                                {...action}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                            />
                        ))}
                    </div>
                </section>

                {/* Activity Feed */}
                <section>
                    <ActivityFeed activities={mockActivities} />
                </section>
            </div>
        </MobileLayout>
    );
}
