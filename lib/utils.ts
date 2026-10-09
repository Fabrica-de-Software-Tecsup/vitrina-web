/** Extrae las dos primeras iniciales de un nombre completo */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_PALETTE = [
  "bg-brand-500",
  "bg-violet-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

/** Asigna un color consistente segun el nombre */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/** Genera un slug URL-safe a partir de un texto */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug legible + sufijo corto del id, para URLs de perfil */
export function slugConId(nombre: string, id: string): string {
  return `${slugify(nombre)}-${id.slice(0, 6)}`;
}

/** Extrae el sufijo de id de un slug generado con slugConId */
export function extraerIdDeSlug(slug: string): string {
  const partes = slug.split("-");
  return partes[partes.length - 1];
}

/**
 * Devuelve la URL solo si es http(s); cualquier otro esquema (javascript:, data:, ...)
 * se descarta para que nunca llegue a un <a href>.
 */
export function urlSegura(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Fecha corta sin depender del locale del navegador (evita desajustes de hidratacion) */
export function fechaCorta(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatoNumero(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function pluralizar(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

/** Periodo academico actual con el formato de Tecsup (AAAA-1 / AAAA-2) */
export function periodoActual(fecha = new Date()): string {
  return `${fecha.getFullYear()}-${fecha.getMonth() < 7 ? 1 : 2}`;
}

export function cn(...clases: (string | false | null | undefined)[]): string {
  return clases.filter(Boolean).join(" ");
}
