"use client";

import { useEffect, useState } from "react";
import { Employee } from "@/lib/types";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ name: "", email: "", dni: "", position: "" });
  const [error, setError] = useState("");

  async function loadEmployees() {
    const res = await fetch("/api/employees");
    const data = await res.json();
    setEmployees(data);
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  function resetForm() {
    setForm({ name: "", email: "", dni: "", position: "" });
    setEditing(null);
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const method = editing ? "PUT" : "POST";
    const body = editing ? { id: editing.id, ...form } : form;

    const res = await fetch("/api/employees", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    resetForm();
    loadEmployees();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Seguro que querés eliminar este empleado?")) return;

    await fetch("/api/employees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadEmployees();
  }

  function startEdit(emp: Employee) {
    setForm({ name: emp.name, email: emp.email, dni: emp.dni, position: emp.position });
    setEditing(emp);
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-yellow">Empleados</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-brand-yellow text-black px-4 py-2 rounded-lg hover:brightness-110 transition text-sm font-semibold"
        >
          {showForm ? "Cancelar" : "Agregar empleado"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-brand-gray p-6 rounded-xl border border-gray-700 mb-6">
          <h2 className="font-semibold mb-4 text-gray-200">{editing ? "Editar empleado" : "Nuevo empleado"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre completo *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              required
            />
            <input
              placeholder="DNI *"
              value={form.dni}
              onChange={(e) => setForm({ ...form, dni: e.target.value })}
              className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <input
              placeholder="Cargo"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="bg-brand-dark border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-4 bg-brand-yellow text-black px-6 py-2 rounded-lg hover:brightness-110 transition text-sm font-semibold"
          >
            {editing ? "Guardar cambios" : "Crear empleado"}
          </button>
        </form>
      )}

      <div className="bg-brand-gray rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-dark border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Nombre</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">DNI</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Cargo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Estado</th>
              <th className="text-left px-4 py-3 font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-gray-700 last:border-0">
                <td className="px-4 py-3 font-medium text-gray-200">{emp.name}</td>
                <td className="px-4 py-3 text-gray-300">{emp.dni}</td>
                <td className="px-4 py-3 text-gray-400">{emp.email || "—"}</td>
                <td className="px-4 py-3 text-gray-400">{emp.position || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      emp.active ? "bg-green-900/40 text-green-400" : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {emp.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => startEdit(emp)}
                    className="text-brand-yellow hover:underline text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="text-red-400 hover:underline text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No hay empleados registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
