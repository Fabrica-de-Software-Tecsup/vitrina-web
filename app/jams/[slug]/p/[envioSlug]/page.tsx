import type { Metadata } from "next";
import DetalleEnvio from "@/components/jams/DetalleEnvio";
import { envioPorSlug, jamPorSlug } from "@/lib/api-servidor";
import { portadaEnvio } from "@/lib/api-jams";

export const revalidate = 30;

type Params = { params: Promise<{ slug: string; envioSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, envioSlug } = await params;
  const [envio, jam] = await Promise.all([envioPorSlug(slug, envioSlug), jamPorSlug(slug)]);
  if (!envio) return { title: "Proyecto" };
  const titulo = jam ? `${envio.nombre} · ${jam.nombre}` : envio.nombre;
  const descripcion = (envio.frase || envio.descripcion.split("\n")[0]).slice(0, 160);
  const portada = portadaEnvio(envio);
  const url = `/jams/${slug}/p/${envioSlug}`;
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: { title: titulo, description: descripcion, type: "article", url, ...(portada ? { images: [{ url: portada.url }] } : {}) },
    twitter: { card: portada ? "summary_large_image" : "summary", title: titulo, description: descripcion },
  };
}

export default async function EnvioPage({ params }: Params) {
  const { slug, envioSlug } = await params;
  const [envio, jam] = await Promise.all([envioPorSlug(slug, envioSlug), jamPorSlug(slug)]);
  return <DetalleEnvio key={`${slug}/${envioSlug}`} slug={slug} envioSlug={envioSlug} envioInicial={envio} jamInicial={jam} />;
}
