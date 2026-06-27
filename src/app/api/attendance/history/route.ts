import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const employeeId = searchParams.get("employee_id");

  let query = supabase
    .from("attendance_records")
    .select("*, employee:employees(name, dni)")
    .order("timestamp", { ascending: false })
    .limit(100);

  if (date) {
    const startOfDay = `${date}T00:00:00.000Z`;
    const endOfDay = `${date}T23:59:59.999Z`;
    query = query.gte("timestamp", startOfDay).lte("timestamp", endOfDay);
  }

  if (employeeId) {
    query = query.eq("employee_id", employeeId);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}
