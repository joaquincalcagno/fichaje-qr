"use client";

import { useEffect, useState } from "react";
import { AttendanceRecord, Employee } from "@/lib/types";

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [employeeId, setEmployeeId] = useState("");

  async function loadRecords() {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (employeeId) params.set("employee_id", employeeId);

    const res = await fetch(`/api/attendance/history?${params}`);
    const data = await res.json();
    setRecords(data);
  }

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  useEffect(() => {
    loadRecords();
  }, [date, employeeId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-brand-yellow">Historial de Asistencia</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-brand-gray border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
        />
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="bg-brand-gray border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
        >
          <option value="">Todos los empleados</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-brand-gray rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-dark border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Empleado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">DNI</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const emp = record.employee as { name: string; dni: string } | undefined;
              return (
                <tr key={record.id} className="border-b border-gray-700 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-200">{emp?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{emp?.dni || "—"}</td>
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
                    {new Date(record.timestamp).toLocaleString("es-AR")}
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No hay registros para la fecha seleccionada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
