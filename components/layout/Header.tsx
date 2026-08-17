"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

interface HeaderProps {
  role?: "public" | "student" | "teacher";
}

export default function Header({ role = "public" }: HeaderProps) {
  const userName = "Maria Mamani";
  const [viewMode, setViewMode] = useState<"public" | "session">(role);

  useEffect(() => {
    if (role === "public") {
      setViewMode("public");
    } else {
      setViewMode("session");
    }
  }, [role]);

  const isSession = viewMode === "session";
  const currentRole = isSession ? "student" : "public";

  return (
    <header className="sticky top-0 z-50 bg-tecsup-blue text-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* ── Toggle Prototipo ── */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
          <div className="flex items-center gap-1 bg-black/20 rounded-md px-1.5 py-1">
            <button
              onClick={() => setViewMode("public")}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                !isSession
                  ? "bg-white text-tecsup-blue"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Público
            </button>
            <button
              onClick={() => setViewMode("session")}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                isSession
                  ? "bg-white text-tecsup-blue"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              Sesión
            </button>
          </div>
        </div>

        {/* Logo Izquierdo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 relative">
            <div className="absolute inset-0 bg-white/30 rounded-md rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
            <div className="absolute inset-1 bg-white/10 rounded-sm rotate-45" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Vitrina
          </span>
        </Link>

        {/* Navegación Central */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            Proyectos
          </Link>
          <Link
            href="/estudiantes"
            className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
          >
            Estudiantes
          </Link>

          {isSession && role === "teacher" && (
            <>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm font-semibold text-white bg-white/20 rounded-md"
              >
                Mis Proyectos
              </Link>
              <Link
                href="/dashboard/crear-proyecto"
                className="px-3 py-1.5 text-sm font-semibold text-white bg-tecsup-green rounded-md hover:bg-tecsup-green/90 transition-colors"
              >
                + Nuevo Proyecto
              </Link>
            </>
          )}

          {isSession && role !== "teacher" && (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-semibold text-white bg-white/20 rounded-md"
            >
              Mis Proyectos
            </Link>
          )}
        </nav>

        {/* Lado Derecho */}
        <div>
          {isSession ? (
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-tight">
                  Maria
                </p>
                <p className="text-[10px] text-white/60 uppercase">Alumno</p>
              </div>
              <Avatar name={userName} size="md" />
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-1.5 bg-white text-tecsup-blue text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
