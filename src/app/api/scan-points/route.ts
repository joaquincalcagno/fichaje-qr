import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("scan_points")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();

  if (!name) {
    return Response.json({ error: "Nombre es requerido" }, { status: 400 });
  }

  const code = crypto.randomUUID().slice(0, 8);

  const { data, error } = await supabase
    .from("scan_points")
    .insert({ name, code })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) {
    return Response.json({ error: "ID es requerido" }, { status: 400 });
  }

  const { error } = await supabase.from("scan_points").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
