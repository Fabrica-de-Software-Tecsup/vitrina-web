import type { ImageLoader } from "next/image";
import { thumbHashToDataURL } from "thumbhash";
import type { Imagen, VarianteImagen } from "./tipos";

const ORDEN = ["s", "m", "l"] as const;

/** URL de una variante: AVIF si existe (≈30 % menos que WebP), si no WebP. */
function urlVariante(v: VarianteImagen | undefined): string | undefined {
  return v?.avif ?? v?.webp;
}

/**
 * Loader de next/image que elige la variante del API por ancho pedido, sin pasar por el optimizador
 * de Vercel. Devuelve undefined si la imagen no trae variantes (entonces se sirve el original).
 */
export function cargadorDe(img: Pick<Imagen, "url" | "variantes">): ImageLoader | undefined {
  const variantes = img.variantes;
  if (!variantes || !ORDEN.some((k) => urlVariante(variantes[k]))) return undefined;
  const disponibles = ORDEN.map((k) => variantes[k]).filter((v): v is VarianteImagen => !!urlVariante(v));
  return ({ src, width }) => {
    const elegida = disponibles.find((v) => v.ancho >= width) ?? disponibles[disponibles.length - 1];
    const url = urlVariante(elegida) ?? src;
    // El ancho va en el fragmento: no cambia la petición, pero deja claro a next/image que el loader lo usa.
    return `${url}#w=${width}`;
  };
}

const cacheHash = new Map<string, string | null>();

/** ThumbHash (base64) → data URL PNG diminuto para el hueco mientras carga. */
export function placeholderDe(hash: string | null | undefined): string | null {
  if (!hash) return null;
  if (cacheHash.has(hash)) return cacheHash.get(hash)!;
  let url: string | null = null;
  try {
    const bin = typeof atob === "function" ? atob(hash) : Buffer.from(hash, "base64").toString("binary");
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    url = thumbHashToDataURL(bytes);
  } catch {
    url = null;
  }
  cacheHash.set(hash, url);
  return url;
}

/** object-position a partir del punto focal guardado (0–1). */
export function posicionFocal(img: Pick<Imagen, "puntoFocalX" | "puntoFocalY">): string | undefined {
  const x = img.puntoFocalX;
  const y = img.puntoFocalY;
  if (x == null || y == null) return undefined;
  if (x === 0.5 && y === 0.5) return undefined;
  return `${Math.round(x * 100)}% ${Math.round(y * 100)}%`;
}
