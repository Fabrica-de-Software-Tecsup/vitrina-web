"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { getProjectBySlug } from "@/lib/mock-data";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);

  const project = getProjectBySlug(slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLinkedIn = () => {
    if (!project) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      'Mira el proyecto "' +
        project.name +
        '" desarrollado por estudiantes de Tecsup.',
    );
    window.open(
      "https://www.linkedin.com/sharing/share-offsite/?url=" +
        url +
        "&summary=" +
        text,
      "_blank",
    );
  };

  if (!project) {
    return (
      <div className="bg-tecsup-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-tecsup-dark">
            Proyecto no encontrado
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

  const categoryVariantMap: Record<string, "daw" | "iot" | "otro"> = {
    DAW: "daw",
    IOT: "iot",
  };

  return (
    <div className="bg-tecsup-gray min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
          <a href="/" className="hover:text-tecsup-dark transition-colors">
            Proyectos
          </a>
          <span>/</span>
          <span className="text-gray-500">{project.course}</span>
          <span>/</span>
          <span className="text-tecsup-dark font-medium">
            {project.name.split(" — ")[0]}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-tecsup-dark">
                {project.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={categoryVariantMap[project.category] || "otro"}>
                  Web
                </Badge>
                <Badge variant="Publicado">Publicado</Badge>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {project.course} · {project.cycle} ·{" "}
                {project.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                vistas
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShareLinkedIn}
                className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white text-xs font-semibold rounded-lg hover:bg-[#004182] transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Compartir en LinkedIn
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
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
                    Copiar enlace
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Layout 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Imagen principal */}
            <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
              <img
                src={project.images[selectedImage]}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-5 gap-3">
              {project.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={
                    "aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 cursor-pointer transition-all " +
                    (i === selectedImage
                      ? "border-tecsup-cyan scale-95"
                      : "border-transparent hover:border-gray-300")
                  }
                >
                  <img
                    src={img}
                    alt={"Miniatura " + (i + 1)}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Sobre el proyecto */}
            <div>
              <h2 className="text-lg font-bold text-tecsup-dark mb-3">
                Sobre el proyecto
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {project.description}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {project.descriptionLong}
              </p>
            </div>

            {/* Video + Stats */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-tecsup-dark mb-3">
                  Video demo
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-[#0F0F0F]">
                  <iframe
                    src={"https://www.youtube.com/embed/" + project.youtubeId}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="w-36 shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <p className="text-lg font-bold text-tecsup-dark">
                    {project.views}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Vistas</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center mt-4">
                  <p className="text-lg font-bold text-tecsup-dark">
                    {project.shares}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Compartido</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-tecsup-dark mb-4">
                  Equipo
                </h3>
                <div className="space-y-3">
                  {project.team.map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <Avatar name={member.name} size="md" />
                      <div>
                        <p className="text-sm font-semibold text-tecsup-dark">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-tecsup-dark mb-3">
                  Tecnologías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 bg-tecsup-gray rounded-full text-gray-600 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-tecsup-dark mb-3">
                  Enlaces
                </h3>
                <div className="space-y-2">
                  <a
                    href={project.links.github}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-tecsup-dark transition-colors"
                  >
                    🌐 GitHub
                  </a>
                  <a
                    href={project.links.demo}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-tecsup-dark transition-colors"
                  >
                    🌐 Demo en vivo
                  </a>
                  <a
                    href={project.links.figma}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-tecsup-dark transition-colors"
                  >
                    🌐 Figma
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-tecsup-dark text-white text-sm font-semibold rounded-xl hover:bg-tecsup-dark/85 transition-colors">
                <svg
                  className="w-5 h-5"
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
                Descargar compilado
                <span className="text-white/60">(.zip · 24 MB)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
