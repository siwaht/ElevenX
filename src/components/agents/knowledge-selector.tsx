"use client";

import { useEffect, useState } from "react";
import { Pica } from "@/lib/pica";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";

interface KnowledgeSelectorProps {
    selectedDocIds: string[];
    onChange: (ids: string[]) => void;
}

export function KnowledgeSelector({ selectedDocIds, onChange }: KnowledgeSelectorProps) {
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDocs();
    }, []);

    const loadDocs = async () => {
        try {
            setLoading(true);
            const data = await Pica.listIDs();
            // Adjust based on actual API response structure
            // The prompt says listIDs returns list of docs.
            const list = Array.isArray(data) ? data : (data.documents || []);
            setDocs(list);
        } catch (err) {
            console.error("Failed to load knowledge base", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Loading documents...</div>;

    if (docs.length === 0) {
        return (
            <div className="text-sm text-muted-foreground border border-dashed p-4 rounded-md text-center">
                No documents found.
                <br />
                Upload documents in the Knowledge Base section.
            </div>
        )
    }

    return (
        <div className="grid gap-3">
            {docs.map((doc) => {
                const isSelected = selectedDocIds.includes(doc.id || doc.document_id || "");
                return (
                    <div key={doc.id || doc.document_id} className="flex items-start space-x-3 p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors">
                        <Checkbox
                            id={doc.id || doc.document_id}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                                const id = doc.id || doc.document_id;
                                if (checked) {
                                    onChange([...selectedDocIds, id]);
                                } else {
                                    onChange(selectedDocIds.filter(d => d !== id));
                                }
                            }}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor={doc.id || doc.document_id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                            >
                                <FileText className="h-3 w-3" />
                                {doc.name || "Untitled Document"}
                            </Label>
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                ID: {doc.id || doc.document_id}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
