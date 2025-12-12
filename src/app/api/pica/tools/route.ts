import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: tools, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      tools: tools?.map(tool => ({
        tool_id: tool.id,
        name: tool.name,
        description: tool.description,
        tool_config: tool.config,
      })) || [],
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

    const toolData = {
      name: body.name,
      description: body.description || "",
      tool_type: body.tool_config?.type || "webhook",
      config: body.tool_config || {},
    };

    const { data: tool, error } = await supabase
      .from("tools")
      .insert(toolData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      tool_id: tool.id,
      name: tool.name,
      description: tool.description,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
