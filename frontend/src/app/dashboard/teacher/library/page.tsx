"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Image, Trash2, Plus } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { resources } from '@/lib/api';
import { LibraryItem } from '@/types';

export default function MyLibraryPage() {
    const router = useRouter();
    const [resourceList, setResourceList] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await resources.list();
            const mapped = res.data.map((r: any) => ({
                ...r,
                createdAt: r.created_at
            }));
            setResourceList(mapped);
        } catch (error) {
            console.error("Failed to fetch resources", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        try {
            await resources.delete(id);
            toast({ title: "Resource Deleted", description: "The resource has been removed." });
            fetchResources();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
        }
    };

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">My Library</h1>
                    <Button size="sm" onClick={() => router.push('/dashboard/teacher/ai')}>
                        <Plus size={18} className="mr-1" /> New Resource
                    </Button>
                </div>

                <div className="grid gap-3">
                    {loading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : resourceList.length === 0 ? (
                        <div className="text-center py-8 space-y-3">
                            <p className="text-muted-foreground">No resources found.</p>
                            <Button variant="outline" onClick={() => router.push('/dashboard/teacher/ai')}>
                                Create with AI
                            </Button>
                        </div>
                    ) : (
                        resourceList.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent-foreground">
                                        {item.type === 'visual' ? <Image size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {item.subject} • {item.grade} • {item.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
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
