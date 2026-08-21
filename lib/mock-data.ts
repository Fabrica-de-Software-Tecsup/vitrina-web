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
  observaciones?: string | null;
}