"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, FileText, Palette, Send, Loader2, Save, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { resources, ai } from '@/lib/api';

type Mode = 'chat' | 'worksheet' | 'visual';

const modes = [
    { id: 'chat' as Mode, icon: MessageSquare, label: 'Quick Chat' },
    { id: 'worksheet' as Mode, icon: FileText, label: 'Worksheet Maker' },
    { id: 'visual' as Mode, icon: Palette, label: 'Visual Aid' },
];

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
const grades = ['Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
const questionTypes = [
    { id: 'mcq', label: 'Multiple Choice' },
    { id: 'truefalse', label: 'True/False' },
    { id: 'short', label: 'Short Answer' },
    { id: 'essay', label: 'Essay' },
];

function AIAssistantContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialMode = (searchParams.get('mode') as Mode) || 'chat';

    const [mode, setMode] = useState<Mode>(initialMode);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);

    // Chat state
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; message: string }[]>([]);

    // Worksheet form state
    const [worksheetForm, setWorksheetForm] = useState({
        subject: '',
        grade: '',
        topic: '',
        numQuestions: '5',
        questionTypes: ['mcq'],
    });

    // Visual aid state
    const [visualTopic, setVisualTopic] = useState('');

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            let prompt = '';
            if (mode === 'chat') {
                prompt = chatMessage;
            } else if (mode === 'worksheet') {
                prompt = `Create a ${worksheetForm.subject} worksheet for ${worksheetForm.grade} on the topic "${worksheetForm.topic}". 
                Include ${worksheetForm.numQuestions} questions. 
                Question types: ${worksheetForm.questionTypes.join(', ')}.
                Format nicely with Markdown.`;
            } else if (mode === 'visual') {
                prompt = `Create a step-by-step guide to draw a visual aid for: ${visualTopic}. 
                Format nicely with Markdown.`;
            }

            const res = await ai.chat({ message: prompt, role: 'teacher' });

            if (mode === 'chat') {
                setChatHistory([
                    ...chatHistory,
                    { role: 'user', message: chatMessage },
                    { role: 'ai', message: res.data.response },
                ]);
                setChatMessage('');
            } else {
                setGeneratedContent(res.data.response);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to generate content", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedContent) return;

        try {
            const title = mode === 'worksheet'
                ? `${worksheetForm.topic} Worksheet`
                : `Visual Aid: ${visualTopic}`;

            await resources.create({
                title,
                type: mode,
                content: generatedContent,
                subject: mode === 'worksheet' ? worksheetForm.subject : 'General',
                grade: mode === 'worksheet' ? worksheetForm.grade : 'General'
            });

            toast({
                title: 'Saved to Library',
                description: 'Your content has been saved successfully.',
            });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save resource", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-card border-b border-border">
                <div className="flex items-center gap-3 h-14 px-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft size={20} />
                    </Button>
                    <h1 className="text-lg font-semibold">AI Assistant</h1>
                </div>

                {/* Mode Tabs */}
                <div className="flex border-b border-border">
                    {modes.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => {
                                setMode(m.id);
                                setGeneratedContent(null);
                            }}
                            className={cn(
                                'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
                                mode === m.id
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <m.icon size={18} />
                            <span className="hidden sm:inline">{m.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Content */}
            <main className="p-4 pb-24">
                {/* Chat Mode */}
                {mode === 'chat' && (
                    <div className="space-y-4">
                        <div className="min-h-[300px] space-y-3">
                            {chatHistory.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                                    <p>Ask me anything about teaching!</p>
                                </div>
                            )}
                            {chatHistory.map((chat, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        'p-3 rounded-lg max-w-[85%]',
                                        chat.role === 'user'
                                            ? 'bg-primary text-primary-foreground ml-auto'
                                            : 'bg-secondary text-secondary-foreground'
                                    )}
                                >
                                    {chat.message}
                                </div>
                            ))}
                            {isGenerating && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span className="text-sm">AI is thinking...</span>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask a question..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && chatMessage && handleGenerate()}
                            />
                            <Button onClick={handleGenerate} disabled={!chatMessage || isGenerating}>
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Worksheet Mode */}
                {mode === 'worksheet' && (
                    <div className="space-y-5">
                        {!generatedContent ? (
                            <>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Subject</Label>
                                        <Select
                                            value={worksheetForm.subject}
                                            onValueChange={(v) => setWorksheetForm({ ...worksheetForm, subject: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select subject" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects.map((s) => (
                                                    <SelectItem key={s} value={s}>
                                                        {s}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Grade</Label>
                                        <Select
                                            value={worksheetForm.grade}
                                            onValueChange={(v) => setWorksheetForm({ ...worksheetForm, grade: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select grade" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {grades.map((g) => (
                                                    <SelectItem key={g} value={g}>
                                                        {g}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Topic</Label>
                                        <Input
                                            placeholder="e.g., Fractions, Photosynthesis..."
                                            value={worksheetForm.topic}
                                            onChange={(e) => setWorksheetForm({ ...worksheetForm, topic: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Number of Questions</Label>
                                        <Select
                                            value={worksheetForm.numQuestions}
                                            onValueChange={(v) => setWorksheetForm({ ...worksheetForm, numQuestions: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[3, 5, 10, 15, 20].map((n) => (
                                                    <SelectItem key={n} value={n.toString()}>
                                                        {n} questions
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Question Types</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {questionTypes.map((qt) => (
                                                <div key={qt.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={qt.id}
                                                        checked={worksheetForm.questionTypes.includes(qt.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setWorksheetForm({
                                                                    ...worksheetForm,
                                                                    questionTypes: [...worksheetForm.questionTypes, qt.id],
                                                                });
                                                            } else {
                                                                setWorksheetForm({
                                                                    ...worksheetForm,
                                                                    questionTypes: worksheetForm.questionTypes.filter(
                                                                        (t) => t !== qt.id
                                                                    ),
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    <Label htmlFor={qt.id} className="text-sm font-normal">
                                                        {qt.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleGenerate}
                                    disabled={!worksheetForm.subject || !worksheetForm.grade || !worksheetForm.topic || isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Worksheet'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <FileText size={18} className="text-primary" />
                                        Your Worksheet
                                    </h3>
                                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
                                        {generatedContent}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setGeneratedContent(null)}>
                                        Create New
                                    </Button>
                                    <Button className="flex-1" onClick={handleSave}>
                                        <Save size={18} />
                                        Save to Library
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Visual Aid Mode */}
                {mode === 'visual' && (
                    <div className="space-y-5">
                        {!generatedContent ? (
                            <>
                                <div className="space-y-2">
                                    <Label>Describe the topic you want a visual for</Label>
                                    <Textarea
                                        placeholder="e.g., The water cycle, Parts of a plant, Solar system..."
                                        value={visualTopic}
                                        onChange={(e) => setVisualTopic(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={handleGenerate}
                                    disabled={!visualTopic || isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Visual Aid'
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Palette size={18} className="text-primary" />
                                        Visual Aid Instructions
                                    </h3>
                                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
                                        {generatedContent}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setGeneratedContent(null)}>
                                        Create New
                                    </Button>
                                    <Button className="flex-1" onClick={handleSave}>
                                        <Save size={18} />
                                        Save to Library
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function AIAssistant() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AIAssistantContent />
        </Suspense>
    );
}
