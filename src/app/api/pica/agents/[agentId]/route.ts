import { type NextRequest, NextResponse } from "next/server";
import { getAgent, deleteAgent } from "@/lib/pica-client";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;

    const agent = await getAgent(agentId);

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
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

    await deleteAgent(agentId);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
