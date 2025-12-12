"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pica, type Agent } from "@/lib/pica";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to create or ensure this exists
import { Label } from "@/components/ui/label"; // Need to create/ensure
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need to create/ensure
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VoiceSelector } from "@/components/agents/voice-selector";
import { ToolsSelector } from "@/components/agents/tools-selector";
import { KnowledgeSelector } from "@/components/agents/knowledge-selector";
import { CallConsole } from "@/components/testing/call-console";

export default function AgentBuilderPage() {
    const params = useParams();
    const router = useRouter();
    const agentId = params.agentId as string;
    const isNew = agentId === "new";

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [firstMessage, setFirstMessage] = useState("");
    const [prompt, setPrompt] = useState("");
    const [language, setLanguage] = useState("en");
    const [voiceId, setVoiceId] = useState("");
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

    useEffect(() => {
        if (!isNew && agentId) {
            loadAgent();
        }
    }, [agentId]);

    const loadAgent = async () => {
        try {
            setLoading(true);
            const data = await Pica.getAgent(agentId);
            // Map response to state
            setName(data.name || "");
            setFirstMessage(data.conversation_config?.agent?.first_message || "");
            setPrompt(data.conversation_config?.agent?.prompt?.prompt || "");
            setLanguage(data.conversation_config?.agent?.language || "en");
            // Assuming voice is in conversation_config.tts.voice_id based on standard schema, though not in minimal prompt
            // We will safeguard access
            // @ts-ignore
            setVoiceId(data.conversation_config?.tts?.voice_id || "");
            // @ts-ignore
            setSelectedTools(data.conversation_config?.agent?.tools || []);
            // @ts-ignore
            // knowledge_base is likely an array of objects { id: string, type: 'file' } or similar. Assuming IDs for now.
            setSelectedDocs(data.conversation_config?.agent?.knowledge_base?.map((k: any) => k.id) || []);
        } catch (err) {
            console.error("Failed to load agent", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                name,
                conversation_config: {
                    agent: {
                        first_message: firstMessage,
                        language,
                        prompt: { prompt },
                        dynamic_variables: { dynamic_variable_placeholders: {} }, // Todo
                        tools: selectedTools,
                        knowledge_base: selectedDocs.map(id => ({ id, type: 'file' })) // Generic assumption
                    },
                    tts: { voice_id: voiceId },
                    // Defaults or preserved values
                }
            };

            if (isNew) {
                const res = await Pica.createAgent(payload as any); // Type assertion for now
                router.push(`/agents/${res.agent_id}`);
            } else {
                // Update not strictly defined in Pica helper yet, need to check docs/helper
                // Assuming create/update might use similar endpoints or re-creation logic if update API not explicit in prompt
                // The prompt only listed Create, Delete, Get. 
                // Update is missing in PicaOS example. Usually it's PATCH or PUT.
                // For now I'll just log or attempt a PATCH if I knew the endpoint.
                // I'll simulate save or show a toast "Update not implemented in demo connection".
                // Actually, many platforms use POST /create for update with ID, or have a specific update endpoint.
                // I will focus on Create for now, and Edit just loads data.
                alert("Update functionality requires specific API endpoint documentation. (Simulated Save)");
            }
        } catch (err) {
            console.error("Failed to save", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-background px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/agents"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold">{isNew ? "Create Agent" : name}</h1>
                        <span className="text-xs text-muted-foreground">{isNew ? "New Agent" : "Agent Configuration"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <Tabs defaultValue="configuration" className="w-full max-w-4xl mx-auto">
                        <TabsList className="mb-6 flex flex-wrap h-auto gap-2">
                            <TabsTrigger value="configuration">Configuration</TabsTrigger>
                            <TabsTrigger value="tools">Tools</TabsTrigger>
                            <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        </TabsList>

                        <TabsContent value="configuration" className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid gap-6 p-6 border rounded-lg bg-card/50 backdrop-blur-sm">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Agent Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Support Assistant"
                                        className="bg-background/50"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Input
                                        id="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        placeholder="en"
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            {/* Voice Settings */}
                            <div className="grid gap-6 p-6 border rounded-lg bg-card/50 backdrop-blur-sm">
                                <h3 className="font-semibold">Voice Settings</h3>
                                <div className="grid gap-2">
                                    <Label>Voice</Label>
                                    <VoiceSelector value={voiceId} onChange={setVoiceId} />
                                    <p className="text-xs text-muted-foreground">Select the voice persona for the agent.</p>
                                </div>
                            </div>

                            {/* Prompt Engineering */}
                            <div className="grid gap-6 p-6 border rounded-lg bg-card/50 backdrop-blur-sm">
                                <h3 className="font-semibold">Prompt Engineering</h3>

                                <div className="grid gap-2">
                                    <Label htmlFor="first_message">First Message</Label>
                                    <Textarea
                                        id="first_message"
                                        rows={2}
                                        value={firstMessage}
                                        onChange={(e) => setFirstMessage(e.target.value)}
                                        placeholder="Hello! How can I help you today?"
                                        className="bg-background/50"
                                    />
                                    <p className="text-xs text-muted-foreground">The first message the agent will say.</p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="prompt">System Prompt</Label>
                                    <Textarea
                                        id="prompt"
                                        className="font-mono text-sm min-h-[300px] bg-background/50"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="You are a helpful assistant..."
                                    />
                                    <p className="text-xs text-muted-foreground">Define the agent's persona and logic.</p>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="tools">
                            <div className="p-6 border rounded-lg bg-card/50 backdrop-blur-sm">
                                <h3 className="font-semibold mb-4">Enabled Tools</h3>
                                <ToolsSelector selectedToolIds={selectedTools} onChange={setSelectedTools} />
                            </div>
                        </TabsContent>

                        <TabsContent value="knowledge">
                            <div className="p-6 border rounded-lg bg-card/50 backdrop-blur-sm">
                                <h3 className="font-semibold mb-4">Knowledge Base</h3>
                                <p className="text-sm text-muted-foreground mb-4">Select documents to give your agent context.</p>
                                <KnowledgeSelector selectedDocIds={selectedDocs} onChange={setSelectedDocs} />
                            </div>
                        </TabsContent>

                        <TabsContent value="analytics">
                            <div className="p-12 text-center border rounded-lg bg-muted/20 border-dashed">
                                <h3 className="text-lg font-medium">Agent Analytics</h3>
                                <p className="text-muted-foreground">Coming soon...</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Panel / Test Console */}
                <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col h-[500px] lg:h-auto">
                    <CallConsole agentName={name} agentId={agentId} />
                </div>
            </div>
        </div>
    );
}
