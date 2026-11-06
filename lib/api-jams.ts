/*
  Jams (hackatones): los equipos no tienen cuenta. Envían con el código de acceso del evento y reciben un token
  privado de edición que solo viaja en la cabecera X-Token-Edicion (nunca en la URL de una petición).
*/
import type { Imagen } from "./tipos";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Jam {
  id: string;
  slug: string;
  nombre: string;
  lema: string | null;
  descripcion: string | null;
  lugar: string | null;
  inicioEn: string;
  cierreEn: string;
  categorias: string[];
  abierta: boolean;
  totalEnvios: number;
}

export interface IntegranteEnvio {
  nombre: string;
  rol?: string | null;
  enlace?: string | null;
}

export interface EnlacesEnvio {
  demo?: string | null;
  repositorio?: string | null;
  video?: string | null;
  presentacion?: string | null;
}

/** Mismo formato que las imágenes de un proyecto (variantes, ThumbHash, color dominante). */
export interface ImagenEnvio {
  id: string;
  url: string;
  ancho?: number | null;
  alto?: number | null;
  colorDominante?: string | null;
  placeholder?: string | null;
  variantes?: Imagen["variantes"];
  orden: number;
}

export interface Envio {
  id: string;
  slug: string;
  nombre: string;
  frase: string;
  descripcion: string;
  equipoNombre: string;
  integrantes: IntegranteEnvio[];
  categoria?: string | null;
  enlaces: EnlacesEnvio;
  reconocimiento?: string | null;
  creadoEn: string;
  actualizadoEn: string;
  imagenes: ImagenEnvio[];
}

export interface EnvioPrivado extends Envio {
  contactoCorreo: string;
}

export interface DatosEnvio {
  nombre: string;
  frase: string;
  descripcion: string;
  equipoNombre: string;
  integrantes: IntegranteEnvio[];
  categoria?: string;
  enlaces?: EnlacesEnvio;
  contactoCorreo: string;
}

export const MAX_IMAGENES = 6;
export const MAX_BYTES_IMAGEN = 5 * 1024 * 1024;
export const MAX_INTEGRANTES = 8;

export const rutaJam = (slug: string) => `/jams/${encodeURIComponent(slug)}`;
export const rutaEnvios = (slug: string) => `${rutaJam(slug)}/envios`;
export const rutaEnvio = (slug: string, envioSlug: string) => `${rutaEnvios(slug)}/${encodeURIComponent(envioSlug)}`;
export const urlQr = (slug: string, destino: "enviar" | "galeria") => `${API_URL}${rutaJam(slug)}/qr.png?destino=${destino}`;

/** Ruta pública del enlace privado de edición. El token va en el fragmento: el navegador nunca lo envía al servidor. */
export const rutaEditar = (slug: string, id: string, token: string) => `/jams/${slug}/editar/${id}#t=${encodeURIComponent(token)}`;

/** Portada de un envío: la imagen de menor orden. */
export function portadaEnvio(e: Pick<Envio, "imagenes">): ImagenEnvio | null {
  if (!e.imagenes?.length) return null;
  return [...e.imagenes].sort((a, b) => a.orden - b.orden)[0];
}

export const imagenesOrdenadas = (e: Pick<Envio, "imagenes">) => [...(e.imagenes ?? [])].sort((a, b) => a.orden - b.orden);

/** La imagen del envío con la forma que esperan Portada y el loader de next/image. */
export const comoImagen = (i: ImagenEnvio): Imagen => ({ ...i, esPortada: false });

/** Reconocimientos primero; el resto conserva el orden del API. */
export function ordenarEnvios(envios: Envio[]): Envio[] {
  return [...envios].sort((a, b) => Number(!!b.reconocimiento) - Number(!!a.reconocimiento));
}

export type FaseJam = "antes" | "abierta" | "cerrada";

/** Fase de la jam: el API dice si acepta envíos; el reloj la da por cerrada en cuanto llega la hora. */
export function faseDe(jam: Pick<Jam, "abierta" | "inicioEn" | "cierreEn">, ahora: number): FaseJam {
  if (ahora >= Date.parse(jam.cierreEn)) return "cerrada";
  if (jam.abierta) return "abierta";
  return ahora < Date.parse(jam.inicioEn) ? "antes" : "cerrada";
}

/* ─── Errores en castellano llano ─── */

const CAMPOS: Record<string, string> = {
  codigo: "el código de acceso",
  nombre: "el nombre del proyecto",
  frase: "la frase",
  descripcion: "la descripción",
  equipoNombre: "el nombre del equipo",
  integrantes: "el equipo",
  categoria: "la categoría",
  enlaces: "los enlaces",
  demo: "el enlace a la demo",
  repositorio: "el enlace al repositorio",
  video: "el enlace al video",
  presentacion: "el enlace a la presentación",
  contactoCorreo: "el correo de contacto",
  rol: "el rol",
  enlace: "el enlace del integrante",
};

