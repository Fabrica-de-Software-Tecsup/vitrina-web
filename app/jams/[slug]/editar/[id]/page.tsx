import type { Metadata } from "next";
import EditarCliente from "@/components/jams/EditarCliente";
import { jamPorSlug } from "@/lib/api-servidor";

type Params = { params: Promise<{ slug: string; id: string }> };

/** Enlace privado: nunca en buscadores ni con la URL completa como referente. */
export const metadata: Metadata = { title: "Editar proyecto", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function EditarEnvioPage({ params }: Params) {
  const { slug, id } = await params;
  const jam = await jamPorSlug(slug);
  return <EditarCliente slug={slug} id={id} jamInicial={jam} />;
}
