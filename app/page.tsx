"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Container } from "@/components/ui/Section";
import { CardSkeleton } from "@/components/ui/Feedback";
import Portada from "@/components/proyectos/Portada";
import ProjectCard from "@/components/proyectos/ProjectCard";
import { useSesion } from "@/components/sesion/SesionProvider";
import { listarProyectos } from "@/lib/api-proyectos";
import { recordarProyectos } from "@/lib/cache-proyectos";
import { imagenPortada, type Proyecto } from "@/lib/tipos";

/** Portada del sitio (modo Persuadir): una lámina grande de un proyecto real, una frase y la entrada a Explorar. */
export default function PortadaSitio() {
  const { usuario, esDocente } = useSesion();
  const [destacado, setDestacado] = useState<Proyecto | null | undefined>(undefined);
  const [recientes, setRecientes] = useState<Proyecto[] | null>(null);

  useEffect(() => {
    listarProyectos({ orden: "destacados", limit: 1 })
      .then((r) => {
        recordarProyectos(r.items);
        setDestacado(r.items[0] ?? null);
      })
      .catch(() => setDestacado(null));
    listarProyectos({ orden: "recientes", limit: 9 })
      .then((r) => {
        recordarProyectos(r.items);
        setRecientes(r.items);
      })
      .catch(() => setRecientes([]));
  }, []);

  const filaRecientes = (recientes ?? []).filter((p) => p.id !== destacado?.id).slice(0, 4);
  const lider = destacado ? ((destacado.miembros.find((m) => m.esLider) ?? destacado.miembros[0])?.usuario.nombre ?? destacado.creador?.nombre) : null;
  const publicar = usuario ? (esDocente ? "/dashboard" : "/dashboard/proyectos/nuevo") : "/auth/login";

  return (
    <>
      <Container>
        <section className="grid gap-10 pb-16 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="lg:pb-24">
            <h1 className="titular max-w-[12ch] text-ink-default">Lo que se construye en clase, a la vista.</h1>
            <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-ink-muted sm:text-xl">
              Apps, robots, plantas piloto y campañas hechos por estudiantes. Cada proyecto lo revisa un docente antes de publicarse.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/proyectos" size="lg" icon={<Icono nombre="flecha-der" tam={18} />} className="flex-row-reverse">
                Explorar proyectos
              </Button>
              <Button href={publicar} size="lg" variant="outline">
                {esDocente ? "Ir a mi panel" : "Publicar el tuyo"}
              </Button>
            </div>
          </div>

          {destacado === undefined ? (
            <CardSkeleton />
          ) : destacado ? (
            <figure>
              <Link href={`/proyectos/${destacado.slug}`} className="lamina-enlace group block" transitionTypes={["abrir"]}>
                <Portada
                  id={destacado.id}
                  nombre={destacado.nombre}
                  imagen={imagenPortada(destacado)}
                  sizes="(min-width: 1440px) 760px, (min-width: 1024px) 55vw, 100vw"
                  preload
                />
                <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className="pie-t text-[1.625rem] text-ink-default group-hover:underline group-hover:decoration-brand-primary">{destacado.nombre}</span>
                  <span className="text-body-small text-ink-muted">{[lider, destacado.carrera?.nombre].filter(Boolean).join(" · ")}</span>
                </figcaption>
              </Link>
            </figure>
          ) : (
            <div className="lamina grid place-items-center">
              <p className="max-w-xs px-6 text-center text-ink-muted">Pronto verás aquí el primer proyecto publicado.</p>
            </div>
          )}
        </section>
      </Container>

      {(recientes === null || filaRecientes.length > 0) && (
        <section aria-labelledby="recientes" className="border-t border-linea">
          <Container className="pt-14">
            <div className="mb-8 flex items-baseline justify-between gap-6">
              <h2 id="recientes" className="seccion-t text-ink-default">
                Recién publicados
              </h2>
              <Link href="/proyectos" className="inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-brand-primary hover:underline">
                Ver todos
                <Icono nombre="flecha-der" tam={18} />
              </Link>
            </div>
            <div className="reticula">
              {recientes === null
                ? [0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)
                : filaRecientes.map((p) => <ProjectCard key={p.id} proyecto={p} />)}
            </div>
          </Container>
        </section>
      )}

      <Container>
        <section aria-labelledby="publicar" className="mt-24 grid gap-6 border-t border-ink-default pt-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 id="publicar" className="titular-2 text-ink-default">
              ¿Hiciste un proyecto este ciclo?
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
              Cuéntalo con fotos, tu equipo y lo que aprendiste. Tu docente lo revisa y queda con una página propia para tu CV y LinkedIn.
            </p>
          </div>
          <Button href={publicar} size="lg" variant="secondary">
            {usuario ? (esDocente ? "Ir a mi panel" : "Publicar mi proyecto") : "Entrar con tu correo institucional"}
          </Button>
        </section>
      </Container>
    </>
  );
}
