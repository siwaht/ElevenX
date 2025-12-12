import { type NextRequest, NextResponse } from "next/server";

import { PicaServer } from "@/lib/pica.server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;
    return await PicaServer.getAgent(agentId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;
    return await PicaServer.deleteAgent(agentId);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
