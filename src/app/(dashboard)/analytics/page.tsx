"use client";

import { useEffect, useState } from "react";
import { Pica } from "@/lib/pica";
import { Loader2, TrendingUp, Users, MessageSquare } from "lucide-react";
import { UsageChart } from "@/components/analytics/usage-chart";

type CharacterStats = {
    total_usage?: number;
    [key: string]: unknown;
};

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<CharacterStats | null>(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const now = Date.now() / 1000;
            const start = now - 86400 * 7;
            const data = (await Pica.getCharacterStats(Math.floor(start), Math.floor(now))) as CharacterStats;
            setStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Mock Chart Data (Last 7 days)
    const chartData = [
        { name: "Mon", value: 4000 },
        { name: "Tue", value: 3000 },
        { name: "Wed", value: 2000 },
        { name: "Thu", value: 2780 },
        { name: "Fri", value: 1890 },
        { name: "Sat", value: 2390 },
        { name: "Sun", value: 3490 },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Analytics
            </h1>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 glass-card rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 font-medium">
                        <TrendingUp className="h-4 w-4 text-primary" /> Total Character Usage
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : (stats?.total_usage ?? 12500).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">chars</span>
                    </div>
                </div>

                <div className="p-6 glass-card rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 font-medium">
                        <Users className="h-4 w-4 text-green-500" /> Active Agents
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : "3"}
                    </div>
                </div>

                <div className="p-6 glass-card rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 font-medium">
                        <MessageSquare className="h-4 w-4 text-blue-500" /> Total Conversations
                    </div>
                    <div className="text-3xl font-bold tracking-tight">
                        {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : "12"}
                    </div>
                </div>
            </div>

            {/* Usage Chart */}
            <div className="glass-card p-8 rounded-2xl">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">Usage Trends</h2>
                    <p className="text-sm text-muted-foreground">Character consumption over the last 7 days.</p>
                </div>
                <UsageChart data={chartData} />
            </div>
        </div>
    );
}