function campoDe(ruta: string): string {
  const partes = ruta.split(".");
  const ultimo = partes[partes.length - 1];
  const indice = partes.find((p) => /^\d+$/.test(p));
  const base = CAMPOS[ultimo] ?? ultimo;
  return indice && partes[0] === "integrantes" ? `${base} (integrante ${Number(indice) + 1})` : base;
}

/** Traduce los mensajes por defecto de class-validator; si ya vienen en castellano se dejan tal cual. */
export function traducirValidacion(m: string): string {
  const r = m.match(/^([\w.]+) (.+)$/);
  if (!r) return m;
  const [, ruta, resto] = r;
  const campo = campoDe(ruta);
  const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  let x: RegExpMatchArray | null;
  if ((x = resto.match(/must be shorter than or equal to (\d+) characters/))) return `${mayus(campo)} admite hasta ${x[1]} caracteres.`;
  if ((x = resto.match(/must be longer than or equal to (\d+) characters/))) return `${mayus(campo)} necesita al menos ${x[1]} caracteres.`;
  if (/should not be empty|must be a string|is not allowed to be empty/.test(resto)) return `Falta ${campo}.`;
  if (/must be an email|correo válido/.test(resto)) return "Revisa el correo de contacto: no parece válido.";
  if (/must be a URL|must be an URL|debe ser una URL/.test(resto)) return `${mayus(campo)} debe ser un enlace completo (https://…).`;
  if ((x = resto.match(/must contain (?:at most|no more than) (\d+) elements/))) return `${mayus(campo)} admite hasta ${x[1]} personas.`;
  if ((x = resto.match(/must contain at least (\d+) elements/))) return `${mayus(campo)} necesita al menos ${x[1]} persona.`;
  if (/must be one of|debe ser una de/.test(resto)) return `Elige ${campo} de la lista.`;
  if (/should not exist/.test(resto)) return `Hay un dato que no se esperaba (${ruta}).`;
  return m;
}

export class ErrorJam extends Error {
  constructor(
    mensaje: string,
    readonly status: number,
    readonly detalles: string[] = [],
  ) {
    super(mensaje);
    this.name = "ErrorJam";
  }
}

async function errorDe(res: Response, contexto: "enviar" | "editar" | "imagen" | "leer"): Promise<ErrorJam> {
  const data: unknown = await res.json().catch(() => ({}));
  const crudo = data && typeof data === "object" && "message" in data ? (data as { message: unknown }).message : undefined;
  const lista = Array.isArray(crudo) ? crudo.map(String) : typeof crudo === "string" ? [crudo] : [];
  const s = res.status;
  if (s === 400) {
    const detalles = lista.map(traducirValidacion);
    return new ErrorJam(detalles.length === 1 ? detalles[0] : "Revisa estos datos:", s, detalles.length > 1 ? detalles : []);
  }
  if (s === 401 || (s === 403 && contexto !== "enviar")) {
    const cerrada = lista.some((m) => /cerr[óoa]|closed/i.test(m));
    if (cerrada) return new ErrorJam("Los envíos de esta jam ya cerraron: tu proyecto queda como está.", s);
    return new ErrorJam("Este enlace de edición no es válido. Pide a la organización que te ayude a recuperarlo.", s);
  }
  if (s === 403) {
    const cerrada = lista.some((m) => /cerr[óoa]|closed/i.test(m));
    if (cerrada) return new ErrorJam("Los envíos de esta jam están cerrados.", s);
    return new ErrorJam("El código de acceso no es correcto. Revísalo en la pantalla del evento o pregúntale a la organización.", s);
  }
  if (s === 404) return new ErrorJam(contexto === "leer" ? "No encontramos este proyecto." : "No encontramos esta jam o este proyecto.", s);
  if (s === 409) return new ErrorJam(lista[0] && /[áéíóúñ¿]|\b(el|la|los|las|de)\b/i.test(lista[0]) ? lista[0] : "Esta jam ya llegó al máximo de proyectos. Habla con la organización.", s);
  if (s === 413) return new ErrorJam("La imagen pesa demasiado (máximo 5 MB).", s);
  if (s === 429) return new ErrorJam("Demasiados intentos seguidos. Espera un minuto y vuelve a probar.", s);
  if (s >= 500) return new ErrorJam("El servidor tuvo un problema. Vuelve a intentarlo en unos segundos.", s);
  return new ErrorJam(lista[0] ?? `Error ${s}`, s);
}

