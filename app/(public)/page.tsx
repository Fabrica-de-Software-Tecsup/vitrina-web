"use client";

import { useState } from "react";
import ProjectCard from "@/components/ui/ProjectCard";
import PillFilter from "@/components/ui/PillFilter";
import Badge from "@/components/ui/Badge";
import { featuredProjects, recentProjects } from "@/lib/mock-data";

export default function LandingPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  /** Filtra Ocultos y aplica búsqueda */
  const filterPublic = (list: typeof featuredProjects) =>
    list
      .filter((p) => p.status !== "Oculto")
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden h-[70vh] min-h-[100px]">
        <img
          src="/images/hero-landing.png"
          alt="Hero Vitrina"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-[290px] shrink-0 order-2 lg:order-1 lg:-translate-x-[45%]">
            <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl p-6 border border-white/[0.15] shadow-2xl">
              <Badge
                variant="daw"
                className="mb-4 !bg-[#1B76FF]/15 !text-[#1B76FF]"
              >
                Carreras Profesionales
              </Badge>
              <p className="text-white/90 text-2xl leading-relaxed">
                El proyecto de nuestros estudiantes a la{" "}
                <span className="text-[#2DB5FF] font-bold">vista de todos</span>
                .
              </p>
              <p className="text-white/70 text-sm leading-relaxed mt-2">
                Ideas que crean soluciones que construyen el mañana.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["Maria Mamani", "Diego Huamán", "Valeria Cáceres"].map(
                    (name) => (
                      <div
                        key={name}
                        className="w-8 h-8 rounded-full bg-tecsup-cyan/50 border-2 border-white/20 flex items-center justify-center text-[10px] text-white font-bold"
                      >
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    ),
                  )}
                </div>
                <span className="text-white/50 text-xs">+86 estudiantes</span>
              </div>

              <a
                href="/auth/login"
                className="mt-5 w-full flex items-center justify-center px-5 py-2.5 bg-[#1B76FF] text-white text-sm font-semibold rounded-full hover:bg-[#1B76FF]/85 transition-colors shadow-md"
              >
                Regístrate aquí
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FILTROS ═══════════════ */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <PillFilter
                active={activeFilter === "Todos"}
                onClick={() => setActiveFilter("Todos")}
              >
                Todos
              </PillFilter>
              <PillFilter
                active={activeFilter === "Otros"}
                onClick={() => setActiveFilter("Otros")}
              >
                Otros
              </PillFilter>
            </div>

            <p className="text-xs text-gray-400 font-medium hidden sm:block">
              124 proyectos · 86 estudiantes · 18 cursos · 6 ciclos documentados
            </p>

            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar proyecto..."
                className="pl-9 pr-4 py-2 text-sm bg-tecsup-gray rounded-full border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none w-64"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium text-center mt-2 sm:hidden">
            124 proyectos · 86 estudiantes · 18 cursos · 6 ciclos documentados
          </p>
        </div>
      </section>

      {/* ═══════════════ CONTENIDO ═══════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm">★</span>
            <h2 className="text-lg font-bold text-tecsup-dark">
              Destacados del ciclo
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filterPublic(featuredProjects).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-tecsup-dark mb-6">Recientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filterPublic(recentProjects).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
