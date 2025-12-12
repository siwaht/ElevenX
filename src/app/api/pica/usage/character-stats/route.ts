import { NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

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

    return await PicaServer.getCharacterStats(Math.floor(startUnix), Math.floor(endUnix));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
