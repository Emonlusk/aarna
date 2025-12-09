"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Image } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { useAuth } from '@/contexts/AuthContext';
import { Assignment } from '@/types';
import { assignments } from '@/lib/api';

const mockDrawings = [
    { id: '1', name: 'Solar System', date: 'Jan 15' },
    { id: '2', name: 'Water Cycle', date: 'Jan 12' },
    { id: '3', name: 'Plant Cell', date: 'Jan 10' },
];

export default function StudentDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Assignment[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await assignments.list();
                // Map API response to Assignment type if needed
                // API returns: { id, title, subject, description, due_date, status, class_name }
                // Frontend type: { id, title, subject, dueDate, status }
                const mappedTasks = res.data.map((t: any) => ({
                    id: t.id.toString(),
                    title: t.title,
                    subject: t.subject || 'General',
                    dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString() : 'No due date',
                    status: t.submission_status || 'pending',
                    grade: t.grade
                }));
                setTasks(mappedTasks);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            }
        };
        fetchTasks();
    }, []);

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                {/* Class Info */}
                {user?.className && (
                    <div className="bg-primary/10 rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">Your Class</p>
                        <p className="text-2xl font-bold text-primary">{user.className}</p>
                    </div>
                )}

                {/* Learning Buddy CTA */}
                <Button
                    size="xl"
                    className="w-full h-auto py-6 flex-col gap-2"
                    onClick={() => router.push('/dashboard/student/buddy')}
                >
                    <Brain size={36} />
                    <span className="text-lg">Ask Learning Buddy 🧠</span>
                    <span className="text-sm font-normal opacity-80">Get help with your questions</span>
                </Button>

                {/* Tasks Section */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Your Tasks
                        </h2>
                        <span className="text-xs text-muted-foreground">
                            {tasks.filter((t) => t.status === 'pending').length} pending
                        </span>
                    </div>
                    <div className="space-y-3">
                        {tasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No tasks assigned yet.</p>
                        ) : (
                            tasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                                >
                                    <TaskCard
                                        task={task}
                                        onStart={() => router.push(`/dashboard/student/task/${task.id}`)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Drawings Gallery */}
                <section>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Your Drawings
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {mockDrawings.map((drawing, index) => (
                            <div
                                key={drawing.id}
                                className="aspect-square bg-card border border-border rounded-lg flex flex-col items-center justify-center p-2 animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                            >
                                <Image size={24} className="text-muted-foreground mb-1" />
                                <span className="text-xs text-foreground text-center truncate w-full">
                                    {drawing.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground">{drawing.date}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MobileLayout>
    );
}
