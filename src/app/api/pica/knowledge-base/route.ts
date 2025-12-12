import { NextResponse } from "next/server";
import { listKnowledgeBase } from "@/lib/pica-client";
import { supabase } from "@/lib/supabase";

function hasPicaCredentials(): boolean {
  return !!(process.env.PICA_SECRET_KEY && process.env.PICA_ELEVENLABS_CONNECTION_KEY);
}

export async function GET() {
  try {
    if (hasPicaCredentials()) {
      try {
        const data = await listKnowledgeBase();
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: items, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedItems = (items || []).map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      content: item.content,
      metadata: item.metadata,
    }));

    return NextResponse.json(formattedItems);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
