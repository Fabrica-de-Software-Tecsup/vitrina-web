import Badge from "./Badge";
import Avatar from "./Avatar";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import type { Project } from "@/lib/mock-data";

const categoryVariantMap: Record<string, "daw" | "iot" | "otro"> = {
  DAW: "daw",
  IOT: "iot",
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const badgeVariant = categoryVariantMap[project.category] || "otro";

  return (
    <Link
      href={"/proyectos/" + (project.slug ?? slugify(project.name))}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-0.5 py-0.5 shadow-md">
          <Badge variant={badgeVariant} className="!bg-white/20 !text-white">
            {project.category}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
          {project.course} · {project.cycle}
        </p>
        <h3 className="text-sm font-bold mt-1 text-tecsup-dark leading-snug line-clamp-1">
          {project.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-2 py-0.5 bg-tecsup-gray rounded-full text-gray-600 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member) => (
              <Avatar key={member.name} name={member.name} size="sm" />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">
            {project.team.length} integrantes
          </span>
        </div>
      </div>
    </Link>
  );
}
