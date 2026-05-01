import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, customer_name, event_type, event_date, event_time, venue, groom_name, bride_name, invitation_message, invitation_url"
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("id", id)
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { error } = await supabaseAdmin.from("rsvps").insert({
    order_id: id,
    guest_name: body.guestName,
    attending: body.attending,
    guest_count: body.guestCount || 1,
    message: body.message || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
