"use client";

import { useState } from "react";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Fichaje</h1>
        <p className="text-gray-500 text-center mb-6">Ingresá tu DNI para registrar entrada o salida</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {status === "loading" ? "Registrando..." : "Fichar"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-center">
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
