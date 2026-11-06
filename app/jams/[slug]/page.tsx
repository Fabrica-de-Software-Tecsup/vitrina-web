import type { Metadata } from "next";
import PaginaJam from "@/components/jams/PaginaJam";
import { enviosDeJam, jamPorSlug } from "@/lib/api-servidor";
import { portadaEnvio } from "@/lib/api-jams";

/** Durante el evento entran proyectos cada pocos minutos: la página se regenera como mucho cada 30 s. */
export const revalidate = 30;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [jam, envios] = await Promise.all([jamPorSlug(slug), enviosDeJam(slug)]);
  if (!jam) return { title: "Jam" };
  const descripcion = (jam.lema ?? jam.descripcion ?? `Proyectos de ${jam.nombre} en Vitrina.`).split("\n")[0].slice(0, 160);
  const imagen = envios?.map(portadaEnvio).find(Boolean);
  return {
    title: jam.nombre,
    description: descripcion,
    alternates: { canonical: `/jams/${slug}` },
    openGraph: { title: jam.nombre, description: descripcion, url: `/jams/${slug}`, ...(imagen ? { images: [{ url: imagen.url }] } : {}) },
    twitter: { card: imagen ? "summary_large_image" : "summary", title: jam.nombre, description: descripcion },
  };
}

export default async function JamPage({ params }: Params) {
  const { slug } = await params;
  const [jam, envios] = await Promise.all([jamPorSlug(slug), enviosDeJam(slug)]);
  // La fase exacta (y la cuenta atrás) la pone el reloj del navegador al hidratar.
  const faseInicial = jam?.abierta ? "abierta" : "cerrada";
  return <PaginaJam key={slug} slug={slug} jamInicial={jam} enviosIniciales={envios} faseInicial={faseInicial} />;
}
