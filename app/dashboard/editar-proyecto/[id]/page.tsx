"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import {
  getProyectoRawPorId,
  actualizarProyecto,
  subirImagenProyecto,
  subirBuildProyecto,
  agregarMiembro,
  quitarMiembro,
  actualizarImagenProyecto,
  eliminarImagenProyecto,
  type ProyectoApi,
} from "@/lib/api-proyectos";
import {
  getTecnologias,
  crearTecnologia,
  getCursos,
  getCategorias,
  type Tecnologia,
  type Curso,
  type Categoria,
} from "@/lib/api-catalogos";
import { buscarUsuarios, type UsuarioBusqueda } from "@/lib/api-usuarios";
import { obtenerUsuarioDesdeToken } from "@/lib/auth";

const MIN_IMAGENES = 4;
const MAX_IMAGENES = 10;
export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proyecto, setProyecto] = useState<ProyectoApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const usuarioActual = obtenerUsuarioDesdeToken();
  const puedeCrearTecnologia =
    usuarioActual?.rol === "DOCENTE" || usuarioActual?.rol === "ADMIN";

  const [step, setStep] = useState(1);

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cursoId, setCursoId] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [catalogoTech, setCatalogoTech] = useState<Tecnologia[]>([]);
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([]);
  const [nuevaTechNombre, setNuevaTechNombre] = useState("");
  const [creandoTech, setCreandoTech] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");
  const [buscandoMiembro, setBuscandoMiembro] = useState(false);
  const [resultadosMiembro, setResultadosMiembro] = useState<UsuarioBusqueda[]>([]);
  const [teamMembers, setTeamMembers] = useState<
    { usuarioId: string; nombre: string; rol: string }[]
  >([]);

  const [imagenes, setImagenes] = useState<{ id: string; url: string; esPortada: boolean; orden: number }[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [procesandoImagen, setProcesandoImagen] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [buildUrl, setBuildUrl] = useState<string | null>(null);
  const [subiendoZip, setSubiendoZip] = useState(false);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [howBuilt, setHowBuilt] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [future, setFuture] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getProyectoRawPorId(id), getTecnologias(), getCursos(), getCategorias()])
      .then(([p, techs, cursosData, categoriasData]) => {
        setProyecto(p);
        setCatalogoTech(techs);
        setCursos(cursosData);
        setCategorias(categoriasData);
        setCursoId(p.cursos[0]?.curso.id ? String(p.cursos[0].curso.id) : "");
        setCategoriaId(p.categorias[0]?.categoria.id ? String(p.categorias[0].categoria.id) : "");
        setSelectedTechIds(p.tecnologias.map((t) => t.tecnologia.id));
        setTeamMembers(
          p.miembros.map((m) => ({
            usuarioId: m.usuarioId,
            nombre: m.usuario.nombre,
            rol: m.rol,
          })),
        );
        setImagenes(p.imagenes);
        setYoutubeUrl(p.youtubeUrl ?? "");
        setGithubUrl(p.githubUrl ?? "");
        setHowBuilt(p.comoLoConstruyeron ?? "");
        setChallenges(p.retosSuperados ?? "");
        setLessons(p.leccionAprendida ?? "");
        setFuture(p.queHarianDiferente ?? "");
        if (p.descripcion) {
          const partes = p.descripcion.split("\n\n");
          setShortDesc(partes[0] ?? "");
          setLongDesc(partes.slice(1).join("\n\n") ?? "");
        }
      })
      .catch(() => setErrorCarga("No se pudo cargar el proyecto."))
      .finally(() => setCargando(false));
  }, [id]);

  const toggleTech = (techId: number) => {
    setSelectedTechIds((prev) =>
      prev.includes(techId) ? prev.filter((t) => t !== techId) : [...prev, techId],
    );
  };

  const handleCrearTecnologia = async () => {
    if (!nuevaTechNombre.trim()) return;
    setCreandoTech(true);
    try {
      const nueva = await crearTecnologia(nuevaTechNombre.trim(), "herramienta");
      setCatalogoTech((prev) => [...prev, nueva]);
      setSelectedTechIds((prev) => [...prev, nueva.id]);
      setNuevaTechNombre("");
    } catch {
      // silencioso, el input se queda para reintentar
    } finally {
      setCreandoTech(false);
    }
  };

  useEffect(() => {
    if (memberEmail.trim().length < 2) {
      setResultadosMiembro([]);
      return;
    }
    setBuscandoMiembro(true);
    const timeoutId = setTimeout(() => {
      buscarUsuarios(memberEmail)
        .then(setResultadosMiembro)
        .catch(() => setResultadosMiembro([]))
        .finally(() => setBuscandoMiembro(false));
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [memberEmail]);

  const handleAddMember = async (u: UsuarioBusqueda) => {
    if (teamMembers.some((m) => m.usuarioId === u.id)) return;
    try {
      await agregarMiembro(id, u.id, "Colaborador", false);
      setTeamMembers((prev) => [...prev, { usuarioId: u.id, nombre: u.nombre, rol: "Colaborador" }]);
      setMemberEmail("");
      setResultadosMiembro([]);
    } catch {
      // silencioso
    }
  };

  const handleRemoveMember = async (usuarioId: string) => {
    try {
      await quitarMiembro(id, usuarioId);
      setTeamMembers((prev) => prev.filter((m) => m.usuarioId !== usuarioId));
    } catch {
      // el backend rechaza quitar al creador; se ignora silenciosamente
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;
    setSubiendoImagen(true);
    let cantidadActual = imagenes.length;
    try {
      for (const file of files) {
        if (cantidadActual >= MAX_IMAGENES) break;
        const actualizado = await subirImagenProyecto(id, file, cantidadActual === 0);
        setImagenes([...actualizado.imagenes].sort((a, b) => a.orden - b.orden));
        cantidadActual = actualizado.imagenes.length;
      }
    } catch {
      // silencioso
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleRemoveImage = async (imagenId: string) => {
    setProcesandoImagen(true);
    try {
      const actualizado = await eliminarImagenProyecto(id, imagenId);
      setImagenes(actualizado.imagenes);
    } catch {
      // silencioso
    } finally {
      setProcesandoImagen(false);
    }
  };

  const handleSetPortada = async (imagenId: string) => {
    setProcesandoImagen(true);
    try {
      const actualizado = await actualizarImagenProyecto(id, imagenId, { esPortada: true });
      setImagenes(actualizado.imagenes);
    } catch {
      // silencioso
    } finally {
      setProcesandoImagen(false);
    }
  };

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      return;
    }
    const reordenadas = [...imagenes];
    const [movida] = reordenadas.splice(dragIndex, 1);
    reordenadas.splice(dropIndex, 0, movida);
    setImagenes(reordenadas);
    setDragIndex(null);

    setProcesandoImagen(true);
    try {
      await Promise.all(
        reordenadas.map((img, idx) =>
          actualizarImagenProyecto(id, img.id, { orden: idx }),
        ),
      );
    } catch {
      // silencioso; el orden visual ya se aplicó
    } finally {
      setProcesandoImagen(false);
    }
  };

  const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setSubiendoZip(true);
    try {
      const actualizado = await subirBuildProyecto(id, file);
      setBuildUrl((actualizado as any).buildUrl ?? "subido");
    } catch {
      // silencioso
    } finally {
      setSubiendoZip(false);
    }
  };

  const isValidYoutubeUrl = (url: string) => {
    if (!url.trim()) return false;
    const pattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]+/;
    return pattern.test(url.trim());
  };

  const isValidGithubUrl = (url: string) => {
    if (!url.trim()) return false;
    const pattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/;
    return pattern.test(url.trim());
  };

  useEffect(() => {
    if (step === 1 && longDesc.length > 20 && selectedTechIds.length > 0) {
      setStep(2);
    } else if (step === 2 && teamMembers.length > 1) {
      setStep(3);
    } else if (step === 3 && imagenes.length >= MIN_IMAGENES && buildUrl) {
      setStep(4);
    }
  }, [step, longDesc, selectedTechIds.length, teamMembers.length, imagenes.length, buildUrl]);

  const isFormComplete =
    shortDesc.trim().length > 0 &&
    longDesc.trim().length > 20 &&
    selectedTechIds.length > 0 &&
    imagenes.length >= MIN_IMAGENES &&
    buildUrl !== null &&
    isValidYoutubeUrl(youtubeUrl) &&
    isValidGithubUrl(githubUrl) &&
    howBuilt.trim().length > 0 &&
    challenges.trim().length > 0 &&
    lessons.trim().length > 0 &&
    future.trim().length > 0;

  const handleSubmit = async () => {
    if (!isFormComplete) return;
    setEnviando(true);
    setErrorEnvio(null);
    try {
      const descripcion = [shortDesc, longDesc].filter(Boolean).join("\n\n");
      await actualizarProyecto(id, {
        descripcion,
        tecnologiaIds: selectedTechIds,
        cursoIds: cursoId ? [Number(cursoId)] : [],
        categoriaIds: categoriaId ? [Number(categoriaId)] : [],
        youtubeUrl,
        githubUrl,
        comoLoConstruyeron: howBuilt,
        retosSuperados: challenges,
        leccionAprendida: lessons,
        queHarianDiferente: future,
        estado: "POR_REVISAR",
      });
      setShowSuccessModal(true);
    } catch (err: any) {
      setErrorEnvio(err.message || "Error al enviar el proyecto");
    } finally {
      setEnviando(false);
    }
  };

  const handleCancel = () => setShowCancelModal(true);
  const confirmCancel = () => router.push("/dashboard");
  const closeCancelModal = () => setShowCancelModal(false);

  if (cargando) {
    return (
      <div className="bg-tecsup-gray min-h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando proyecto...</p>
      </div>
    );
  }

  if (errorCarga || !proyecto) {
    return (
      <div className="bg-tecsup-gray min-h-full flex items-center justify-center">
        <p className="text-red-500 text-sm">{errorCarga ?? "Proyecto no encontrado"}</p>
      </div>
    );
  }

    return (
    <div className="bg-tecsup-gray min-h-full flex flex-col">
      <Header defaultView="session" />

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCancelModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-tecsup-dark text-center mb-2">¿Cancelar edición?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Si sales ahora, perderás los cambios sin enviar.
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
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-14 h-14 bg-tecsup-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h3 className="text-lg font-bold text-tecsup-dark mb-2">¡Proyecto enviado!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Tu proyecto quedó en revisión. El docente lo evaluará pronto.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full px-4 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-xl hover:bg-tecsup-cyan/85 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 w-[90%] mx-auto py-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-tecsup-dark">
              Completar Proyecto: {proyecto.nombre}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Completa toda la información para enviar tu proyecto a revisión.
            </p>
          </div>

          {proyecto.observaciones && (
            <div className="mb-6 p-5 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="text-sm font-bold text-amber-800 mb-1">
                    Recomendaciones del docente
                  </h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    {proyecto.observaciones}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* PASO 1 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                PASO 1: Descripción y Tecnologías
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Curso asociado
                    </label>
                    <select
                      value={cursoId}
                      onChange={(e) => setCursoId(e.target.value)}
                      disabled={!puedeCrearTecnologia}
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all text-gray-600 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Sin curso asignado</option>
                      {cursos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({c.ciclo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Categoría
                    </label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      disabled={!puedeCrearTecnologia}
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all text-gray-600 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Sin categoría asignada</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
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
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Descripción larga
                  </label>
                  <textarea
                    value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)}
                    rows={4}
                    placeholder="Explica a detalle de qué trata el proyecto..."
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Tecnologías utilizadas
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {catalogoTech.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTech(t.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedTechIds.includes(t.id)
                            ? "bg-tecsup-cyan text-white border-tecsup-cyan"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {t.nombre}
                      </button>
                    ))}
                  </div>
                  {puedeCrearTecnologia && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevaTechNombre}
                        onChange={(e) => setNuevaTechNombre(e.target.value)}
                        placeholder="Agregar tecnología nueva al catálogo..."
                        className="flex-1 px-3 py-2 text-xs bg-white rounded-lg border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none"
                      />
                      <button
                        onClick={handleCrearTecnologia}
                        disabled={creandoTech || !nuevaTechNombre.trim()}
                        className="px-3 py-2 bg-tecsup-dark text-white text-xs font-semibold rounded-lg hover:bg-tecsup-dark/85 transition-colors disabled:opacity-50"
                      >
                        {creandoTech ? "..." : "+ Agregar"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PASO 2 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                PASO 2: Equipo
              </h2>
              <div className="space-y-3 mb-4">
                {teamMembers.map((m) => (
                  <div
                    key={m.usuarioId}
                    className="flex items-center justify-between p-3 bg-tecsup-gray rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={m.nombre} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-tecsup-dark">{m.nombre}</p>
                        <p className="text-[11px] text-gray-400">{m.rol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(m.usuarioId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Buscar estudiante por correo o nombre..."
                  className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                />
                {buscandoMiembro && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    Buscando...
                  </span>
                )}
              </div>
              {resultadosMiembro.length > 0 && (
                <div className="mt-2 space-y-2">
                  {resultadosMiembro.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleAddMember(u)}
                      className="w-full flex items-center gap-3 p-3 bg-tecsup-gray rounded-xl hover:border-tecsup-cyan/40 border border-transparent transition-colors text-left"
                    >
                      <Avatar name={u.nombre} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-tecsup-dark">{u.nombre}</p>
                        <p className="text-[11px] text-gray-400">{u.correo}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PASO 3 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">
                PASO 3: Multimedia
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Imágenes ({imagenes.length}/{MAX_IMAGENES}) · mínimo {MIN_IMAGENES}
                  </label>
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {imagenes.map((img, index) => (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`aspect-square rounded-lg overflow-hidden bg-gray-100 relative cursor-move group border-2 ${
                          dragIndex === index ? "border-tecsup-cyan opacity-50" : "border-transparent"
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover pointer-events-none" />
                        {img.esPortada && (
                          <span className="absolute top-1 left-1 text-[9px] bg-tecsup-cyan text-white px-1.5 py-0.5 rounded-full">
                            Portada
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          {!img.esPortada && (
                            <button
                              type="button"
                              draggable={false}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={() => handleSetPortada(img.id)}
                              disabled={procesandoImagen}
                              title="Marcar como portada"
                              className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-tecsup-cyan hover:bg-white text-xs"
                            >
                              ★
                            </button>
                          )}
                          <button
                            type="button"
                            draggable={false}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => handleRemoveImage(img.id)}
                            disabled={procesandoImagen}
                            title="Eliminar imagen"
                            className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-white text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {imagenes.length > 1 && (
                    <p className="text-[10px] text-gray-400 mb-2">
                      Arrastra las imágenes para reordenarlas. Pasa el mouse sobre una para marcarla como portada o eliminarla.
                    </p>
                  )}
                  {imagenes.length < MAX_IMAGENES && (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 cursor-pointer hover:border-tecsup-cyan/40 transition-colors">
                      {subiendoImagen ? "Subiendo..." : "Subir imagen"}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={subiendoImagen}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Build compilado (.zip)
                  </label>
                  {buildUrl ? (
                    <div className="flex items-center justify-between p-3 bg-tecsup-gray rounded-xl">
                      <span className="text-sm text-gray-600">✅ Archivo subido correctamente</span>
                      <button
                        onClick={() => zipInputRef.current?.click()}
                        className="text-xs text-tecsup-cyan hover:underline"
                      >
                        Reemplazar
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 cursor-pointer hover:border-tecsup-cyan/40 transition-colors">
                      {subiendoZip ? "Subiendo..." : "Subir archivo .zip"}
                      <input
                        ref={zipInputRef}
                        type="file"
                        accept=".zip"
                        onChange={handleZipChange}
                        disabled={subiendoZip}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Enlace de YouTube
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Enlace de GitHub
                  </label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/usuario/repo"
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* PASO 4 */}
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
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
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
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
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
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
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
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {errorEnvio && (
            <p className="text-sm text-red-500 mt-4">{errorEnvio}</p>
          )}

          <div className="flex justify-end items-center gap-3 mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancelar
            </button>
            <button
              disabled={!isFormComplete || enviando}
              onClick={handleSubmit}
              className={`px-8 py-2.5 text-sm font-semibold rounded-full transition-all shadow-sm ${
                isFormComplete
                  ? "bg-tecsup-cyan text-white hover:bg-tecsup-cyan/85 cursor-pointer hover:shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {enviando ? "Enviando..." : "Enviar a revisión"}
            </button>
          </div>

          {!isFormComplete && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-2">
                Para habilitar el botón "Enviar", completa:
              </p>
              <div className="flex flex-wrap gap-2">
                {!shortDesc.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Descripción corta</span>
                )}
                {longDesc.trim().length <= 20 && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Descripción larga (mín. 20 car.)</span>
                )}
                {selectedTechIds.length === 0 && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Al menos 1 tecnología</span>
                )}
                {imagenes.length < MIN_IMAGENES && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Mínimo {MIN_IMAGENES} imágenes ({imagenes.length}/{MIN_IMAGENES})</span>
                )}
                {!buildUrl && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Archivo ZIP</span>
                )}
                {!isValidYoutubeUrl(youtubeUrl) && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Enlace de YouTube válido</span>
                )}
                {!isValidGithubUrl(githubUrl) && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Enlace de GitHub válido</span>
                )}
                {!howBuilt.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">¿Cómo lo construyeron?</span>
                )}
                {!challenges.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">¿Qué retos superaron?</span>
                )}
                {!lessons.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">Lección aprendida</span>
                )}
                {!future.trim() && (
                  <span className="text-[11px] px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">¿Qué harían diferente?</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}