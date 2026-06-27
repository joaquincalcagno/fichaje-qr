"use client";

import { useEffect, useState } from "react";
import { AttendanceRecord } from "@/lib/types";

export default function DashboardPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState({ entries: 0, exits: 0, present: 0 });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetch(`/api/attendance/history?date=${today}`)
      .then((res) => res.json())
      .then((data: AttendanceRecord[]) => {
        setRecords(data);
        const entries = data.filter((r) => r.type === "entry").length;
        const exits = data.filter((r) => r.type === "exit").length;
        setStats({ entries, exits, present: entries - exits });
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-brand-yellow">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-brand-gray p-6 rounded-xl border border-gray-700">
          <p className="text-sm text-gray-400">Entradas hoy</p>
          <p className="text-3xl font-bold text-green-400">{stats.entries}</p>
        </div>
        <div className="bg-brand-gray p-6 rounded-xl border border-gray-700">
          <p className="text-sm text-gray-400">Salidas hoy</p>
          <p className="text-3xl font-bold text-red-400">{stats.exits}</p>
        </div>
        <div className="bg-brand-gray p-6 rounded-xl border border-gray-700">
          <p className="text-sm text-gray-400">Presentes ahora</p>
          <p className="text-3xl font-bold text-brand-yellow">{Math.max(0, stats.present)}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-300">Últimos movimientos</h2>
      <div className="bg-brand-gray rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-dark border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Empleado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Hora</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 20).map((record) => (
              <tr key={record.id} className="border-b border-gray-700 last:border-0">
                <td className="px-4 py-3 text-gray-200">
                  {(record.employee as { name: string } | undefined)?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.type === "entry"
                        ? "bg-green-900/40 text-green-400"
                        : "bg-red-900/40 text-red-400"
                    }`}
                  >
                    {record.type === "entry" ? "Entrada" : "Salida"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(record.timestamp).toLocaleTimeString("es-AR")}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No hay registros hoy
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
