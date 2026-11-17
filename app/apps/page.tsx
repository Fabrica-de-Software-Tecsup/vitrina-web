import type { Metadata } from "next";
import SeccionApps from "@/components/apps/SeccionApps";

const descripcion = "Descarga Vitrina para Android y Android XR (Google Play) o Vitrina Estudiantil para iPhone (App Store).";

export const metadata: Metadata = {
  title: "Apps móviles",
  description: descripcion,
  alternates: { canonical: "/apps" },
  openGraph: {
    title: "Apps móviles — Vitrina",
    description: descripcion,
    url: "/apps",
  },
};

export default function AppsPage() {
  return <SeccionApps modo="pagina" />;
}
