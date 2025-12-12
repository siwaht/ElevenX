"use client";

import { useEffect, useState } from "react";
import { Pica, type Tool } from "@/lib/pica";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ToolsPage() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);

    // New Tool State
    const [newToolName, setNewToolName] = useState("");
    const [newToolDesc, setNewToolDesc] = useState("");
    const [newToolUrl, setNewToolUrl] = useState("");

    useEffect(() => {
        loadTools();
    }, []);

    const loadTools = async () => {
        try {
            setLoading(true);
            const data = await Pica.listTools();
            const list = Array.isArray(data) ? data : (data.tools || []);
            setTools(list);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            setCreating(true);
            await Pica.createTool({
                name: newToolName,
                description: newToolDesc,
                tool_config: {
                    type: 'webhook',
                    api_schema: { url: newToolUrl }
                }
            });
            setOpen(false);
            loadTools();
            // Reset
            setNewToolName("");
            setNewToolDesc("");
            setNewToolUrl("");
        } catch (err) {
            console.error(err);
            alert("Failed to create tool");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Tool
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Webhook Tool</DialogTitle>
                            <DialogDescription>
                                Define a new tool that agents can use.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={newToolName} onChange={e => setNewToolName(e.target.value)} placeholder="e.g. Check Weather" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="desc">Description</Label>
                                <Input id="desc" value={newToolDesc} onChange={e => setNewToolDesc(e.target.value)} placeholder="What does this tool do?" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="url">Webhook URL</Label>
                                <Input id="url" value={newToolUrl} onChange={e => setNewToolUrl(e.target.value)} placeholder="https://api.example.com/webhook" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={creating}>
                                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? [1, 2, 3].map(i => (
                    <div key={i} className="h-32 rounded-lg border bg-muted/20 animate-pulse" />
                )) : tools.length === 0 ? (
                    <div className="col-span-full text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                        No tools found. Create one to get started.
                    </div>
                ) : tools.map((tool) => (
                    <div key={tool.tool_id} className="p-6 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                            <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                                <Wrench className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border px-1.5 py-0.5 rounded">
                                {tool.tool_config.type}
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg">{tool.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {tool.description || "No description"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
