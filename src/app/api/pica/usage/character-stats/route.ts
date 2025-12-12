import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startRaw = searchParams.get("start_unix");
    const endRaw = searchParams.get("end_unix");

    if (!startRaw || !endRaw) {
      return NextResponse.json(
        { error: "Missing required query params: start_unix, end_unix" },
        { status: 400 }
      );
    }

    const startUnix = Number(startRaw);
    const endUnix = Number(endRaw);

    if (!Number.isFinite(startUnix) || !Number.isFinite(endUnix)) {
      return NextResponse.json(
        { error: "start_unix and end_unix must be numbers" },
        { status: 400 }
      );
    }

    const startDate = new Date(startUnix * 1000).toISOString().split('T')[0];
    const endDate = new Date(endUnix * 1000).toISOString().split('T')[0];

    const { data: stats, error } = await supabase
      .from("usage_stats")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      stats: stats?.map(stat => ({
        date: stat.date,
        character_count: stat.character_count,
        call_count: stat.call_count,
        total_duration_seconds: stat.total_duration_seconds,
      })) || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
