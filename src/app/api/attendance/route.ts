import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { dni, code } = await request.json();

  if (!dni || !code) {
    return Response.json({ error: "DNI y código son requeridos" }, { status: 400 });
  }

  const { data: scanPoint } = await supabase
    .from("scan_points")
    .select("*")
    .eq("code", code)
    .single();

  if (!scanPoint) {
    return Response.json({ error: "Código QR inválido" }, { status: 401 });
  }

  const { data: employee } = await supabase
    .from("employees")
    .select("*")
    .eq("dni", dni)
    .eq("active", true)
    .single();

  if (!employee) {
    return Response.json({ error: "Empleado no encontrado o inactivo" }, { status: 404 });
  }

  const { data: lastRecord } = await supabase
    .from("attendance_records")
    .select("type")
    .eq("employee_id", employee.id)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single();

  const newType = lastRecord?.type === "entry" ? "exit" : "entry";

  const { error } = await supabase.from("attendance_records").insert({
    employee_id: employee.id,
    type: newType,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    return Response.json({ error: "Error al registrar fichaje" }, { status: 500 });
  }

  const label = newType === "entry" ? "Entrada" : "Salida";
  return Response.json({
    message: `${label} registrada para ${employee.name} en ${scanPoint.name}`,
    type: newType,
  });
}
