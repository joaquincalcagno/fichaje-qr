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
      <h1 className="text-2xl font-bold mb-6">Historial de Asistencia</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los empleados</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Empleado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">DNI</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha y hora</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const emp = record.employee as { name: string; dni: string } | undefined;
              return (
                <tr key={record.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{emp?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{emp?.dni || "—"}</td>
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
                    {new Date(record.timestamp).toLocaleString("es-AR")}
                  </td>
                </tr>
              );
            })}
            {records.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
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
