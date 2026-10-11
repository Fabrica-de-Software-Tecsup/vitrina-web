/*
  Lecturas del API desde el servidor de Next, para que el HTML salga ya con datos.

  Cada respuesta se guarda en la caché de datos (en Vercel sobrevive entre despliegues) durante 5 minutos y,
  pasado ese tiempo, se sigue sirviendo la guardada mientras se pide la nueva por detrás. Así la primera vista
  no depende de que el API (Render Free, tarda 30–60 s en despertar) esté arriba.

  Etiquetas, para la revalidación bajo demanda de /api/revalidar:
    · proyectos         listados, cifras, directorio y carreras (llevan contadores de proyectos)
    · proyecto:<slug>   el detalle de un proyecto
    · catalogos         carreras, categorías y tecnologías
    · personas          directorio de docentes y estudiantes
*/
import { cache } from "react";
import type { Proyecto } from "./tipos";

export const REVALIDAR_S = 300;
const ESPERA_MS = 8000;

export interface DatoInicial<T> {
  /** Ruta del API de la que salieron los datos; el cliente la compara con la suya antes de usarlos. */
  ruta: string;
  datos: T;
}

/**
 * GET al API con caché y tope de espera. Devuelve null si el API no responde a tiempo o responde con error:
 * la página se renderiza igual y el navegador carga los datos por su cuenta.
 */
export async function pedirEnServidor<T>(ruta: string, tags: string[], esperaMs = ESPERA_MS): Promise<T | null> {
  const apiUrl = process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}${ruta}`, { next: { revalidate: REVALIDAR_S, tags }, signal: AbortSignal.timeout(esperaMs) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Igual que pedirEnServidor, con la ruta al lado para que el cliente sepa a qué consulta corresponden. */
export async function inicialDe<T>(ruta: string, tags: string[], esperaMs?: number): Promise<DatoInicial<T> | null> {
  const datos = await pedirEnServidor<T>(ruta, tags, esperaMs);
  return datos === null ? null : { ruta, datos };
}

/** Detalle de un proyecto por slug, tal como lo ve un anónimo. Los metadatos y la página comparten la petición. */
export const proyectoPorSlug = cache((slug: string) =>
  pedirEnServidor<Proyecto>(`/proyectos/slug/${encodeURIComponent(slug)}`, ["proyectos", `proyecto:${slug}`]),
);

/**
 * Para páginas estáticas (ISR). Al regenerarse, Next espera la respuesta nueva del API en vez de usar la guardada;
 * si el API duerme, la página se regeneraría sin datos y quedaría así 5 minutos para todos. Lanzar aquí hace que
 * Next conserve la última página buena y lo reintente en la siguiente visita. En la compilación (no hay página
 * anterior) y en desarrollo no se lanza: se renderiza sin datos y el navegador los pide.
 */
export function conservarPaginaSiFaltan(...datos: unknown[]) {
  if (process.env.NODE_ENV !== "production" || process.env.NEXT_PHASE === "phase-production-build") return;
  if (datos.some((d) => d === null)) throw new Error("El API no respondió a tiempo: se conserva la página generada antes.");
}
