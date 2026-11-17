"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Icono from "@/components/ui/Icono";
import { cargadorDe } from "@/lib/imagenes";
import type { Imagen } from "@/lib/tipos";
import { cn } from "@/lib/utils";

interface Props {
  imagenes: Imagen[];
  /** Índice de la primera imagen dentro de la galería completa (p. ej. 1 cuando la 0 es la portada). */
  desplazamiento?: number;
  totalGaleria?: number;
  tituloProyecto: string;
  onAmpliar: (indiceGlobal: number) => void;
}

/**
 * Carrusel editorial para las capturas adicionales del proyecto: muestra cada imagen íntegra (`object-contain`),
 * permite cambiar con flechas, teclado o tira de miniaturas, y abrir el visor ampliado en la imagen activa.
 */
export default function CarruselGaleria({ imagenes, desplazamiento = 0, totalGaleria, tituloProyecto, onAmpliar }: Props) {
  const [activa, setActiva] = useState(0);
  if (imagenes.length === 0) return null;

  const indiceSeguro = activa < imagenes.length ? activa : 0;
  const actual = imagenes[indiceSeguro];
  const loaderActual = cargadorDe(actual);
  const total = totalGaleria ?? imagenes.length;
  const numeroGlobal = desplazamiento + indiceSeguro + 1;
  const varias = imagenes.length > 1;

  const mover = (delta: number) => {
    setActiva((prev) => (prev + delta + imagenes.length) % imagenes.length);
  };

  return (
    <section
      aria-label={`Galería de ${tituloProyecto}`}
      className="my-10"
      onKeyDown={(e) => {
        if (!varias) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          mover(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          mover(1);
        }
      }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => onAmpliar(desplazamiento + indiceSeguro)}
          className="block w-full cursor-zoom-in rounded-lamina text-left"
          aria-label={`Ampliar imagen ${numeroGlobal} de ${total}`}
        >
          <span
            className="lamina aspect-[4/3] sm:aspect-[16/10] sm:max-h-[26rem] bg-surface-sunken"
            style={{
              backgroundImage: actual.colorDominante
                ? `radial-gradient(75% 75% at 50% 50%, color-mix(in oklch, ${actual.colorDominante} 14%, transparent), transparent 72%)`
                : undefined,
              "--dominante": actual.colorDominante ?? undefined,
            } as CSSProperties}
          >
            <Image
              src={actual.url}
              alt={`${tituloProyecto} — imagen ${numeroGlobal}`}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              loading="lazy"
              {...(loaderActual ? { loader: loaderActual } : { unoptimized: true })}
              style={{ objectFit: "contain" }}
            />
          </span>
        </button>

        {varias && (
          <>
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-linea bg-surface-default/90 text-ink-default shadow-sm backdrop-blur-sm transition hover:bg-surface-default"
            >
              <Icono nombre="chevron-izq" tam={18} />
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-linea bg-surface-default/90 text-ink-default shadow-sm backdrop-blur-sm transition hover:bg-surface-default"
            >
              <Icono nombre="chevron-der" tam={18} />
            </button>
          </>
        )}

        <span className="pointer-events-none absolute bottom-3 right-3 rounded-sm border border-linea bg-surface-default/90 px-2.5 py-1 text-caption font-medium text-ink-default backdrop-blur-sm">
          Toca para ampliar
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="num text-body-small text-ink-muted">
          Imagen {numeroGlobal} de {total}
        </p>
      </div>

      {varias && (
        <div className="carril mt-3 flex gap-2.5 overflow-x-auto pb-1" role="tablist" aria-label="Elegir imagen">
          {imagenes.map((img, i) => {
            const loader = cargadorDe(img);
            const seleccionada = i === indiceSeguro;
            return (
              <button
                key={img.id}
                type="button"
                role="tab"
                aria-selected={seleccionada}
                aria-label={`Ver imagen ${desplazamiento + i + 1}`}
                onClick={() => setActiva(i)}
                className={cn(
                  "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-sm border bg-surface-sunken transition",
                  seleccionada ? "border-brand-primary ring-2 ring-brand-primary/35" : "border-linea opacity-75 hover:opacity-100",
                )}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  loading="lazy"
                  {...(loader ? { loader } : { unoptimized: true })}
                  style={{ objectFit: "cover" }}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
