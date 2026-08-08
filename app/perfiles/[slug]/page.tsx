"use client";

import { useState } from "react";
import Avatar from "@/components/ui/Avatar";
import ProjectCard from "@/components/ui/ProjectCard";

const student = {
  name: "Maria Mamani Quispe",
  career: "Diseño y Desarrollo de Software",
  location: "Arequipa, Perú",
  bio: "Apasionada por crear productos digitales que resuelvan problemas reales. Especializada en frontend y experiencia de usuario. Busco siempre aprender nuevas tecnologías y aplicarlas en proyectos con impacto social.",
  technologies: [
    { name: "React", projects: 8 },
    { name: "TypeScript", projects: 7 },
    { name: "Node.js", projects: 6 },
    { name: "Tailwind", projects: 6 },
    { name: "PostgreSQL", projects: 5 },
    { name: "Figma", projects: 4 },
  ],
  projectCount: 12,
};

const projects = [
  {
    id: "1",
    name: "EcoCajero — Recompensas por reciclaje",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description:
      "Proyecto que busca reciclar botellas de plástico y dar una recompensa económica a cambio.",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    team: [
      { name: "Maria Mamani", role: "Líder" },
      { name: "Carlos Quispe", role: "Desarrollador" },
    ],
    coverSeed: 180,
    views: 1245,
    status: "Publicado" as const,
  },
  {
    id: "2",
    name: "RivVirtual — Simulador de maquinaria pesada",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description:
      "Simulador virtual inmersivo para entrenamiento en maquinaria pesada usando realidad virtual.",
    technologies: ["React", "Three.js", "Node.js", "WebRTC"],
    team: [
      { name: "Maria Mamani", role: "Líder" },
      { name: "Diego Huamán", role: "Desarrollador" },
    ],
    coverSeed: 190,
    views: 876,
    status: "Publicado" as const,
  },
  {
    id: "3",
    name: "Wayki — Tutoría entre estudiantes",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo V",
    category: "DAW",
    description:
      "Plataforma que conecta estudiantes que necesitan ayuda con aquellos que dominan un tema.",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    team: [
      { name: "Maria Mamani", role: "Miembro" },
      { name: "Lucia Flores", role: "Líder" },
    ],
    coverSeed: 200,
    views: 432,
    status: "Publicado" as const,
  },
  {
    id: "4",
    name: "SafeBus — Rastreo de transporte urbano",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description:
      "Sistema de rastreo en tiempo real para transporte urbano de Arequipa.",
    technologies: ["ESP32", "React", "Python", "MQTT"],
    team: [
      { name: "Maria Mamani", role: "Desarrolladora" },
      { name: "Pedro Gutiérrez", role: "Líder" },
    ],
    coverSeed: 210,
    views: 567,
    status: "Publicado" as const,
  },
  {
    id: "5",
    name: "NutriScan — Scanner nutricional con IA",
    course: "Inteligencia Artificial",
    cycle: "Ciclo VI",
    category: "IOT",
    description:
      "Scanner con IA que lee etiquetas de alimentos con un fin nutricional.",
    technologies: ["Python", "TensorFlow", "React", "FastAPI"],
    team: [
      { name: "Maria Mamani", role: "Líder" },
      { name: "Jorge Rojas", role: "Desarrollador" },
    ],
    coverSeed: 220,
    views: 540,
    status: "Publicado" as const,
  },
  {
    id: "6",
    name: "Kanban Pro — Gestión ágil de tareas",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo IV",
    category: "DAW",
    description:
      "Herramienta de gestión áril en tareas en equipo con tableros Kanban personalizables.",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    team: [
      { name: "Maria Mamani", role: "Miembro" },
      { name: "Ana Torres", role: "Líder" },
    ],
    coverSeed: 230,
    views: 321,
    status: "Publicado" as const,
  },
  {
    id: "7",
    name: "Turnify — Reserva de citas para pymes",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo V",
    category: "DAW",
    description:
      "Sistema de reserva de citas en línea diseñado para pequeñas y medianas empresas.",
    technologies: ["Next.js", "Prisma", "Stripe", "Tailwind"],
    team: [
      { name: "Maria Mamani", role: "Líder" },
      { name: "Lucia Flores", role: "Desarrolladora" },
    ],
    coverSeed: 240,
    views: 198,
    status: "Publicado" as const,
  },
  {
    id: "8",
    name: "AquaSense — Calidad del agua en tiempo real",
    course: "Internet de las Cosas",
    cycle: "Ciclo VI",
    category: "IOT",
    description:
      "Sensor que indica la calidad del agua en tiempo real usando IoT.",
    technologies: ["ESP32", "Python", "MQTT", "React"],
    team: [
      { name: "Maria Mamani", role: "Desarrolladora" },
      { name: "Diego Huamán", role: "Líder" },
    ],
    coverSeed: 250,
    views: 654,
    status: "Publicado" as const,
  },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const maxProjects = Math.max(...student.technologies.map((t) => t.projects));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-tecsup-gray min-h-screen">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-[#071422] via-[#0c2240] to-[#091a30] relative">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-tecsup-cyan/10 rounded-full blur-[80px]" />
      </div>

      {/* Info del perfil */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
          <Avatar
            name={student.name}
            size="xl"
            className="border-4 border-white shadow-xl"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-tecsup-dark">
              {student.name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{student.career}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {student.location}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 text-xs font-semibold rounded-full hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                "✅ Copiado"
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Compartir perfil
                </>
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-tecsup-dark text-white text-xs font-semibold rounded-full hover:bg-tecsup-dark/85 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar CV
            </button>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mb-8">
          {student.bio}
        </p>

        {/* Layout 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Izquierda: Proyectos */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-tecsup-dark">
                Proyectos ({student.projectCount})
              </h2>
              <button className="text-xs text-tecsup-cyan font-semibold hover:underline cursor-pointer">
                Destacados primero
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          {/* Derecha: Sidebar */}
          <div className="space-y-6">
            {/* Mapa de crecimiento */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-tecsup-dark mb-2">
                Mapa de crecimiento
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Según los {student.projectCount} proyectos documentados
              </p>
              <div className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-[11px] text-gray-400 mt-2 font-medium">
                    Gráfico radar
                  </p>
                </div>
              </div>
            </div>

            {/* Tecnologías dominadas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-tecsup-dark mb-4">
                Tecnologías dominadas
              </h3>
              <div className="space-y-3">
                {student.technologies.map((tech) => (
                  <div key={tech.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        {tech.name}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {tech.projects} proyectos
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tecsup-cyan rounded-full transition-all duration-500"
                        style={{
                          width: `${(tech.projects / maxProjects) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
