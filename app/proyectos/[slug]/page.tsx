"use client";

import { useState } from "react";
import Image, { type ImageLoaderProps } from "next/image";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

function picsumLoader({ src, width }: ImageLoaderProps) {
  const seedMatch = src.match(/\/seed\/([^/]+)\//);
  const seed = seedMatch?.[1] ?? "qhatu";
  const height = Math.round(width * 0.5625);

  return `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
}

const project = {
  name: "Qhatu",
  subtitle: "Marketplace de productores locales",
  course: "Desarrollo de Aplicaciones Web",
  cycle: "2026-I",
  status: "Publicado" as const,
  views: 1245,
  shares: 38,
  description:
    'Qhatu, que significa “mercado” en quechua, conecta a productores agrícolas de la campiña arequipeña con compradores urbanos sin intermediarios. Los productores pueden publicar su oferta semanal desde un celular y los compradores arman sus pedidos con entregas programadas.',
  secondDescription:
    "La plataforma busca impulsar el comercio justo, mejorar los ingresos de los productores y acercar alimentos frescos a las familias de la ciudad mediante una experiencia digital sencilla y accesible.",
  team: [
    {
      name: "Diego Mamani Q.",
      role: "Backend y despliegue",
    },
    {
      name: "Valeria Ccama H.",
      role: "Frontend y UI",
    },
    {
      name: "José Apaza T.",
      role: "QA y documentación",
    },
  ],
  technologies: ["React", "TypeScript", "NestJS", "PostgreSQL", "Docker"],
  images: ["qhatu-main", "qhatu-1", "qhatu-2", "qhatu-3"],
};

const projectLinks = [
  {
    emoji: "💻",
    label: "Repositorio en GitHub",
    href: "#",
  },
  {
    emoji: "🌐",
    label: "Demo en vivo",
    href: "#",
  },
  {
    emoji: "🎨",
    label: "Prototipo en Figma",
    href: "#",
  },
  {
    emoji: "📄",
    label: "Documentación técnica",
    href: "#",
  },
];

export default function ProjectDetailPage() {
  const [copied, setCopied] = useState(false);

  function handleLinkedInShare() {
    const currentUrl = encodeURIComponent(window.location.href);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;

    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-tecsup-gray">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-sm text-gray-500"
        >
          <Link href="/" className="transition hover:text-tecsup-cyan">
            Inicio
          </Link>

          <span aria-hidden="true">/</span>

          <Link href="/" className="transition hover:text-tecsup-cyan">
            Proyectos
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-gray-700">{project.name}</span>
        </nav>

        <section className="mb-8 flex flex-col gap-6 border-b border-gray-200 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="daw">Web</Badge>
              <Badge variant={project.status}>{project.status}</Badge>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-tecsup-dark sm:text-5xl">
              {project.name}
            </h1>

            <p className="mt-2 text-lg text-gray-500">{project.subtitle}</p>

            <div className="mt-5 flex flex-wrap gap-x-2 gap-y-2 text-sm text-gray-500">
              <span>{project.course}</span>
              <span aria-hidden="true">·</span>
              <span>Ciclo {project.cycle}</span>
              <span aria-hidden="true">·</span>
              <span>{project.views.toLocaleString("es-PE")} vistas</span>
              <span aria-hidden="true">·</span>
              <span>{project.shares} veces compartido</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="accent"
              className="w-full sm:w-auto"
              onClick={handleLinkedInShare}
            >
              Compartir LinkedIn
            </Button>

            <Button
              variant="outline"
              className="w-full bg-white sm:w-auto"
              onClick={handleCopyLink}
            >
              {copied ? "Enlace copiado" : "Copiar enlace"}
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <section className="space-y-8 lg:col-span-2">
            <div>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-200 shadow-sm">
                <Image
                  loader={picsumLoader}
                  src={`https://picsum.photos/seed/${project.images[0]}/1280/720.jpg`}
                  alt={`Vista principal de ${project.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 sm:gap-4">
                {project.images.map((seed, index) => (
                  <button
                    key={seed}
                    type="button"
                    aria-label={`Ver imagen ${index + 1} del proyecto`}
                    className={`relative aspect-square overflow-hidden rounded-xl bg-gray-200 transition hover:opacity-90 ${
                      index === 0
                        ? "border-2 border-tecsup-cyan"
                        : "border-2 border-transparent"
                    }`}
                  >
                    <Image
                      loader={picsumLoader}
                      src={`https://picsum.photos/seed/${seed}/320/320.jpg`}
                      alt={`Miniatura ${index + 1} del proyecto ${project.name}`}
                      fill
                      sizes="(max-width: 640px) 25vw, 160px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-cyan">
                Conoce la propuesta
              </p>

              <h2 className="mt-2 text-2xl font-bold text-tecsup-dark">
                Sobre el proyecto
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
                <p>{project.description}</p>
                <p>{project.secondDescription}</p>
              </div>
            </article>

            <section>
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#151c28] to-[#252f40] shadow-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,179,224,0.16),transparent_60%)]" />

                <button
                  type="button"
                  aria-label="Reproducir video del proyecto"
                  className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-4xl text-white shadow-2xl backdrop-blur transition hover:scale-105 hover:bg-white/20"
                >
                  ▶
                </button>

                <div className="absolute bottom-6 left-6">
                  <p className="text-sm font-semibold text-white">
                    Presentación del proyecto
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Duración aproximada: 3 minutos
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Alcance del proyecto</p>
                  <p className="mt-2 text-2xl font-black text-tecsup-dark">
                    120+
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Productores potencialmente beneficiados
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-gray-500">Validación inicial</p>
                  <p className="mt-2 text-2xl font-black text-tecsup-dark">
                    92%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    De usuarios valoraron positivamente la solución
                  </p>
                </div>
              </div>
            </section>
          </section>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <section>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-purple">
                Colaboradores
              </p>

              <h2 className="mt-2 text-xl font-bold text-tecsup-dark">
                Equipo
              </h2>

              <div className="mt-5 space-y-4">
                {project.team.map((member) => (
                  <div key={member.name} className="flex items-center gap-3">
                    <Avatar name={member.name} size="md" />

                    <div>
                      <p className="text-sm font-semibold text-tecsup-dark">
                        {member.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="my-6 border-gray-200" />

            <section>
              <h2 className="text-base font-bold text-tecsup-dark">
                Tecnologías
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </section>

            <hr className="my-6 border-gray-200" />

            <section>
              <h2 className="text-base font-bold text-tecsup-dark">Enlaces</h2>

              <ul className="mt-4 space-y-3">
                {projectLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-tecsup-gray hover:text-tecsup-cyan"
                    >
                      <span className="flex items-center gap-3">
                        <span aria-hidden="true">{link.emoji}</span>
                        {link.label}
                      </span>

                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <button
              type="button"
              className="mt-7 w-full rounded-xl bg-tecsup-dark px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-tecsup-dark/85"
            >
              Descargar compilado (.zip · 24 MB)
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}