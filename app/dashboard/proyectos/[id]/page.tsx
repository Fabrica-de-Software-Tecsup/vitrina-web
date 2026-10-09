"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Chip, EstadoBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Section";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal, Skeleton, Tabs, useToast } from "@/components/ui/Feedback";
import { useSesion } from "@/components/sesion/SesionProvider";
import {
  actualizarImagenProyecto, actualizarProyecto, agregarMiembro, eliminarImagenProyecto, eliminarProyecto, getHistorial,
  getProyectoPorId, quitarMiembro, subirBuildProyecto, subirImagenProyecto, type DatosProyecto,
} from "@/lib/api-proyectos";
import { crearTecnologia, getCarreras, getCategorias, getTecnologias } from "@/lib/api-catalogos";
import { buscarUsuarios, getDocentes, type DocenteOpcion, type UsuarioBusqueda } from "@/lib/api-usuarios";
import { ESTADO_LABEL, type Carrera, type Categoria, type HistorialItem, type Proyecto, type Tecnologia } from "@/lib/tipos";
import { cn, fechaCorta } from "@/lib/utils";
import DocentesSelector from "@/components/proyectos/DocentesSelector";

type Pestana = "basico" | "historia" | "multimedia" | "equipo";

const MIN_DESCRIPCION = 80;

