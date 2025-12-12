"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, PhoneOff, Send, User, Bot, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CallConsoleProps {
    agentName: string;
    agentId: string;
}

export function CallConsole({ agentName, agentId }: CallConsoleProps) {
    const [isCallActive, setIsCallActive] = useState(false);
    const [micActive, setMicActive] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "agent" | "system", content: string }[]>([]);
    const [inputText, setInputText] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
        }
    }, [messages]);

    const handleStartCall = () => {
        setIsCallActive(true);
        setMicActive(true);
        addMessage("system", "Connecting to agent...");
        setTimeout(() => {
            addMessage("system", "Connected.");
            addMessage("agent", `Hello! I am ${agentName || "your agent"}. How can I assist you?`);
        }, 1000);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        setMicActive(false);
        addMessage("system", "Call ended.");
    };

    const addMessage = (role: "user" | "agent" | "system", content: string) => {
        setMessages(prev => [...prev, { role, content }]);
    };

    const handleSend = () => {
        if (!inputText.trim()) return;
        addMessage("user", inputText);
        setInputText("");

        // Simulate response
        setTimeout(() => {
            if (isCallActive) {
                addMessage("agent", "I received your message. This is a simulated response as the real-time API is not connected.");
            }
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full bg-background border-l">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold text-sm">Test Console</h3>
                <div className="flex items-center gap-2">
                    {!isCallActive ? (
                        <Button size="sm" onClick={handleStartCall} className="gap-2 bg-green-600 hover:bg-green-700">
                            <Phone className="h-3 w-3" />
                            Start Call
                        </Button>
                    ) : (
                        <Button size="sm" variant="destructive" onClick={handleEndCall} className="gap-2">
                            <PhoneOff className="h-3 w-3" />
                            End Call
                        </Button>
                    )}
                </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-hidden relative" ref={scrollRef} style={{ overflowY: 'auto' }}>
                <div className="p-4 space-y-4">
                    {messages.length === 0 && !isCallActive && (
                        <div className="text-center text-muted-foreground text-sm mt-10">
                            <Mic className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p>Ready to test.</p>
                            <p className="text-xs">Click "Start Call" to begin interaction.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={cn(
                            "flex gap-3 text-sm max-w-[90%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                            msg.role === "system" ? "mx-auto justify-center text-xs text-muted-foreground w-full" : ""
                        )}>
                            {msg.role !== "system" && (
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-orange-500 text-white"
                                )}>
                                    {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                </div>
                            )}
                            <div className={cn(
                                "rounded-lg p-3",
                                msg.role === "user" ? "bg-primary text-primary-foreground" :
                                    msg.role === "agent" ? "bg-muted" : "bg-transparent text-center px-0 py-0"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t bg-background">
                {isCallActive ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-center gap-4 py-2">
                            <Button
                                variant={micActive ? "default" : "secondary"}
                                size="icon"
                                className="rounded-full h-12 w-12"
                                onClick={() => setMicActive(!micActive)}
                            >
                                {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                            </Button>
                            <div className="flex items-center gap-2 text-xs text-green-500 font-medium animate-pulse">
                                <Activity className="h-3 w-3" />
                                Live
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <Button size="icon" onClick={handleSend} disabled={!inputText}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-xs text-muted-foreground">
                        Console offline
                    </div>
                )}
            </div>
        </div>
    );
}
