import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: phoneNumbers, error } = await supabase
      .from("phone_numbers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      phone_numbers: phoneNumbers || [],
    });
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

    const phoneData = {
      phone_number: body.phone_number,
      provider: body.provider || "twilio",
      label: body.label || "",
      sid: body.sid || null,
      agent_id: body.agent_id || null,
    };

    const { data: phone, error } = await supabase
      .from("phone_numbers")
      .insert(phoneData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(phone);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
