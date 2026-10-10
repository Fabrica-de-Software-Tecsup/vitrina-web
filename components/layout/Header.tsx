"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { SelectorTemaMenu } from "@/components/ui/SelectorTema";
import { useSesion } from "@/components/sesion/SesionProvider";
import { cn, slugConId } from "@/lib/utils";

const NAV = [
  { href: "/proyectos", label: "Explorar" },
  { href: "/carreras", label: "Carreras" },
  { href: "/docentes", label: "Docentes" },
];

/** Buscador de la cabecera: un formulario GET real hacia Explorar (funciona sin JS). */
function Buscador(props: { className?: string; onBuscar?: () => void }) {
  // useSearchParams exige un límite de Suspense para no forzar el renderizado dinámico de todo el sitio.
  return (
    <Suspense fallback={<div className={cn("h-10", props.className)} />}>
      <BuscadorInterno {...props} />
    </Suspense>
  );
}

function BuscadorInterno({ className, onBuscar }: { className?: string; onBuscar?: () => void }) {
  const router = useRouter();
  const sp = useSearchParams();
  const pathname = usePathname();
  const actual = pathname === "/proyectos" ? (sp.get("buscar") ?? "") : "";
  return (
    <search className={className}>
      <form
        action="/proyectos"
        onSubmit={(e) => {
          e.preventDefault();
          const q = String(new FormData(e.currentTarget).get("buscar") ?? "").trim();
          const next = new URLSearchParams(pathname === "/proyectos" ? sp.toString() : "");
          next.delete("offset");
          if (q) next.set("buscar", q);
          else next.delete("buscar");
          router.push(`/proyectos${next.toString() ? `?${next}` : ""}`);
          onBuscar?.();
        }}
        className="relative"
      >
        <label htmlFor="buscar-cabecera" className="sr-only">
          Buscar proyectos
        </label>
        <Icono nombre="buscar" tam={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          key={actual}
          id="buscar-cabecera"
          name="buscar"
          type="search"
          defaultValue={actual}
          placeholder="Buscar proyectos, personas o tecnologías"
          className="field h-10 min-h-10 pl-9"
          autoComplete="off"
        />
      </form>
    </search>
  );
}

export default function Header() {
  const { usuario, cargando, esDocente, esAdmin, cerrarSesion } = useSesion();
  const pathname = usePathname();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [movil, setMovil] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menús al navegar.
  const [ruta, setRuta] = useState(pathname);
  if (ruta !== pathname) {
    setRuta(pathname);
    setMenu(false);
    setMovil(false);
  }

  useEffect(() => {
    if (!menu) return;
    const fuera = (e: PointerEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const salir = () => {
    cerrarSesion();
    setMenu(false);
    router.push("/");
  };

  const activo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const etiquetaPanel = esDocente ? "Panel docente" : "Mi espacio";

  return (
    <header className="sticky top-0 z-50 border-b border-linea bg-surface-default">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-surface-raised focus:px-3 focus:py-2">
        Saltar al contenido
      </a>
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-4 sm:px-8 lg:h-[72px] lg:gap-10 xl:px-20">
        <Link href="/" className="font-display text-[1.625rem] font-medium leading-none tracking-[-0.01em] text-ink-default lg:text-[1.875rem]" aria-label="Vitrina, inicio">
          Vitrina
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={activo(n.href) ? "page" : undefined}
              className={cn(
                "py-3 text-[0.9375rem] font-medium transition-colors",
                activo(n.href) ? "text-ink-default underline decoration-brand-primary decoration-2 underline-offset-[10px]" : "text-ink-muted hover:text-ink-default",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Buscador className="hidden w-[min(25rem,32vw)] lg:block" />
          <Link href="/proyectos#buscar" className="grid h-10 w-10 place-items-center rounded-md text-ink-muted hover:bg-surface-sunken hover:text-ink-default lg:hidden" aria-label="Buscar proyectos">
            <Icono nombre="buscar" />
          </Link>
          <SelectorTemaMenu />

          {cargando ? (
            <div className="cargando h-10 w-10 rounded-full" aria-hidden />
          ) : usuario ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                className="flex h-10 items-center gap-2 rounded-full pr-1 hover:opacity-85"
                aria-haspopup="menu"
                aria-expanded={menu}
                aria-label={`Cuenta de ${usuario.nombre}`}
              >
                <Avatar name={usuario.nombre} src={usuario.fotoUrl} size="md" />
              </button>
              {menu && (
                <div className="aparece absolute right-0 top-full z-50 mt-2 w-64 rounded-md border border-linea bg-surface-overlay py-1.5 shadow-md" role="menu">
                  <div className="border-b border-linea px-4 pb-2.5 pt-1.5">
                    <p className="truncate text-label text-ink-default">{usuario.nombre}</p>
                    <p className="truncate text-body-small text-ink-muted">{usuario.correo}</p>
                  </div>
                  {[
                    { href: "/dashboard", label: etiquetaPanel },
                    ...(!esDocente ? [{ href: "/dashboard/proyectos/nuevo", label: "Publicar un proyecto" }] : []),
                    { href: `/perfiles/${slugConId(usuario.nombre, usuario.id)}`, label: "Mi perfil público" },
                    { href: "/onboarding", label: "Carrera y datos académicos" },
                    ...(esAdmin ? [{ href: "/admin", label: "Administración" }] : []),
                  ].map((l) => (
                    <Link key={l.href} href={l.href} role="menuitem" onClick={() => setMenu(false)} className="block px-4 py-2.5 text-[0.9375rem] text-ink-default hover:bg-surface-sunken">
                      {l.label}
                    </Link>
                  ))}
                  <button type="button" role="menuitem" onClick={salir} className="mt-1 flex w-full items-center gap-2 border-t border-linea px-4 py-2.5 text-left text-[0.9375rem] text-state-danger hover:bg-surface-sunken">
                    <Icono nombre="salir" tam={18} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button href="/auth/login" variant="outline" className="hidden sm:inline-flex">
              Entrar
            </Button>
          )}

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md text-ink-default hover:bg-surface-sunken md:hidden"
            aria-label={movil ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={movil}
            aria-controls="menu-movil"
            onClick={() => setMovil((m) => !m)}
          >
            <Icono nombre={movil ? "cerrar" : "menu"} />
          </button>
        </div>
      </div>

      {movil && (
        <div id="menu-movil" className="border-t border-linea bg-surface-default md:hidden">
          <nav aria-label="Principal" className="flex flex-col px-4 py-3 sm:px-8">
            <Buscador className="mb-3" onBuscar={() => setMovil(false)} />
            {[...NAV, ...(usuario ? [{ href: "/dashboard", label: etiquetaPanel }] : []), ...(esAdmin ? [{ href: "/admin", label: "Administración" }] : [])].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={activo(n.href) ? "page" : undefined}
                className={cn("flex min-h-12 items-center border-b border-linea text-base", activo(n.href) ? "text-ink-default" : "text-ink-muted")}
              >
                {n.label}
              </Link>
            ))}
            {!usuario && !cargando && (
              <Button href="/auth/login" variant="outline" className="mt-4">
                Entrar
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
