"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Shield, BookOpen, KeyRound, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/api';

export default function ProfilePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        pin: '',
        currentPin: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                pin: '',
                currentPin: ''
            });
        }
    }, [user]);

    const handleUpdate = async () => {
        if (!formData.currentPin) {
            toast({
                title: "Verification Required",
                description: "Please enter your current PIN to make changes.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await auth.updateProfile(formData);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please check your PIN.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <MobileLayout>
            <div className="min-h-screen bg-background pb-20">
                <header className="sticky top-0 z-40 bg-card border-b border-border">
                    <div className="flex items-center gap-3 h-14 px-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft size={20} />
                        </Button>
                        <h1 className="text-lg font-semibold">My Profile</h1>
                    </div>
                </header>

                <div className="p-4 space-y-6">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center justify-center py-6 space-y-3">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={48} />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10"
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    value={user.role}
                                    className="pl-10 capitalize"
                                    disabled
                                />
                            </div>
                        </div>

                        {user.className && (
                            <div className="space-y-2">
                                <Label>Class</Label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        value={user.className}
                                        className="pl-10"
                                        disabled
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t border-border space-y-4">
                            <h3 className="font-semibold">Security</h3>

                            <div className="space-y-2">
                                <Label>New PIN (Optional)</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        type="password"
                                        maxLength={4}
                                        placeholder="Enter new 4-digit PIN"
                                        value={formData.pin}
                                        onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Current PIN (Required to save)</Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <Input
                                        type="password"
                                        maxLength={4}
                                        placeholder="Enter current PIN"
                                        value={formData.currentPin}
                                        onChange={(e) => setFormData({ ...formData, currentPin: e.target.value.replace(/\D/g, '') })}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-6" size="lg" onClick={handleUpdate} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
