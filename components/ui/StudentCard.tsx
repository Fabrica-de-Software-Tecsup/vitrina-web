import Link from "next/link";
import Avatar from "./Avatar";

interface StudentCardProps {
  name: string;
  career: string;
  location: string;
  technologies: string[];
  projectCount: number;
  slug: string;
}

export default function StudentCard({
  name,
  career,
  location,
  technologies,
  projectCount,
  slug,
}: StudentCardProps) {
  return (
    <article className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2 transition-all duration-300">
      {/* Banner superior decorativo */}
      <div className="h-16 bg-gradient-to-r from-tecsup-cyan/20 to-tecsup-purple/20 relative">
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <Avatar
            name={name}
            size="lg"
            className="border-4 border-white shadow-md"
          />
        </div>
      </div>

      <div className="pt-9 pb-5 px-5 text-center">
        <h3 className="text-sm font-bold text-tecsup-dark">{name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{career}</p>
        <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mt-1">
          <svg
            className="w-3 h-3"
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
          {location}
        </p>

        {/* Tecnologías */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-2 py-0.5 bg-tecsup-gray rounded-full text-gray-600 font-medium"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full text-gray-400 font-medium">
              +{technologies.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-medium">
            {projectCount} proyectos
          </span>
          <Link
            href={`/perfiles/${slug}`}
            className="text-xs font-semibold text-tecsup-cyan group-hover:underline"
          >
            Ver perfil →
          </Link>
        </div>
      </div>
    </article>
  );
}
