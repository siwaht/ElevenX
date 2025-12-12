import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeRaw = searchParams.get("page_size") ?? "30";
    const pageSize = Number(pageSizeRaw);
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 30;

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(`
        *,
        agents(name)
      `)
      .order("started_at", { ascending: false })
      .limit(safePageSize);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      conversations: conversations?.map(conv => ({
        conversation_id: conv.id,
        agent_id: conv.agent_id,
        agent_name: conv.agents?.name,
        phone_number: conv.phone_number,
        duration_seconds: conv.duration_seconds,
        status: conv.status,
        started_at: conv.started_at,
        ended_at: conv.ended_at,
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
