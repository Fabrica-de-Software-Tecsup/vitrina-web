import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vitrina — Proyectos hechos por estudiantes",
    short_name: "Vitrina",
    description: "Proyectos reales de estudiantes, revisados y publicados por sus docentes.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6F1",
    theme_color: "#FAF6F1",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
