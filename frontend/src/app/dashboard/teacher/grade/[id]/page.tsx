"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Brain, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { submissions, ai } from '@/lib/api';

export default function GradeSubmission() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [submission, setSubmission] = useState<any>(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            setLoading(true);
            try {
                // We need a new endpoint to get a single submission or update the list endpoint
                // For now, let's assume we can get it from the list or add a new endpoint
                // Since we don't have a single submission endpoint, we might need to fetch list and filter
                // But better to add a get endpoint in backend.
                // For now, let's mock it or assume we added it.
                // Let's add GET /submissions/<id> to backend first.
                const res = await submissions.get(parseInt(id));
                setSubmission(res.data);
                setGrade(res.data.grade || '');
                setFeedback(res.data.feedback || '');
            } catch (error) {
                console.error("Failed to fetch submission", error);
                toast({ title: "Error", description: "Failed to load submission", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchSubmission();
    }, [id]);

    const handleAiGrade = async () => {
        if (!submission?.content) return;

        setAiLoading(true);
        try {
            const res = await ai.grade({
                content: submission.content,
                assignment_title: submission.assignment_title, // We need to ensure backend sends this
                assignment_description: submission.assignment_description
            });

            setGrade(res.data.grade);
            setFeedback(res.data.feedback);
            toast({ title: "AI Graded", description: "Review the AI's suggestions before saving." });
        } catch (error) {
            console.error("AI Grading failed", error);
            toast({ title: "Error", description: "AI Grading failed.", variant: "destructive" });
        } finally {
            setAiLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await submissions.grade(parseInt(id), { grade, feedback });
            toast({ title: "Saved", description: "Grade and feedback saved successfully." });
            router.back();
        } catch (error) {
            console.error("Failed to save grade", error);
            toast({ title: "Error", description: "Failed to save grade.", variant: "destructive" });
        }
    };

    if (loading || !submission) {
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
                    <h1 className="text-lg font-semibold">Grade Submission</h1>
                </div>
            </header>

            <div className="p-4 space-y-6">
                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="font-semibold">{submission.student_name}</h2>
                            <p className="text-sm text-muted-foreground">Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-border mt-2">
                        <p className="text-sm whitespace-pre-wrap">{submission.content}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Grading</h3>
                        <Button variant="outline" size="sm" onClick={handleAiGrade} disabled={aiLoading}>
                            {aiLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Brain className="mr-2" size={16} />}
                            Auto-Grade with AI
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Grade</Label>
                        <Input
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            placeholder="e.g., A, 90/100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Feedback</Label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Enter feedback for the student..."
                            rows={5}
                        />
                    </div>

                    <Button className="w-full" size="lg" onClick={handleSave}>
                        <CheckCircle className="mr-2" size={18} />
                        Save Grade
                    </Button>
                </div>
            </div>
        </div>
    );
}
