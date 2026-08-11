"use client";

import Image, { type ImageLoaderProps } from "next/image";
import Link from "next/link";
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

  // Solo Qhatu tiene una pantalla de detalle disponible por ahora.
  const isQhatu = project.id === "1";

  // Solo María Mamani tiene una pantalla de perfil disponible por ahora.
  const hasMariaProfile = project.team.some(
    (member) => member.name === "Maria Mamani",
  );

  const coverContent = (
    <>
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
    </>
  );

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {isQhatu ? (
        <Link
          href="/proyectos/qhatu"
          className="relative block aspect-[8/5] overflow-hidden bg-gray-100"
          aria-label={`Ver proyecto ${project.name}`}
        >
          {coverContent}
        </Link>
      ) : (
        <div className="relative aspect-[8/5] overflow-hidden bg-gray-100">
          {coverContent}

          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/45 via-transparent to-transparent p-4 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700">
              Detalle próximamente
            </span>
          </div>
        </div>
      )}

      <div className="p-5">
        <p className="mb-2 text-xs font-medium text-gray-500">
          {project.course} · {project.cycle}
        </p>

        {isQhatu ? (
          <Link href="/proyectos/qhatu" className="block">
            <h3
              title={project.name}
              className="truncate text-lg font-bold text-tecsup-dark transition hover:text-tecsup-cyan"
            >
              {project.name}
            </h3>
          </Link>
        ) : (
          <h3
            title={project.name}
            className="truncate text-lg font-bold text-tecsup-dark"
          >
            {project.name}
          </h3>
        )}

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
            {project.team.slice(0, 3).map((member) => {
              const hasProfile = member.name === "Maria Mamani";

              if (hasProfile) {
                return (
                  <Link
                    key={member.name}
                    href="/perfiles/maria-mamani"
                    aria-label={`Ver perfil de ${member.name}`}
                    title={`Ver perfil de ${member.name}`}
                    className="relative rounded-full transition hover:z-10 hover:scale-110"
                  >
                    <Avatar
                      name={member.name}
                      size="sm"
                      className="ring-1 ring-white"
                    />
                  </Link>
                );
              }

              return (
                <Avatar
                  key={member.name}
                  name={member.name}
                  size="sm"
                  className="ring-1 ring-white"
                />
              );
            })}
          </div>

          <p className="text-xs font-medium text-gray-500">
            {project.team.length}{" "}
            {project.team.length === 1 ? "integrante" : "integrantes"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {isQhatu ? (
            <Link
              href="/proyectos/qhatu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-tecsup-cyan transition hover:gap-3"
            >
              Ver proyecto
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-400">
              Detalle próximamente
            </span>
          )}

          {hasMariaProfile && (
            <Link
              href="/perfiles/maria-mamani"
              className="inline-flex items-center gap-2 text-sm font-semibold text-tecsup-purple transition hover:opacity-75"
            >
              Ver perfil
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}