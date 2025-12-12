import { NextResponse } from "next/server";
import { listTools, createTool } from "@/lib/pica-client";
import { supabase } from "@/lib/supabase";

function hasPicaCredentials(): boolean {
  return !!(process.env.PICA_SECRET_KEY && process.env.PICA_ELEVENLABS_CONNECTION_KEY);
}

export async function GET() {
  try {
    if (hasPicaCredentials()) {
      try {
        const data = await listTools();
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: tools, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedTools = (tools || []).map((tool) => ({
      tool_id: tool.id,
      name: tool.name,
      description: tool.description,
      tool_config: {
        type: tool.tool_type,
        ...tool.config,
      },
    }));

    return NextResponse.json({ tools: formattedTools });
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
        const data = await createTool(body);
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: tool, error } = await supabase
      .from("tools")
      .insert({
        name: body.name || body.tool_config.name,
        description: body.description || body.tool_config.description,
        tool_type: body.tool_config.type,
        config: body.tool_config,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      tool_id: tool.id,
      name: tool.name,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
