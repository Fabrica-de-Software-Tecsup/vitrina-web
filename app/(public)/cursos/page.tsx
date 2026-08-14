"use client";

import { useMemo, useState } from "react";
import { projects } from "@/lib/mock-data";

interface CourseSummary {
  name: string;
  cycles: string[];
  projectCount: number;
  studentCount: number;
  technologies: string[];
  categories: string[];
}

const CYCLE_ORDER = [
  "Ciclo I",
  "Ciclo II",
  "Ciclo III",
  "Ciclo IV",
  "Ciclo V",
  "Ciclo VI",
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("Todos");

  const publicProjects = useMemo(
    () => projects.filter((project) => project.status === "Publicado"),
    [],
  );

  const courses = useMemo<CourseSummary[]>(() => {
    const courseMap = new Map<
      string,
      {
        cycles: Set<string>;
        projects: Set<string>;
        students: Set<string>;
        technologies: Set<string>;
        categories: Set<string>;
      }
    >();

    // Registramos todos los cursos existentes en los datos.
    projects.forEach((project) => {
      if (!courseMap.has(project.course)) {
        courseMap.set(project.course, {
          cycles: new Set(),
          projects: new Set(),
          students: new Set(),
          technologies: new Set(),
          categories: new Set(),
        });
      }

      const course = courseMap.get(project.course)!;

      course.cycles.add(project.cycle);
      course.categories.add(project.category);
    });

    // Solo los proyectos publicados aportan estadísticas públicas.
    publicProjects.forEach((project) => {
      const course = courseMap.get(project.course)!;

      course.projects.add(project.id);

      project.team.forEach((member) => {
        course.students.add(member.name);
      });

      project.technologies.forEach((technology) => {
        course.technologies.add(technology);
      });
    });

    return Array.from(courseMap.entries())
      .map(([name, data]) => ({
        name,
        cycles: Array.from(data.cycles).sort(
          (a, b) => CYCLE_ORDER.indexOf(a) - CYCLE_ORDER.indexOf(b),
        ),
        projectCount: data.projects.size,
        studentCount: data.students.size,
        technologies: Array.from(data.technologies),
        categories: Array.from(data.categories),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [publicProjects]);

  const availableCycles = useMemo(() => {
    const cycles = new Set<string>();

    courses.forEach((course) => {
      course.cycles.forEach((cycle) => cycles.add(cycle));
    });

    return Array.from(cycles).sort(
      (a, b) => CYCLE_ORDER.indexOf(a) - CYCLE_ORDER.indexOf(b),
    );
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCycle =
        selectedCycle === "Todos" ||
        course.cycles.includes(selectedCycle);

      const matchesSearch =
        !normalizedSearch ||
        course.name.toLowerCase().includes(normalizedSearch) ||
        course.technologies.some((technology) =>
          technology.toLowerCase().includes(normalizedSearch),
        ) ||
        course.categories.some((category) =>
          category.toLowerCase().includes(normalizedSearch),
        );

      return matchesCycle && matchesSearch;
    });
  }, [courses, search, selectedCycle]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCycle("Todos");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <section className="bg-tecsup-blue text-white">
        <div className="max-w-7xl mx-auto px-6 py-9 md:py-10">
          <p className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-3">
            Vitrina académica
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Explora nuestros cursos
          </h1>

          <p className="mt-4 max-w-2xl text-white/75 text-sm md:text-base leading-relaxed">
            Descubre los cursos de Diseño y Desarrollo de Software y conoce
            los proyectos desarrollados por los estudiantes.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="text-xs text-white/70">Cursos disponibles</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-2xl font-bold">{publicProjects.length}</p>
              <p className="text-xs text-white/70">Proyectos publicados</p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-2xl font-bold">{availableCycles.length}</p>
              <p className="text-xs text-white/70">Ciclos documentados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buscador y filtros */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por curso o tecnología..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-tecsup-cyan focus:ring-2 focus:ring-tecsup-cyan/10 transition"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCycle("Todos")}
                className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCycle === "Todos"
                    ? "bg-tecsup-blue text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>

              {availableCycles.map((cycle) => (
                <button
                  type="button"
                  key={cycle}
                  onClick={() => setSelectedCycle(cycle)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCycle === cycle
                      ? "bg-tecsup-blue text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cycle}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listado */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16">
        <div className="flex items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Cursos disponibles
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "curso encontrado" : "cursos encontrados"}
            </p>
          </div>

          {(search || selectedCycle !== "Todos") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-tecsup-blue hover:underline cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <article
                key={course.name}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="h-1.5 bg-tecsup-cyan" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-tecsup-cyan mb-2">
                        {course.categories.join(" · ")}
                      </p>

                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {course.name}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-xl bg-tecsup-blue/10 text-tecsup-blue flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M12 14 3 9l9-5 9 5-9 5Zm0 0 6.16-3.422A12.083 12.083 0 0 1 18.75 14c0 1.326-.213 2.602-.606 3.797A11.952 11.952 0 0 0 12 21a11.952 11.952 0 0 0-6.144-3.203A12.041 12.041 0 0 1 5.25 14c0-1.2.176-2.358.503-3.45L12 14Z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {course.cycles.map((cycle) => (
                      <span
                        key={cycle}
                        className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                      >
                        {cycle}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xl font-bold text-gray-900">
                        {course.projectCount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.projectCount === 1 ? "Proyecto" : "Proyectos"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xl font-bold text-gray-900">
                        {course.studentCount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.studentCount === 1
                          ? "Estudiante"
                          : "Estudiantes"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Tecnologías
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {course.technologies.slice(0, 4).map((technology) => (
                        <span
                          key={technology}
                          className="px-2.5 py-1 text-xs rounded-md bg-tecsup-blue/5 text-tecsup-blue font-medium"
                        >
                          {technology}
                        </span>
                      ))}

                      {course.technologies.length > 4 && (
                        <span className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-500 font-medium">
                          +{course.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>

            <h3 className="font-bold text-gray-900">
              No encontramos cursos
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Intenta cambiar el término de búsqueda o seleccionar otro ciclo.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 px-5 py-2.5 bg-tecsup-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
