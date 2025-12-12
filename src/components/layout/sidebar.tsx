"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Users,
    Phone,
    Wrench,
    Database,
    BarChart3,
    Settings,
    Menu,
    X
} from "lucide-react"; // Make sure to install lucide-react if not present
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sidebarItems = [
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/phone-numbers", label: "Phone Numbers", icon: Phone },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/knowledge", label: "Knowledge Base", icon: Database },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden p-4 border-b flex items-center justify-between bg-background">
                <div className="font-semibold text-lg">ElevenX</div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:block",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b">
                    <span className="font-bold text-xl tracking-tight">ElevenX</span>
                </div>

                <div className="p-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
