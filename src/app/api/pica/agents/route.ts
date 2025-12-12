import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeRaw = searchParams.get("page_size") ?? "30";
    const pageSize = Number(pageSizeRaw);
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 30;

    const { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(safePageSize);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      agents: agents?.map(agent => ({
        agent_id: agent.id,
        name: agent.name,
        created_at_unix_secs: Math.floor(new Date(agent.created_at).getTime() / 1000),
        access_level: agent.access_level,
      })) || [],
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
    const { conversation_config, name } = body;

    const agentData = {
      name,
      prompt: conversation_config?.agent?.prompt?.prompt || "",
      first_message: conversation_config?.agent?.first_message || "Hello! How can I help you today?",
      language: conversation_config?.agent?.language || "en",
      voice_id: conversation_config?.tts?.voice_id || null,
    };

    const { data: agent, error } = await supabase
      .from("agents")
      .insert(agentData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      agent_id: agent.id,
      name: agent.name,
      created_at_unix_secs: Math.floor(new Date(agent.created_at).getTime() / 1000),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
