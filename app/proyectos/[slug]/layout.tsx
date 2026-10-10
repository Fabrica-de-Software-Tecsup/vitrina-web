import type { Metadata } from "next";

/** Metadatos por proyecto generados en el servidor: titulo, descripcion y Open Graph con la portada. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const apiUrl = process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL;
  const fallback: Metadata = { title: "Proyecto" };
  if (!apiUrl) return fallback;
  try {
    const res = await fetch(`${apiUrl}/proyectos/slug/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
    if (!res.ok) return fallback;
    const p = (await res.json()) as {
      nombre: string;
      tagline: string | null;
      descripcion: string | null;
      imagenes: { url: string; esPortada: boolean }[];
      tecnologias: { tecnologia: { nombre: string } }[];
      carrera: { nombre: string } | null;
    };
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
