"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Container, SectionHeading } from "@/components/ui/Section";
import { CardSkeleton, EmptyState } from "@/components/ui/Feedback";
import CarruselProyectos from "@/components/proyectos/CarruselProyectos";
import { getEstadisticas, listarProyectos } from "@/lib/api-proyectos";
import { getCarreras } from "@/lib/api-catalogos";
import type { Carrera, Estadisticas, Proyecto } from "@/lib/tipos";
import { useSesion } from "@/components/sesion/SesionProvider";

export default function LandingPage() {
  const router = useRouter();
  const { usuario, esDocente } = useSesion();
  const [destacados, setDestacados] = useState<Proyecto[] | null>(null);
  const [recientes, setRecientes] = useState<Proyecto[] | null>(null);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    listarProyectos({ orden: "destacados", limit: 8 }).then((r) => setDestacados(r.items)).catch(() => setDestacados([]));
    listarProyectos({ orden: "recientes", limit: 12 }).then((r) => setRecientes(r.items)).catch(() => setRecientes([]));
    getEstadisticas().then(setStats).catch(() => null);
    getCarreras().then(setCarreras).catch(() => null);
  }, []);

  const carrerasConProyectos = carreras.filter((c) => c.proyectosPublicados > 0).sort((a, b) => b.proyectosPublicados - a.proyectosPublicados);
  const areas = Array.from(new Set(carreras.map((c) => c.area)));

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="bg-mesh relative -mt-16 overflow-hidden pt-16 text-white">
        <div className="bg-grid absolute inset-0 opacity-60" />
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-3xl animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
              Portafolio oficial de proyectos · {carreras.length || 26} carreras · 3 sedes
            </p>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Lo que construyen los estudiantes de Tecsup, <span className="text-gradient">a la vista de todos</span>.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
              Software, robots, plantas, drones, campañas y prototipos. Cada proyecto tiene su página, su equipo y su historia, revisada por un docente.
            </p>

            <form
              className="mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lift"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/proyectos${busqueda ? `?buscar=${encodeURIComponent(busqueda)}` : ""}`);
              }}
            >
              <svg className="ml-3 h-5 w-5 shrink-0 text-ink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M21 21l-4.3-4.3M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" /></svg>
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Busca por nombre, tecnología o idea…"
                className="h-10 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
                aria-label="Buscar proyectos"
              />
              <Button type="submit" size="md">Buscar</Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {stats?.tecnologiasTop.slice(0, 6).map((t) => (
                <Link key={t.id} href={`/proyectos?tecnologiaId=${t.id}`} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 hover:bg-white/20">
                  {t.nombre}
                </Link>
              ))}
            </div>
          </div>

          <dl className="mt-14 grid max-w-3xl grid-cols-3 gap-3 animate-fade-up">
            {[
              { v: stats?.proyectosPublicados ?? "—", l: "proyectos publicados" },
              { v: stats?.estudiantes ?? "—", l: "estudiantes" },
              { v: stats?.carrerasConProyectos ?? "—", l: "carreras representadas" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <dt className="text-xs text-white/60">{s.l}</dt>
                <dd className="font-display text-3xl font-bold">{s.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ═══ DESTACADOS ═══ */}
      {destacados === null ? (
        <section className="py-16">
          <Container>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}</div>
          </Container>
        </section>
      ) : destacados.length === 0 ? (
        <section className="py-16">
          <Container>
            <EmptyState titulo="Aún no hay proyectos publicados" texto="Sé el primero: entra con tu correo Tecsup y publica el tuyo." accion={<Button href="/auth/login">Publicar mi proyecto</Button>} />
          </Container>
        </section>
      ) : (
        <CarruselProyectos eyebrow="Recién salidos de las aulas" titulo="Lo que construyeron los estudiantes" proyectos={destacados} verTodosHref="/proyectos?orden=destacados" verTodosTexto="Ver todos los proyectos" />
      )}

      {/* ═══ CARRERAS ═══ */}
      <section className="border-y border-ink-200 bg-white py-16">
        <Container>
          <SectionHeading eyebrow="Todas las carreras" titulo="Explora por carrera" texto="De Diseño de Software a Operaciones Mineras: cada carrera tiene su vitrina." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => {
              const lista = carreras.filter((c) => c.area === area);
              const total = lista.reduce((s, c) => s + c.proyectosPublicados, 0);
              const color = lista[0]?.color ?? "#00B3E0";
              return (
                <div key={area} className="card p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-bold text-ink-900">{area}</h3>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ backgroundColor: `${color}1a`, color }}>{total} publicados</span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {lista.map((c) => (
                      <li key={c.id}>
                        <Link href={`/proyectos?carreraId=${c.id}`} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-ink-700 hover:bg-ink-50 hover:text-brand-700">
                          <span className="line-clamp-1">{c.nombre}</span>
                          <span className="ml-2 shrink-0 text-xs text-ink-400">{c.proyectosPublicados}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ═══ RECIENTES ═══ */}
      {recientes !== null && recientes.length > 0 && (
        <div className="bg-white">
          <CarruselProyectos eyebrow="Lo último" titulo="Recién publicados" proyectos={recientes} verTodosHref="/proyectos" verTodosTexto="Explorar todo" />
          {carrerasConProyectos.length > 0 && (
            <Container className="pb-16">
              <div className="flex flex-wrap gap-2">
                {carrerasConProyectos.map((c) => (
                  <Link key={c.id} href={`/proyectos?carreraId=${c.id}`}>
                    <Chip color={c.color} size="md">{c.nombre} · {c.proyectosPublicados}</Chip>
                  </Link>
                ))}
              </div>
            </Container>
          )}
        </div>
      )}

      {/* ═══ CTA ═══ */}
      <section className="pb-8">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 text-white sm:px-12">
            <div className="bg-mesh absolute inset-0 opacity-70" />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold">¿Hiciste un proyecto este ciclo?</h2>
                <p className="mt-3 text-white/75">Publicarlo toma 10 minutos: una frase, una descripción, fotos y tu equipo. Tu docente lo aprueba y queda con URL propia para tu CV y LinkedIn.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href={usuario ? (esDocente ? "/dashboard" : "/dashboard/proyectos/nuevo") : "/auth/login"} variant="white" size="lg">
                    {usuario ? (esDocente ? "Ir a mi panel" : "Publicar mi proyecto") : "Entrar con correo Tecsup"}
                  </Button>
                  <Button href="/proyectos" variant="ghost" size="lg" className="text-white hover:bg-white/10">Ver ejemplos</Button>
                </div>
              </div>
              <ol className="space-y-3 text-sm">
                {["Entra con tu correo @tecsup.edu.pe y elige tu carrera.", "Cuenta tu proyecto: frase, descripción, fotos, enlaces y equipo.", "Envíalo a revisión. Tu docente lo publica o te deja observaciones por correo.", "Comparte tu página en LinkedIn y en tu CV."].map((t, i) => (
                  <li key={t} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">{i + 1}</span>
                    <span className="text-white/85">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
