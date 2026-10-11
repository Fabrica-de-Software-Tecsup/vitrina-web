import { apiFetch, ErrorApi } from "./api-client";
import type { Proyecto } from "./tipos";

/*
  Caché del navegador para los GET públicos (listado, catálogos, directorio, detalle), con dos niveles:

  · Memoria: lectura síncrona. Sirve al gesto de firma: la lámina y la cabecera del detalle tienen que
    estar en el mismo commit de la navegación, y al volver atrás Explorar pinta su retícula al instante.
  · localStorage: la última respuesta de cada URL con su sello de tiempo. En la siguiente visita se pinta
    al momento mientras se pide la nueva (stale-while-revalidate), aunque el API esté dormido.

  Nunca se usa en el servidor (ahí sería compartida entre usuarios) y solo se persisten respuestas públicas:
  quien llama decide con `persistir` (un borrador visto con sesión no se guarda en disco).
*/
const enNavegador = typeof window !== "undefined";
const PREFIJO = "vitrina:swr:";
const INDICE = `${PREFIJO}indice`;
const MAX_ENTRADAS = 40;
const MAX_BYTES = 2 * 1024 * 1024;
/** Una sola respuesta no puede comerse el cupo entero. */
const MAX_BYTES_ENTRADA = 512 * 1024;
/** Pasada una semana, lo guardado ya no se enseña. */
const CADUCIDAD_MS = 7 * 24 * 60 * 60 * 1000;

const memoria = new Map<string, unknown>();
const porSlug = new Map<string, Proyecto>();

interface FilaIndice {
  /** Ruta del API (clave). */
  r: string;
  /** Sello de tiempo. */
  t: number;
  /** Tamaño aproximado en bytes (caracteres del JSON). */
  n: number;
}

function leerIndice(): FilaIndice[] {
  try {
    const crudo = localStorage.getItem(INDICE);
    const filas: unknown = crudo ? JSON.parse(crudo) : [];
    return Array.isArray(filas) ? (filas as FilaIndice[]).filter((f) => typeof f?.r === "string") : [];
  } catch {
    return [];
  }
}

/** Borra todo lo nuestro (cupo lleno o índice corrupto). */
function vaciarDisco() {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIJO)) localStorage.removeItem(k);
    }
  } catch {
    /* sin almacenamiento: no hay nada que limpiar */
  }
}

function escribirDisco(ruta: string, datos: unknown) {
  try {
    const ahora = Date.now();
    const texto = JSON.stringify({ t: ahora, d: datos });
    if (texto.length > MAX_BYTES_ENTRADA) return;
    const filas = leerIndice().filter((f) => f.r !== ruta);
    filas.push({ r: ruta, t: ahora, n: texto.length });
    filas.sort((a, b) => b.t - a.t);
    // De la más reciente a la más antigua: se conservan hasta 40 entradas y 2 MB; el resto (y lo caducado) se borra.
    const conservadas: FilaIndice[] = [];
    let bytes = 0;
    for (const f of filas) {
      if (conservadas.length < MAX_ENTRADAS && bytes + f.n <= MAX_BYTES && ahora - f.t < CADUCIDAD_MS) {
        conservadas.push(f);
        bytes += f.n;
      } else localStorage.removeItem(PREFIJO + f.r);
    }
    localStorage.setItem(PREFIJO + ruta, texto);
    localStorage.setItem(INDICE, JSON.stringify(conservadas));
  } catch {
    // Cupo lleno o almacenamiento bloqueado (modo privado): se empieza de cero y se sigue sin caché en disco.
    vaciarDisco();
  }
}

/** Anota en memoria, por slug, los proyectos que vengan en una respuesta (lista paginada, arreglo o uno solo). */
function anotarProyectos(datos: unknown) {
  const esProyecto = (x: unknown): x is Proyecto =>
    !!x && typeof x === "object" && typeof (x as Proyecto).slug === "string" && Array.isArray((x as Proyecto).imagenes) && Array.isArray((x as Proyecto).miembros);
  const lista = Array.isArray(datos) ? datos : Array.isArray((datos as { items?: unknown[] } | null)?.items) ? (datos as { items: unknown[] }).items : [datos];
  for (const x of lista) if (esProyecto(x)) porSlug.set(x.slug, x);
}

/** Guarda una respuesta. `persistir: false` la deja solo en memoria (datos que dependen de la sesión). */
export function guardarEnCache(ruta: string, datos: unknown, persistir = true) {
  if (!enNavegador) return;
  memoria.delete(ruta);
  memoria.set(ruta, datos);
  if (memoria.size > 60) memoria.delete(memoria.keys().next().value!);
  anotarProyectos(datos);
  if (persistir) escribirDisco(ruta, datos);
}

/** Lectura síncrona de memoria: lo visto en esta sesión de navegación. */
export function enMemoria<T>(ruta: string): T | undefined {
  return enNavegador ? (memoria.get(ruta) as T | undefined) : undefined;
}

/**
 * Última respuesta guardada en disco para esa ruta (de esta visita o de una anterior).
 * Solo debe llamarse después de hidratar: el servidor no la conoce y el primer render debe coincidir.
 */
