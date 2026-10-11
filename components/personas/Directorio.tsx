"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { Container } from "@/components/ui/Section";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import Button from "@/components/ui/Button";
import { rutaDirectorio } from "@/lib/api-usuarios";
import { RUTA_CARRERAS } from "@/lib/api-catalogos";
import type { DatoInicial } from "@/lib/api-servidor";
import { useDatoPublico } from "@/lib/usar-dato-publico";
import { pluralizar, slugConId } from "@/lib/utils";
import { SEDES, type Carrera, type PerfilDirectorio, type Rol } from "@/lib/tipos";

interface Props {
  rol: Rol;
  titulo: string;
  texto: string;
  /** Texto del contador de proyectos de cada persona. */
  proyectos: [singular: string, plural: string];
  /** Directorio sin filtros y carreras, resueltos en el servidor; null si el API no respondió a tiempo. */
  inicial?: DatoInicial<PerfilDirectorio[]> | null;
  carrerasIniciales?: Carrera[] | null;
}

const SIN_CARRERAS: Carrera[] = [];
/** Con sesión el API puede incluir correos: esa respuesta no se guarda en disco. */
const sinCorreos = (items: PerfilDirectorio[]) => items.every((e) => !e.correo);

/** Directorio de personas (estudiantes o docentes) como lista con línea fina: avatar, nombre, carrera y proyectos. */
export default function Directorio({ rol, titulo, texto, proyectos, inicial = null, carrerasIniciales = null }: Props) {
  const [q, setQ] = useState("");
  const [carreraId, setCarreraId] = useState<number | "">("");
  const [sede, setSede] = useState("");
  const [soloConProyectos, setSoloConProyectos] = useState(rol === "ALUMNO");

  const ruta = rutaDirectorio({ rol, carreraId: carreraId || undefined, sede: sede || undefined });
  const pedido = useDatoPublico<PerfilDirectorio[]>(ruta, inicial?.ruta === ruta ? inicial.datos : null, { persistir: sinCorreos });
  const carreras = useDatoPublico<Carrera[]>(RUTA_CARRERAS, carrerasIniciales, { silencioso: true }).datos ?? SIN_CARRERAS;
  // Al cambiar carrera o sede no se enseña la lista anterior: vuelve el esqueleto hasta que llega la nueva.
  const lista = pedido.actualizado ? pedido.datos : null;

  const filtrados = useMemo(() => {
    if (!lista) return null;
    const texto = q.trim().toLowerCase();
    return lista
      .filter((e) => !soloConProyectos || e.projectCount > 0)
      .filter((e) => !texto || e.nombre.toLowerCase().includes(texto) || e.technologies.some((t) => t.toLowerCase().includes(texto)))
      .sort((a, b) => b.projectCount - a.projectCount || a.nombre.localeCompare(b.nombre));
  }, [lista, q, soloConProyectos]);

  return (
    <Container className="pt-12 sm:pt-16">
      <h1 className="titular-2 text-ink-default">{titulo}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-muted">{texto}</p>

      <search className="mt-10 grid gap-3 border-y border-linea py-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_auto] lg:items-center">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre o tecnología" aria-label="Buscar por nombre o tecnología" type="search" />
        <Select value={carreraId} onChange={(e) => setCarreraId(Number(e.target.value) || "")} aria-label="Carrera">
          <option value="">Todas las carreras</option>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
        <Select value={sede} onChange={(e) => setSede(e.target.value)} aria-label="Sede">
          <option value="">Todas las sedes</option>
          {SEDES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <label className="flex min-h-11 items-center gap-2 text-label text-ink-default">
          <input type="checkbox" checked={soloConProyectos} onChange={(e) => setSoloConProyectos(e.target.checked)} className="h-4 w-4" />
          Solo con proyectos
        </label>
      </search>

      <p className="sr-only" aria-live="polite">
        {filtrados ? pluralizar(filtrados.length, "persona", "personas") : ""}
      </p>

      <div className="mt-2">
        {pedido.fallo ? (
          <EmptyState
            icono="usuario"
            titulo="No pudimos cargar el directorio"
            texto="El servidor no respondió. Suele bastar con intentarlo otra vez en un momento."
            accion={
              <Button variant="outline" onClick={pedido.reintentar}>
                Reintentar
              </Button>
            }
            className="mt-8"
          />
        ) : filtrados === null ? (
          <div className="divide-y divide-linea">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <EmptyState icono="usuario" titulo="Nadie coincide con la búsqueda" texto="Prueba sin filtros o desmarca «Solo con proyectos»." className="mt-8" />
        ) : (
          <ul className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {filtrados.map((e) => (
              <li key={e.id} className="min-w-0 border-b border-linea">
                <Link href={`/perfiles/${slugConId(e.nombre, e.id)}`} className="group flex items-center gap-4 py-4">
                  <Avatar name={e.nombre} src={e.fotoUrl} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[1.1875rem] font-medium text-ink-default group-hover:underline group-hover:decoration-brand-primary">{e.nombre}</span>
                    <span className="block truncate text-body-small text-ink-muted">
                      {[e.carrera?.nombre ?? "Carrera sin especificar", e.sede].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="num shrink-0 text-body-small text-ink-muted">{pluralizar(e.projectCount, proyectos[0], proyectos[1])}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