export default function EditarProyectoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { usuario, esDocente } = useSesion();
  const { avisar } = useToast();

  const [proyecto, setProyecto] = useState<Proyecto | null | undefined>(undefined);
  const [tab, setTab] = useState<Pestana>("basico");
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [docentes, setDocentes] = useState<DocenteOpcion[]>([]);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [form, setForm] = useState<DatosProyecto>({});
  const [guardando, setGuardando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [confirmarEnvio, setConfirmarEnvio] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const sucio = useRef(false);

  const cargarDesde = useCallback((p: Proyecto) => {
    setProyecto(p);
    setForm({
      nombre: p.nombre,
      tagline: p.tagline ?? "",
      descripcion: p.descripcion ?? "",
      carreraId: p.carreraId,
      ciclo: p.ciclo,
      periodo: p.periodo ?? "",
      docenteIds: p.docentes.map((d) => d.usuarioId),
      resumenCambios: p.resumenCambios ?? "",
      categoriaIds: p.categorias.map((c) => c.categoria.id),
      tecnologiaIds: p.tecnologias.map((t) => t.tecnologia.id),
      youtubeUrl: p.youtubeUrl ?? "",
      githubUrl: p.githubUrl ?? "",
      demoUrl: p.demoUrl ?? "",
      figmaUrl: p.figmaUrl ?? "",
      comoLoConstruyeron: p.comoLoConstruyeron ?? "",
      retosSuperados: p.retosSuperados ?? "",
      leccionAprendida: p.leccionAprendida ?? "",
      queHarianDiferente: p.queHarianDiferente ?? "",
    });
    sucio.current = false;
  }, []);

  useEffect(() => {
    getProyectoPorId(id).then(cargarDesde).catch(() => setProyecto(null));
    getHistorial(id).then(setHistorial).catch(() => null);
    getCarreras().then(setCarreras).catch(() => null);
    getCategorias().then(setCategorias).catch(() => null);
    getTecnologias().then(setTecnologias).catch(() => null);
    getDocentes().then(setDocentes).catch(() => null);
  }, [id, cargarDesde]);

  const set = <K extends keyof DatosProyecto>(k: K, v: DatosProyecto[K]) => {
    sucio.current = true;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const guardar = async (silencioso = false): Promise<boolean> => {
    if (!proyecto) return false;
    setGuardando(true);
    try {
      const payload: DatosProyecto = {
        ...form,
        carreraId: form.carreraId || null,
        ciclo: form.ciclo || null,
        periodo: form.periodo || null,
      };
      cargarDesde(await actualizarProyecto(proyecto.id, payload));
      if (!silencioso) avisar("Cambios guardados");
      return true;
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo guardar", "error");
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const enviarARevision = async () => {
    if (!proyecto) return;
    setEnviando(true);
    try {
      const payload: DatosProyecto = { ...form, carreraId: form.carreraId || null, ciclo: form.ciclo || null, periodo: form.periodo || null, estado: "POR_REVISAR" };
      cargarDesde(await actualizarProyecto(proyecto.id, payload));
      setConfirmarEnvio(false);
      avisar("¡Enviado! Tu docente recibirá un aviso.");
      getHistorial(id).then(setHistorial).catch(() => null);
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo enviar", "error");
    } finally {
      setEnviando(false);
    }
  };

  const volverABorrador = async () => {
    if (!proyecto) return;
    try {
      cargarDesde(await actualizarProyecto(proyecto.id, { estado: "EN_DESARROLLO" }));
      avisar("Volvió a borrador: puedes seguir editando.");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo cambiar", "error");
    }
  };

  const prepararNuevaVersion = async () => {
    if (!proyecto) return;
    try {
      cargarDesde(await actualizarProyecto(proyecto.id, { estado: "EN_DESARROLLO" }));
      avisar(`Preparando la versión ${proyecto.versionActual + 1}. El público sigue viendo la versión ${proyecto.versionActual}.`);
      setTab("basico");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo iniciar la nueva versión", "error");
    }
  };

  const alternarVisibilidad = async () => {
    if (!proyecto) return;
    try {
      cargarDesde(await actualizarProyecto(proyecto.id, { estado: proyecto.estado === "PUBLICADO" ? "OCULTO" : "PUBLICADO" }));
      avisar(proyecto.estado === "PUBLICADO" ? "Proyecto oculto" : "Proyecto visible de nuevo");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo cambiar", "error");
    }
  };

  const borrar = async () => {
    if (!proyecto) return;
    try {
      await eliminarProyecto(proyecto.id);
      avisar("Proyecto eliminado");
      router.push("/dashboard");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo eliminar", "error");
    }
  };

  /* Checklist para enviar a revision */
  const checklist = useMemo(() => {
    if (!proyecto) return [];
    return [
      { ok: (form.tagline ?? "").trim().length > 0, label: "Una frase que lo resuma" },
      { ok: (form.descripcion ?? "").trim().length >= MIN_DESCRIPCION, label: `Descripción de al menos ${MIN_DESCRIPCION} caracteres` },
      { ok: proyecto.imagenes.length > 0, label: "Al menos una imagen" },
      { ok: (form.docenteIds ?? []).length > 0, label: "Al menos un docente que lo valide" },
      ...(proyecto.versionActual > 0 ? [{ ok: (form.resumenCambios ?? "").trim().length > 0, label: "Qué cambió en esta versión" }] : []),
      { ok: (form.tecnologiaIds ?? []).length > 0, label: "Tecnologías usadas (recomendado)", opcional: true },
      { ok: (form.leccionAprendida ?? "").trim().length > 0, label: "Qué aprendieron (recomendado)", opcional: true },
      { ok: !!(form.githubUrl || form.demoUrl || form.youtubeUrl), label: "Un enlace: demo, repo o video (recomendado)", opcional: true },
    ];
  }, [form, proyecto]);
  const listoParaEnviar = checklist.filter((c) => !c.opcional).every((c) => c.ok);
  const progreso = Math.round((checklist.filter((c) => c.ok).length / checklist.length) * 100);

  if (proyecto === undefined) return <Container className="py-10"><Skeleton className="h-8 w-1/2" /><Skeleton className="mt-6 h-64" /></Container>;
  if (proyecto === null) return <Container className="py-20 text-center"><p className="text-ink-600">No encontramos este proyecto o no tienes acceso.</p><Button href="/dashboard" variant="outline" className="mt-4">Volver</Button></Container>;

  const editable = proyecto.estado !== "POR_REVISAR" || esDocente;
  const esMiembro = !!usuario && (proyecto.creadorId === usuario.id || proyecto.miembros.some((m) => m.usuarioId === usuario.id));

  return (
    <Container className="py-8">
      {/* Cabecera */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <nav className="text-xs text-ink-500"><Link href="/dashboard" className="hover:text-brand-700">Mis proyectos</Link> / Editar</nav>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">{proyecto.nombre}</h1>
            <EstadoBadge estado={proyecto.estado} />
          </div>
          {proyecto.estado === "PUBLICADO" && <Link href={`/proyectos/${proyecto.slug}`} className="mt-1 inline-block text-sm text-brand-700 hover:underline">Ver página pública ↗</Link>}
        </div>
        <div className="flex flex-wrap gap-2">
          {proyecto.estado === "POR_REVISAR" && !esDocente && <Button variant="outline" onClick={volverABorrador}>Retirar de revisión</Button>}
          {(proyecto.estado === "PUBLICADO" || proyecto.estado === "OCULTO") && <Button variant="outline" onClick={alternarVisibilidad}>{proyecto.estado === "PUBLICADO" ? "Ocultar" : "Volver a mostrar"}</Button>}
          {proyecto.estado === "PUBLICADO" && <Button variant="secondary" onClick={prepararNuevaVersion}>Preparar nueva versión</Button>}
          {esDocente && proyecto.estado === "POR_REVISAR" && <Button href={`/dashboard/revision/${proyecto.id}`} variant="secondary">Ir a revisar</Button>}
          {editable && <Button onClick={() => guardar()} loading={guardando} variant={proyecto.estado === "EN_DESARROLLO" ? "outline" : "primary"}>Guardar</Button>}
          {proyecto.estado === "EN_DESARROLLO" && <Button onClick={() => setConfirmarEnvio(true)} disabled={!listoParaEnviar} title={listoParaEnviar ? undefined : "Completa los requisitos de la lista"}>Enviar a revisión</Button>}
        </div>
      </div>

      {proyecto.observaciones && proyecto.estado === "EN_DESARROLLO" && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Observaciones del docente</p>
          <p className="mt-1 whitespace-pre-line text-sm text-amber-900">{proyecto.observaciones}</p>
        </div>
      )}
      {proyecto.estado === "PUBLICADO" && proyecto.versionActual > 0 && (
        <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-4 text-sm text-ink-700">
          Este proyecto está publicado como <span className="font-semibold">versión {proyecto.versionActual}</span>. Para seguir trabajándolo el próximo semestre sin borrar lo que ya se ve, usa <span className="font-semibold">Preparar nueva versión</span>: editas en borrador, lo reenvías con un resumen de cambios y, al publicarse, la versión anterior queda en la línea de tiempo.
        </div>
      )}
      {proyecto.estado === "EN_DESARROLLO" && proyecto.versionActual > 0 && (
        <div className="mt-6 rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4 text-sm text-ink-700">
          Estás preparando la <span className="font-semibold">versión {proyecto.versionActual + 1}</span>. El público sigue viendo la versión {proyecto.versionActual} hasta que un docente publique esta.
        </div>
      )}
      {proyecto.estado === "POR_REVISAR" && !esDocente && (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
          Tu proyecto está en la cola de revisión. Mientras tanto no se puede editar; si necesitas cambiar algo, retíralo y vuelve a enviarlo.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Formulario */}
        <div>
          <Tabs
            valor={tab}
            onChange={setTab}
            opciones={[
              { id: "basico", label: "Lo básico" },
              { id: "historia", label: "La historia" },
              { id: "multimedia", label: "Fotos y enlaces", count: proyecto.imagenes.length },
              { id: "equipo", label: "Equipo", count: proyecto.miembros.length },
            ]}
          />

          <fieldset disabled={!editable} className="card mt-4 space-y-5 p-6 disabled:opacity-70">
            {tab === "basico" && (
              <>
                {proyecto.versionActual > 0 && (
                  <Field label={`Qué cambió en esta versión (v${proyecto.versionActual + 1})`} htmlFor="resumen" required hint="Se muestra en la línea de tiempo del proyecto. La versión anterior queda guardada tal cual." contador={{ actual: (form.resumenCambios ?? "").length, max: 2000 }}>
                    <Textarea id="resumen" rows={3} maxLength={2000} value={form.resumenCambios ?? ""} onChange={(e) => set("resumenCambios", e.target.value)} placeholder="Ej. Agregamos la app móvil, rediseñamos el panel y migramos la base a PostgreSQL." />
                  </Field>
                )}
                <Field label="Nombre" htmlFor="nombre" required contador={{ actual: (form.nombre ?? "").length, max: 120 }}>
                  <Input id="nombre" value={form.nombre ?? ""} maxLength={120} onChange={(e) => set("nombre", e.target.value)} />
                </Field>
                <Field label="En una frase" htmlFor="tagline" required hint="Aparece en la tarjeta y al compartir. Qué problema resuelve y para quién." contador={{ actual: (form.tagline ?? "").length, max: 120 }}>
                  <Input id="tagline" value={form.tagline ?? ""} maxLength={120} onChange={(e) => set("tagline", e.target.value)} placeholder="Ej. Riega el huerto del campus solo cuando la tierra lo necesita" />
                </Field>
                <Field label="Descripción" htmlFor="descripcion" required hint="Qué es, para quién, qué hace. Separa párrafos con una línea en blanco." contador={{ actual: (form.descripcion ?? "").length, max: 5000 }}>
                  <Textarea id="descripcion" rows={7} value={form.descripcion ?? ""} maxLength={5000} onChange={(e) => set("descripcion", e.target.value)} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Carrera" htmlFor="carrera" className="sm:col-span-2">
                    <Select id="carrera" value={form.carreraId ?? ""} onChange={(e) => set("carreraId", Number(e.target.value) || null)}>
                      <option value="">Sin carrera</option>
                      {Array.from(new Set(carreras.map((c) => c.area))).map((area) => (
                        <optgroup key={area} label={area}>{carreras.filter((c) => c.area === area).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</optgroup>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Ciclo" htmlFor="ciclo">
                    <Select id="ciclo" value={form.ciclo ?? ""} onChange={(e) => set("ciclo", Number(e.target.value) || null)}>
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>Ciclo {c}</option>)}
                    </Select>
                  </Field>
                  <Field label="Periodo" htmlFor="periodo" hint="AAAA-1 o AAAA-2">
                    <Input id="periodo" value={form.periodo ?? ""} onChange={(e) => set("periodo", e.target.value)} placeholder="2026-2" />
                  </Field>
                </div>
                <DocentesSelector docentes={docentes} seleccionados={form.docenteIds ?? []} onChange={(ids) => set("docenteIds", ids)} carreraId={form.carreraId ?? null} disabled={!editable} />
                <Field label="Categorías" hint="Elige una o dos.">
                  <div className="flex flex-wrap gap-2">
                    {categorias.map((c) => {
                      const activa = (form.categoriaIds ?? []).includes(c.id);
                      return (
                        <Chip key={c.id} size="md" color={activa ? undefined : c.color} active={activa} onClick={() => set("categoriaIds", activa ? (form.categoriaIds ?? []).filter((x) => x !== c.id) : [...(form.categoriaIds ?? []), c.id])}>
                          {c.nombre}
                        </Chip>
                      );
                    })}
                  </div>
                </Field>
                <SelectorTecnologias todas={tecnologias} seleccionadas={form.tecnologiaIds ?? []} onChange={(ids) => set("tecnologiaIds", ids)} onNueva={async (nombre) => { const t = await crearTecnologia(nombre); setTecnologias((lista) => (lista.some((x) => x.id === t.id) ? lista : [...lista, t])); return t; }} />
              </>
            )}

            {tab === "historia" && (
              <>
                <p className="text-sm text-ink-600">Esta parte es la que más leen los reclutadores. Escribe como se lo contarías a un amigo.</p>
                {([
                  ["comoLoConstruyeron", "¿Cómo lo construyeron?", "Arquitectura, herramientas, cómo se organizaron."],
                  ["retosSuperados", "¿Qué retos superaron?", "Lo que salió mal y cómo lo resolvieron."],
                  ["leccionAprendida", "¿Qué aprendieron?", "Técnico y humano. Una o dos ideas fuertes."],
                  ["queHarianDiferente", "¿Qué harían diferente?", "Con lo que saben hoy."],
                ] as const).map(([campo, label, hint]) => (
                  <Field key={campo} label={label} htmlFor={campo} hint={hint} contador={{ actual: (form[campo] ?? "").length, max: 5000 }}>
                    <Textarea id={campo} rows={4} value={form[campo] ?? ""} maxLength={5000} onChange={(e) => set(campo, e.target.value)} />
                  </Field>
                ))}
              </>
            )}

            {tab === "multimedia" && (
              <>
                <GaleriaEditor proyecto={proyecto} onCambio={cargarDesde} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Video en YouTube" htmlFor="yt" hint="Pega el enlace del video (watch o youtu.be)."><Input id="yt" value={form.youtubeUrl ?? ""} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtu.be/…" /></Field>
                  <Field label="Demo en vivo" htmlFor="demo"><Input id="demo" value={form.demoUrl ?? ""} onChange={(e) => set("demoUrl", e.target.value)} placeholder="https://" /></Field>
                  <Field label="Repositorio (GitHub, GitLab…)" htmlFor="gh"><Input id="gh" value={form.githubUrl ?? ""} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" /></Field>
                  <Field label="Figma u otro diseño" htmlFor="fg"><Input id="fg" value={form.figmaUrl ?? ""} onChange={(e) => set("figmaUrl", e.target.value)} placeholder="https://" /></Field>
                </div>
                <BuildUploader proyecto={proyecto} onCambio={cargarDesde} />
              </>
            )}

            {tab === "equipo" && <EquipoEditor proyecto={proyecto} onCambio={cargarDesde} puedeEditar={editable} />}
          </fieldset>
        </div>

        {/* Lateral: checklist + historial */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-ink-900">Listo para revisión</h3>
              <span className="text-xs font-semibold text-ink-500">{progreso}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all" style={{ width: `${progreso}%` }} /></div>
            <ul className="mt-4 space-y-2">
              {checklist.map((c) => (
                <li key={c.label} className={cn("flex items-start gap-2 text-sm", c.ok ? "text-ink-500 line-through decoration-ink-300" : c.opcional ? "text-ink-600" : "text-ink-800")}>
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px]", c.ok ? "bg-emerald-500 text-white" : "border border-ink-300")}>{c.ok ? "✓" : ""}</span>
                  {c.label}
                </li>
              ))}
            </ul>
            {proyecto.estado === "EN_DESARROLLO" && (
              <Button className="mt-4 w-full" onClick={() => setConfirmarEnvio(true)} disabled={!listoParaEnviar}>Enviar a revisión</Button>
            )}
          </div>

          {historial.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-sm font-bold text-ink-900">Historial</h3>
              <ol className="mt-3 space-y-3 border-l border-ink-200 pl-4">
                {historial.map((h) => (
                  <li key={h.id} className="relative text-xs">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-500" />
                    <p className="font-semibold text-ink-800">{ESTADO_LABEL[h.aEstado]}</p>
                    <p className="text-ink-500">{h.actor?.nombre ?? "Sistema"} · {fechaCorta(h.createdAt)}</p>
                    {h.observaciones && <p className="mt-1 rounded-lg bg-ink-50 p-2 text-ink-700">{h.observaciones}</p>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {(proyecto.creadorId === usuario?.id || esDocente) && (
            <button type="button" onClick={() => setConfirmarBorrado(true)} className="w-full text-center text-xs text-rose-600 hover:underline">Eliminar proyecto</button>
          )}
          {!esMiembro && esDocente && <p className="text-xs text-ink-400">Estás editando como docente.</p>}
        </aside>
      </div>

      <Modal
        abierto={confirmarEnvio}
        onCerrar={() => setConfirmarEnvio(false)}
        titulo="¿Enviar a revisión?"
        descripcion="Se guardarán los cambios y tu docente recibirá un aviso. Mientras lo revisa no podrás editarlo (puedes retirarlo si necesitas corregir algo)."
        acciones={<><Button variant="ghost" onClick={() => setConfirmarEnvio(false)}>Todavía no</Button><Button onClick={enviarARevision} loading={enviando}>Sí, enviar</Button></>}
      />
      <Modal
        abierto={confirmarBorrado}
        onCerrar={() => setConfirmarBorrado(false)}
        titulo="Eliminar este proyecto"
        descripcion="Se borrarán sus imágenes, equipo e historial. Esta acción no se puede deshacer."
        acciones={<><Button variant="ghost" onClick={() => setConfirmarBorrado(false)}>Cancelar</Button><Button variant="danger" onClick={borrar}>Eliminar definitivamente</Button></>}
      />
    </Container>
  );
}

/* ─── Tecnologias: chips + buscador con alta rapida ─── */
function SelectorTecnologias({ todas, seleccionadas, onChange, onNueva }: { todas: Tecnologia[]; seleccionadas: number[]; onChange: (ids: number[]) => void; onNueva: (nombre: string) => Promise<Tecnologia> }) {
  const [q, setQ] = useState("");
  const [creando, setCreando] = useState(false);
  const texto = q.trim().toLowerCase();
  const sugerencias = texto ? todas.filter((t) => t.nombre.toLowerCase().includes(texto) && !seleccionadas.includes(t.id)).slice(0, 8) : [];
  const existeExacta = todas.some((t) => t.nombre.toLowerCase() === texto);
  const elegidas = seleccionadas.map((id) => todas.find((t) => t.id === id)).filter(Boolean) as Tecnologia[];

  const agregar = (t: Tecnologia) => {
    onChange([...seleccionadas, t.id]);
    setQ("");
  };
  const crear = async () => {
    if (!texto || creando) return;
    setCreando(true);
    try {
      agregar(await onNueva(q.trim()));
    } finally {
      setCreando(false);
    }
  };

  return (
    <Field label="Tecnologías y herramientas" hint="Lenguajes, frameworks, hardware, software de diseño… Si no está en la lista, escríbela y pulsa Enter.">
      <div className="rounded-2xl border border-ink-200 bg-white p-2">
        <div className="flex flex-wrap gap-1.5">
          {elegidas.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800">
              {t.nombre}
              <button type="button" aria-label={`Quitar ${t.nombre}`} onClick={() => onChange(seleccionadas.filter((x) => x !== t.id))} className="text-brand-500 hover:text-brand-800">×</button>
            </span>
          ))}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (sugerencias[0] && (existeExacta || sugerencias.length === 1)) agregar(sugerencias.find((s) => s.nombre.toLowerCase() === texto) ?? sugerencias[0]);
                else if (texto) void crear();
              }
            }}
            placeholder={elegidas.length ? "Agregar otra…" : "Ej. Arduino, React, SolidWorks…"}
            className="min-w-[160px] flex-1 bg-transparent px-2 py-1 text-sm outline-none"
          />
        </div>
        {(sugerencias.length > 0 || (texto && !existeExacta)) && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-ink-100 pt-2">
            {sugerencias.map((s) => <Chip key={s.id} size="md" onClick={() => agregar(s)}>{s.nombre}</Chip>)}
            {texto && !existeExacta && <Chip size="md" onClick={crear} className="border-dashed border-brand-300 text-brand-700">{creando ? "Creando…" : `+ Crear “${q.trim()}”`}</Chip>}
          </div>
        )}
      </div>
    </Field>
  );
}

/* ─── Galeria ─── */
function GaleriaEditor({ proyecto, onCambio }: { proyecto: Proyecto; onCambio: (p: Proyecto) => void }) {
  const { avisar } = useToast();
  const [subiendo, setSubiendo] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);

  const subir = async (archivos: FileList | File[] | null) => {
    if (!archivos) return;
    const lista = Array.from(archivos).filter((f) => f.type.startsWith("image/"));
    if (!lista.length) return avisar("Solo se aceptan imágenes PNG, JPG, GIF o WebP", "error");
    for (const f of lista) {
      if (f.size > 5 * 1024 * 1024) {
        avisar(`${f.name} supera 5 MB`, "error");
        continue;
      }
      setSubiendo((n) => n + 1);
      try {
        onCambio(await subirImagenProyecto(proyecto.id, f, false));
      } catch (e) {
        avisar(e instanceof Error ? e.message : "No se pudo subir", "error");
      } finally {
        setSubiendo((n) => n - 1);
      }
    }
  };

  return (
    <Field label="Imágenes" required hint="Hasta 10, 5 MB cada una. La primera es la portada; puedes cambiarla.">
      <div
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => { e.preventDefault(); setArrastrando(false); void subir(e.dataTransfer.files); }}
        className={cn("rounded-2xl border-2 border-dashed p-4 transition-colors", arrastrando ? "border-brand-500 bg-brand-50" : "border-ink-200")}
      >
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {proyecto.imagenes.map((img) => (
            <div key={img.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              {img.esPortada && <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">Portada</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/60 p-1.5 opacity-0 transition group-hover:opacity-100">
                {!img.esPortada && <button type="button" onClick={async () => onCambio(await actualizarImagenProyecto(proyecto.id, img.id, { esPortada: true }))} className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-ink-800">Portada</button>}
                <button type="button" onClick={async () => onCambio(await eliminarImagenProyecto(proyecto.id, img.id))} className="ml-auto rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white">Quitar</button>
              </div>
            </div>
          ))}
          {proyecto.imagenes.length < 10 && (
            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-xl border border-ink-200 bg-ink-50 text-center text-xs text-ink-500 hover:border-brand-400 hover:text-brand-700">
              <span className="text-2xl">＋</span>
              {subiendo ? `Subiendo ${subiendo}…` : "Subir o arrastrar"}
              <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple className="hidden" onChange={(e) => { void subir(e.target.files); e.target.value = ""; }} />
            </label>
          )}
        </div>
      </div>
    </Field>
  );
}

/* ─── Build ZIP opcional ─── */
function BuildUploader({ proyecto, onCambio }: { proyecto: Proyecto; onCambio: (p: Proyecto) => void }) {
  const { avisar } = useToast();
  const [subiendo, setSubiendo] = useState(false);
  return (
    <Field label="Build o ejecutable (opcional)" hint="ZIP de hasta 100 MB. Útil para apps de escritorio, juegos o firmware.">
      <div className="flex flex-wrap items-center gap-3">
        <label className={cn("inline-flex h-10 cursor-pointer items-center rounded-full border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 hover:border-brand-400", subiendo && "opacity-60")}>
          {subiendo ? "Subiendo…" : proyecto.buildUrl ? "Reemplazar ZIP" : "Subir ZIP"}
          <input type="file" accept=".zip,application/zip" className="hidden" disabled={subiendo} onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (!f) return;
            setSubiendo(true);
            try { onCambio(await subirBuildProyecto(proyecto.id, f)); avisar("Build subido"); } catch (err) { avisar(err instanceof Error ? err.message : "No se pudo subir", "error"); } finally { setSubiendo(false); }
          }} />
        </label>
        {proyecto.buildUrl && <a href={proyecto.buildUrl} className="text-sm text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">Descargar actual ↗</a>}
      </div>
    </Field>
  );
}

/* ─── Equipo ─── */
function EquipoEditor({ proyecto, onCambio, puedeEditar }: { proyecto: Proyecto; onCambio: (p: Proyecto) => void; puedeEditar: boolean }) {
  const { avisar } = useToast();
  const [q, setQ] = useState("");
  const [resultados, setResultados] = useState<UsuarioBusqueda[]>([]);
  const [rol, setRol] = useState("Desarrollador/a");

  useEffect(() => {
    const t = setTimeout(() => {
      if (q.trim().length < 2) return setResultados([]);
      buscarUsuarios(q).then((r) => setResultados(r.filter((u) => !proyecto.miembros.some((m) => m.usuarioId === u.id)))).catch(() => setResultados([]));
    }, 300);
    return () => clearTimeout(t);
  }, [q, proyecto.miembros]);

  const agregar = async (u: UsuarioBusqueda) => {
    try {
      onCambio(await agregarMiembro(proyecto.id, u.id, rol.trim() || "Integrante"));
      setQ("");
      setResultados([]);
      avisar(`${u.nombre} agregado al equipo`);
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo agregar", "error");
    }
  };

  return (
    <div className="space-y-5">
      <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-200">
        {proyecto.miembros.map((m) => (
          <li key={m.usuarioId} className="flex items-center gap-3 p-3">
            <Avatar name={m.usuario.nombre} src={m.usuario.fotoUrl} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink-900">{m.usuario.nombre}</p>
              <p className="truncate text-xs text-ink-500">{m.rol}{m.esLider ? " · líder" : ""}{m.usuarioId === proyecto.creadorId ? " · creador" : ""}</p>
            </div>
            {puedeEditar && m.usuarioId !== proyecto.creadorId && (
              <button type="button" onClick={async () => { try { onCambio(await quitarMiembro(proyecto.id, m.usuarioId)); } catch (e) { avisar(e instanceof Error ? e.message : "No se pudo quitar", "error"); } }} className="text-xs text-rose-600 hover:underline">Quitar</button>
            )}
          </li>
        ))}
      </ul>
      {puedeEditar && (
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <Field label="Agregar integrante" htmlFor="buscar" hint="Busca por nombre o correo Tecsup. Debe haber entrado a Vitrina al menos una vez.">
            <Input id="buscar" value={q} onChange={(e) => setQ(e.target.value)} placeholder="nombre o correo…" autoComplete="off" />
            {resultados.length > 0 && (
              <ul className="mt-2 overflow-hidden rounded-xl border border-ink-200 bg-white">
                {resultados.map((u) => (
                  <li key={u.id}>
                    <button type="button" onClick={() => agregar(u)} className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-ink-50">
                      <Avatar name={u.nombre} src={u.fotoUrl} size="sm" />
                      <span className="min-w-0"><span className="block truncate text-sm font-medium text-ink-900">{u.nombre}</span><span className="block truncate text-xs text-ink-500">{u.correo}{u.carrera ? ` · ${u.carrera.nombre}` : ""}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Field>
          <Field label="Rol en el equipo" htmlFor="rol"><Input id="rol" value={rol} onChange={(e) => setRol(e.target.value)} maxLength={60} /></Field>
        </div>
      )}
    </div>
  );
}
