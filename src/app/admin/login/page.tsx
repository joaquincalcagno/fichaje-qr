"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-dark">
      <div className="bg-brand-gray p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-700">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Pinturerías Calcagno" width={200} height={70} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-brand-yellow">Admin - Iniciar Sesión</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-yellow text-black py-3 rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-400 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
