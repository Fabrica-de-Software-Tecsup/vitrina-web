"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Chip } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Section";
import { CardSkeleton, EmptyState, Skeleton } from "@/components/ui/Feedback";
import EstadoJam from "@/components/jams/EstadoJam";
import TarjetaEnvio from "@/components/jams/TarjetaEnvio";
import { ordenarEnvios, rangoFechas, rutaEnvios, rutaJam, type Envio, type FaseJam, type Jam } from "@/lib/api-jams";
import { useDatoPublico } from "@/lib/usar-dato-publico";
import { pluralizar } from "@/lib/utils";

interface Props {
  slug: string;
  jamInicial: Jam | null;
  enviosIniciales: Envio[] | null;
  faseInicial: FaseJam;
}

/** Párrafos separados por línea en blanco. */
const parrafos = (t: string | null | undefined) => (t ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/**
 * Página del evento: nombre, lema, lugar y fechas; la cuenta atrás con la llamada a subir el proyecto; y la galería.
 * Llega renderizada desde el servidor (30 s de caché) y el navegador la revalida al abrir, así un equipo que acaba de
 * enviar se ve en la galería sin esperar.
 */
export default function PaginaJam({ slug, jamInicial, enviosIniciales, faseInicial }: Props) {
  const jamPedida = useDatoPublico<Jam>(rutaJam(slug), jamInicial);
  const enviosPedidos = useDatoPublico<Envio[]>(rutaEnvios(slug), enviosIniciales, { silencioso: true });
  const [categoria, setCategoria] = useState<string | null>(null);
  const jam = jamPedida.datos;

  const envios = useMemo(() => (enviosPedidos.datos ? ordenarEnvios(enviosPedidos.datos) : null), [enviosPedidos.datos]);
  const visibles = useMemo(() => (envios && categoria ? envios.filter((e) => e.categoria === categoria) : envios), [envios, categoria]);
  // Solo las categorías con algún proyecto, en el orden en que las definió la organización.
  const categorias = useMemo(() => (jam?.categorias ?? []).filter((c) => envios?.some((e) => e.categoria === c)), [jam, envios]);

  if (!jam) {
    if (jamPedida.fallo) {
      return (
        <Container className="py-20">
          <EmptyState
            icono="buscar"
            titulo="No encontramos esta jam"
            texto="Revisa el enlace o el código QR. Si el servidor estaba dormido, vuelve a intentarlo en unos segundos."
            accion={
              <Button variant="outline" onClick={jamPedida.reintentar}>
                Reintentar
              </Button>
            }
          />
        </Container>
      );
    }
    return (
      <Container className="pt-12 sm:pt-16">
        <Skeleton className="h-14 w-2/3" />
        <Skeleton className="mt-5 h-6 w-1/2" />
        <Skeleton className="mt-10 h-28 w-full" />
      </Container>
    );
  }

  const abierta = faseInicial === "abierta";
  const meta = [jam.lugar, rangoFechas(jam.inicioEn, jam.cierreEn)].filter(Boolean);

  return (
    <Container className="pt-10 sm:pt-16">
      <header className="max-w-4xl">
        <h1 className="titular text-ink-default">{jam.nombre}</h1>
        {jam.lema && <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-muted sm:text-xl">{jam.lema}</p>}
        <ul className="mt-6 flex flex-col gap-2 text-body-small text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-6">
          {meta.map((m, i) => (
            <li key={m} className="flex items-start gap-2">
              <Icono nombre={i === 0 && jam.lugar ? "bandera" : "reloj"} tam={16} className="mt-0.5 shrink-0" />
              <span className="first-letter:uppercase">{m}</span>
            </li>
          ))}
        </ul>
      </header>

      <section aria-label="Estado de los envíos" className="mt-10 border-y border-linea py-6 sm:py-8">
        <EstadoJam jam={jam} faseInicial={faseInicial} />
      </section>

      {parrafos(jam.descripcion).length > 0 && (
        <div className="lectura mt-10">
          {parrafos(jam.descripcion).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <section aria-labelledby="proyectos" className="mt-14 sm:mt-20">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 id="proyectos" className="seccion-t text-ink-default">
            Proyectos
          </h2>
          {envios && envios.length > 0 && <p className="num text-body-small text-ink-muted">{pluralizar(envios.length, "proyecto", "proyectos")}</p>}
        </div>

        {categorias.length > 1 && (
          <div className="carril -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoría">
            <Chip size="md" active={categoria === null} onClick={() => setCategoria(null)}>
              Todas
            </Chip>
            {categorias.map((c) => (
              <Chip key={c} size="md" active={categoria === c} onClick={() => setCategoria(categoria === c ? null : c)}>
                {c}
              </Chip>
            ))}
          </div>
        )}

        <div className="mt-8">
          {visibles === null ? (
            <div className="reticula">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : visibles.length === 0 ? (
            <EmptyState
              icono="equipo"
              titulo={abierta ? "Aún no hay proyectos" : "No hay proyectos que mostrar"}
              texto={abierta ? "Sé el primer equipo en subir el suyo: son cinco minutos y luego puedes seguir editándolo." : undefined}
              accion={
                abierta ? (
                  <Button href={`/jams/${jam.slug}/enviar`} icon={<Icono nombre="subir" tam={18} />}>
                    Subir nuestro proyecto
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="reticula">
              {visibles.map((e, i) => (
                <TarjetaEnvio key={e.id} envio={e} jamSlug={jam.slug} preload={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
