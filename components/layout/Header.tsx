"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { obtenerUsuarioActual, cerrarSesion, type UsuarioActual } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { slugConId } from "@/lib/utils";

interface HeaderProps {
  defaultView?: "public" | "session";
}

export default function Header({ defaultView = "session" }: HeaderProps) {
  const [usuario, setUsuario] = useState<UsuarioActual | null>(null);
  const [viewMode, setViewMode] = useState<"public" | "session">(defaultView);
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    obtenerUsuarioActual().then(setUsuario);
  }, []);

  const isSession = viewMode === "session";
  const esDocente = usuario?.rol === "DOCENTE" || usuario?.rol === "ADMIN";

  const handleCerrarSesion = () => {
    cerrarSesion();
    setShowMenu(false);
    router.push("/");
    router.refresh();
  };

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
              onClick={() => {
                if (usuario) {
                  setViewMode("session");
                } else {
                  router.push("/auth/login");
                }
              }}
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

          {isSession && usuario && (
            <>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm font-semibold text-white bg-white/20 rounded-md"
              >
                Mis Proyectos
              </Link>
              {esDocente && (
                <Link
                  href="/dashboard/crear-proyecto"
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-tecsup-green rounded-md hover:bg-tecsup-green/90 transition-colors"
                >
                  + Nuevo Proyecto
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Lado Derecho */}
        <div>
          {isSession && usuario ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-white leading-tight">
                    {usuario.nombre.split(" ")[0]}
                  </p>
                  <p className="text-[10px] text-white/60 uppercase">
                    {usuario.rol}
                  </p>
                </div>
                <Avatar name={usuario.nombre} size="md" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-tecsup-dark truncate">
                        {usuario.nombre}
                      </p>
                      <p className="text-[10px] text-gray-400 truncate">
                        {usuario.correo}
                      </p>
                    </div>
                    {usuario.rol === "ALUMNO" && (
                      <Link
                        href={`/perfiles/${slugConId(usuario.nombre, usuario.id)}`}
                        onClick={() => setShowMenu(false)}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Ver mi perfil
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Mis Proyectos
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleCerrarSesion}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
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