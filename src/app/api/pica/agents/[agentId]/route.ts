import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;

    const { data: agent, error } = await supabase
      .from("agents")
      .select(`
        *,
        agent_tools!inner(
          tool_id,
          tools(*)
        ),
        agent_knowledge!inner(
          knowledge_id,
          knowledge_base(*)
        )
      `)
      .eq("id", agentId)
      .maybeSingle();

    if (error) {
      throw error;
    }

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
          prompt: {
            prompt: agent.prompt,
          },
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

    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("id", agentId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
