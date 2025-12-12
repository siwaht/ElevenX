import { NextResponse } from "next/server";
import { listAgents, createAgent } from "@/lib/pica-client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeRaw = searchParams.get("page_size") ?? "30";
    const pageSize = Number(pageSizeRaw);
    const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 30;
    const search = searchParams.get("search") || undefined;
    const cursor = searchParams.get("cursor") || undefined;

    const data = await listAgents({
      page_size: safePageSize,
      search,
      cursor,
    });

    return NextResponse.json(data);
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

    const data = await createAgent(body);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
