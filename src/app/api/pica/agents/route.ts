import { NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeRaw = searchParams.get("page_size") ?? "30";
    const cursor = searchParams.get("cursor") ?? undefined;

    const pageSize = Number(pageSizeRaw);
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 30;

    return await PicaServer.listAgents(safePageSize, cursor);
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
    return await PicaServer.createAgent(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
