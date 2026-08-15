"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import {
  projects as mockProjects,
  slugify,
  type Project,
} from "@/lib/mock-data";
import { applyOverrides, useOverridesVersion } from "@/lib/project-overrides";

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const SHORT_COURSE: Record<string, string> = {
  "Desarrollo de Aplicaciones Web": "Desarrollo Web",
  "Internet de las Cosas": "Internet de las Cosas",
  "Inteligencia Artificial": "Inteligencia Artificial",
  "Redes y Comunicaciones": "Redes y Comunicaciones",
};

/** Usuario "logueado" en el prototipo — debe coincidir EXACTO con mock-data.ts */
const STUDENT_NAME = "Maria Mamani Quispe";

type ProjectRow = {
  id: string;
  name: string;
  fullName: string;
  course: string;
  status: Project["status"];
  views: number;
  shares: number;
  technologies: string[];
  cycle: string;
  team: Project["team"];
  image: string;
};

const studentTabs = [
  { name: "Todos", status: "all" },
  { name: "Publicados", status: "Publicado" },
  { name: "Borradores", status: "En Desarrollo" },
  { name: "Ocultos", status: "Oculto" },
];

const teacherTabs = [
  { name: "Todos", status: "all" },
  { name: "Publicados", status: "Publicado" },
  { name: "Por Revisar", status: "Por Revisar" },
  { name: "En Desarrollo", status: "En Desarrollo" },
];

const teacherStats = [
  { value: "12", label: "proyectos documentados", icon: "📁" },
  { value: "2,928", label: "vistas acumuladas", icon: "👁️" },
  { value: "38", label: "veces compartido", icon: "🔗" },
  { value: "6", label: "tecnologías dominadas", icon: "⚡" },
];

