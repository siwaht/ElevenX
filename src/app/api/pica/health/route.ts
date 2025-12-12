import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasPicaSecret = !!process.env.PICA_SECRET_KEY;
    const hasPicaConnection = !!process.env.PICA_ELEVENLABS_CONNECTION_KEY;

    const { data, error } = await supabase
      .from("agents")
      .select("count")
      .limit(1);

    return NextResponse.json({
      env: {
        hasSupabaseUrl,
        hasSupabaseKey,
        hasPicaSecret,
        hasPicaConnection,
      },
      supabase: {
        connected: !error,
        error: error?.message,
        data: data,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
      },
      { status: 500 }
    );
  }
}