async function pedir<T>(ruta: string, init: RequestInit, contexto: Parameters<typeof errorDe>[1]): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${ruta}`, init);
  } catch {
    throw new ErrorJam("No hay conexión con el servidor. Revisa tu internet y vuelve a intentarlo.", 0);
  }
  if (!res.ok) throw await errorDe(res, contexto);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

const conToken = (token: string, extra: HeadersInit = {}): HeadersInit => ({ "X-Token-Edicion": token, ...extra });

export const crearEnvio = (slug: string, datos: DatosEnvio & { codigo: string }) =>
  pedir<{ envio: Envio; tokenEdicion: string }>(rutaEnvios(slug), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) }, "enviar");

export const getEnvioPrivado = (slug: string, id: string, token: string) =>
  pedir<EnvioPrivado>(`${rutaEnvios(slug)}/${encodeURIComponent(id)}/privado`, { headers: conToken(token), cache: "no-store" }, "editar");

export const actualizarEnvio = (slug: string, id: string, token: string, datos: Partial<DatosEnvio>) =>
  pedir<Envio>(`${rutaEnvios(slug)}/${encodeURIComponent(id)}`, { method: "PATCH", headers: conToken(token, { "Content-Type": "application/json" }), body: JSON.stringify(datos) }, "editar");

export const eliminarImagenEnvio = (slug: string, id: string, token: string, imagenId: string) =>
  pedir<void>(`${rutaEnvios(slug)}/${encodeURIComponent(id)}/imagenes/${encodeURIComponent(imagenId)}`, { method: "DELETE", headers: conToken(token) }, "imagen");

/** Sube una imagen con progreso (XHR: fetch todavía no informa del avance de subida). */
export function subirImagenEnvio(slug: string, id: string, token: string, archivo: File, alAvanzar?: (fraccion: number) => void): Promise<ImagenEnvio> {
  return new Promise((resolver, rechazar) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}${rutaEnvios(slug)}/${encodeURIComponent(id)}/imagenes`);
    xhr.setRequestHeader("X-Token-Edicion", token);
    xhr.upload.onprogress = (e) => e.lengthComputable && alAvanzar?.(e.loaded / e.total);
    xhr.onerror = () => rechazar(new ErrorJam("Se cortó la conexión al subir la imagen. Vuelve a intentarlo.", 0));
    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolver(JSON.parse(xhr.responseText) as ImagenEnvio);
        } catch {
          rechazar(new ErrorJam("Respuesta inesperada del servidor.", xhr.status));
        }
        return;
      }
      rechazar(await errorDe(new Response(xhr.responseText || "{}", { status: xhr.status }), "imagen"));
    };
    const fd = new FormData();
    fd.append("archivo", archivo);
    xhr.send(fd);
  });
}

/* ─── Token guardado en este navegador ─── */

const clave = (slug: string) => `vitrina.jam.${slug}`;

export function guardarToken(slug: string, id: string, token: string) {
  try {
    localStorage.setItem(clave(slug), JSON.stringify({ id, token }));
  } catch {
    /* modo privado o almacenamiento bloqueado: el enlace sigue siendo la llave */
  }
}

export function tokenGuardado(slug: string, id?: string): { id: string; token: string } | null {
  try {
    const v = JSON.parse(localStorage.getItem(clave(slug)) ?? "null") as { id?: unknown; token?: unknown } | null;
    if (v && typeof v.id === "string" && typeof v.token === "string" && (!id || v.id === id)) return { id: v.id, token: v.token };
  } catch {
    /* sin acceso */
  }
  return null;
}

/* ─── Fechas en hora de Lima (fija: el servidor y el navegador pintan lo mismo) ─── */

const ZONA = "America/Lima";
const fmtDia = new Intl.DateTimeFormat("es-PE", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" });
const fmtHora = new Intl.DateTimeFormat("es-PE", { timeZone: ZONA, hour: "numeric", minute: "2-digit", hour12: true });

export const diaLima = (iso: string) => fmtDia.format(new Date(iso));
export const horaLima = (iso: string) => fmtHora.format(new Date(iso)).replace(/\s?a\.\s?m\./, " a. m.").replace(/\s?p\.\s?m\./, " p. m.");

/** «sábado 7 de noviembre, 9:00 a. m. – 6:00 p. m.» o con dos días si cambia la fecha. */
export function rangoFechas(inicio: string, cierre: string): string {
  const d1 = diaLima(inicio);
  const d2 = diaLima(cierre);
  if (d1 === d2) return `${d1}, ${horaLima(inicio)} – ${horaLima(cierre)}`;
  return `${d1}, ${horaLima(inicio)} – ${d2}, ${horaLima(cierre)}`;
}
