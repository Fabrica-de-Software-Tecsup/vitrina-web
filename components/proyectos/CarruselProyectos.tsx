"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { portadaDe, type Proyecto } from "@/lib/tipos";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow: string;
  titulo: string;
  proyectos: Proyecto[];
  verTodosHref: string;
  verTodosTexto?: string;
}

/**
 * Carrusel horizontal "lo que construyeron": tarjetas anchas con la captura como protagonista,
 * etiqueta en mayusculas, nombre, autor y contexto. Se desborda por los bordes de la pagina y
 * se desplaza con rueda, arrastre tactil o las flechas.
 */
export default function CarruselProyectos({ eyebrow, titulo, proyectos, verTodosHref, verTodosTexto = "Ver todos" }: Props) {
  const pista = useRef<HTMLDivElement>(null);
  const [puedeIzq, setPuedeIzq] = useState(false);
  const [puedeDer, setPuedeDer] = useState(true);

  const actualizar = useCallback(() => {
    const el = pista.current;
    if (!el) return;
    setPuedeIzq(el.scrollLeft > 8);
    setPuedeDer(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    actualizar();
    const el = pista.current;
    if (!el) return;
    el.addEventListener("scroll", actualizar, { passive: true });
    window.addEventListener("resize", actualizar);
    return () => {
      el.removeEventListener("scroll", actualizar);
      window.removeEventListener("resize", actualizar);
    };
  }, [actualizar, proyectos.length]);

  const desplazar = (dir: 1 | -1) => {
    const el = pista.current;
    if (!el) return;
    const tarjeta = el.querySelector<HTMLElement>("[data-tarjeta]");
    el.scrollBy({ left: dir * ((tarjeta?.offsetWidth ?? 360) + 24), behavior: "smooth" });
  };

  if (proyectos.length === 0) return null;

  return (
    <section className="py-16">
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-500">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink-900 sm:text-4xl">{titulo}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={() => desplazar(-1)} disabled={!puedeIzq} aria-label="Anterior" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-30">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button type="button" onClick={() => desplazar(1)} disabled={!puedeDer} aria-label="Siguiente" className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-30">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <Link href={verTodosHref} className="whitespace-nowrap text-sm font-semibold text-brand-700 hover:underline">
            {verTodosTexto} →
          </Link>
        </div>
      </div>

      {/* La pista ocupa todo el ancho de la ventana; el padding alinea la primera tarjeta con el contenedor. */}
      <div
        ref={pista}
        className="carrusel mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[max(1rem,calc((100vw-80rem)/2+1rem))] pb-6 pt-2 sm:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {proyectos.map((p) => (
          <Tarjeta key={p.id} proyecto={p} />
        ))}
        <Link
          href={verTodosHref}
          data-tarjeta
          className="group flex w-[300px] shrink-0 snap-start items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 text-center transition hover:border-brand-400 sm:w-[340px]"
        >
          <span className="px-8">
            <span className="block font-display text-lg font-bold text-ink-900 group-hover:text-brand-700">{verTodosTexto}</span>
            <span className="mt-1 block text-sm text-ink-500">Explora con filtros por carrera, tecnología y ciclo</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

function Tarjeta({ proyecto: p }: { proyecto: Proyecto }) {
  const portada = portadaDe(p);
  const lider = p.miembros.find((m) => m.esLider)?.usuario ?? p.creador;
  const etiqueta = p.categorias[0]?.categoria.nombre ?? p.carrera?.area ?? "Proyecto";
  const color = p.categorias[0]?.categoria.color ?? p.carrera?.color ?? "#0082CE";
  const contexto = [p.periodo ? `Periodo ${p.periodo}` : null, p.docentes[0] ? `con ${p.docentes[0].usuario.nombre}` : null].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/proyectos/${p.slug}`}
      data-tarjeta
      className={cn(
        "group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-[400px]",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-900">
        {portada ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portada} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-violet-500">
            <span className="font-display text-6xl font-extrabold text-white/40">{p.nombre.slice(0, 1)}</span>
          </div>
        )}
        {p.destacado && <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow-sm">★ Destacado</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>{etiqueta}</p>
        <h3 className="mt-2 line-clamp-1 font-display text-xl font-bold text-ink-900 group-hover:text-brand-700">{p.nombre}</h3>
        <p className="mt-1.5 line-clamp-1 text-sm text-ink-600">
          {lider.nombre}
          {p.carrera && <span className="text-ink-400"> · {p.carrera.nombre}</span>}
        </p>
        {contexto && <p className="mt-1 line-clamp-1 text-sm text-ink-400">{contexto}</p>}
        {p.tagline && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-700">{p.tagline}</p>}
      </div>
      <span className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r from-brand-500 to-violet-500 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
