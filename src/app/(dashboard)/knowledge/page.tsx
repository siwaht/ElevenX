"use client";

import { useEffect, useState } from "react";
import { Pica } from "@/lib/pica";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Loader2 } from "lucide-react";

export default function KnowledgePage() {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        try {
            setLoading(true);
            const data = await Pica.listIDs();
            const list = Array.isArray(data) ? data : (data.documents || []);
            setDocs(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {loading ? [1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 rounded-lg border bg-muted/20 animate-pulse" />
                )) : docs.length === 0 ? (
                    <div className="col-span-full text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                        No documents found.
                    </div>
                ) : docs.map((doc) => (
                    <div key={doc.id || doc.document_id} className="p-6 border rounded-lg bg-card shadow-sm flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold truncate w-full max-w-[200px]">{doc.name || "Untitled"}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                ID: {(doc.id || doc.document_id)?.substring(0, 8)}...
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
