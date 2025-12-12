"use client";

import { Button } from "@/components/ui/button";
import { Plus, Phone } from "lucide-react";

// Mock data as list capability wasn't in list prompt, only Create
const numbers = [
    { phone_number: "+1234567890", provider: "twilio", label: "Demo Line" },
];

export default function PhoneNumbersPage() {

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Phone Numbers</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Buy Number
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {numbers.map((num) => (
                    <div key={num.phone_number} className="p-6 border rounded-lg bg-card shadow-sm flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-semibold">{num.label}</div>
                                <div className="text-sm text-muted-foreground">{num.phone_number}</div>
                                <div className="text-xs text-muted-foreground uppercase mt-1 bg-muted px-1.5 py-0.5 rounded w-fit">
                                    {num.provider}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
