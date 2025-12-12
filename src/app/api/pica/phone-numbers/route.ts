import { NextResponse } from "next/server";
import { createPhoneNumber } from "@/lib/pica-client";

export async function GET() {
  return NextResponse.json({
    phone_numbers: [],
    message: "Phone numbers listing requires additional Pica API configuration",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = await createPhoneNumber(body);

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
