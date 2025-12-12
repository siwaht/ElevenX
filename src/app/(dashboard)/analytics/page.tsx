"use client";

import { useEffect, useState } from "react";
import { Pica } from "@/lib/pica";
import { Loader2, TrendingUp, Users, MessageSquare } from "lucide-react";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const now = Date.now() / 1000;
            const start = now - 86400 * 7;
            const data = await Pica.getCharacterStats(Math.floor(start), Math.floor(now));
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <TrendingUp className="h-4 w-4" /> Total Usage
                    </div>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (stats?.total_usage || "0")} chars
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Users className="h-4 w-4" /> Active Agents
                    </div>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "3"}
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MessageSquare className="h-4 w-4" /> Conversations
                    </div>
                    <div className="text-2xl font-bold">
                        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "12"}
                    </div>
                </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-[400px] border rounded-lg bg-card flex items-center justify-center border-dashed text-muted-foreground">
                Chart visualization coming soon (requires Recharts integration).
            </div>
        </div>
    );
}
