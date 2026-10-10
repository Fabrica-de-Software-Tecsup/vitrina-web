import type { Metadata } from "next";

export const metadata: Metadata = { title: "Carreras", alternates: { canonical: "/carreras" } };

export default function CarrerasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
