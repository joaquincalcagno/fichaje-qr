"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
      } else {
        setAuthenticated(true);
      }
      setChecking(false);
    });
  }, [pathname, router, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-dark">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/employees", label: "Empleados" },
    { href: "/admin/attendance", label: "Asistencia" },
    { href: "/admin/qr", label: "Código QR" },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <nav className="bg-brand-gray shadow-lg border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Image src="/logo.png" alt="Pinturerías Calcagno" width={140} height={50} />
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm ${
                  pathname === link.href
                    ? "text-brand-yellow font-semibold"
                    : "text-gray-400 hover:text-brand-yellow"
                } transition`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-400 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
