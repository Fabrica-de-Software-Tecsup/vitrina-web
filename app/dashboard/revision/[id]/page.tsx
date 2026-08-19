"use client";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { obtenerUrlEmbedYoutube } from "@/lib/youtube";
import { getProyectoPorId, actualizarProyecto } from "@/lib/api-proyectos";
import type { Project } from "@/lib/mock-data";

export default function RevisionPage() {
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [cargando, setCargando] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showChangesPanel, setShowChangesPanel] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [successType, setSuccessType] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    getProyectoPorId(id)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setCargando(false));
  }, [id]);

  const handlePublish = async () => {
    if (!project) return;
    setEnviando(true);
    try {
      await actualizarProyecto(project.id, { estado: "PUBLICADO" });
      setProject({ ...project, status: "Publicado" });
      setShowPublishModal(false);
      setSuccessType("published");
      setShowSuccessMessage(
        "Proyecto publicado correctamente. Ahora es visible para todos.",
      );
      setTimeout(() => setShowSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error al publicar:", err);
    } finally {
      setEnviando(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!project) return;
    if (observaciones.trim().length === 0) return;
    setEnviando(true);
    try {
      await actualizarProyecto(project.id, {
        estado: "EN_DESARROLLO",
        observaciones: observaciones.trim(),
      });
      setProject({ ...project, status: "En Desarrollo" });
      setShowChangesPanel(false);
      setObservaciones("");
      setSuccessType("changes");
      setShowSuccessMessage(
        "Observaciones enviadas. El proyecto vuelve a estado En Desarrollo.",
      );
      setTimeout(() => setShowSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Error al solicitar cambios:", err);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-tecsup-gray min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando proyecto...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-tecsup-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold text-tecsup-dark">
            Proyecto no encontrado
          </h1>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-tecsup-cyan hover:underline">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const categoryVariantMap: Record<string, "daw" | "iot" | "otro"> = {
    DAW: "daw",
    IOT: "iot",
  };

  return (
    <div className="bg-tecsup-gray min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {showSuccessMessage && (
          <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              successType === "published"
                ? "bg-tecsup-green text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {successType === "published" ? "✅" : "📝"} {showSuccessMessage}
          </div>
        )}

        {showPublishModal && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setShowPublishModal(false)}
            />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
              <div className="text-center">
                <div className="w-14 h-14 bg-tecsup-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-lg font-bold text-tecsup-dark">
                  ¿Publicar este proyecto?
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Esta acción lo hará visible públicamente. Se registrará tu
                  nombre como docente publicador y la fecha de publicación.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePublish}
                  disabled={enviando}
                  className="flex-1 px-4 py-2.5 bg-tecsup-green text-white text-sm font-semibold rounded-xl hover:bg-tecsup-green/85 transition-colors disabled:opacity-50"
                >
                  {enviando ? "Publicando..." : "Publicar"}
                </button>
              </div>
            </div>
          </>
        )}

        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-400">
            <Link href="/dashboard" className="hover:text-tecsup-dark transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-amber-600 font-medium">Por Revisar</span>
            <span>/</span>
            <span className="text-tecsup-dark font-medium">
              {project.name.split(" — ")[0]}
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-tecsup-dark">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={categoryVariantMap[project.category] || "otro"}
                  >
                    Web
                  </Badge>
                  <Badge variant="En Desarrollo">POR REVISAR</Badge>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    v1
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {project.course} · {project.cycle} ·{" "}
                  {project.views
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  vistas
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
                <img
                  src={project.images[selectedImage]}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>

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

              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-tecsup-dark mb-3">
                    Video demo
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden bg-[#0F0F0F]">
                    {project.youtubeId ? (
                      <iframe
                        src={obtenerUrlEmbedYoutube(project.youtubeId) ?? ""}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500 text-sm">
                          Video no disponible
                        </p>
                      </div>
                    )}
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
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Compartido
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-tecsup-dark mb-4">
                    Equipo
                  </h3>
                  <div className="space-y-3">
                    {project.team.map((member) => (
                      <div
                        key={member.name}
                        className="flex items-center gap-3"
                      >
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
                    <a href={project.links.github} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-tecsup-dark transition-colors">
                      🌐 GitHub
                    </a>
                    <a href={project.links.demo} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-tecsup-dark transition-colors">
                      🌐 Demo en vivo
                    </a>
                    <a href={project.links.figma} target="_blank" className="flex items-center gap-2 text-sm text-gray-600 hover:text-tecsup-dark transition-colors">
                      🌐 Figma
                    </a>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-6"></div>

                <button
                  onClick={() => setShowChangesPanel(!showChangesPanel)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-amber-300 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-colors"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  {showChangesPanel
                    ? "Ocultar observaciones"
                    : "Solicitar cambios"}
                </button>

                {showChangesPanel && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                    <label className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Observaciones para el equipo
                    </label>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      rows={5}
                      placeholder="Describe los cambios necesarios: completar descripción, corregir imágenes, agregar enlace al repositorio..."
                      className="w-full px-3 py-2 text-sm bg-white border border-amber-200 rounded-lg focus:outline-none focus:border-amber-400 resize-none"
                    />
                    <button
                      onClick={handleRequestChanges}
                      disabled={observaciones.trim().length === 0 || enviando}
                      className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                        observaciones.trim().length > 0
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {enviando ? "Enviando..." : "Enviar observaciones"}
                    </button>
                    <p className="text-[10px] text-amber-600/70 text-center">
                      El proyecto volverá a estado "En Desarrollo" para que el
                      equipo corrija.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowPublishModal(true)}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-tecsup-green text-white text-sm font-semibold rounded-xl hover:bg-tecsup-green/85 transition-colors"
                >
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Publicar proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}