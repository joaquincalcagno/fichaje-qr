import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Fichaje QR</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Sistema de control de asistencia mediante código QR
      </p>
      <div className="flex gap-4">
        <Link
          href="/admin/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Panel Admin
        </Link>
        <Link
          href="/scan"
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Fichar Asistencia
        </Link>
      </div>
    </div>
  );
}
