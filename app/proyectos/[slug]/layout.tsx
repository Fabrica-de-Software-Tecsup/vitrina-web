import type { Metadata } from "next";
import { proyectoPorSlug } from "@/lib/api-servidor";

/** Metadatos por proyecto generados en el servidor: titulo, descripcion y Open Graph con la portada. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const fallback: Metadata = { title: "Proyecto" };
  try {
    const p = await proyectoPorSlug(slug);
    if (!p) return fallback;
    const portada = p.imagenes.find((i) => i.esPortada) ?? p.imagenes[0];
    const descripcion = (p.tagline ?? p.descripcion ?? "").split("\n")[0].slice(0, 160) || "Proyecto de estudiantes en Vitrina.";
    const titulo = p.carrera ? `${p.nombre} · ${p.carrera.nombre}` : p.nombre;
    return {
      title: titulo,
      description: descripcion,
      keywords: p.tecnologias.map((t) => t.tecnologia.nombre),
      alternates: { canonical: `/proyectos/${slug}` },
      openGraph: { title: titulo, description: descripcion, type: "article", url: `/proyectos/${slug}`, ...(portada ? { images: [{ url: portada.url }] } : {}) },
      twitter: { card: portada ? "summary_large_image" : "summary", title: titulo, description: descripcion },
    };
  } catch {
    return fallback;
  }
}

export default function ProyectoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
