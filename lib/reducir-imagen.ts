/**
 * Reduce una imagen en el navegador antes de subirla: lado mayor de 2.000 px y WebP de calidad 0,82.
 * Conserva PNG si el original tiene transparencia, y deja tal cual los GIF (pueden ser animados).
 * Si el resultado pesa más que el original, sube el original.
 */
const LADO_MAX = 2000;
const CALIDAD = 0.82;

export interface Reduccion {
  archivo: File;
  antes: number;
  despues: number;
}

function lienzo(ancho: number, alto: number): OffscreenCanvas | HTMLCanvasElement {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(ancho, alto);
  const c = document.createElement("canvas");
  c.width = ancho;
  c.height = alto;
  return c;
}

async function aBlob(c: OffscreenCanvas | HTMLCanvasElement, tipo: string, calidad?: number): Promise<Blob | null> {
  if ("convertToBlob" in c) return c.convertToBlob({ type: tipo, quality: calidad });
  return new Promise((r) => (c as HTMLCanvasElement).toBlob(r, tipo, calidad));
}

/** ¿Algún píxel semitransparente? Se mira una versión pequeña para que sea rápido. */
function tieneTransparencia(bitmap: ImageBitmap): boolean {
  const lado = 64;
  const c = lienzo(lado, lado);
  const ctx = c.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  if (!ctx) return false;
  ctx.drawImage(bitmap, 0, 0, lado, lado);
  const datos = ctx.getImageData(0, 0, lado, lado).data;
  for (let i = 3; i < datos.length; i += 4) if (datos[i] < 250) return true;
  return false;
}

export async function reducirImagen(original: File): Promise<Reduccion> {
  const sinCambios = { archivo: original, antes: original.size, despues: original.size };
  if (!original.type.startsWith("image/") || original.type === "image/gif" || typeof createImageBitmap === "undefined") return sinCambios;
  try {
    const bitmap = await createImageBitmap(original, { imageOrientation: "from-image" });
    const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));
    const ancho = Math.round(bitmap.width * escala);
    const alto = Math.round(bitmap.height * escala);
    const conAlfa = original.type === "image/png" && tieneTransparencia(bitmap);
    // Un PNG con transparencia que ya es pequeño se sube tal cual: recodificarlo no ahorraría.
    if (conAlfa && escala === 1) {
      bitmap.close();
      return sinCambios;
    }
    const c = lienzo(ancho, alto);
    const ctx = c.getContext("2d") as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    if (!ctx) return sinCambios;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close();
    const tipo = conAlfa ? "image/png" : "image/webp";
    const blob = await aBlob(c, tipo, conAlfa ? undefined : CALIDAD);
    if (!blob || blob.size >= original.size) return sinCambios;
    const base = original.name.replace(/\.[^.]+$/, "");
    const archivo = new File([blob], `${base}.${conAlfa ? "png" : "webp"}`, { type: tipo, lastModified: Date.now() });
    return { archivo, antes: original.size, despues: archivo.size };
  } catch {
    return sinCambios;
  }
}

/** Peso legible: «6,1 MB», «312 KB». */
export function peso(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
