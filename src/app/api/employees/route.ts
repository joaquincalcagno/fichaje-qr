import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, dni, position } = body;

  if (!name || !dni) {
    return Response.json({ error: "Nombre y DNI son requeridos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("employees")
    .insert({ name, email, dni, position })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json({ error: "Ya existe un empleado con ese DNI o email" }, { status: 409 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "ID es requerido" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("employees")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  if (!id) {
    return Response.json({ error: "ID es requerido" }, { status: 400 });
  }

  const { error } = await supabase.from("employees").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}
