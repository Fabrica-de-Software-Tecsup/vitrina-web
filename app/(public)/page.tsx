"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import PillFilter from "@/components/ui/PillFilter";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/mock-data";

type ProjectFilter = "all" | "other";

const communityMembers = [
  "María Mamani",
  "Diego Huamán",
  "Valeria Cáceres",
  "Raúl Paredes",
];

function CommunityCard() {
  return (
    <div className="mx-auto w-full max-w-[250px] rounded-2xl border border-white/15 bg-white/10 p-5 text-left shadow-2xl backdrop-blur-md">
      <div className="flex -space-x-3">
        {communityMembers.map((member) => (
          <Avatar
            key={member}
            name={member}
            size="md"
            className="ring-2 ring-[#0c2240]"
          />
        ))}
      </div>

      <p className="mt-4 text-sm font-semibold text-white">
        Talento que transforma
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-300">
        Proyectos creados por estudiantes que convierten ideas en soluciones
        reales.
      </p>

      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-tecsup-green" />
        <span className="text-xs font-medium text-slate-200">
          Comunidad activa
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [activeFilter, setActiveFilter] =
    useState<ProjectFilter>("all");

  const [search, setSearch] = useState("");

  const { featuredProjects, recentProjects } = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const applyFilters = (items: typeof projects) =>
      items.filter((project) => {
        const matchesCategory =
          activeFilter === "all" ||
          project.category.toLowerCase() !== "daw";

        const searchableContent = [
          project.name,
          project.course,
          project.cycle,
          project.category,
          project.description,
          ...project.technologies,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          normalizedSearch.length === 0 ||
          searchableContent.includes(normalizedSearch);

        return matchesCategory && matchesSearch;
      });

    return {
      featuredProjects: applyFilters(projects.slice(0, 4)),
      recentProjects: applyFilters(projects.slice(-4)),
    };
  }, [activeFilter, search]);

  const hasResults =
    featuredProjects.length > 0 || recentProjects.length > 0;

  return (
    <div className="bg-tecsup-gray">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071422] via-[#0c2240] to-[#091a30]">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-tecsup-cyan/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-tecsup-purple/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-32">
          <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 lg:block">
            <CommunityCard />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-tecsup-cyan sm:text-sm">
              Vitrina de proyectos Tecsup
            </p>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              TE PASO PROYECTOS QUE{" "}
              <span className="bg-gradient-to-r from-tecsup-cyan to-tecsup-purple bg-clip-text text-transparent">
                FUTURO
              </span>
            </h1>

            <p className="mt-6 text-sm font-semibold tracking-[0.22em] text-slate-300 sm:text-base">
              CREAMOS HOY, LIDERAMOS MAÑANA
            </p>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Descubre soluciones digitales desarrolladas por estudiantes que
              están preparados para transformar el mundo.
            </p>
          </div>

          <div className="mt-10 lg:hidden">
            <CommunityCard />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div className="flex flex-col gap-5 border-b border-gray-200 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <PillFilter
                active={activeFilter === "all"}
                onClick={() => setActiveFilter("all")}
              >
                Todos
              </PillFilter>

              <PillFilter
                active={activeFilter === "other"}
                onClick={() => setActiveFilter("other")}
              >
                Otros
              </PillFilter>
            </div>

            <p className="text-sm text-gray-500">
              <span className="font-semibold text-tecsup-dark">124</span>{" "}
              proyectos creados por estudiantes
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar proyectos..."
              aria-label="Buscar proyectos"
              className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-5 text-sm text-tecsup-dark outline-none transition placeholder:text-gray-400 focus:border-tecsup-cyan focus:ring-4 focus:ring-tecsup-cyan/10"
            />
          </div>
        </div>

        {hasResults ? (
          <>
            <section className="pt-10">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-cyan">
                  Selección especial
                </p>
                <h2 className="mt-2 text-2xl font-bold text-tecsup-dark">
                  Destacados
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>

            <section className="pt-16">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-tecsup-purple">
                  Nuevas propuestas
                </p>
                <h2 className="mt-2 text-2xl font-bold text-tecsup-dark">
                  Recientes
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="py-24 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-bold text-tecsup-dark">
              No encontramos proyectos
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Prueba con otra palabra o cambia el filtro seleccionado.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}