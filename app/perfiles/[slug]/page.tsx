"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import ProjectCard from "@/components/ui/ProjectCard";
import { projects } from "@/lib/mock-data";

/* ─── Datos de estudiantes ─── */
const students = [
  {
    slug: "maria-mamani-quispe",
    name: "Maria Mamani Quispe",
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
    bio: "Apasionada por crear productos digitales que resuelvan problemas reales. Especializada en frontend y experiencia de usuario.",
    github: "https://github.com/mariamamani",
    linkedin: "https://linkedin.com/in/mariamamani",
    email: "mmamani@tecsup.edu.pe",
  },
  {
    slug: "diego-human-poma",
    name: "Diego Huamán Poma",
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
    bio: "Especialista en IoT y sistemas embebidos. Me gusta conectar el hardware con el software para crear soluciones reales.",
    github: "https://github.com/diegohuaman",
    linkedin: "https://linkedin.com/in/diegohuaman",
    email: "dhuaman@tecsup.edu.pe",
  },
  {
    slug: "valeria-caceres-camacho",
    name: "Valeria Cáceres Camacho",
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
    bio: "Desarrolladora full-stack con interés en aplicaciones de impacto social. Experiencia en React, Next.js y Firebase.",
    github: "https://github.com/valeriacaceres",
    linkedin: "https://linkedin.com/in/valeriacaceres",
    email: "vcaceres@tecsup.edu.pe",
  },
  {
    slug: "lucia-flores-torres",
    name: "Lucia Flores Torres",
    career: "Diseño y Desarrollo de Software",
    location: "Lima, Perú",
    bio: "Apasionada por datos y visualización. Combino habilidades de desarrollo con análisis de datos para contar historias.",
    github: "https://github.com/luciaflores",
    linkedin: "https://linkedin.com/in/luciaflores",
    email: "lflores@tecsup.edu.pe",
  },
  {
    slug: "carlos-quispe-rojas",
    name: "Carlos Quispe Rojas",
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
    bio: "Backend developer enfocado en APIs escalables y bases de datos optimizadas. Fan de PostgreSQL y Docker.",
    github: "https://github.com/carlosquispe",
    linkedin: "https://linkedin.com/in/carlosquispe",
    email: "cquispe@tecsup.edu.pe",
  },
  {
    slug: "ana-torres-mendoza",
    name: "Ana Torres Mendoza",
    career: "Diseño y Desarrollo de Software",
    location: "Cusco, Perú",
    bio: "Diseñadora UX/UI que escribe código. Puente entre diseño y desarrollo, amo crear interfaces que la gente disfruta usar.",
    github: "https://github.com/anatorres",
    linkedin: "https://linkedin.com/in/anatorres",
    email: "atorres@tecsup.edu.pe",
  },
  {
    slug: "pedro-gutierrez-salas",
    name: "Pedro Gutiérrez Salas",
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
    bio: "Hardware y software, todo junto. Trabajo con ESP32, Python y TensorFlow para construir soluciones IoT inteligentes.",
    github: "https://github.com/pedrogutierrez",
    linkedin: "https://linkedin.com/in/pedrogutierrez",
    email: "pgutierrez@tecsup.edu.pe",
  },
  {
    slug: "jorge-rojas-huanca",
    name: "Jorge Rojas Huanca",
    career: "Diseño y Desarrollo de Software",
    location: "Arequipa, Perú",
    bio: "Desarrollador backend con experiencia en Java y Spring Boot. Actualmente explorando el ecosistema de Node.js.",
    github: "https://github.com/jorgerojas",
    linkedin: "https://linkedin.com/in/jorgerojas",
    email: "jrojas@tecsup.edu.pe",
  },
];

