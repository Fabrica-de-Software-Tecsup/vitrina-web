export interface TeamMember {
  id?: string;
  name: string;
  role: string;
}

export interface Project {
  id: string;
  name: string;
  course: string;
  cycle: string;
  category: string;
  description: string;
  descriptionLong: string;
  technologies: string[];
  team: TeamMember[];
  images: string[];
  views: number;
  shares: number;
  status: "Publicado" | "En Desarrollo" | "Por Revisar" | "Oculto";
  deadline: string; // formato "YYYY-MM-DD"
  links: {
    github: string;
    demo: string;
    figma: string;
  };
  youtubeId: string;
  createdAt?: string;
  slug?: string;
  buildUrl?: string | null;
}

// ─── Cuando el backend esté listo, reemplaza esto por:
// export async function getProjects(): Promise<Project[]> {
//   const res = await fetch("/api/v1/projects?status=Publicado");
//   return res.json();
// }

export const projects: Project[] = [
  {
    id: "1",
    name: "EcoCajero — Recompensas por reciclaje",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description:
      "Proyecto que busca reciclar botellas de plástico y dar una recompensa económica a cambio, fomentando la sostenibilidad en la comunidad universitaria.",
    descriptionLong:
      "Desarrollamos EcoCajero pensando en la economía circular. Utilizamos React para el frontend debido a su ecosistema robusto, y Node.js para el backend garantizando una API escalable. La integración con sensores IoT fue uno de los retos más grandes, pero logramos implementar una solución que conecta el hardware con la aplicación en tiempo real.",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"],
    team: [
      { name: "Maria Mamani Quispe", role: "Líder" },
      { name: "Carlos Quispe Rojas", role: "Desarrollador Backend" },
      { name: "Ana Torres Mendoza", role: "Diseñadora UX/UI" },
    ],
    images: [
      "/images/projects/EcoCajero-1.png",
      "/images/projects/EcoCajero-2.png",
      "/images/projects/EcoCajero-3.png",
      "/images/projects/EcoCajero-4.png",
      "/images/projects/EcoCajero-5.png",
    ],
    views: 1245,
    shares: 38,
    status: "Publicado",
    deadline: "2026-08-30",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "rqJX77MKgrQ",
  },
  {
    id: "2",
    name: "RivVirtual — Simulador de maquinaria pesada",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description:
      "Simulador virtual inmersivo para entrenamiento en maquinaria pesada usando realidad virtual.",
    descriptionLong:
      "RivVirtual nació de la necesidad de entrenar operadores de maquinaria pesada sin los costos y riesgos del entrenamiento en campo. Usamos Three.js para renderizar los modelos 3D y WebRTC para la comunicación en tiempo real entre el instructor y el operador en VR.",
    technologies: ["React", "Three.js", "Node.js", "WebRTC"],
    team: [
      { name: "Carlos Quispe Rojas", role: "Líder" },
      { name: "Maria Mamani Quispe", role: "Desarrolladora Frontend" },
      { name: "Pedro Gutiérrez Salas", role: "Modelado 3D / IoT" },
    ],
    images: [
      "/images/projects/RivVirtual-1.png",
      "/images/projects/RivVirtual-2.png",
      "/images/projects/RivVirtual-3.png",
      "/images/projects/RivVirtual-4.png",
      "/images/projects/RivVirtual-5.png",
    ],
    views: 876,
    shares: 22,
    status: "Publicado",
    deadline: "2026-08-30",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "r4gFhR0z1dQ",
  },
  {
    id: "3",
    name: "Wayki — Tutoría entre estudiantes",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo V",
    category: "DAW",
    description:
      "Plataforma que conecta estudiantes que necesitan ayuda con aquellos que dominan un tema.",
    descriptionLong:
      "Wayki significa 'hermano' en quechua, y ese fue el espíritu del proyecto. Construimos un sistema de matching automático basado en las habilidades de cada estudiante y los temas en los que necesitan ayuda. Usamos Prisma para la gestión de datos y PostgreSQL para almacenar las sesiones de tutoría.",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    team: [
      { name: "Valeria Cáceres Camacho", role: "Líder" },
      { name: "Lucia Flores Torres", role: "Desarrolladora Backend" },
      { name: "Jorge Rojas Huanca", role: "Desarrollador" },
    ],
    images: [
      "/images/projects/Wayki-1.png",
      "/images/projects/Wayki-2.png",
      "/images/projects/Wayki-3.png",
      "/images/projects/Wayki-4.png",
      "/images/projects/Wayki-5.png",
    ],
    views: 432,
    shares: 15,
    status: "En Desarrollo",
    deadline: "2026-08-20",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "JJwaE6TWORk",
  },
  {
    id: "4",
    name: "SafeBus — Rastreo de transporte urbano",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description:
      "Sistema de rastreo en tiempo real para transporte urbano de Arequipa.",
    descriptionLong:
      "SafeBus conecta sensores GPS ESP32 instalados en buses urbanos de Arequipa con una aplicación web que muestra la ubicación en tiempo real. Los pasajeros pueden ver cuánto falta para que llegue su bus, y las empresas pueden optimizar sus rutas según los datos de uso.",
    technologies: ["ESP32", "React", "Python", "MQTT"],
    team: [
      { name: "Diego Huamán Poma", role: "Líder" },
      { name: "Maria Mamani Quispe", role: "Desarrolladora Frontend" },
      { name: "Pedro Gutiérrez Salas", role: "Hardware" },
    ],
    images: [
      "/images/projects/SafeBus-1.png",
      "/images/projects/SafeBus-2.png",
      "/images/projects/SafeBus-3.png",
      "/images/projects/SafeBus-4.png",
      "/images/projects/SafeBus-5.png",
    ],
    views: 567,
    shares: 29,
    status: "Oculto",
    deadline: "2026-08-15",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "fOCkoQUGPDM",
  },
  {
    id: "5",
    name: "NutriScan — Scanner nutricional con IA",
    course: "Inteligencia Artificial",
    cycle: "Ciclo VI",
    category: "IOT",
    description:
      "Scanner con IA que lee etiquetas de alimentos con un fin nutricional.",
    descriptionLong:
      "NutriScan usa un modelo de TensorFlow entrenado con miles de imágenes de etiquetas nutricionales peruanas. El usuario apunta su celular a la etiqueta, la IA extrae la información y genera un análisis nutricional personalizado según las necesidades del usuario.",
    technologies: ["Python", "TensorFlow", "React", "FastAPI"],
    team: [
      { name: "Valeria Cáceres Camacho", role: "Líder" },
      { name: "Carlos Quispe Rojas", role: "Desarrollador Backend" },
      { name: "Ana Torres Mendoza", role: "Diseñadora UX/UI" },
    ],
    images: [
      "/images/projects/NutriScan-1.png",
      "/images/projects/NutriScan-2.png",
      "/images/projects/NutriScan-3.png",
      "/images/projects/NutriScan-4.png",
      "/images/projects/NutriScan-5.png",
    ],
    views: 540,
    shares: 18,
    status: "Por Revisar",
    deadline: "2026-08-18",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "_3eKies99Jo",
  },
  {
    id: "6",
    name: "Kanban Pro — Gestión ágil de tareas",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo IV",
    category: "DAW",
    description:
      "Herramienta de gestión ágil en tareas en equipo con tableros Kanban personalizables.",
    descriptionLong:
      "Kanban Pro nació como un proyecto de curso y se convirtió en una herramienta que usamos internamente. Soporta drag & drop, etiquetas, fechas límite, asignación de miembros y notificaciones en tiempo real. El backend está en Node.js con PostgreSQL.",
    technologies: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    team: [
      { name: "Lucia Flores Torres", role: "Líder" },
      { name: "Jorge Rojas Huanca", role: "Desarrollador Backend" },
      { name: "Ana Torres Mendoza", role: "Diseñadora UX/UI" },
    ],
    images: [
      "/images/projects/KanbanPro-1.png",
      "/images/projects/KanbanPro-2.png",
      "/images/projects/KanbanPro-3.png",
      "/images/projects/KanbanPro-4.png",
      "/images/projects/KanbanPro-5.png",
    ],
    views: 321,
    shares: 11,
    status: "Publicado",
    deadline: "2026-07-30",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "CfROfwnQgps",
  },
  {
    id: "7",
    name: "Turnify — Reserva de citas para pymes",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo V",
    category: "DAW",
    description:
      "Sistema de reserva de citas en línea diseñado para pequeñas y medianas empresas.",
    descriptionLong:
      "Turnify permite a las pymes configurar sus servicios, horarios disponibles y recibir reservas automáticas. Integramos Stripe para pagos por adelantado y un sistema de recordatorios por correo. La interfaz fue diseñada para ser usada por personas no técnicas.",
    technologies: ["Next.js", "Prisma", "Stripe", "Tailwind"],
    team: [
      { name: "Valeria Cáceres Camacho", role: "Líder" },
      { name: "Lucia Flores Torres", role: "Desarrolladora" },
    ],
    images: [
      "/images/projects/Turnify-1.png",
      "/images/projects/Turnify-2.png",
      "/images/projects/Turnify-3.png",
      "/images/projects/Turnify-4.png",
      "/images/projects/Turnify-5.png",
    ],
    views: 198,
    shares: 7,
    status: "Publicado",
    deadline: "2026-08-05",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "JOcAvV5bZX0",
  },
  {
    id: "8",
    name: "AquaSense — Calidad del agua en tiempo real",
    course: "Internet de las Cosas",
    cycle: "Ciclo VI",
    category: "IOT",
    description:
      "Sensor que indica la calidad del agua en tiempo real usando IoT.",
    descriptionLong:
      "AquaSense usa sensores de pH, turbidez y temperatura conectados a un ESP32 que envía datos vía MQTT a un servidor Node.js. El dashboard web muestra mapas de calor de la calidad del agua en diferentes zonas de la ciudad, con alertas automáticas cuando los niveles superan los límites permisibles.",
    technologies: ["ESP32", "Python", "MQTT", "React"],
    team: [
      { name: "Diego Huamán Poma", role: "Líder" },
      { name: "Maria Mamani Quispe", role: "Desarrolladora Frontend" },
      { name: "Pedro Gutiérrez Salas", role: "Hardware" },
    ],
    images: [
      "/images/projects/AquaSense-1.png",
      "/images/projects/AquaSense-2.png",
      "/images/projects/AquaSense-3.png",
      "/images/projects/AquaSense-4.png",
      "/images/projects/AquaSense-5.png",
    ],
    views: 654,
    shares: 25,
    status: "Por Revisar",
    deadline: "2026-08-22",
    links: {
      github: "https://github.com",
      demo: "https://example.com",
      figma: "https://figma.com",
    },
    youtubeId: "xsVqdYTeHyw",
  },
];

/** Primeros 4 para la sección "Destacados" */
export const featuredProjects = projects.slice(0, 4);

/** Últimos 4 para la sección "Recientes" */
export const recentProjects = projects.slice(4, 8);

// ─── Funciones utilitarias ────────────────────────────────────────

/** Extrae las dos primeras iniciales de un nombre */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Paleta de colores para avatares */
const AVATAR_PALETTE = [
  "bg-tecsup-cyan",
  "bg-tecsup-purple",
  "bg-tecsup-green",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

/** Asigna un color consistente según el nombre */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/** Genera un slug URL-safe */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Busca un proyecto por slug del nombre completo */
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => slugify(p.name) === slug);
}

/** Busca un proyecto por ID numérico O por slug corto */
export function getProjectByIdentifier(
  identifier: string,
): Project | undefined {
  const byId = projects.find((p) => p.id === identifier);
  if (byId) return byId;

  const byFullSlug = projects.find((p) => slugify(p.name) === identifier);
  if (byFullSlug) return byFullSlug;

  return projects.find((p) => slugify(p.name.split(" — ")[0]) === identifier);
}
