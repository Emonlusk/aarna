import { ActivityItem } from '@/types';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
    activities: ActivityItem[];
}

const iconMap = {
    generated: FileText,
    submitted: CheckCircle,
    assigned: Send,
};

const colorMap = {
    generated: 'text-primary bg-primary/10',
    submitted: 'text-success bg-success/10',
    assigned: 'text-accent bg-accent/10',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-1">
                Recent Activity
            </h3>
            <div className="space-y-2">
                {activities.map((activity, index) => {
                    const Icon = iconMap[activity.type];
                    return (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div
                                className={cn(
                                    'flex items-center justify-center w-8 h-8 rounded-full shrink-0',
                                    colorMap[activity.type]
                                )}
                            >
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">{activity.message}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {activity.timestamp}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
