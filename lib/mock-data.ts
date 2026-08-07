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
  images: string[]; 
  views: number;
  status: "Publicado" | "En Desarrollo" | "Oculto";
}

export const projects: Project[] = [
  {
    id: "1",
    name: "EcoCajero — Recompensas por reciclaje",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Proyecto que busca reciclar botellas de plástico y a cambio te da una recompensa económica, fomentando la economía circular en la ciudad.",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    team: [
      { name: "Maria Mamani", role: "Líder" },
      { name: "Carlos Quispe", role: "Desarrollador" },
      { name: "Ana Torres", role: "Diseñadora" },
    ],
    images: [ "/images/projects/EcoCajero-1.png", "/images/projects/EcoCajero-2.png", "/images/projects/EcoCajero-3.png", "/images/projects/EcoCajero-4.png", "/images/projects/EcoCajero-5.png" ],
    views: 1245,
    status: "Publicado",
  },
  {
    id: "2",
    name: "RivVirtual — Simulador de maquinaria pesada",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description: "Simulador virtual inmersivo que permite a los estudiantes practicar el manejo de maquinaria pesada sin riesgos, usando tecnología VR.",
    technologies: ["Unity", "C#", "Bluetooth", "Firebase"],
    team: [
      { name: "Diego Huamán", role: "Líder" },
      { name: "Lucia Flores", role: "Desarrolladora" },
      { name: "Pedro Gutiérrez", role: "Diseño 3D" },
    ],
    images: [ "/images/projects/RivVirtual-1.png", "/images/projects/RivVirtual-2.png", "/images/projects/RivVirtual-3.png", "/images/projects/RivVirtual-4.png", "/images/projects/RivVirtual-5.png" ],
    views: 876,
    status: "Publicado",
  },
  {
    id: "3",
    name: "Wayki — Tutoría entre pares",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Plataforma que conecta estudiantes que necesitan ayuda con estudiantes avanzados que ofrecen tutorías sobre temas específicos de la carrera.",
    technologies: ["Next.js", "TypeScript", "Prisma", "Socket.io"],
    team: [
      { name: "Valeria Cáceres", role: "Líder" },
      { name: "Jorge Rojas", role: "Desarrollador" },
    ],
    images: [ "/images/projects/Wayki-1.png", "/images/projects/Wayki-2.png", "/images/projects/Wayki-3.png", "/images/projects/Wayki-4.png", "/images/projects/Wayki-5.png" ],
    views: 2103,
    status: "Publicado",
  },
  {
    id: "4",
    name: "SafeBus — Rastreo de transporte urbano",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description: "Sistema de rastreo en tiempo real para el transporte público de Arequipa, permitiendo a los usuarios saber exactamente dónde va su bus.",
    technologies: ["ESP32", "GPS", "React", "Node.js"],
    team: [
      { name: "Raúl Paredes", role: "Líder" },
      { name: "Sofia Vargas", role: "Desarrolladora" },
      { name: "Miguel Ángel", role: "Hardware" },
    ],
    images: [ "/images/projects/SafeBus-1.png", "/images/projects/SafeBus-2.png", "/images/projects/SafeBus-3.png", "/images/projects/SafeBus-4.png", "/images/projects/SafeBus-5.png" ],
    views: 654,
    status: "Publicado",
  },
  {
    id: "5",
    name: "NutriScan — Scanner nutricional con IA",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo IV",
    category: "DAW",
    description: "Aplicación que usa la cámara del celular para escanear etiquetas de alimentos y analizar su valor nutricional mediante inteligencia artificial.",
    technologies: ["React Native", "Python", "TensorFlow", "FastAPI"],
    team: [
      { name: "Camila Ramos", role: "Líder" },
      { name: "Fernando Díaz", role: "Desarrollador" },
    ],
    images: [ "/images/projects/NutriScan-1.png", "/images/projects/NutriScan-2.png", "/images/projects/NutriScan-3.png", "/images/projects/NutriScan-4.png", "/images/projects/NutriScan-5.png" ],
    views: 432,
    status: "En Desarrollo",
  },
  {
    id: "6",
    name: "Kanban Pro — Gestión áil de tareas",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Herramienta web para la gestión ágil de proyectos en equipo, con tableros Kanban personalizables y métricas de productividad.",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    team: [
      { name: "Andrés Mendoza", role: "Líder" },
      { name: "Gabriela Huanca", role: "Desarrolladora" },
    ],
    images: [ "/images/projects/KanbanPro-1.png", "/images/projects/KanbanPro-2.png", "/images/projects/KanbanPro-3.png", "/images/projects/KanbanPro-4.png", "/images/projects/KanbanPro-5.png" ],
    views: 287,
    status: "Publicado",
  },
  {
    id: "7",
    name: "Turnify — Reserva de citas para PyMEs",
    course: "Desarrollo de Aplicaciones Web",
    cycle: "Ciclo VI",
    category: "DAW",
    description: "Sistema de reservas en línea diseñado para pequeñas y medianas empresas, facilitando la gestión de citas de sus clientes.",
    technologies: ["React", "Node.js", "MongoDB", "Twilio"],
    team: [
      { name: "Isabella Castro", role: "Líder" },
      { name: "Diego Torres", role: "Desarrollador" },
    ],
    images: [ "/images/projects/Turnify-1.png", "/images/projects/Turnify-2.png", "/images/projects/Turnify-3.png", "/images/projects/Turnify-4.png", "/images/projects/Turnify-5.png" ],
    views: 189,
    status: "En Desarrollo",
  },
  {
    id: "8",
    name: "AquaSense — Calidad del agua en tiempo real",
    course: "Internet de las Cosas",
    cycle: "Ciclo V",
    category: "IOT",
    description: "Red de sensores IoT que monitorea la calidad del agua en tiempo real (pH, turbidez, temperatura) y envía alertas a las autoridades.",
    technologies: ["ESP32", "LoRa", "React", "InfluxDB"],
    team: [
      { name: "Sebastián Ávila", role: "Líder" },
      { name: "Daniela Quispe", role: "Desarrolladora" },
    ],
    images: [ "/images/projects/AquaSense-1.png", "/images/projects/AquaSense-2.png", "/images/projects/AquaSense-3.png", "/images/projects/AquaSense-4.png", "/images/projects/AquaSense-5.png" ],
    views: 521,
    status: "Publicado",
  },
];