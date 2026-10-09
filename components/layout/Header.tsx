"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useSesion } from "@/components/sesion/SesionProvider";
import { cn, slugConId } from "@/lib/utils";

const nav = [
  { href: "/proyectos", label: "Explorar" },
  { href: "/estudiantes", label: "Estudiantes" },
];

export default function Header() {
  const { usuario, cargando, esDocente, esAdmin, cerrarSesion } = useSesion();
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [movil, setMovil] = useState(false);
  const transparente = pathname === "/";

  const salir = () => {
    cerrarSesion();
    setMenu(false);
    router.push("/");
  };

  return (
    <header className={cn("sticky top-0 z-50 border-b backdrop-blur-xl transition-colors", transparente ? "border-white/10 bg-ink-900/60 text-white" : "border-ink-200/70 bg-white/85 text-ink-800")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Vitrina, inicio">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rotate-45 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500" />
            <span className="relative font-display text-sm font-extrabold text-white">V</span>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Vitrina</span>
          <span className={cn("hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline", transparente ? "bg-white/15 text-white/90" : "bg-brand-50 text-brand-700")}>Tecsup</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(n.href)
                  ? transparente ? "bg-white/15 text-white" : "bg-ink-100 text-ink-900"
                  : transparente ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
              )}
            >
              {n.label}
            </Link>
          ))}
          {usuario && (
            <Link
              href="/dashboard"
              className={cn("rounded-full px-3.5 py-2 text-sm font-medium transition-colors", pathname.startsWith("/dashboard") ? (transparente ? "bg-white/15 text-white" : "bg-ink-100 text-ink-900") : transparente ? "text-white/80 hover:bg-white/10" : "text-ink-600 hover:bg-ink-100")}
            >
              {esDocente ? "Panel docente" : "Mis proyectos"}
            </Link>
          )}
          {esAdmin && (
            <Link href="/admin" className={cn("rounded-full px-3.5 py-2 text-sm font-medium", transparente ? "text-white/80 hover:bg-white/10" : "text-ink-600 hover:bg-ink-100")}>
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {usuario && !esDocente && (
            <Button href="/dashboard/proyectos/nuevo" size="sm" className="hidden sm:inline-flex">
              + Publicar proyecto
            </Button>
          )}
          {cargando ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-ink-200/60" />
          ) : usuario ? (
            <div className="relative">
              <button type="button" onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-full p-0.5 pr-2 hover:bg-black/5" aria-haspopup="menu" aria-expanded={menu}>
                <Avatar name={usuario.nombre} src={usuario.fotoUrl} size="md" />
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[120px] truncate text-sm font-semibold leading-tight">{usuario.nombre.split(" ")[0]}</span>
                  <span className={cn("block text-[10px] uppercase", transparente ? "text-white/60" : "text-ink-400")}>{usuario.rol.toLowerCase()}</span>
                </span>
              </button>
              {menu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-200 bg-white py-2 text-ink-800 shadow-lift" role="menu">
                    <div className="border-b border-ink-100 px-4 py-2">
                      <p className="truncate text-sm font-semibold">{usuario.nombre}</p>
                      <p className="truncate text-xs text-ink-400">{usuario.correo}</p>
                    </div>
                    <Link href={`/perfiles/${slugConId(usuario.nombre, usuario.id)}`} onClick={() => setMenu(false)} className="block px-4 py-2 text-sm hover:bg-ink-50">
                      Mi perfil público
                    </Link>
                    <Link href="/dashboard" onClick={() => setMenu(false)} className="block px-4 py-2 text-sm hover:bg-ink-50">
                      {esDocente ? "Panel docente" : "Mis proyectos"}
                    </Link>
                    <Link href="/onboarding" onClick={() => setMenu(false)} className="block px-4 py-2 text-sm hover:bg-ink-50">
                      Carrera y datos académicos
                    </Link>
                    {esAdmin && (
                      <Link href="/admin" onClick={() => setMenu(false)} className="block px-4 py-2 text-sm hover:bg-ink-50">
                        Administración
                      </Link>
                    )}
                    <button type="button" onClick={salir} className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Button href="/auth/login" size="sm" variant={transparente ? "white" : "primary"}>
              Ingresar
            </Button>
          )}
          <button type="button" className="rounded-full p-2 hover:bg-black/5 md:hidden" aria-label="Abrir menú" onClick={() => setMovil((m) => !m)}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>

      {movil && (
        <div className={cn("border-t md:hidden", transparente ? "border-white/10 bg-ink-900/90" : "border-ink-200 bg-white")}>
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {[...nav, ...(usuario ? [{ href: "/dashboard", label: esDocente ? "Panel docente" : "Mis proyectos" }] : []), ...(esAdmin ? [{ href: "/admin", label: "Admin" }] : [])].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMovil(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-black/5">
                {n.label}
              </Link>
            ))}
            {usuario && !esDocente && (
              <Link href="/dashboard/proyectos/nuevo" onClick={() => setMovil(false)} className="mt-1 rounded-xl bg-brand-600 px-3 py-2.5 text-center text-sm font-semibold text-white">
                + Publicar proyecto
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
