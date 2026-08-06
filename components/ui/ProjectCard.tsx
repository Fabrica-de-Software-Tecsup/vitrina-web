"use client";

import Image, { type ImageLoaderProps } from "next/image";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/mock-data";

interface ProjectCardProps {
  project: Project;
}

function picsumLoader({ src, width }: ImageLoaderProps) {
  const seedMatch = src.match(/\/seed\/([^/]+)\//);
  const seed = seedMatch?.[1] ?? "vitrina";
  const height = Math.round(width * 0.625);

  return `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const badgeVariant =
    project.category.toLowerCase() === "iot" ? "iot" : "daw";

  const visibleTechnologies = project.technologies.slice(0, 3);
  const remainingTechnologies = project.technologies.length - 3;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[8/5] overflow-hidden bg-gray-100">
        <Image
          loader={picsumLoader}
          src={`https://picsum.photos/seed/${project.coverSeed}/640/400.jpg`}
          alt={`Portada del proyecto ${project.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3">
          <Badge variant={badgeVariant}>{project.category}</Badge>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-2 text-xs font-medium text-gray-500">
          {project.course} · {project.cycle}
        </p>

        <h3
          title={project.name}
          className="truncate text-lg font-bold text-tecsup-dark"
        >
          {project.name}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
          {project.description}
        </p>

        <div className="mt-4 flex min-h-7 flex-wrap gap-2">
          {visibleTechnologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
            >
              {technology}
            </span>
          ))}

          {remainingTechnologies > 0 && (
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              +{remainingTechnologies}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member) => (
              <Avatar
                key={member.name}
                name={member.name}
                size="sm"
                className="ring-1 ring-white"
              />
            ))}
          </div>

          <p className="text-xs font-medium text-gray-500">
            {project.team.length}{" "}
            {project.team.length === 1 ? "integrante" : "integrantes"}
          </p>
        </div>
      </div>
    </article>
  );
}