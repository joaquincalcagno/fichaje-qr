import { supabase } from "@/lib/supabase";

export async function POST() {
  const token = crypto.randomUUID();
  const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { error } = await supabase.from("qr_tokens").insert({ token, expires_at });

  if (error) {
    return Response.json({ error: "Error al generar token" }, { status: 500 });
  }

  return Response.json({ token, expires_at });
}

export async function GET() {
  const { data } = await supabase
    .from("qr_tokens")
    .select("*")
    .gte("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return Response.json({ token: data?.token || null, expires_at: data?.expires_at || null });
}
