"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Chip } from "@/components/ui/Badge";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import { actualizarEnvioAdmin, actualizarJam, crearJam, descargarCsvJam, getEnviosAdmin, getJamsAdmin, type DatosJam, type EnvioAdmin, type JamAdmin } from "@/lib/api-admin";
import { rangoFechas, urlQr } from "@/lib/api-jams";
import { cn, slugify } from "@/lib/utils";

/** ISO → valor de <input type="datetime-local"> en la hora local de este navegador. */
function aLocal(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function guardarArchivo(blob: Blob, nombre: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

const mensaje = (e: unknown, porDefecto: string) => (e instanceof Error ? e.message : porDefecto);

/** Jams (hackatones): alta y edición, QR para proyectar, moderación de envíos y descarga en CSV. */
export default function AdminJams() {
  const [jams, setJams] = useState<JamAdmin[] | null>(null);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [editando, setEditando] = useState<JamAdmin | "nueva" | null>(null);
  const cargar = () =>
    getJamsAdmin()
      .then((l) => {
        setJams(l);
        setSeleccion((s) => s ?? l[0]?.id ?? null);
      })
      .catch(() => setJams([]));
  useEffect(() => {
    void cargar();
  }, []);

  const elegida = jams?.find((j) => j.id === seleccion) ?? null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-2xl text-sm text-ink-muted">Los equipos suben su proyecto sin cuenta, con el código de acceso. Comparte el QR de «Subir» en la pantalla del evento y el de la galería al final.</p>
        {editando === null && (
          <Button onClick={() => setEditando("nueva")} icon={<Icono nombre="mas" tam={18} />}>
            Nueva jam
          </Button>
        )}
      </div>

      {editando !== null && (
        <FormularioJam
          jam={editando === "nueva" ? null : editando}
          onCancelar={() => setEditando(null)}
          onGuardado={(j) => {
            setEditando(null);
            setSeleccion(j.id);
            void cargar();
          }}
        />
      )}

      {jams === null ? (
        <Skeleton className="h-32" />
      ) : jams.length === 0 ? (
        <EmptyState icono="bandera" titulo="Todavía no hay jams" texto="Crea la primera con su código de acceso y sus fechas." />
      ) : (
        <ul className="card divide-y divide-linea">
          {jams.map((j) => (
            <li key={j.id} className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-center", seleccion === j.id && "bg-surface-sunken")}>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink-default">{j.nombre}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  /jams/{j.slug} · {rangoFechas(j.inicioEn, j.cierreEn)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip>{j.publica ? "Pública" : "Oculta"}</Chip>
                  <Chip>{j.abierta ? "Abierta" : "Cerrada"}</Chip>
                  <Chip>
                    {j.totalEnvios} / {j.maxEnvios} envíos
                  </Chip>
                  {!!j.enviosOcultos && <Chip>{j.enviosOcultos} ocultos</Chip>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={seleccion === j.id ? "secondary" : "outline"} onClick={() => setSeleccion(j.id)}>
                  Gestionar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditando(j)} icon={<Icono nombre="editar" tam={16} />}>
                  Editar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {elegida && <PanelJam key={elegida.id} jam={elegida} onCambio={() => void cargar()} />}
    </div>
  );
}

function FormularioJam({ jam, onCancelar, onGuardado }: { jam: JamAdmin | null; onCancelar: () => void; onGuardado: (j: JamAdmin) => void }) {
  const { avisar } = useToast();
  const [f, setF] = useState({
    slug: jam?.slug ?? "",
    nombre: jam?.nombre ?? "",
    lema: jam?.lema ?? "",
    descripcion: jam?.descripcion ?? "",
    lugar: jam?.lugar ?? "",
    inicio: aLocal(jam?.inicioEn),
    cierre: aLocal(jam?.cierreEn),
    categorias: (jam?.categorias ?? []).join(", "),
    codigo: "",
    maxEnvios: String(jam?.maxEnvios ?? 60),
    publica: jam?.publica ?? true,
  });
  const [slugTocado, setSlugTocado] = useState(!!jam);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const campo = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!f.inicio || !f.cierre) return setError("Indica la fecha de inicio y la de cierre.");
    const datos: DatosJam = {
      slug: f.slug.trim(),
      nombre: f.nombre.trim(),
      lema: f.lema.trim() || null,
      descripcion: f.descripcion.trim() || null,
      lugar: f.lugar.trim() || null,
      // datetime-local está en la hora de este navegador; el API guarda el instante en ISO.
      inicioEn: new Date(f.inicio).toISOString(),
      cierreEn: new Date(f.cierre).toISOString(),
      categorias: Array.from(new Set(f.categorias.split(",").map((c) => c.trim()).filter(Boolean))),
      publica: f.publica,
      maxEnvios: Number(f.maxEnvios) || 60,
      ...(f.codigo.trim() ? { codigo: f.codigo.trim() } : {}),
    };
    setGuardando(true);
    try {
      const j = jam ? await actualizarJam(jam.id, datos) : await crearJam(datos);
      avisar(jam ? "Jam actualizada" : "Jam creada");
      onGuardado(j);
    } catch (err) {
      setError(mensaje(err, "No se pudo guardar"));
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={guardar} className="card space-y-5 p-5 sm:p-6">
      <h2 className="font-display text-title font-medium text-ink-default">{jam ? `Editar ${jam.nombre}` : "Nueva jam"}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="jam-nombre" required>
          <Input
            id="jam-nombre"
            value={f.nombre}
            onChange={(e) => setF({ ...f, nombre: e.target.value, slug: slugTocado ? f.slug : slugify(e.target.value).slice(0, 60) })}
            required
            minLength={3}
            maxLength={120}
          />
        </Field>
        <Field label="Slug (dirección)" htmlFor="jam-slug" required hint={`vitrina…/jams/${f.slug || "mi-jam"}`}>
          <Input
            id="jam-slug"
            value={f.slug}
            onChange={(e) => {
              setSlugTocado(true);
              setF({ ...f, slug: e.target.value.toLowerCase() });
            }}
            required
            pattern="[a-z0-9-]{3,60}"
            title="De 3 a 60 caracteres: minúsculas, números y guiones"
            className="font-mono"
          />
        </Field>
        <Field label="Lema" htmlFor="jam-lema" className="sm:col-span-2">
          <Input id="jam-lema" value={f.lema} onChange={campo("lema")} maxLength={200} placeholder="Una línea que acompañe al nombre" />
        </Field>
        <Field label="Descripción" htmlFor="jam-desc" className="sm:col-span-2">
          <Textarea id="jam-desc" value={f.descripcion} onChange={campo("descripcion")} maxLength={4000} rows={3} />
        </Field>
        <Field label="Lugar" htmlFor="jam-lugar">
          <Input id="jam-lugar" value={f.lugar} onChange={campo("lugar")} maxLength={200} placeholder="Tecsup Arequipa" />
        </Field>
        <Field label="Categorías" htmlFor="jam-cats" hint="Separadas por comas. Vacío = sin categorías.">
          <Input id="jam-cats" value={f.categorias} onChange={campo("categorias")} placeholder="IA, Web, Hardware" />
        </Field>
        <Field label="Inicio" htmlFor="jam-inicio" required hint="En la hora de este dispositivo.">
          <Input id="jam-inicio" type="datetime-local" value={f.inicio} onChange={campo("inicio")} required />
        </Field>
        <Field label="Cierre de envíos" htmlFor="jam-cierre" required hint="Después ya no se puede subir ni editar.">
          <Input id="jam-cierre" type="datetime-local" value={f.cierre} onChange={campo("cierre")} required />
        </Field>
        <Field label="Código de acceso" htmlFor="jam-codigo" required={!jam} hint={jam ? "Vacío conserva el actual (no se puede ver: se guarda cifrado)." : "De 4 a 40 caracteres. Se muestra en la pantalla del evento."}>
          <Input id="jam-codigo" value={f.codigo} onChange={campo("codigo")} required={!jam} minLength={4} maxLength={40} autoComplete="off" className="font-mono uppercase" />
        </Field>
        <Field label="Máximo de envíos" htmlFor="jam-max">
          <Input id="jam-max" type="number" min={1} max={1000} value={f.maxEnvios} onChange={campo("maxEnvios")} />
        </Field>
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink-default">
        <input type="checkbox" checked={f.publica} onChange={(e) => setF({ ...f, publica: e.target.checked })} className="h-5 w-5" />
        Pública (si no, la página de la jam no existe para nadie)
      </label>
      {error && <p className="rounded-sm bg-surface-sunken px-3 py-2 text-sm text-state-danger">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" loading={guardando}>
          {jam ? "Guardar" : "Crear jam"}
        </Button>
      </div>
    </form>
  );
}

function Qr({ slug, destino, titulo, texto }: { slug: string; destino: "enviar" | "galeria"; titulo: string; texto: string }) {
  const { avisar } = useToast();
  const url = urlQr(slug, destino);
  const descargar = async () => {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error();
      guardarArchivo(await r.blob(), `qr-${slug}-${destino}.png`);
    } catch {
      avisar("No se pudo descargar el QR", "error");
    }
  };
  return (
    <figure className="card flex flex-col items-center p-5 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- PNG del API, para proyectar */}
      <img src={url} alt={`Código QR: ${titulo}`} width={320} height={320} className="aspect-square w-full max-w-[20rem] rounded-sm bg-white" />
      <figcaption className="mt-4">
        <p className="font-display text-title font-medium text-ink-default">{titulo}</p>
        <p className="mt-1 text-xs text-ink-muted">{texto}</p>
      </figcaption>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Button size="sm" variant="outline" onClick={descargar} icon={<Icono nombre="descargar" tam={16} />}>
          Descargar PNG
        </Button>
        <Button size="sm" variant="ghost" href={url} externo icon={<Icono nombre="externo" tam={16} />}>
          Abrir en grande
        </Button>
      </div>
    </figure>
  );
}

function PanelJam({ jam, onCambio }: { jam: JamAdmin; onCambio: () => void }) {
  const { avisar } = useToast();
  const [envios, setEnvios] = useState<EnvioAdmin[] | null>(null);
  const [bajando, setBajando] = useState(false);
  const cargar = () =>
    getEnviosAdmin(jam.id)
      .then(setEnvios)
      .catch(() => setEnvios([]));
  useEffect(() => {
    void cargar();
  }, [jam.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const csv = async () => {
    setBajando(true);
    try {
      guardarArchivo(await descargarCsvJam(jam.id), `envios-${jam.slug}.csv`);
    } catch (e) {
      avisar(mensaje(e, "No se pudo descargar el CSV"), "error");
    } finally {
      setBajando(false);
    }
  };

  const moderar = async (e: EnvioAdmin, cambios: { oculto?: boolean; reconocimiento?: string | null }) => {
    try {
      const nuevo = await actualizarEnvioAdmin(e.id, cambios);
      setEnvios((l) => l?.map((x) => (x.id === e.id ? nuevo : x)) ?? l);
      if (cambios.oculto !== undefined) onCambio();
      avisar(cambios.oculto !== undefined ? (cambios.oculto ? "Envío oculto" : "Envío visible") : "Reconocimiento guardado");
    } catch (err) {
      avisar(mensaje(err, "No se pudo guardar"), "error");
    }
  };

  return (
    <section aria-labelledby="panel-jam" className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-linea pt-8">
        <h2 id="panel-jam" className="seccion-t text-ink-default">
          {jam.nombre}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" href={`/jams/${jam.slug}`} icon={<Icono nombre="ojo" tam={16} />}>
            Página pública
          </Button>
          <Button size="sm" variant="outline" href={`/jams/${jam.slug}/enviar`} icon={<Icono nombre="subir" tam={16} />}>
            Formulario de envío
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Qr slug={jam.slug} destino="enviar" titulo="Sube tu proyecto" texto={`Abre /jams/${jam.slug}/enviar. El código de acceso se pide aparte.`} />
        <Qr slug={jam.slug} destino="galeria" titulo="Galería de proyectos" texto={`Abre /jams/${jam.slug}.`} />
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-title font-medium text-ink-default">Envíos {envios && <span className="num text-ink-muted">({envios.length})</span>}</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => void cargar()} icon={<Icono nombre="historial" tam={16} />}>
              Actualizar
            </Button>
            <Button size="sm" variant="secondary" onClick={csv} loading={bajando} icon={<Icono nombre="descargar" tam={16} />}>
              Descargar CSV
            </Button>
          </div>
        </div>
        {envios === null ? (
          <Skeleton className="mt-4 h-40" />
        ) : envios.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">Todavía no hay envíos.</p>
        ) : (
          <ul className="card mt-4 divide-y divide-linea">
            {envios.map((e) => (
              <FilaEnvio key={e.id} envio={e} jamSlug={jam.slug} onModerar={(c) => moderar(e, c)} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function FilaEnvio({ envio: e, jamSlug, onModerar }: { envio: EnvioAdmin; jamSlug: string; onModerar: (c: { oculto?: boolean; reconocimiento?: string | null }) => Promise<void> }) {
  const [reconocimiento, setReconocimiento] = useState(e.reconocimiento ?? "");
  const [guardando, setGuardando] = useState(false);
  const cambiado = reconocimiento.trim() !== (e.reconocimiento ?? "");
  const guardar = async () => {
    if (!cambiado) return;
    setGuardando(true);
    await onModerar({ reconocimiento: reconocimiento.trim() || null });
    setGuardando(false);
  };
  return (
    <li className={cn("grid gap-3 p-4 lg:grid-cols-[1fr_18rem_auto] lg:items-center", e.oculto && "bg-surface-sunken")}>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-2">
          <Link href={`/jams/${jamSlug}/p/${e.slug}`} target="_blank" className={cn("font-semibold text-ink-default hover:underline", e.oculto && "text-ink-muted line-through")}>
            {e.nombre}
          </Link>
          {e.oculto && <Chip>Oculto</Chip>}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-muted">
          {[e.equipoNombre, e.categoria, `${e.integrantes.length} personas`, `${e.imagenes.length} fotos`].filter(Boolean).join(" · ")}
        </p>
        <a href={`mailto:${e.contactoCorreo}`} className="mt-0.5 inline-block text-xs text-brand-primary hover:underline">
          {e.contactoCorreo}
        </a>
      </div>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          void guardar();
        }}
        className="flex gap-2"
      >
        <Input value={reconocimiento} onChange={(ev) => setReconocimiento(ev.target.value)} placeholder="Reconocimiento (p. ej. 1.er puesto)" maxLength={80} aria-label={`Reconocimiento de ${e.nombre}`} className="min-h-9 py-1.5 text-sm" />
        {cambiado && (
          <Button type="submit" size="sm" loading={guardando}>
            Guardar
          </Button>
        )}
      </form>
      <Button size="sm" variant="ghost" onClick={() => void onModerar({ oculto: !e.oculto })} icon={<Icono nombre={e.oculto ? "ojo" : "cerrar"} tam={16} />}>
        {e.oculto ? "Mostrar" : "Ocultar"}
      </Button>
    </li>
  );
}
