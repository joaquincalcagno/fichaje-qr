"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ScanPoint {
  id: string;
  name: string;
  code: string;
}

export default function QrPage() {
  const [points, setPoints] = useState<ScanPoint[]>([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [appUrl, setAppUrl] = useState("");

  useEffect(() => {
    setAppUrl(window.location.origin);
    loadPoints();
  }, []);

  async function loadPoints() {
    const res = await fetch("/api/scan-points");
    const data = await res.json();
    setPoints(data);
  }

  async function addPoint(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);

    await fetch("/api/scan-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    setNewName("");
    setLoading(false);
    loadPoints();
  }

  async function deletePoint(id: string) {
    if (!confirm("¿Eliminar este punto de fichaje?")) return;
    await fetch("/api/scan-points", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadPoints();
  }

  function printQr(name: string) {
    const qrEl = document.getElementById(`qr-${name}`);
    if (!qrEl) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>QR - ${name}</title></head>
      <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
        <h2>${name}</h2>
        ${qrEl.outerHTML}
        <p style="margin-top:16px;color:#666;">Escaneá este código para fichar</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Puntos de Fichaje (QR)</h1>

      <form onSubmit={addPoint} className="bg-white p-6 rounded-xl shadow-sm border mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Nombre del punto de fichaje</label>
          <input
            placeholder="Ej: Entrada principal, Oficina 2, Depósito..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear punto"}
        </button>
      </form>

      {points.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No hay puntos de fichaje. Creá uno para generar un QR.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {points.map((point) => {
            const qrUrl = `${appUrl}/scan?code=${point.code}`;
            return (
              <div key={point.id} className="bg-white p-6 rounded-xl shadow-sm border text-center">
                <h3 className="font-semibold text-lg mb-4">{point.name}</h3>
                <div className="inline-block p-4 bg-white border rounded-xl mb-4">
                  <QRCodeSVG id={`qr-${point.name}`} value={qrUrl} size={200} />
                </div>
                <p className="text-xs text-gray-400 mb-4 break-all">{qrUrl}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => printQr(point.name)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Imprimir QR
                  </button>
                  <button
                    onClick={() => deletePoint(point.id)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
