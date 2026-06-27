import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-brand-dark">
      <Image src="/logo.png" alt="Pinturerías Calcagno" width={280} height={100} className="mb-8" />
      <h1 className="text-4xl font-bold mb-4 text-brand-yellow">Fichaje QR</h1>
      <p className="text-lg text-gray-400 mb-8 text-center max-w-md">
        Sistema de control de asistencia mediante código QR
      </p>
      <div className="flex gap-4">
        <Link
          href="/admin/login"
          className="bg-brand-yellow text-black px-6 py-3 rounded-lg hover:brightness-110 transition font-semibold"
        >
          Panel Admin
        </Link>
        <Link
          href="/scan"
          className="border-2 border-brand-yellow text-brand-yellow px-6 py-3 rounded-lg hover:bg-brand-yellow hover:text-black transition font-semibold"
        >
          Fichar Asistencia
        </Link>
      </div>
    </div>
  );
}
