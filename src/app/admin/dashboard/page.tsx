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
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Entradas hoy</p>
          <p className="text-3xl font-bold text-green-600">{stats.entries}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Salidas hoy</p>
          <p className="text-3xl font-bold text-red-500">{stats.exits}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Presentes ahora</p>
          <p className="text-3xl font-bold text-blue-600">{Math.max(0, stats.present)}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Últimos movimientos</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Empleado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Hora</th>
            </tr>
          </thead>
          <tbody>
            {records.slice(0, 20).map((record) => (
              <tr key={record.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  {(record.employee as { name: string } | undefined)?.name || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.type === "entry"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {record.type === "entry" ? "Entrada" : "Salida"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(record.timestamp).toLocaleTimeString("es-AR")}
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
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
