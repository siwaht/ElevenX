import { NextResponse } from "next/server";
import { listKnowledgeBase } from "@/lib/pica-client";

export async function GET() {
  try {
    const data = await listKnowledgeBase();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
