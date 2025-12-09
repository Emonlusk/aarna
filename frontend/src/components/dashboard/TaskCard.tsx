import { Assignment } from '@/types';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: Assignment;
    onStart?: () => void;
}

const statusColors = {
    pending: 'border-l-primary',
    submitted: 'border-l-accent',
    graded: 'border-l-success',
    completed: 'border-l-success',
    overdue: 'border-l-destructive',
};

export function TaskCard({ task, onStart }: TaskCardProps) {
    return (
        <div
            className={cn(
                'bg-card rounded-lg border border-border p-4 border-l-4',
                statusColors[task.status]
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{task.subject}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        <span>Due: {task.dueDate}</span>
                    </div>
                </div>
                {task.status === 'pending' && (
                    <Button size="sm" onClick={onStart} className="shrink-0">
                        Start <ArrowRight size={16} />
                    </Button>
                )}
                {task.status === 'submitted' && (
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                        Submitted
                    </span>
                )}
                {task.status === 'graded' && (
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full mb-1">
                            Graded
                        </span>
                        {task.grade && <span className="text-sm font-bold">{task.grade}</span>}
                    </div>
                )}
                {task.status === 'completed' && (
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                        Done
                    </span>
                )}
            </div>
        </div>
    );
}
