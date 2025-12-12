import { NextResponse } from "next/server";
import { getCharacterStats } from "@/lib/pica-client";
import { supabase } from "@/lib/supabase";

function hasPicaCredentials(): boolean {
  return !!(process.env.PICA_SECRET_KEY && process.env.PICA_ELEVENLABS_CONNECTION_KEY);
}

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

    if (hasPicaCredentials()) {
      try {
        const data = await getCharacterStats(startUnix, endUnix);
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const startDate = new Date(startUnix * 1000).toISOString().split('T')[0];
    const endDate = new Date(endUnix * 1000).toISOString().split('T')[0];

    const { data: stats, error } = await supabase
      .from("usage_stats")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    const totalUsage = (stats || []).reduce(
      (sum, stat) => sum + (stat.character_count || 0),
      0
    );

    return NextResponse.json({
      total_usage: totalUsage,
      stats: stats,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
