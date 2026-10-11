"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import Button from "@/components/ui/Button";
import { RUTA_CARRERAS } from "@/lib/api-catalogos";
import { useDatoPublico } from "@/lib/usar-dato-publico";
import { pluralizar } from "@/lib/utils";
import type { Carrera } from "@/lib/tipos";

/** Carreras agrupadas por área, como índice: cada una lleva a Explorar filtrado. */
export default function CarrerasCliente({ inicial }: { inicial: Carrera[] | null }) {
  const pedido = useDatoPublico<Carrera[]>(RUTA_CARRERAS, inicial);
  const carreras = pedido.datos;
  const areas = carreras ? Array.from(new Set(carreras.map((c) => c.area))) : [];

  return (
    <Container className="pt-12 sm:pt-16">
      <h1 className="titular-2 text-ink-default">Carreras</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">Cada carrera con sus proyectos publicados. Elige una para ver su trabajo en Explorar.</p>

      {pedido.fallo ? (
        <EmptyState
          className="mt-12"
          titulo="No pudimos cargar las carreras"
          texto="El servidor no respondió. Suele bastar con intentarlo otra vez en un momento."
          accion={
            <Button variant="outline" onClick={pedido.reintentar}>
              Reintentar
            </Button>
          }
        />
      ) : carreras === null ? (
        <div className="mt-12 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-2/3" />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => (
            <section key={area}>
              <h2 className="font-display text-title font-medium text-ink-default">{area}</h2>
              <ul className="mt-3 border-t border-linea">
                {carreras
                  .filter((c) => c.area === area)
                  .map((c) => (
                    <li key={c.id} className="border-b border-linea">
                      <Link href={`/proyectos?carreraId=${c.id}`} className="group flex min-h-12 items-baseline justify-between gap-4 py-3">
                        <span className="text-ink-default group-hover:underline group-hover:decoration-brand-primary">{c.nombre}</span>
                        <span className="num shrink-0 text-body-small text-ink-muted">
                          {c.proyectosPublicados ? pluralizar(c.proyectosPublicados, "proyecto", "proyectos") : "Aún sin proyectos"}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
