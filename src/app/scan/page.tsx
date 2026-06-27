"use client";

import { useState } from "react";
import Image from "next/image";

export default function ScanPage() {
  const [dni, setDni] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      setStatus("error");
      setMessage("QR inválido. Escaneá el código QR de la empresa.");
      return;
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, code }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setDni("");
      } else {
        setStatus("error");
        setMessage(data.error || "Error al registrar fichaje");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intentá de nuevo.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-brand-dark">
      <div className="bg-brand-gray p-8 rounded-2xl shadow-lg w-full max-w-sm border border-gray-700">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Pinturerías Calcagno" width={200} height={70} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2 text-brand-yellow">Fichaje</h1>
        <p className="text-gray-400 text-center mb-6">Ingresá tu DNI para registrar entrada o salida</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brand-yellow text-black py-3 rounded-lg text-lg font-semibold hover:brightness-110 transition disabled:opacity-50"
          >
            {status === "loading" ? "Registrando..." : "Fichar"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 p-4 bg-green-900/40 border border-green-700 rounded-lg text-green-400 text-center">
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 p-4 bg-red-900/40 border border-red-700 rounded-lg text-red-400 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
