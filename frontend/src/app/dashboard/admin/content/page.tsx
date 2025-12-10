"use client";

import { useState, useEffect } from 'react';
import { FileText, Image, Trash2, Search } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { resources } from '@/lib/api';
import { LibraryItem } from '@/types';

export default function ContentManagementPage() {
    const [resourceList, setResourceList] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
        if (!confirm("Are you sure you want to delete this resource? This cannot be undone.")) return;
        try {
            await resources.delete(id);
            toast({ title: "Resource Deleted", description: "The resource has been removed." });
            fetchResources();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
        }
    };

    const filteredResources = resourceList.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MobileLayout>
            <div className="px-4 py-5 space-y-6">
                <div className="space-y-4">
                    <h1 className="text-xl font-bold">Content Management</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input
                            placeholder="Search content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid gap-3">
                    {loading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : filteredResources.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No content found.</p>
                    ) : (
                        filteredResources.map((item) => (
                            <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent-foreground">
                                        {item.type === 'visual' ? <Image size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {item.subject} • {item.grade} • {item.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => handleDelete(item.id)}>
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
