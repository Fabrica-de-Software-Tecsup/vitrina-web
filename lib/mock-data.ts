export interface TeamMember {
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
  technologies: string[];
  team: TeamMember[];
  coverSeed: number;
  views: number;
  status: "Publicado" | "En Desarrollo" | "Oculto";
}

export const projects: Project[] = [
  {
    id: "1",
    name: "Qhatu — Marketplace de productores locales",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Plataforma que conecta productores agrícolas locales con consumidores finales, facilitando la venta directa y reduciendo intermediarios.",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    team: [
      { name: "Maria Mamani", role: "Líder" },
      { name: "Carlos Quispe", role: "Desarrollador" },
      { name: "Ana Torres", role: "Diseñadora" },
    ],
    coverSeed: 1015,
    views: 1245,
    status: "Publicado",
  },
  {
    id: "2",
    name: "AgroSense — Monitoreo inteligente de cultivos",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description: "Sistema de sensores IoT para monitorear humedad, temperatura y luminosidad en invernaderos, con dashboard en tiempo real.",
    technologies: ["ESP32", "Python", "MQTT", "React"],
    team: [
      { name: "Diego Huamán", role: "Líder" },
      { name: "Lucia Flores", role: "Desarrolladora" },
      { name: "Pedro Gutiérrez", role: "Hardware" },
    ],
    coverSeed: 1040,
    views: 876,
    status: "Publicado",
  },
  {
    id: "3",
    name: "MediConnect — Plataforma de telemedicina",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Aplicación web que permite consultas médicas virtuales con videollamadas, historial clínico digital y recetas electrónicas.",
    technologies: ["Next.js", "Tailwind", "Firebase", "WebRTC"],
    team: [
      { name: "Valeria Cáceres", role: "Líder" },
      { name: "Jorge Rojas", role: "Desarrollador" },
    ],
    coverSeed: 1069,
    views: 2103,
    status: "Publicado",
  },
  {
    id: "4",
    name: "SmartHome Hub — Control domótico centralizado",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description: "Hub central para controlar luces, cerraduras y electrodomésticos desde una app móvil con protocolos MQTT y REST API.",
    technologies: ["Arduino", "React", "Node.js", "MQTT"],
    team: [
      { name: "Raúl Paredes", role: "Líder" },
      { name: "Sofia Vargas", role: "Desarrolladora" },
      { name: "Miguel Ángel", role: "Hardware" },
    ],
    coverSeed: 1080,
    views: 654,
    status: "Publicado",
  },
  {
    id: "5",
    name: "EduTrack — Gestión de aprendizaje adaptativo",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo IV",
    category: "DAW",
    description: "Plataforma que adapta el contenido educativo según el progreso y estilo de aprendizaje de cada estudiante.",
    technologies: ["React", "Python", "Django", "PostgreSQL"],
    team: [
      { name: "Camila Ramos", role: "Líder" },
      { name: "Fernando Díaz", role: "Desarrollador" },
    ],
    coverSeed: 1100,
    views: 432,
    status: "En Desarrollo",
  },
  {
    id: "6",
    name: "EcoMonitor — Estaciones de monitoreo ambiental",
    course: "Internet de las Cosas",
    cycle: "Ciclo IV",
    category: "IOT",
    description: "Red de estaciones con sensores de calidad del aire y sonido, transmitiendo datos vía LoRa a un dashboard público.",
    technologies: ["ESP32", "LoRa", "React", "InfluxDB"],
    team: [
      { name: "Andrés Mendoza", role: "Líder" },
      { name: "Gabriela Huanca", role: "Desarrolladora" },
    ],
    coverSeed: 1120,
    views: 287,
    status: "Publicado",
  },
  {
    id: "7",
    name: "FitPass — Marketplace de planes fitness",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Marketplace donde los usuarios comparan y compran membresías de gimnasios y estudios de yoga con pagos integrados.",
    technologies: ["Next.js", "TypeScript", "Prisma", "Stripe"],
    team: [
      { name: "Isabella Castro", role: "Líder" },
      { name: "Diego Torres", role: "Desarrollador" },
    ],
    coverSeed: 1140,
    views: 189,
    status: "En Desarrollo",
  },
  {
    id: "8",
    name: "CityPulse — Análisis de tráfico urbano en tiempo real",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description: "Sistema que captura datos de flujo vehicular con cámaras y sensores, procesándolos para generar mapas de calor de congestión.",
    technologies: ["Raspberry Pi", "Python", "React", "Docker"],
    team: [
      { name: "Sebastián Ávila", role: "Líder" },
      { name: "Daniela Quispe", role: "Desarrolladora" },
    ],
    coverSeed: 1160,
    views: 521,
    status: "Publicado",
  },
];