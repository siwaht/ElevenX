"use client";

import { useEffect, useState } from "react";
import { Pica, type Tool } from "@/lib/pica";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ToolsSelectorProps {
    selectedToolIds: string[];
    onChange: (ids: string[]) => void;
}

export function ToolsSelector({ selectedToolIds, onChange }: ToolsSelectorProps) {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTools();
    }, []);

    const loadTools = async () => {
        try {
            setLoading(true);
            const data = await Pica.listTools();
            // Adjust based on actual API response structure (array vs wrapped)
            // The prompt example says `const toolList = await res.json();`.
            // It implies it might be an array or object. PicaOS docs typically return { tools: [...] } or array.
            // I'll handle both safery.
            const list = Array.isArray(data)
                ? (data as Tool[])
                : ((data as { tools?: Tool[] }).tools ?? []);
            setTools(list);
        } catch (err) {
            console.error("Failed to load tools", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Loading tools...</div>;

    if (tools.length === 0) {
        return (
            <div className="text-sm text-muted-foreground border border-dashed p-4 rounded-md text-center">
                No tools available.
                <br />
                Create a tool in the Tools section first.
            </div>
        )
    }

    return (
        <div className="grid gap-3">
            {tools.map((tool) => {
                const toolId = tool.tool_id;
                if (!toolId) return null;

                const isSelected = selectedToolIds.includes(toolId);
                return (
                    <div key={toolId} className="flex items-start space-x-3 p-3 border rounded-md bg-background hover:bg-muted/50 transition-colors">
                        <Checkbox
                            id={toolId}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                                if (checked === true) {
                                    onChange([...selectedToolIds, toolId]);
                                } else {
                                    onChange(selectedToolIds.filter((id) => id !== toolId));
                                }
                            }}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor={toolId}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {tool.name}
                            </Label>
                            {tool.description && (
                                <p className="text-xs text-muted-foreground">
                                    {tool.description}
                                </p>
                            )}
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground uppercase tracking-wider font-semibold">
                                    {tool.tool_config.type}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
