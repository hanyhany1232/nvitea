"use server";

import { createClient } from "@/lib/supabase/server";

export interface DesignFormData {
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  tags: string[];
  featured: boolean;
  active: boolean;
}

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", supabase };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Not authorized", supabase };
  }

  return { error: null, supabase };
}

export async function getDesigns() {
  const supabase = await createClient();

  const { data: designs, error } = await supabase
    .from("designs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { designs: designs || [] };
}

export async function createDesign(data: DesignFormData) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError) {
    return { error: authError };
  }

  const { data: design, error } = await supabase
    .from("designs")
    .insert({
      name: data.name,
      slug: data.slug,
      category: data.category,
      price: data.price,
      description: data.description,
      image_url: data.imageUrl,
      tags: data.tags,
      featured: data.featured,
      active: data.active,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { design };
}

export async function updateDesign(id: string, data: Partial<DesignFormData>) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError) {
    return { error: authError };
  }

  const updateObj: Record<string, unknown> = {};
  if (data.name !== undefined) updateObj.name = data.name;
  if (data.slug !== undefined) updateObj.slug = data.slug;
  if (data.category !== undefined) updateObj.category = data.category;
  if (data.price !== undefined) updateObj.price = data.price;
  if (data.description !== undefined) updateObj.description = data.description;
  if (data.imageUrl !== undefined) updateObj.image_url = data.imageUrl;
  if (data.tags !== undefined) updateObj.tags = data.tags;
  if (data.featured !== undefined) updateObj.featured = data.featured;
  if (data.active !== undefined) updateObj.active = data.active;

  const { error } = await supabase
    .from("designs")
    .update(updateObj)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function deleteDesign(id: string) {
  const { error: authError, supabase } = await requireAdmin();
  if (authError) {
    return { error: authError };
  }

  const { error } = await supabase.from("designs").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
