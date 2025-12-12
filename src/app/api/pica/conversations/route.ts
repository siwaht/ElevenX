import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    conversations: [],
    has_more: false,
    message: "Conversations are managed through call history in ElevenLabs",
  });
}
