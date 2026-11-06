import { permanentRedirect } from "next/navigation";

/** El API enlaza los envíos (CSV, correos) como /jams/<jam>/envios/<envío>; la página vive en /p/. */
export default async function RedirigirEnvio({ params }: { params: Promise<{ slug: string; envioSlug: string }> }) {
  const { slug, envioSlug } = await params;
  permanentRedirect(`/jams/${encodeURIComponent(slug)}/p/${encodeURIComponent(envioSlug)}`);
}
