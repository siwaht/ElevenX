import { NextResponse } from "next/server";
import { createPhoneNumber } from "@/lib/pica-client";
import { supabase } from "@/lib/supabase";

function hasPicaCredentials(): boolean {
  return !!(process.env.PICA_SECRET_KEY && process.env.PICA_ELEVENLABS_CONNECTION_KEY);
}

export async function GET() {
  try {
    const { data: phoneNumbers, error } = await supabase
      .from("phone_numbers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedNumbers = (phoneNumbers || []).map((phone) => ({
      id: phone.id,
      phone_number: phone.phone_number,
      provider: phone.provider,
      label: phone.label,
      sid: phone.sid,
      agent_id: phone.agent_id,
    }));

    return NextResponse.json({ phone_numbers: formattedNumbers });
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

    if (hasPicaCredentials()) {
      try {
        const data = await createPhoneNumber(body);
        return NextResponse.json(data);
      } catch (picaError) {
        console.error("Pica API failed, falling back to Supabase:", picaError);
      }
    }

    const { data: phoneNumber, error } = await supabase
      .from("phone_numbers")
      .insert({
        phone_number: body.phone_number,
        provider: body.provider,
        label: body.label,
        sid: body.sid,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: phoneNumber.id,
      phone_number: phoneNumber.phone_number,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