export function enDisco<T>(ruta: string): T | undefined {
  if (!enNavegador) return undefined;
  try {
    const crudo = localStorage.getItem(PREFIJO + ruta);
    if (!crudo) return undefined;
    const { t, d } = JSON.parse(crudo) as { t: number; d: T };
    if (typeof t !== "number" || Date.now() - t > CADUCIDAD_MS) {
      localStorage.removeItem(PREFIJO + ruta);
      return undefined;
    }
    memoria.set(ruta, d);
    anotarProyectos(d);
    return d;
  } catch {
    return undefined;
  }
}

/** Proyectos ya vistos, por slug: el detalle pinta su cabecera sin esperar a la red. */
export function recordarProyectos(items: Proyecto[]) {
  if (!enNavegador) return;
  for (const p of items) porSlug.set(p.slug, p);
}

export function proyectoEnCache(slug: string): Proyecto | undefined {
  return enNavegador ? porSlug.get(slug) : undefined;
}

let explorar = "/proyectos";

/** Última URL de Explorar (con filtros y página), para que «Explorar» en el detalle vuelva a la misma retícula. */
export function recordarExplorar(url: string) {
  if (enNavegador) explorar = url;
}

export function urlExplorar(): string {
  return explorar;
}

/* ─── Red: reintentos y aviso de servidor dormido ─── */

/** A partir de aquí una petición que bloquea contenido enciende el aviso bajo la cabecera. */
const ESPERA_AVISO_MS = 4000;
/** Pausas entre reintentos; la última se repite hasta agotar el tope. */
const PAUSAS_MS = [2000, 4000, 8000];
/** Tiempo total que se insiste antes de rendirse. */
const TOPE_MS = 60_000;

let lentas = 0;
const oyentes = new Set<() => void>();
const emitir = () => oyentes.forEach((f) => f());

/** Para useSyncExternalStore: ¿hay alguna petición visible que lleva más de 4 s esperando? */
export function suscribirEspera(oyente: () => void) {
  oyentes.add(oyente);
  return () => {
    oyentes.delete(oyente);
  };
}
export const hayEsperaLarga = () => lentas > 0;

/** Se reintenta lo que huele a servidor arrancando: fallo de red o 5xx/429. Un 404 o un 401 son respuestas, no esperas. */
function reintentable(e: unknown): boolean {
  if (e instanceof ErrorApi) return e.status >= 500 || e.status === 429 || e.status === 408;
  return e instanceof TypeError;
}

function dormir(ms: number, senal: AbortSignal): Promise<void> {
  return new Promise((resolver, rechazar) => {
    const cancelar = () => {
      clearTimeout(reloj);
      rechazar(new DOMException("Cancelada", "AbortError"));
    };
    const reloj = setTimeout(() => {
      senal.removeEventListener("abort", cancelar);
      resolver();
    }, ms);
    senal.addEventListener("abort", cancelar, { once: true });
  });
}

interface OpcionesPeticion<T> {
  /**
   * true cuando el visitante está esperando estos datos (no hay nada pintado): si tardan más de 4 s
   * aparece el aviso. Una revalidación en segundo plano va en silencio.
   */
  avisar?: boolean;
  signal?: AbortSignal;
  /** Si devuelve false, la respuesta se queda en memoria y no se escribe en disco. */
  persistir?: (datos: T) => boolean;
}

/**
 * GET público con paciencia: reintenta con pausas de 2, 4 y 8 s mientras el servidor despierta (60 s en total
 * como mucho) y guarda la respuesta en la caché. Rechaza si se agota el tiempo o el error no es de espera.
 */
export async function pedirPublico<T>(ruta: string, { avisar = true, signal, persistir }: OpcionesPeticion<T> = {}): Promise<T> {
  const inicio = Date.now();
  const control = new AbortController();
  const abortar = () => control.abort();
  if (signal?.aborted) control.abort();
  signal?.addEventListener("abort", abortar, { once: true });
  const tope = setTimeout(abortar, TOPE_MS);
  let avisando = false;
  const reloj = avisar
    ? setTimeout(() => {
        avisando = true;
        lentas += 1;
        emitir();
      }, ESPERA_AVISO_MS)
    : undefined;

  try {
    for (let intento = 0; ; intento++) {
      try {
        const datos = await apiFetch<T>(ruta, { signal: control.signal });
        guardarEnCache(ruta, datos, persistir ? persistir(datos) : true);
        return datos;
      } catch (e) {
        if (control.signal.aborted || !reintentable(e)) throw e;
        const pausa = PAUSAS_MS[Math.min(intento, PAUSAS_MS.length - 1)];
        if (Date.now() - inicio + pausa >= TOPE_MS) throw e;
        await dormir(pausa, control.signal);
      }
    }
  } finally {
    clearTimeout(tope);
    clearTimeout(reloj);
    signal?.removeEventListener("abort", abortar);
    if (avisando) {
      lentas -= 1;
      emitir();
    }
  }
}
