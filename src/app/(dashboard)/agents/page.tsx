"use client";

import { useEffect, useState } from "react";
import { Pica, type Agent } from "@/lib/pica";
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const data = await Pica.listAgents();
            setAgents(data.agents || []);
        } catch (err) {
            setError("Failed to load agents. Please check your connection keys.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and deploy your intelligent voice agents.
                    </p>
                </div>
                <Button asChild className="shrink-0">
                    <Link href="/agents/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Agent
                    </Link>
                </Button>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                {/* Search/Filter Bar (Placeholder for now) */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border border-dashed">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-sm text-muted-foreground">Loading agents...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                        <p className="font-semibold">{error}</p>
                        <Button variant="outline" size="sm" onClick={fetchAgents} className="mt-4">Try Again</Button>
                    </div>
                ) : agents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg border border-dashed text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold">No agents found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
                            You haven't created any agents yet. Get started by creating your first voice agent.
                        </p>
                        <Button asChild>
                            <Link href="/agents/new">Create Agent</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((agent) => (
                            <Link key={agent.agent_id} href={`/agents/${agent.agent_id}`} className="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold">
                                        {agent.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                                        Active
                                    </div>
                                </div>
                                <h3 className="font-semibold truncate pr-4">{agent.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Updated {formatDistanceToNow(new Date(agent.created_at_unix_secs * 1000), { addSuffix: true })}
                                </p>
                                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{agent.access_level}</span>
                                    <span className="group-hover:translate-x-1 transition-transform">Configure →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
