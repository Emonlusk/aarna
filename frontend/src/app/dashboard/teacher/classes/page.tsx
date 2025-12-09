"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Users } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { classes } from '@/lib/api';

interface ClassItem {
    id: number;
    name: string;
    teacher: string;
}

export default function MyClassesPage() {
    const router = useRouter();
    const [classList, setClassList] = useState<ClassItem[]>([]);
    const [newClassName, setNewClassName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await classes.list();
            setClassList(res.data);
        } catch (error) {
            console.error("Failed to fetch classes", error);
        }
    };

    const handleCreateClass = async () => {
        if (!newClassName.trim()) return;
        setLoading(true);
        try {
            await classes.create({ name: newClassName });
            toast({ title: "Class Created", description: `${newClassName} has been added.` });
            setNewClassName('');
            fetchClasses();
        } catch (error) {
            toast({ title: "Error", description: "Failed to create class", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async (id: number) => {
        if (!confirm("Are you sure you want to delete this class?")) return;
        try {
            await classes.delete(id);
            toast({ title: "Class Deleted", description: "The class has been removed." });
            fetchClasses();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete class", variant: "destructive" });
        }
    };

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                <h1 className="text-xl font-bold">My Classes</h1>

                {/* Create Class Form */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                    <h2 className="font-semibold text-sm">Create New Class</h2>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Class Name (e.g. 5A)"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                        />
                        <Button onClick={handleCreateClass} disabled={loading}>
                            {loading ? "..." : <Plus size={20} />}
                        </Button>
                    </div>
                </div>

                {/* Class List */}
                <div className="grid gap-3">
                    {classList.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No classes found. Create one to get started.</p>
                    ) : (
                        classList.map((cls) => (
                            <div key={cls.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{cls.name}</h3>
                                        <p className="text-xs text-muted-foreground">Teacher: {cls.teacher}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClass(cls.id)}>
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
