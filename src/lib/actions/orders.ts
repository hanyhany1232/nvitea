"use server";

import { createClient } from "@/lib/supabase/server";
import { getDesignById } from "@/lib/data";

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  groomName: string;
  brideName: string;
  designPreference: string;
  message: string;
  additionalNotes: string;
  designId?: string;
}

export async function createOrder(data: OrderFormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const design = data.designId ? getDesignById(data.designId) : null;
  const validatedAmount = design?.price || 99;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id || null,
      customer_name: data.name,
      customer_email: data.email,
      customer_phone: data.phone,
      event_type: data.eventType,
      event_date: data.eventDate,
      event_time: data.eventTime || null,
      venue: data.venue || null,
      groom_name: data.groomName || null,
      bride_name: data.brideName || null,
      design_preference: data.designPreference || design?.name || null,
      invitation_message: data.message || null,
      additional_notes: data.additionalNotes || null,
      amount: validatedAmount,
      status: "pending",
      payment_status: "unpaid",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { order };
}

export async function getOrders() {
  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { orders };
}

export async function getOrderById(id: string) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { order };
}

export async function updateOrderStatus(
  id: string,
  status: string,
  invitationUrl?: string
) {
  const supabase = await createClient();

  const updateData: Record<string, string> = { status };
  if (invitationUrl) {
    updateData.invitation_url = invitationUrl;
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function submitRsvp(
  orderId: string,
  data: {
    guestName: string;
    attending: string;
    guestCount: number;
    message: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase.from("rsvps").insert({
    order_id: orderId,
    guest_name: data.guestName,
    attending: data.attending,
    guest_count: data.guestCount,
    message: data.message || null,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getRsvpsByOrder(orderId: string) {
  const supabase = await createClient();

  const { data: rsvps, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { rsvps };
}
