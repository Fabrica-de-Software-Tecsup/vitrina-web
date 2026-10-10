import DetalleProyecto from "@/components/proyectos/DetalleProyecto";
import type { Proyecto } from "@/lib/tipos";

/**
 * Detalle público. El proyecto publicado se resuelve en el servidor (misma petición que los metadatos,
 * cacheada 5 minutos) para que la cabecera llegue en el mismo commit de la navegación y la lámina de
 * Explorar se transforme en esta portada. Los borradores (con sesión) se piden desde el navegador.
 */
async function proyectoPublico(slug: string): Promise<Proyecto | null> {
  const apiUrl = process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  try {
    const res = await fetch(`${apiUrl}/proyectos/slug/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const p = (await res.json()) as Proyecto;
    return p.estado === "PUBLICADO" ? p : null;
  } catch {
    return null;
  }
}

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inicial = await proyectoPublico(slug);
  return <DetalleProyecto key={slug} slug={slug} inicial={inicial} />;
}
