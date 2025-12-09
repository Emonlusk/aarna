"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, User, Shield, BookOpen } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { users } from '@/lib/api';
import { User as UserType } from '@/types';

export default function UserManagementPage() {
    const router = useRouter();
    const [userList, setUserList] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        pin: '',
        class_name: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await users.list();
            setUserList(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }
        try {
            await users.create(newUser);
            toast({ title: "User Created", description: `${newUser.name} has been added.` });
            setNewUser({ name: '', email: '', password: '', role: 'student', pin: '', class_name: '' });
            fetchUsers();
        } catch (error: any) {
            toast({ title: "Error", description: error.response?.data?.error || "Failed to create user", variant: "destructive" });
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await users.delete(id);
            toast({ title: "User Deleted", description: "The user has been removed." });
            fetchUsers();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
        }
    };

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                <h1 className="text-xl font-bold">User Management</h1>

                {/* Create User Form */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                    <h2 className="font-semibold text-sm">Add New User</h2>
                    <div className="grid gap-3">
                        <Input
                            placeholder="Full Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <Select
                                value={newUser.role}
                                onValueChange={(val) => setNewUser({ ...newUser, role: val })}
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {newUser.role === 'student' && (
                                <Input
                                    placeholder="Class (e.g. 5A)"
                                    value={newUser.class_name}
                                    onChange={(e) => setNewUser({ ...newUser, class_name: e.target.value })}
                                    className="flex-1"
                                />
                            )}
                        </div>
                        <Input
                            placeholder="PIN (4 digits)"
                            maxLength={4}
                            value={newUser.pin}
                            onChange={(e) => setNewUser({ ...newUser, pin: e.target.value.replace(/\D/g, '') })}
                        />
                        <Button onClick={handleCreateUser}>
                            Create User
                        </Button>
                    </div>
                </div>

                <div className="grid gap-3">
                    {loading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : userList.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No users found.</p>
                    ) : (
                        userList.map((user) => (
                            <div key={user.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        {user.role === 'admin' ? <Shield size={20} /> : user.role === 'teacher' ? <BookOpen size={20} /> : <User size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{user.name}</h3>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {user.role} {user.className ? `• ${user.className}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
