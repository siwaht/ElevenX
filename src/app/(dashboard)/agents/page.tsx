"use client";

import { useEffect, useState, type SVGProps } from "react";
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
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Voice Agents
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Design, deploy, and monitor your intelligent conversational assistants from a single command center.
                    </p>
                </div>
                <Button asChild size="lg" className="shrink-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                    <Link href="/agents/new">
                        <Plus className="mr-2 h-5 w-5" />
                        Create New Agent
                    </Link>
                </Button>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Search agents by name or ID..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                    />
                </div>

                {/* List */}
                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 rounded-xl border bg-muted/10 animate-pulse" />
                        ))}
                    </div>
                ) : agents.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-24 glass-card rounded-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                            <UsersIcon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No agents yet</h3>
                        <p className="text-muted-foreground max-w-md mb-8">
                            Get started by creating your first AI voice agent. It only takes a few seconds.
                        </p>
                        <Button asChild variant="secondary" size="lg">
                            <Link href="/agents/new">Create Agent</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {agents.map((agent) => (
                            <Link key={agent.agent_id} href={`/agents/${agent.agent_id}`} className="group relative block">
                                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                <div className="relative h-full p-6 rounded-2xl glass-card flex flex-col justify-between transition-transform duration-300 group-hover:-translate-y-1">
                                    <div>
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-primary/20">
                                                {agent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold ring-1 ring-green-500/20">
                                                Active
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">{agent.name}</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                                            Updated {formatDistanceToNow(new Date(agent.created_at_unix_secs * 1000), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-4 border-t border-dashed border-white/10 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                        <span className="uppercase tracking-wider">{agent.access_level}</span>
                                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-foreground">
                                            Configure <span className="text-primary">→</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersIcon(props: SVGProps<SVGSVGElement>) {
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
