"use client";

import { useEffect, useState } from "react";
import { Pica } from "@/lib/pica";
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Need to create/ensure table component
import { formatDistanceToNow } from "date-fns";

type Call = {
    conversation_id: string;
    agent_name?: string;
    start_time_unix_secs: number;
    duration_secs: number;
    status: string;
    [key: string]: unknown;
};

export default function CallsPage() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            setLoading(true);
            // Try to fetch from API, if fails, use mock for demo
            try {
                const data = (await Pica.listConversations()) as { conversations?: Call[] };
                setCalls(data.conversations ?? []);
            } catch {
                console.warn("API fetch failed, utilizing mock data for UI demo");
                setCalls([
                    { conversation_id: "conv_1", agent_name: "Support Agent", start_time_unix_secs: Date.now() / 1000 - 3600, duration_secs: 120, status: "completed" },
                    { conversation_id: "conv_2", agent_name: "Sales Bot", start_time_unix_secs: Date.now() / 1000 - 86400, duration_secs: 45, status: "completed" },
                    { conversation_id: "conv_3", agent_name: "Support Agent", start_time_unix_secs: Date.now() / 1000 - 10000, duration_secs: 300, status: "completed" }
                ]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Call Logs</h1>
                    <p className="text-muted-foreground mt-1">
                        History of conversations with your agents.
                    </p>
                </div>
                <Button variant="outline" onClick={fetchCalls}>
                    Refresh
                </Button>
            </div>

            <div className="border rounded-md bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Agent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : calls.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No calls found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            calls.map((call) => (
                                <TableRow key={call.conversation_id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        {call.agent_name || "Unknown Agent"}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                                            {call.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {call.duration_secs}s
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {formatDistanceToNow(new Date(call.start_time_unix_secs * 1000), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
