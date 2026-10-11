import DetalleProyecto from "@/components/proyectos/DetalleProyecto";
import { proyectoPorSlug } from "@/lib/api-servidor";
import type { Proyecto } from "@/lib/tipos";

/**
 * Detalle público. El proyecto publicado se resuelve en el servidor (misma petición que los metadatos,
 * cacheada 5 minutos y etiquetada `proyecto:<slug>`) para que la cabecera llegue en el mismo commit de la navegación y la lámina de
 * Explorar se transforme en esta portada. Los borradores (con sesión) se piden desde el navegador.
 */
async function proyectoPublico(slug: string): Promise<Proyecto | null> {
  const p = await proyectoPorSlug(slug);
  return p?.estado === "PUBLICADO" ? p : null;
}

export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inicial = await proyectoPublico(slug);
  return <DetalleProyecto key={slug} slug={slug} inicial={inicial} />;
}
