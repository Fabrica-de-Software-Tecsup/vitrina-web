"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import ProjectCard from "@/components/ui/ProjectCard";
import SkillBar from "@/components/ui/SkillBar";
import { projects } from "@/lib/mock-data";

type ProjectOrder = "featured" | "recent";

const profile = {
  name: "María Mamani",
  career: "Diseño y Desarrollo de Software",
  location: "Arequipa, Perú",
  description:
    "Desarrolladora frontend enfocada en crear experiencias digitales accesibles, intuitivas y orientadas a resolver problemas reales.",
};

const socialLinks = [
  {
    label: "LinkedIn",
    abbreviation: "in",
    href: "#",
  },
  {
    label: "GitHub",
    abbreviation: "GH",
    href: "#",
  },
  {
    label: "Portafolio",
    abbreviation: "↗",
    href: "#",
  },
];

const skills = [
  {
    name: "React",
    projects: 8,
    percentage: 92,
  },
  {
    name: "TypeScript",
    projects: 7,
    percentage: 86,
  },
  {
    name: "Next.js",
    projects: 6,
    percentage: 78,
  },
  {
    name: "Diseño UI/UX",
    projects: 5,
    percentage: 70,
  },
];

export default function ProfilePage() {
  const [projectOrder, setProjectOrder] =
    useState<ProjectOrder>("featured");

  const visibleProjects = useMemo(() => {
    const selectedProjects = projects.slice(0, 4);

    if (projectOrder === "recent") {
      return [...selectedProjects].reverse();
    }

    return selectedProjects;
  }, [projectOrder]);

  async function handleShareProfile() {
    const shareData = {
      title: `Perfil de ${profile.name}`,
      text: `Conoce los proyectos de ${profile.name} en Vitrina.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      window.alert("El enlace del perfil fue copiado.");
    } catch {
      // El usuario puede cancelar el diálogo de compartir.
    }
  }

  function handleDownloadCV() {
    window.alert("El CV estará disponible próximamente.");
  }

  return (
    <main className="min-h-screen bg-tecsup-gray">
      <section className="relative">
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#111827] via-[#303846] to-[#171c27] sm:h-64">
          <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-tecsup-cyan/20 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-tecsup-purple/20 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <div className="relative -mt-12 rounded-2xl border border-gray-200 bg-white px-6 pb-7 pt-16 shadow-sm sm:-mt-14 sm:px-8 sm:pt-20">
            <Avatar
              name={profile.name}
              size="xl"
              className="absolute -top-12 left-6 border-4 border-white shadow-lg sm:-top-14 sm:left-8"
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-tecsup-dark sm:text-4xl">
                  {profile.name}
                </h1>

                <p className="mt-2 font-medium text-gray-600">
                  {profile.career}
                </p>

                <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <span aria-hidden="true">📍</span>
                  {profile.location}
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
                  {profile.description}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      title={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-600 transition hover:border-tecsup-cyan hover:bg-tecsup-cyan/10 hover:text-tecsup-cyan"
                    >
                      {social.abbreviation}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleShareProfile}
                  className="rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-tecsup-dark transition hover:bg-gray-50"
                >
                  Compartir perfil
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCV}
                  className="rounded-full bg-tecsup-dark px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-tecsup-dark/85"
                >
                  Descargar CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-3 lg:py-14">
        <section className="lg:col-span-2">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-cyan">
                Portafolio académico
              </p>

              <h2 className="mt-2 text-2xl font-bold text-tecsup-dark">
                Proyectos (12)
              </h2>
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-500">
              <span className="sr-only">Ordenar proyectos</span>

              <select
                value={projectOrder}
                onChange={(event) =>
                  setProjectOrder(event.target.value as ProjectOrder)
                }
                className="rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-tecsup-dark outline-none transition focus:border-tecsup-cyan focus:ring-4 focus:ring-tecsup-cyan/10"
              >
                <option value="featured">Destacados primero</option>
                <option value="recent">Más recientes</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-purple">
              Progreso profesional
            </p>

            <h2 className="mt-2 text-xl font-bold text-tecsup-dark">
              Mapa de crecimiento
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Visualización de las habilidades desarrolladas mediante sus
              proyectos académicos y colaborativos.
            </p>

            <div className="mt-6 flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  ◇
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-600">
                  Gráfico radar
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Habilidades y competencias
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-cyan">
              Experiencia técnica
            </p>

            <h2 className="mt-2 text-xl font-bold text-tecsup-dark">
              Tecnologías dominadas
            </h2>

            <div className="mt-6 space-y-6">
              {skills.map((skill) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  projects={skill.projects}
                  percentage={skill.percentage}
                />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}