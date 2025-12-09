"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { assignments, submissions } from '@/lib/api';

export default function SubmitAssignment() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [task, setTask] = useState<any>(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const res = await assignments.get(parseInt(id));
                setTask(res.data);
            } catch (error) {
                console.error("Failed to fetch task", error);
                toast({ title: "Error", description: "Failed to load assignment", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTask();
    }, [id]);

    const handleSubmit = async () => {
        if (!content.trim()) {
            toast({ title: "Empty Submission", description: "Please enter some content.", variant: "destructive" });
            return;
        }

        setSubmitting(true);
        try {
            await submissions.submit({
                assignment_id: parseInt(id),
                content: content
            });
            toast({ title: "Submitted!", description: "Great job completing this task." });
            router.push('/dashboard/student');
        } catch (error) {
            console.error("Failed to submit", error);
            toast({ title: "Error", description: "Failed to submit assignment.", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !task) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto pb-20">
            <header className="sticky top-0 z-40 bg-card border-b border-border">
                <div className="flex items-center gap-3 h-14 px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-lg font-semibold">Assignment Details</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="font-bold text-lg">{task.title}</h2>
                            <p className="text-sm text-muted-foreground">{task.subject}</p>
                        </div>
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                            Pending
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-2 border-t border-border">
                        <p className="text-sm leading-relaxed">{task.description}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FileText size={18} />
                        Your Submission
                    </h3>
                    <Textarea
                        placeholder="Type your answer here..."
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="resize-none"
                    />

                    <Button variant="outline" className="w-full gap-2">
                        <Upload size={16} />
                        Attach File (Optional)
                    </Button>
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" size={18} />}
                    Submit Assignment
                </Button>
            </div>
        </div>
    );
}
