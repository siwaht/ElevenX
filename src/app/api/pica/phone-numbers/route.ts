import { NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return await PicaServer.createPhoneNumber(body);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
