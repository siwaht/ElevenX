import { type NextRequest, NextResponse } from "next/server";
import { getAgent, deleteAgent } from "@/lib/pica-client";
import { supabase } from "@/lib/supabase";

function hasPicaCredentials(): boolean {
  return !!(process.env.PICA_SECRET_KEY && process.env.PICA_ELEVENLABS_CONNECTION_KEY);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;

    if (hasPicaCredentials()) {
      try {
        const agent = await getAgent(agentId);
        if (agent) {
          return NextResponse.json(agent);
        }
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: agent, error } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .maybeSingle();

    if (error) throw error;

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      agent_id: agent.id,
      name: agent.name,
      conversation_config: {
        agent: {
          prompt: { prompt: agent.prompt },
          first_message: agent.first_message,
          language: agent.language,
        },
        tts: {
          voice_id: agent.voice_id,
        },
      },
      created_at_unix_secs: Math.floor(new Date(agent.created_at).getTime() / 1000),
      access_level: agent.access_level,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;

    if (hasPicaCredentials()) {
      try {
        await deleteAgent(agentId);
        return NextResponse.json({ success: true });
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", agentId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
