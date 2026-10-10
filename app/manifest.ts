import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vitrina — Proyectos de estudiantes de Tecsup",
    short_name: "Vitrina",
    description: "Portafolio público de proyectos de los estudiantes de Tecsup.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b3c5a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
