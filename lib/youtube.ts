/**
 * Convierte cualquier formato de URL de YouTube (watch, youtu.be, embed)
 * a la URL de embed correcta. Retorna null si no reconoce el formato.
 */
export function obtenerUrlEmbedYoutube(url: string | null | undefined): string | null {
  if (!url) return null;

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null;
}