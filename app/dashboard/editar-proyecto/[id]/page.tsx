"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";

interface UploadedFile {
  name: string;
  url: string;
  file: File;
}

export default function EditProjectPage() {
  const [step, setStep] = useState(1);
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState([
    "React",
    "Node.js",
    "PostgreSQL",
  ]);
  const [memberEmail, setMemberEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState([
    { name: "Carlos Quispe", email: "cquispe@tecsup.edu.pe" },
  ]);

  const [images, setImages] = useState<UploadedFile[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");

  // ✅ NUEVOS: Enlaces obligatorios
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  // Estados para el Paso 4
  const [howBuilt, setHowBuilt] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [future, setFuture] = useState("");

  // Key para forzar re-render del input de imágenes
  const [imageInputKey, setImageInputKey] = useState(0);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // ✅ NUEVO: Estado para el modal de cancelación
  const [showCancelModal, setShowCancelModal] = useState(false);

  const addTech = () => {
    if (techInput.trim() && !technologies.includes(techInput)) {
      setTechnologies([...technologies, techInput]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  const handleAddMember = () => {
    if (memberEmail.trim() === "") return;

    const namePart = memberEmail.split("@")[0];
    const formattedName =
      namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(".", " ");
    const exists = teamMembers.find(
      (m) => m.email === memberEmail.toLowerCase(),
    );

    if (!exists) {
      setTeamMembers([
        ...teamMembers,
        { name: formattedName, email: memberEmail.toLowerCase() },
      ]);
      setMemberEmail("");
    }
  };

  const handleRemoveMember = (emailToRemove: string) => {
    setTeamMembers(teamMembers.filter((m) => m.email !== emailToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setImages((prev) => {
      const updated = [...prev, ...newImages];
      return updated.slice(0, 5);
    });

    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImageInputKey((prev) => prev + 1);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setZipFile(e.target.files[0]);
    }
    e.target.value = "";
  };

  const handleRemoveZip = () => {
    setZipFile(null);
    if (zipInputRef.current) {
      zipInputRef.current.value = "";
    }
  };

  // ✅ NUEVO: Función para validar URL de YouTube
  const isValidYoutubeUrl = (url: string) => {
    if (!url.trim()) return false;
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]+/;
    return pattern.test(url.trim());
  };

  // ✅ NUEVO: Función para validar URL de GitHub
  const isValidGithubUrl = (url: string) => {
    if (!url.trim()) return false;
    const pattern =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/;
    return pattern.test(url.trim());
  };

  // ⚡ STEPPER INTELIGENTE
  useEffect(() => {
    if (step === 1 && longDesc.length > 20 && technologies.length > 0) {
      setStep(2);
    } else if (step === 2 && teamMembers.length > 1) {
      setStep(3);
    } else if (step === 3 && images.length >= 5 && zipFile) {
      setStep(4);
    }
  }, [
    step,
    longDesc,
    technologies.length,
    teamMembers.length,
    images.length,
    zipFile,
  ]);

  // ✅ ACTUALIZADO: Validación global con YouTube y GitHub obligatorios
  const isFormComplete =
    shortDesc.trim().length > 0 &&
    longDesc.trim().length > 20 &&
    technologies.length > 0 &&
    images.length === 5 &&
    zipFile !== null &&
    isValidYoutubeUrl(youtubeUrl) &&
    isValidGithubUrl(githubUrl) &&
    howBuilt.trim().length > 0 &&
    challenges.trim().length > 0 &&
    lessons.trim().length > 0 &&
    future.trim().length > 0;

  // ✅ NUEVO: Acción de cancelar con confirmación
  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    // Navegar al dashboard de forma segura (no usa history.back)
    window.location.href = "/dashboard";
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
  };

  return (
    <div className="bg-tecsup-gray min-h-full flex flex-col">
      <Header role="student" />

      {/* ✅ NUEVO: Modal de confirmación para cancelar */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCancelModal}
          />

          {/* Contenido del modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform animate-in fade-in zoom-in duration-200">
            {/* Ícono de advertencia */}
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-tecsup-dark text-center mb-2">
              ¿Cancelar edición?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Si sales ahora, perderás todos los cambios que no hayas enviado.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeCancelModal}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Seguir editando
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-[90%] mx-auto transform scale-[0.9] origin-top">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Cabecera y Aviso Crítico */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-tecsup-dark">
                  Editando: EcoCajero
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  Campos bloqueados asignados por el docente
                </p>
              </div>
              <button className="px-5 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-full hover:bg-tecsup-cian/85 shadow-sm">
                Guardar Cambios
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-xs text-amber-700 font-medium">
                Los campos de Nombre, Curso y Categoría fueron asignados por tu
                docente y no pueden ser modificados.
              </p>
            </div>
          </div>

          {/* Stepper Horizontal */}
          <div className="flex items-center gap-2 mb-8 bg-white p-3 rounded-xl border border-gray-200 overflow-x-auto">
            {["1 General", "2 Equipo", "3 Multimedia", "4 Reflexión"].map(
              (s, i) => (
                <button
                  key={s}
                  onClick={() => setStep(i + 1)}
                  className={
                    step === i + 1
                      ? "bg-tecsup-cyan text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shadow-sm"
                      : "text-gray-400 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                  }
                >
                  {s}
                </button>
              ),
            )}
          </div>

          {/* Layout de 2 Columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ================= COLUMNA IZQUIERDA ================= */}
            <div className="space-y-8">
              {/* PASO 1: Info General */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                  PASO 1: Información General
                </h2>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Nombre del proyecto 🔒
                  </label>
                  <input
                    type="text"
                    value="EcoCajero — Recompensas por reciclaje"
                    readOnly
                    className="w-full px-4 py-3 text-sm bg-tecsup-gray text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Curso 🔒
                  </label>
                  <input
                    type="text"
                    value="Desarrollo de Aplicaciones Web"
                    readOnly
                    className="w-full px-4 py-3 text-sm bg-tecsup-gray text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Categoría 🔒
                  </label>
                  <input
                    type="text"
                    value="DAW"
                    readOnly
                    className="w-full px-4 py-3 text-sm bg-tecsup-gray text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed"
                  />
                </div>

                <div className="border-t border-dashed border-gray-200 my-6"></div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Descripción corta
                  </label>
                  <input
                    type="text"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Un resumen de una línea"
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Descripción larga
                  </label>
                  <textarea
                    rows={4}
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    placeholder="Escribe aquí la descripción detallada del proyecto..."
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Tecnologías
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-tecsup-gray text-gray-600 pl-3 pr-1 py-1.5 rounded-full text-xs font-medium flex items-center gap-2"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(tech)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Ej: Tailwind"
                      className="flex-1 px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                      onKeyDown={(e) => e.key === "Enter" && addTech()}
                    />
                    <button
                      onClick={addTech}
                      className="px-3 py-2 bg-tecsup-dark text-white text-xs font-bold rounded-lg hover:bg-tecsup-dark/85"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* PASO 2: Equipo */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                  PASO 2: Equipo
                </h2>

                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Buscar estudiante por correo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="Escribe un correo..."
                      className="flex-1 px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cian/40 focus:outline-none transition-all"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddMember();
                      }}
                    />
                    <button
                      onClick={handleAddMember}
                      className="px-5 py-3 bg-tecsup-dark text-white text-sm font-semibold rounded-xl hover:bg-tecsup-dark/85 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-tecsup-gray rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar name="Valeria Caceres" size="md" />
                      <div>
                        <p className="font-semibold text-sm text-tecsup-dark">
                          Valeria Cáceres
                        </p>
                        <p className="text-xs text-gray-400">
                          vccama@tecsup.edu.pe
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-tecsup-purple/15 text-tecsup-purple text-[11px] font-semibold rounded-full uppercase">
                        Líder
                      </span>
                      <span
                        className="text-gray-400"
                        title="No se puede eliminar"
                      >
                        🔒
                      </span>
                    </div>
                  </div>

                  {teamMembers.map((member) => (
                    <div
                      key={member.email}
                      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} size="md" />
                        <div>
                          <p className="font-semibold text-sm text-tecsup-dark">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-full uppercase">
                          Miembro
                        </span>
                        <button
                          onClick={() => handleRemoveMember(member.email)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================= COLUMNA DERECHA ================= */}
            <div className="space-y-8">
              {/* PASO 3: Multimedia */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                  PASO 3: Multimedia
                </h2>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Galería de fotos{" "}
                    <span className="text-gray-400 font-normal normal-case">
                      {" "}
                      (Máx. 5 archivos · Máx. 5MB c/u)
                    </span>
                  </label>

                  <input
                    key={`image-input-${imageInputKey}`}
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:rounded-xl border border-dashed border-gray-300 hover:border-tecsup-cian/50 file:bg-white file:text-gray-500 cursor-pointer"
                  />

                  <div className="grid grid-cols-5 gap-3 mt-3">
                    {[...Array(5)].map((_, i) => {
                      const img = images[i];
                      const isEmpty = !img;
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group ${isEmpty ? "" : "border-tecsup-cyan border-solid"}`}
                        >
                          {isEmpty ? (
                            <>
                              <svg
                                className="w-8 h-8 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-[10px] text-gray-400 mt-1">
                                {i + 1}/5
                              </span>
                            </>
                          ) : (
                            <>
                              <img
                                src={img.url}
                                alt={img.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent pt-6">
                                <p className="text-[10px] text-white text-center px-1 truncate">
                                  {img.name}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveImage(i)}
                                className="absolute top-1.5 right-1.5 bg-red-500 text-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg hover:bg-red-600"
                              >
                                ×
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {images.length}/5 imágenes seleccionadas
                  </p>
                </div>

                {/* ✅ MEJORADO: YouTube con validación visual */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Video (YouTube) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-white rounded-xl border transition-all focus:outline-none ${
                        youtubeUrl && !isValidYoutubeUrl(youtubeUrl)
                          ? "border-red-300 focus:border-red-400 bg-red-50/30"
                          : "border-gray-200 focus:border-tecsup-cyan/40"
                      }`}
                    />
                  </div>
                  {youtubeUrl && !isValidYoutubeUrl(youtubeUrl) && (
                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Ingresa un enlace válido de YouTube
                    </p>
                  )}
                </div>

                {/* ✅ MEJORADO: GitHub con validación visual */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Enlace a GitHub <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </div>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/usuario/repositorio"
                      className={`w-full pl-10 pr-4 py-3 text-sm bg-white rounded-xl border transition-all focus:outline-none ${
                        githubUrl && !isValidGithubUrl(githubUrl)
                          ? "border-red-300 focus:border-red-400 bg-red-50/30"
                          : "border-gray-200 focus:border-tecsup-cyan/40"
                      }`}
                    />
                  </div>
                  {githubUrl && !isValidGithubUrl(githubUrl) && (
                    <p className="text-[11px] text-red-500 mt-1.5 flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Ingresa un enlace válido de GitHub (ej:
                      github.com/user/repo)
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Compilado / Build descargable
                  </label>

                  <input
                    ref={zipInputRef}
                    type="file"
                    accept=".zip,.rar,.7z,.apk"
                    onChange={handleZipChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:rounded-xl border border-dashed border-gray-300 hover:border-tecsup-cyan/50 file:bg-white file:text-gray-500 cursor-pointer"
                  />

                  {zipFile && (
                    <div className="flex items-center justify-between mt-2 p-3 bg-tecsup-green/10 rounded-lg border border-tecsup-green/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-tecsup-green/20 rounded-lg flex items-center justify-center text-tecsup-green">
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
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-tecsup-dark">
                            {zipFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveZip}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* PASO 4: Reflexiones */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                  PASO 4: Reflexiones
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      ¿Cómo lo construyeron?
                    </label>
                    <textarea
                      value={howBuilt}
                      onChange={(e) => setHowBuilt(e.target.value)}
                      rows={3}
                      placeholder="Describe el proceso de desarrollo..."
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cian/40 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      ¿Qué retos superaron?
                    </label>
                    <textarea
                      value={challenges}
                      onChange={(e) => setChallenges(e.target.value)}
                      rows={3}
                      placeholder="Los obstáculos que enfrentaron..."
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cian/40 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      ¿Cuál fue la mayor lección aprendida?
                    </label>
                    <textarea
                      value={lessons}
                      onChange={(e) => setLessons(e.target.value)}
                      rows={3}
                      placeholder="Lo más valioso que aprendieron..."
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cian/40 focus:outline-none transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      ¿Qué harían diferente?
                    </label>
                    <textarea
                      value={future}
                      onChange={(e) => setFuture(e.target.value)}
                      rows={3}
                      placeholder="Mejoras para una futura versión..."
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cian/40 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones Finales */}
          <div className="flex justify-end items-center gap-3 mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancelar
            </button>

            <button
              disabled={!isFormComplete}
              className={`px-8 py-2.5 text-sm font-semibold rounded-full transition-all shadow-sm flex items-center gap-2 ${
                isFormComplete
                  ? "bg-tecsup-cyan text-white hover:bg-tecsup-cyan/85 cursor-pointer hover:shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isFormComplete ? (
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Enviar
                </>
              ) : (
                "Enviar"
              )}
            </button>
          </div>

          {/* Indicador de progreso del formulario */}
          {!isFormComplete && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-2">
                Para habilitar el botón "Enviar", completa:
              </p>
              <div className="flex flex-wrap gap-2">
                {!shortDesc.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Descripción corta
                  </span>
                )}
                {longDesc.trim().length <= 20 && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Descripción larga (mín. 20 car.)
                  </span>
                )}
                {technologies.length === 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Al menos 1 tecnología
                  </span>
                )}
                {images.length < 5 && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    5 imágenes ({images.length}/5)
                  </span>
                )}
                {!zipFile && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Archivo ZIP
                  </span>
                )}
                {!isValidYoutubeUrl(youtubeUrl) && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Enlace de YouTube válido
                  </span>
                )}
                {!isValidGithubUrl(githubUrl) && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Enlace de GitHub válido
                  </span>
                )}
                {!howBuilt.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    ¿Cómo lo construyeron?
                  </span>
                )}
                {!challenges.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    ¿Qué retos superaron?
                  </span>
                )}
                {!lessons.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    Lección aprendida
                  </span>
                )}
                {!future.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    ¿Qué harían diferente?
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
