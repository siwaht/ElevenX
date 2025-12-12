"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Users,
    MessageSquare,
    Mic,
    Settings,
    BarChart3,
    Database,
    Phone,
    Wrench,
    Menu
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const routes = [
    {
        label: "Agents",
        icon: Users,
        href: "/agents",
        color: "text-sky-500",
    },
    {
        label: "Phone Numbers",
        icon: Phone,
        href: "/phone-numbers",
        color: "text-violet-500",
    },
    {
        label: "Tools",
        icon: Wrench,
        href: "/tools",
        color: "text-pink-700",
    },
    {
        label: "Knowledge Base",
        icon: Database,
        href: "/knowledge",
        color: "text-orange-700",
    },
    {
        label: "Calls",
        icon: MessageSquare,
        href: "/calls",
        color: "text-green-700",
    },
    {
        label: "Analytics",
        icon: BarChart3,
        href: "/analytics",
        color: "text-emerald-500",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/agents" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        {/* Logo - simplified for code */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-lg opacity-70 blur-sm"></div>
                        <div className="relative bg-black rounded-lg w-full h-full flex items-center justify-center border border-white/10">
                            <span className="font-bold text-xl">11</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        ElevenX
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname.startsWith(route.href) ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="px-3 mb-4">
                    <ThemeToggle />
                </div>
            </div>
        </div>
    );
}

// Mobile Sidebar wrapper using Sheet
export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-slate-900 border-r-slate-800 text-white w-72">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
