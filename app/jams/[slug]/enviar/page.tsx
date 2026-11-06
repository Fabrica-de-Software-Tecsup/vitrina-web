import type { Metadata } from "next";
import EnviarCliente from "@/components/jams/EnviarCliente";
import { jamPorSlug } from "@/lib/api-servidor";

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Pick<Params, "params">): Promise<Metadata> {
  const { slug } = await params;
  const jam = await jamPorSlug(slug);
  return { title: jam ? `Subir proyecto · ${jam.nombre}` : "Subir proyecto", robots: { index: false } };
}

/** Subir el proyecto. El QR del evento puede traer el código (?codigo=): se rellena solo. */
export default async function EnviarPage({ params, searchParams }: Params) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const jam = await jamPorSlug(slug);
  const codigo = Array.isArray(sp.codigo) ? sp.codigo[0] : sp.codigo;
  return <EnviarCliente slug={slug} jamInicial={jam} codigoInicial={(codigo ?? "").slice(0, 80)} />;
}
