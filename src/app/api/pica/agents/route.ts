import { NextResponse } from "next/server";
import { listAgents, createAgent } from "@/lib/pica-client";
import { supabase } from "@/lib/supabase";

function hasPicaCredentials(): boolean {
  return !!(process.env.PICA_SECRET_KEY && process.env.PICA_ELEVENLABS_CONNECTION_KEY);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeRaw = searchParams.get("page_size") ?? "30";
    const pageSize = Number(pageSizeRaw);
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 30;
    const search = searchParams.get("search") || undefined;
    const cursor = searchParams.get("cursor") || undefined;

    if (hasPicaCredentials()) {
      try {
        const data = await listAgents({
          page_size: safePageSize,
          search,
          cursor,
        });
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(safePageSize);

    if (error) throw error;

    const formattedAgents = (agents || []).map((agent) => ({
      agent_id: agent.id,
      name: agent.name,
      created_at_unix_secs: Math.floor(new Date(agent.created_at).getTime() / 1000),
      access_level: agent.access_level || "admin",
    }));

    return NextResponse.json({
      agents: formattedAgents,
      has_more: false,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (hasPicaCredentials()) {
      try {
        const data = await createAgent(body);
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: agent, error } = await supabase
      .from("agents")
      .insert({
        name: body.name,
        prompt: body.conversation_config?.agent?.prompt?.prompt || "",
        first_message: body.conversation_config?.agent?.first_message || "Hello! How can I help you today?",
        language: body.conversation_config?.agent?.language || "en",
        voice_id: body.conversation_config?.tts?.voice_id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      agent_id: agent.id,
      name: agent.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
