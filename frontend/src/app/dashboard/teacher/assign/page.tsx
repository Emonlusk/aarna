"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, BookOpen, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { classes, assignments } from '@/lib/api';

export default function CreateAssignment() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [classList, setClassList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        class_id: '',
        due_date: '',
    });

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await classes.list();
                setClassList(res.data);
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, []);

    const handleSubmit = async () => {
        if (!formData.title || !formData.class_id || !formData.due_date) {
            toast({
                title: "Missing Fields",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            await assignments.create(formData);
            toast({
                title: "Success",
                description: "Assignment created successfully!",
            });
            router.push('/dashboard/teacher');
        } catch (error) {
            console.error("Failed to create assignment", error);
            toast({
                title: "Error",
                description: "Failed to create assignment.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
            <header className="sticky top-0 z-40 bg-card border-b border-border">
                <div className="flex items-center gap-3 h-14 px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-lg font-semibold">Create Assignment</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                        placeholder="e.g., Math Worksheet 1"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select
                        value={formData.subject}
                        onValueChange={(v) => setFormData({ ...formData, subject: v })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {['Mathematics', 'Science', 'English', 'History', 'Geography'].map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select
                        value={formData.class_id}
                        onValueChange={(v) => setFormData({ ...formData, class_id: v })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            {classList.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        placeholder="Instructions for students..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" size={18} />}
                    Create Assignment
                </Button>
            </div>
        </div>
    );
}
