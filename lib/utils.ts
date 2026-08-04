/** Extrae las dos primeras iniciales de un nombre */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Paleta de colores para los avatares del equipo */
const AVATAR_PALETTE = [
  "bg-tecsup-cyan",
  "bg-tecsup-purple",
  "bg-tecsup-green",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];

/** Asigna un color consistente según el nombre */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}