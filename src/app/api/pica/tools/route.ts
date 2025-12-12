import { NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

export async function GET() {
  try {
    return await PicaServer.listTools();
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
    return await PicaServer.createTool(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