export default function DashboardPage() {
  const [isTeacherView, setIsTeacherView] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [enableProject, setEnableProject] = useState(null as ProjectRow | null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const overridesVersion = useOverridesVersion();

  const allProjects: ProjectRow[] = useMemo(() => {
    const base = mockProjects.map((p) => ({
      id: p.id,
      name: p.name.split(" — ")[0],
      fullName: p.name,
      course: SHORT_COURSE[p.course] ?? p.course,
      status: p.status,
      views: p.views,
      shares: p.shares,
      technologies: p.technologies,
      cycle: p.cycle,
      team: p.team,
      image: p.images[0],
    }));
    return applyOverrides(base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overridesVersion]);

  const visibleProjects = useMemo(() => {
    if (isTeacherView) return allProjects;
    return allProjects.filter((p) =>
      p.team.some((m) => m.name === STUDENT_NAME),
    );
  }, [isTeacherView, allProjects]);

  const currentTabs = isTeacherView ? teacherTabs : studentTabs;
  const filteredProjects =
    activeTab === "all"
      ? visibleProjects
      : visibleProjects.filter((p) => p.status === activeTab);

  const counts = {
    all: visibleProjects.length,
    Publicado: visibleProjects.filter((p) => p.status === "Publicado").length,
    "En Desarrollo": visibleProjects.filter((p) => p.status === "En Desarrollo")
      .length,
    Oculto: visibleProjects.filter((p) => p.status === "Oculto").length,
    "Por Revisar": visibleProjects.filter((p) => p.status === "Por Revisar")
      .length,
  };

  const studentStats = useMemo(() => {
    if (isTeacherView) return null;
    const totalViews = visibleProjects.reduce((s, p) => s + p.views, 0);
    const totalShares = visibleProjects.reduce((s, p) => s + p.shares, 0);
    const techSet = new Set<string>();
    visibleProjects.forEach((p) =>
      p.technologies.forEach((t) => techSet.add(t)),
    );
    return [
      {
        value: String(visibleProjects.length),
        label: "proyectos documentados",
        icon: "📁",
      },
      {
        value: formatNumber(totalViews),
        label: "vistas acumuladas",
        icon: "👁️",
      },
      {
        value: formatNumber(totalShares),
        label: "veces compartido",
        icon: "🔗",
      },
      {
        value: String(techSet.size),
        label: "tecnologías dominadas",
        icon: "⚡",
      },
    ];
  }, [isTeacherView, visibleProjects]);

  const stats = studentStats ?? teacherStats;

  const openEnableModal = (project: ProjectRow) => {
    setOpenMenuId(null);
    setEnableProject(project);
    setStartDate("");
    setEndDate("");
    setShowEnableModal(true);
  };

  const confirmEnable = () => {
    setShowEnableModal(false);
    setEnableProject(null);
  };

  return (
    <div className="bg-tecsup-gray min-h-full flex flex-col">
      <Header role={isTeacherView ? "teacher" : "student"} />

      {/* Modal Habilitar */}
      {showEnableModal && enableProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowEnableModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="w-14 h-14 bg-tecsup-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-tecsup-cyan"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-tecsup-dark text-center mb-1">
              Habilitar proyecto
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {enableProject.name}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                  className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEnableModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmEnable}
                disabled={!startDate || !endDate}
                className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${startDate && endDate ? "bg-tecsup-cyan text-white hover:bg-tecsup-cyan/85" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Toggle Prototipo */}
          <div className="mb-6 p-3 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Modo Prototipo
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTeacherView(false)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${!isTeacherView ? "bg-tecsup-cyan text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Alumno
              </button>
              <button
                onClick={() => setIsTeacherView(true)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${isTeacherView ? "bg-tecsup-purple text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                Docente
              </button>
            </div>
          </div>

          {/* Banner de contexto */}
          {isTeacherView ? (
            <div className="bg-tecsup-purple/5 border border-tecsup-purple/15 rounded-xl p-4 mb-8 flex items-start gap-3">
              <span className="text-lg mt-0.5">ℹ️</span>
              <div>
                <p className="text-sm font-semibold text-tecsup-purple">
                  Gestión de proyectos — Ciclo 2026-I
                </p>
                <p className="text-xs text-tecsup-purple/70 mt-0.5">
                  Puedes aperturar, habilitar o evaluar las entregas de los
                  estudiantes.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
              <span className="text-lg mt-0.5">🟠</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Ventana de edición abierta hasta el 15/08/2026 a las 11:59 PM
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Después de esta fecha, tus proyectos del ciclo pasarán a solo
                  lectura.
                </p>
              </div>
            </div>
          )}

          {/* Saludo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-tecsup-dark">
              {isTeacherView ? "Panel de Gestión" : "Hola, María 👋"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isTeacherView ? (
                "Administra y evalúa los proyectos de tus cursos."
              ) : (
                <>
                  Tienes{" "}
                  <span className="font-semibold text-amber-600">
                    {counts["En Desarrollo"]} borradores sin publicar
                  </span>
                  . ¡Completa la información!
                </>
              )}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {currentTabs.map((tab) => (
              <button
                key={tab.status}
                onClick={() => setActiveTab(tab.status)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${activeTab === tab.status ? "bg-tecsup-dark text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:text-tecsup-dark"}`}
              >
                {tab.name}
                <span
                  className={`ml-1.5 text-xs ${activeTab === tab.status ? "text-white/60" : "text-gray-400"}`}
                >
                  ({counts[tab.status as keyof typeof counts] ?? 0})
                </span>
              </button>
            ))}
          </div>

          {/* Tabla de proyectos */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">Proyecto</div>
              <div className="col-span-3">Curso</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1 text-right">Vistas</div>
              <div className="col-span-2 text-right">Acciones</div>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-gray-400 text-sm">
                  No hay proyectos en esta categoría.
                </p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-50 hover:bg-tecsup-gray/50 transition-colors items-center"
                >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-tecsup-dark truncate">
                        {project.name}
                      </p>
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                        <span className="flex -space-x-1.5">
                          {project.team.slice(0, 3).map((m) => (
                            <Avatar key={m.name} name={m.name} size="sm" />
                          ))}
                        </span>
                        {project.team.length} integrantes · Ciclo{" "}
                        {project.cycle}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-gray-600">{project.course}</p>
                  </div>
                  <div className="col-span-2">
                    <Badge variant={project.status}>{project.status}</Badge>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className="text-sm font-medium text-gray-600">
                      {project.views > 0 ? formatNumber(project.views) : "—"}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-2">
                    {isTeacherView ? (
                      <>
                        {project.status === "Por Revisar" && (
                          <Link
                            href={"/dashboard/revision/" + project.id}
                            className="text-tecsup-cyan hover:text-tecsup-cyan/80 font-medium text-sm"
                          >
                            Ver
                          </Link>
                        )}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === project.id ? null : project.id,
                              )
                            }
                            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          {openMenuId === project.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-44">
                                <button
                                  onClick={() => openEnableModal(project)}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                >
                                  <svg
                                    className="w-4 h-4 text-tecsup-cyan"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Habilitar
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </>
                    ) : project.status === "Publicado" ? (
                      <Link
                        href={"/proyectos/" + slugify(project.fullName)}
                        className="text-tecsup-cyan hover:text-tecsup-cyan/80 font-medium text-sm"
                      >
                        Ver
                      </Link>
                    ) : project.status === "Por Revisar" ? (
                      <Link
                        href={"/proyectos/" + slugify(project.fullName)}
                        className="text-tecsup-cyan hover:text-tecsup-cyan/80 font-medium text-sm"
                      >
                        Ver
                      </Link>
                    ) : project.status === "En Desarrollo" ? (
                      <Link
                        href={"/dashboard/editar-proyecto/" + project.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-tecsup-cyan hover:bg-tecsup-cyan/10 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Editar
                      </Link>
                    ) : project.status === "Oculto" ? (
                      <Link
                        href={"/proyectos/" + slugify(project.fullName)}
                        className="text-tecsup-cyan hover:text-tecsup-cyan/80 font-medium text-sm"
                      >
                        Ver
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <p className="text-xl font-bold text-tecsup-dark">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