/* ─── Categorías para el radar de crecimiento ─── */
const TECH_CATEGORIES = [
  {
    name: "Frontend",
    techs: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind",
      "CSS",
      "Three.js",
      "WebRTC",
    ],
  },
  {
    name: "Backend",
    techs: ["Node.js", "FastAPI", "Spring Boot", "Java"],
  },
  {
    name: "IoT",
    techs: ["ESP32", "MQTT", "C++", "Python", "TensorFlow"],
  },
  {
    name: "Bases de Datos",
    techs: ["PostgreSQL", "Prisma", "Firebase"],
  },
  {
    name: "DevOps",
    techs: ["Docker", "Stripe", "Grafana"],
  },
  {
    name: "Diseño",
    techs: ["Figma", "Adobe XD"],
  },
];

/* ─── Componente radar SVG ─── */
function RadarChart({ data }: { data: { name: string; score: number }[] }) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 48;
  const n = data.length;

  const getPoint = (index: number, radius: number) => {
    const angle = (index * 2 * Math.PI) / n - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const getLabelAnchor = (index: number): string => {
    if (index === 0 || index === Math.floor(n / 2)) return "middle";
    return index < n / 2 ? "start" : "end";
  };

  const gridLevels = [0.33, 0.66, 1.0];
  const dataPoints = data.map((d, i) => getPoint(i, (d.score / 100) * maxR));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      {gridLevels.map((level, li) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const p = getPoint(i, maxR * level);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={li}
            points={pts}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, maxR);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {data.some((d) => d.score > 0) && (
        <polygon
          points={dataPoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(0, 179, 224, 0.15)"
          stroke="#00B3E0"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}

      {dataPoints.map((p, i) =>
        data[i].score > 0 ? (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#00B3E0" />
        ) : null,
      )}

      {data.map((d, i) => {
        const p = getPoint(i, maxR + 12);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={getLabelAnchor(i)}
            dominantBaseline="middle"
            style={{ fontSize: "7px", fill: "#6b7280", fontWeight: 500 }}
          >
            {d.name}
          </text>
        );
      })}
    </svg>
  );
}

/* ─── Página ─── */
export default function StudentProfilePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);

  const student = students.find((s) => s.slug === slug);

  const studentProjects = useMemo(() => {
    if (!student) return [];
    return projects.filter((p) => p.team.some((m) => m.name === student.name));
  }, [student]);

  const sortedTechs = useMemo(() => {
    const techCount: Record<string, number> = {};
    studentProjects.forEach((p) => {
      p.technologies.forEach((t) => {
        techCount[t] = (techCount[t] || 0) + 1;
      });
    });
    return Object.entries(techCount).sort((a, b) => b[1] - a[1]);
  }, [studentProjects]);

  const maxTechCount = sortedTechs.length > 0 ? sortedTechs[0][1] : 1;

  const radarData = useMemo(() => {
    if (studentProjects.length === 0)
      return TECH_CATEGORIES.map((c) => ({ name: c.name, score: 0 }));
    return TECH_CATEGORIES.map((cat) => {
      const count = studentProjects.filter((p) =>
        p.technologies.some((t) => cat.techs.includes(t)),
      ).length;
      return {
        name: cat.name,
        score: Math.round((count / studentProjects.length) * 100),
      };
    });
  }, [studentProjects]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!student) {
    return (
      <div className="bg-tecsup-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-tecsup-dark">
            Estudiante no encontrado
          </h1>
          <a
            href="/"
            className="mt-4 inline-block text-sm text-tecsup-cyan hover:underline"
          >
            Volver a la Landing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-tecsup-gray min-h-screen">
      <Header />

      {/* ─── Banner ─── */}
      <div className="h-40 bg-gradient-to-r from-tecsup-cyan/30 via-tecsup-purple/20 to-tecsup-cyan/10 relative">
        <div className="max-w-7xl mx-auto px-6 absolute -bottom-12 left-0 right-0">
          <div className="ml-6">
            <Avatar
              name={student.name}
              size="xl"
              className="border-4 border-white shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ─── Info personal ─── */}
        <div className="pt-14 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-center gap-2 order-2 lg:order-1">
              <a
                href={student.github}
                target="_blank"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-tecsup-dark hover:border-gray-400 transition-colors"
                title="GitHub"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.645 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 6.705-6.206 6.705-12.205 0-18.546-2.057-24.401-5.467-6.602-2.41-12.401-6.705-12.401-12.205 0-2.628.934-5.06 2.452-6.948-.254-.608-.594-1.568.114-2.322 0 0 1.018-.308 3.296 1.278a11.494 11.494 0 013.368-.49c1.148.085 2.258.128 3.368.128 1.11 0 2.22-.043 3.368-.128 1.14-.614 2.367-1.278 3.368-1.278 1.708 1.586 2.368 1.714 2.368 1.714.708 2.014 1.236 3.222 1.236 4.609 0 8.4-2.096 8.4-5.921 0-1.311-.469-2.381-1.236-3.221.124-.303.535-1.524.117-3.176 0 0-1.008-.322-3.301-1.23-.957.266-1.983.399-3.003.404-1.02.005-2.047-.138-3.006-.404-2.291 1.552-3.297 1.23-3.297 1.23-.645 1.653-.242 2.874-.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319-.192.694-.801.576-4.765-1.589-6.759-6.206-6.759-12.205 0-6.626 5.373-12 12-12z" />
                </svg>
              </a>
              <a
                href={student.linkedin}
                target="_blank"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 transition-colors"
                title="LinkedIn"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={"mailto:" + student.email}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-tecsup-cyan hover:border-tecsup-cyan/40 transition-colors"
                title="Correo"
              >
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>

            <div className="order-1 lg:order-2">
              <h1 className="text-2xl font-bold text-tecsup-dark">
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
              <p className="text-sm text-gray-500 mt-3 max-w-lg leading-relaxed">
                {student.bio}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 order-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-600 text-xs font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                {copied ? "✅ Copiado" : "Compartir perfil"}
              </button>
              <button className="px-4 py-2 bg-tecsup-dark text-white text-xs font-semibold rounded-full hover:bg-tecsup-dark/85 transition-colors">
                Descargar CV
              </button>
            </div>
          </div>
        </div>

        {/* ─── Fila superior: Mapa (izq) + Tecnologías (der) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Mapa de crecimiento — compacto */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-bold text-tecsup-dark mb-0.5">
              Mapa de crecimiento
            </h3>
            <p className="text-[10px] text-gray-400 mb-2">
              {studentProjects.length} proyectos documentados
            </p>
            {studentProjects.length > 0 ? (
              <div className="h-44 flex items-center justify-center">
                <RadarChart data={radarData} />
              </div>
            ) : (
              <div className="h-44 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl mb-0.5">📊</p>
                  <p className="text-[10px] text-gray-400">Gráfico radar</p>
                </div>
              </div>
            )}
          </div>

          {/* Tecnologías dominadas — con scroll interno */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-bold text-tecsup-dark mb-0.5">
              Tecnologías dominadas
            </h3>
            <p className="text-[10px] text-gray-400 mb-2">
              {sortedTechs.length} tecnologías en {studentProjects.length}{" "}
              proyectos
            </p>
            {sortedTechs.length > 0 ? (
              <div className="max-h-[176px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {sortedTechs.map(([tech, count]) => (
                  <div key={tech}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] font-medium text-gray-600">
                        {tech}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        {count} proyecto{count > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-tecsup-gray h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tecsup-cyan rounded-full transition-all duration-500"
                        style={{
                          width: (count / maxTechCount) * 100 + "%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center">
                <p className="text-[11px] text-gray-400">Sin datos aún</p>
              </div>
            )}
          </div>
        </div>

        {/* ─── Proyectos ─── */}
        <div>
          <h2 className="text-lg font-bold text-tecsup-dark mb-6">
            Proyectos ({studentProjects.length})
          </h2>
          {studentProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {studentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm text-gray-400">
                Este estudiante aún no tiene proyectos publicados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
