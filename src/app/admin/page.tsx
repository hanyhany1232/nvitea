import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: rsvps } = await supabase.from("rsvps").select("*");

  return <AdminDashboard orders={orders || []} rsvps={rsvps || []} />;
}
