"use client";

import { useState } from 'react';
import { Database, Shield, Bell, Moon, LogOut } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function AdminSettingsPage() {
    const { logout } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [maintenance, setMaintenance] = useState(false);

    const handleBackup = () => {
        toast({ title: "Backup Started", description: "Database backup is running in the background." });
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                <h1 className="text-xl font-bold">System Settings</h1>

                {/* System Status */}
                <section className="bg-card border border-border rounded-lg p-4 space-y-4">
                    <h2 className="font-semibold text-sm flex items-center gap-2">
                        <Shield size={18} className="text-primary" />
                        System Status
                    </h2>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-xs text-muted-foreground">Disable access for non-admins</p>
                        </div>
                        <Switch
                            checked={maintenance}
                            onCheckedChange={setMaintenance}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>System Notifications</Label>
                            <p className="text-xs text-muted-foreground">Enable global alerts</p>
                        </div>
                        <Switch
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                    </div>
                </section>

                {/* Data Management */}
                <section className="bg-card border border-border rounded-lg p-4 space-y-4">
                    <h2 className="font-semibold text-sm flex items-center gap-2">
                        <Database size={18} className="text-accent" />
                        Data Management
                    </h2>
                    <div className="p-3 bg-secondary/50 rounded-md text-sm">
                        <p className="font-medium">Database Size: 24 MB</p>
                        <p className="text-muted-foreground text-xs">Last backup: 2 hours ago</p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleBackup}>
                        Run Manual Backup
                    </Button>
                </section>

                {/* Account */}
                <section className="bg-card border border-border rounded-lg p-4 space-y-4">
                    <h2 className="font-semibold text-sm flex items-center gap-2">
                        <LogOut size={18} className="text-destructive" />
                        Account Actions
                    </h2>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                        Log Out
                    </Button>
                </section>

                <p className="text-center text-xs text-muted-foreground pt-4">
                    School Digital Hub v1.0.0
                </p>
            </div>
        </MobileLayout>
    );
}
