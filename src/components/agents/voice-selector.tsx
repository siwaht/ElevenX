"use client";

import { Check, ChevronsUpDown, Mic } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const voices = [
    { value: "21m00Tcm4TlvDq8ikWAM", label: "Rachel", description: "American, calm" },
    { value: "AZnzlk1XvdvUeBnXmlld", label: "Domi", description: "American, strong" },
    { value: "EXAVITQu4vr4xnSDxMaL", label: "Bella", description: "American, soft" },
    { value: "ErXwobaYiN019PkySvjV", label: "Antoni", description: "American, well-rounded" },
    { value: "MF3mGyEYCl7XYWbV9V6O", label: "Elli", description: "American, emotional" },
    { value: "TxGEqnHWrfWFTfGW9XjX", label: "Josh", description: "American, deep" },
    { value: "VR6AewLTigWg4xSOukaG", label: "Arnold", description: "American, crisp" },
    { value: "pNInz6obpgDQGcFmaJgB", label: "Adam", description: "American, deep" },
    { value: "yoZ06aMxZJJ28mfd3POQ", label: "Sam", description: "American, raspy" },
];

interface VoiceSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? voices.find((voice) => voice.value === value)?.label || value
                        : "Select voice..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search voice..." />
                    <CommandList>
                        <CommandEmpty>No voice found.</CommandEmpty>
                        <CommandGroup>
                            {voices.map((voice) => (
                                <CommandItem
                                    key={voice.value}
                                    value={voice.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === voice.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{voice.label}</span>
                                        <span className="text-xs text-muted-foreground">{voice.description}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
