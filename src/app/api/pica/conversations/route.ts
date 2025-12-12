import { NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeRaw = searchParams.get("page_size") ?? "30";

    const pageSize = Number(pageSizeRaw);
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 30;

    return await PicaServer.listConversations(safePageSize);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
