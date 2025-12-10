"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { assignments } from '@/lib/api';
import { Assignment } from '@/types';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'pending' | 'completed';

export default function MyTasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Assignment[]>([]);
    const [filter, setFilter] = useState<FilterType>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await assignments.list();
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
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return task.status === 'pending';
        if (filter === 'completed') return task.status === 'submitted' || task.status === 'graded';
        return true;
    });

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <BookOpen size={20} />
                    </div>
                    <h1 className="text-xl font-bold">My Tasks</h1>
                </div>

                {/* Filters */}
                <div className="flex p-1 bg-secondary rounded-lg">
                    <button
                        onClick={() => setFilter('all')}
                        className={cn(
                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                            filter === 'all' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={cn(
                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5",
                            filter === 'pending' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Clock size={14} />
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={cn(
                            "flex-1 py-1.5 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-1.5",
                            filter === 'completed' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <CheckCircle size={14} />
                        Done
                    </button>
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    {loading ? (
                        <p className="text-center text-muted-foreground py-10">Loading tasks...</p>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">No tasks found.</p>
                        </div>
                    ) : (
                        filteredTasks.map((task, index) => (
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
            </div>
        </MobileLayout>
    );
}
