"use client";

import { useState, useMemo } from "react";
import StudentCard from "@/components/ui/StudentCard";
import { projects, slugify } from "@/lib/mock-data";

const heroSlides = [
  "/images/students/hero-students-1.png",
  "/images/students/hero-students-1.png",
  "/images/students/hero-students-1.png",
];

const STUDENT_NAMES = [
  "Maria Mamani Quispe",
  "Diego Huamán Poma",
  "Valeria Cáceres Camacho",
  "Carlos Quispe Rojas",
  "Lucia Flores Torres",
  "Ana Torres Mendoza",
  "Pedro Gutiérrez Salas",
  "Jorge Rojas Huanca",
];

const STUDENT_META: Record<string, { career: string; location: string }> = {
  "Maria Mamani Quispe": {
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
  },
  "Diego Huamán Poma": {
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
  },
  "Valeria Cáceres Camacho": {
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
  },
  "Carlos Quispe Rojas": {
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
  },
  "Lucia Flores Torres": {
    career: "Diseño y Desarrollo de Software",
    location: "Lima, Perú",
  },
  "Ana Torres Mendoza": {
    career: "Diseño y Desarrollo de Software",
    location: "Cusco, Perú",
  },
  "Pedro Gutiérrez Salas": {
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
  },
  "Jorge Rojas Huanca": {
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
  },
};

function buildStudentData() {
  return STUDENT_NAMES.map((name) => {
    const meta = STUDENT_META[name];
    const studentProjects = projects.filter((p) =>
      p.team.some((m) => m.name === name),
    );

    const techSet = new Set<string>();
    studentProjects.forEach((p) =>
      p.technologies.forEach((t) => techSet.add(t)),
    );

    return {
      name,
      career: meta.career,
      location: meta.location,
      technologies: Array.from(techSet),
      projectCount: studentProjects.length,
      slug: slugify(name),
    };
  });
}

const allStudents = buildStudentData();

export default function StudentsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const filteredAll = allStudents.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* Destacados: los 4 con más proyectos */
  const featuredStudents = useMemo(
    () =>
      [...allStudents]
        .sort((a, b) => b.projectCount - a.projectCount)
        .slice(0, 4),
    [],
  );

  return (
    <>
      {/* ═══════════════ HERO CON CARRUSEL ═══════════════ */}
      <section className="relative overflow-hidden h-[70vh] min-h-[500px]">
        <img
          src={heroSlides[currentSlide]}
          alt="Hero Estudiantes"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors cursor-pointer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === currentSlide ? "bg-white w-6" : "bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ FILTROS ═══════════════ */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center">
          <p className="text-xs text-gray-400 font-medium mb-3">
            {projects.length} proyectos · {allStudents.length} estudiantes · 18
            cursos · 6 ciclos documentados
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
            {featuredStudents.map((student) => (
              <StudentCard key={student.name} {...student} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-tecsup-dark">Estudiantes</h2>
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
                placeholder="Buscar estudiante..."
                className="pl-9 pr-4 py-2 text-sm bg-tecsup-gray rounded-full border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none w-64"
              />
            </div>
          </div>
          {filteredAll.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">
                No se encontraron estudiantes con &quot;{searchTerm}&quot;
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAll.map((student) => (
                <StudentCard key={student.name} {...student} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
