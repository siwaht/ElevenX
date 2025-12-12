import { NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

export async function GET() {
  try {
    return await PicaServer.listKnowledgeBase();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
