"use client";

import { Users, BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { QuickStatCard } from '@/components/dashboard/QuickStatCard';
import { ActionButton } from '@/components/dashboard/ActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockStats = [
    { label: 'Total Users', value: 156, icon: <Users size={20} /> },
    { label: 'Content Items', value: 342, icon: <BookOpen size={20} /> },
    { label: 'AI Usage', value: '2.3K', icon: <Sparkles size={20} /> },
    { label: 'Active Today', value: 47, icon: <TrendingUp size={20} /> },
];

const usageData = [
    { month: 'Oct', usage: 450 },
    { month: 'Nov', usage: 680 },
    { month: 'Dec', usage: 890 },
    { month: 'Jan', usage: 1250 },
];

const recentUsers = [
    { name: 'Ms. Sarah Johnson', role: 'Teacher', joined: 'Jan 15' },
    { name: 'Alex Kumar', role: 'Student', joined: 'Jan 14' },
    { name: 'Dr. Williams', role: 'Admin', joined: 'Jan 12' },
];

export default function AdminDashboard() {
    const router = useRouter();
    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {mockStats.map((stat, index) => (
                        <QuickStatCard
                            key={stat.label}
                            {...stat}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                        />
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                        icon={<Users size={28} />}
                        label="Manage Users"
                        onClick={() => router.push('/dashboard/admin/users')}
                    />
                </div>

                {/* Usage Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">AI Usage This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {usageData.map((data, index) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                                    <div
                                        className="w-full bg-primary/20 rounded-t-sm transition-all duration-500 animate-slide-up"
                                        style={{
                                            height: `${(data.usage / 1500) * 100}%`,
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div
                                            className="w-full h-full bg-primary rounded-t-sm"
                                            style={{ opacity: 0.3 + (index * 0.2) }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Recent Users</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentUsers.map((user, index) => (
                            <div
                                key={user.name}
                                className="flex items-center justify-between py-2 border-b border-border last:border-0 animate-fade-in"
                                style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                            >
                                <div>
                                    <p className="font-medium text-sm text-foreground">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.role}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">{user.joined}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </MobileLayout>
    );
}
