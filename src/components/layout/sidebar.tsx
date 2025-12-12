"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Users,
    MessageSquare,
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
        <div className="space-y-4 py-6 flex flex-col h-full bg-background/60 backdrop-blur-xl border-r border-white/5 text-foreground relative z-50">
            <div className="px-4 py-2 flex-1">
                <Link href="/agents" className="flex items-center pl-2 mb-10 group">
                    <div className="relative w-10 h-10 mr-4 transition-transform group-hover:scale-105 duration-300">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative bg-black/40 backdrop-blur-md rounded-xl w-full h-full flex items-center justify-center border border-white/10 shadow-inner">
                            <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-br from-white to-primary/50">11</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 tracking-tight">
                        ElevenX
                    </h1>
                </Link>
                <div className="space-y-2">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200 ease-in-out relative overflow-hidden",
                                pathname.startsWith(route.href)
                                    ? "text-white bg-white/5 shadow-[0_0_20px_-5px_rgba(124,58,237,0.3)] border border-white/10"
                                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                            )}
                        >
                            {pathname.startsWith(route.href) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_2px_rgba(124,58,237,0.5)]" />
                            )}
                            <div className="flex items-center flex-1 relative z-10">
                                <route.icon className={cn("h-5 w-5 mr-3 transition-colors", pathname.startsWith(route.href) ? "text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" : route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-4 py-4 border-t border-white/5 bg-black/20">
                <div className="px-2">
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
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/10">
                    <Menu className="text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-white/10 bg-background/80 backdrop-blur-2xl text-white w-72">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}
