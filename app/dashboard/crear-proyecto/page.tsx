"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";
import { getCursos, getCategorias, type Curso, type Categoria } from "@/lib/api-catalogos";
import { buscarUsuarios, type UsuarioBusqueda } from "@/lib/api-usuarios";
import { crearProyecto, agregarMiembro } from "@/lib/api-proyectos";

export default function CreateProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Paso 1: datos generales
  const [nombre, setNombre] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcionCorta, setDescripcionCorta] = useState("");
  const [descripcionLarga, setDescripcionLarga] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  useEffect(() => {
    Promise.all([getCursos(), getCategorias()])
      .then(([c, cat]) => {
        setCursos(c);
        setCategorias(cat);
      })
      .catch(() => {})
      .finally(() => setCargandoCatalogos(false));
  }, []);

  // Paso 2: búsqueda y asignación de líder
  const [leaderEmail, setLeaderEmail] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [resultados, setResultados] = useState<UsuarioBusqueda[]>([]);
  const [lider, setLider] = useState<UsuarioBusqueda | null>(null);
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null);

    useEffect(() => {
    if (leaderEmail.trim().length < 2) {
      setResultados([]);
      setErrorBusqueda(null);
      return;
    }
    setBuscando(true);
    setErrorBusqueda(null);
    const timeoutId = setTimeout(() => {
      buscarUsuarios(leaderEmail)
        .then((res) => {
          setResultados(res);
          if (res.length === 0) {
            setErrorBusqueda("No se encontró ningún estudiante con ese correo o nombre.");
          }
        })
        .catch((err) => setErrorBusqueda(err.message || "Error al buscar"))
        .finally(() => setBuscando(false));
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [leaderEmail]);

  const seleccionarLider = (u: UsuarioBusqueda) => {
    setLider(u);
    setResultados([]);
  };

  const quitarLider = () => {
    setLider(null);
    setLeaderEmail("");
  };

  // Envío final
  const [creando, setCreando] = useState(false);
  const [errorCrear, setErrorCrear] = useState<string | null>(null);

  const handleCrearProyecto = async () => {
    if (!lider) return;
    setCreando(true);
    setErrorCrear(null);
    try {
      const descripcion = [descripcionCorta, descripcionLarga]
        .filter(Boolean)
        .join("\n\n");
      const proyecto = await crearProyecto({
        nombre,
        descripcion,
        categoriaIds: categoriaId ? [Number(categoriaId)] : [],
        cursoIds: cursoId ? [Number(cursoId)] : [],
      });
      await agregarMiembro(proyecto.id, lider.id, "Líder del proyecto", true);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorCrear(err.message || "Error al crear el proyecto");
    } finally {
      setCreando(false);
    }
  };

  const puedeAvanzarPaso1 = nombre.trim().length >= 3;

  return (
    <div className="bg-tecsup-gray min-h-full flex flex-col">
      <Header defaultView="session" />

      <div className="flex-1 w-[85%] mx-auto transform scale-[0.85] origin-top">
        <div className="max-w-2xl mx-auto px-6 py-8">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-tecsup-dark">Crear Nuevo Proyecto</h1>
            <p className="text-gray-500 text-sm mt-1">
              Completa los datos para asignar un proyecto a un equipo de estudiantes.
            </p>
          </div>

          <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200">
            <button
              onClick={() => setStep(1)}
              className={step === 1 ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-tecsup-cyan text-white" : "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-gray-50"}
            >
              <span className={step === 1 ? "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-white" : "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-gray-300"}>1</span>
              General
            </button>

            <div className="flex-1 h-px bg-gray-200"></div>

            <button
              onClick={() => puedeAvanzarPaso1 && setStep(2)}
              disabled={!puedeAvanzarPaso1}
              className={step === 2 ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-tecsup-cyan text-white" : "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"}
            >
              <span className={step === 2 ? "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-white" : "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-gray-300"}>2</span>
              Asignar Líder
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">

            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-2">Información General</h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Nombre del proyecto</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: EcoCajero"
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Curso asociado</label>
                    <select
                      value={cursoId}
                      onChange={(e) => setCursoId(e.target.value)}
                      disabled={cargandoCatalogos}
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all text-gray-600"
                    >
                      <option value="">
                        {cargandoCatalogos ? "Cargando..." : "Seleccionar curso..."}
                      </option>
                      {cursos.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({c.ciclo})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Categoría</label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      disabled={cargandoCatalogos}
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all text-gray-600"
                    >
                      <option value="">
                        {cargandoCatalogos ? "Cargando..." : "Seleccionar categoría..."}
                      </option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descripción corta</label>
                  <input
                    type="text"
                    value={descripcionCorta}
                    onChange={(e) => setDescripcionCorta(e.target.value)}
                    placeholder="Un resumen de una línea"
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descripción larga</label>
                  <textarea
                    rows={4}
                    value={descripcionLarga}
                    onChange={(e) => setDescripcionLarga(e.target.value)}
                    placeholder="Explica a detalle de qué trata el proyecto..."
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-2">Asignar Líder del Proyecto</h2>
                <p className="text-sm text-gray-500">El líder será el encargado de completar los detalles del proyecto.</p>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Buscar estudiante por correo o nombre</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="nombre@tecsup.edu.pe"
                      className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                    />
                    {buscando && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        Buscando...
                      </span>
                    )}
                  </div>
                  {errorBusqueda && (
                    <p className="text-sm text-red-500 mt-2">{errorBusqueda}</p>
                  )}
                </div>

                {resultados.length > 0 && (
                  <div className="space-y-2">
                    {resultados.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => seleccionarLider(u)}
                        className="w-full flex items-center gap-3 p-4 bg-tecsup-gray rounded-xl border border-gray-100 hover:border-tecsup-cyan/40 transition-colors text-left"
                      >
                        <Avatar name={u.nombre} size="md" />
                        <div>
                          <p className="font-semibold text-sm text-tecsup-dark">{u.nombre}</p>
                          <p className="text-xs text-gray-400">{u.correo}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {lider && (
                  <div className="flex items-center justify-between p-4 bg-tecsup-gray rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar name={lider.nombre} size="md" />
                      <div>
                        <p className="font-semibold text-sm text-tecsup-dark">{lider.nombre}</p>
                        <p className="text-xs text-gray-400">{lider.correo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-tecsup-cyan/15 text-tecsup-cyan text-[11px] font-semibold rounded-full uppercase">Líder</span>
                      <button onClick={quitarLider} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                )}

                {errorCrear && (
                  <p className="text-sm text-red-500">{errorCrear}</p>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              <button onClick={() => step === 2 ? setStep(1) : window.history.back()} className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">
                {step === 1 ? "Cancelar" : "Volver"}
              </button>
              <div className="flex gap-3">
                {step === 1 ? (
                  <button
                    onClick={() => puedeAvanzarPaso1 && setStep(2)}
                    disabled={!puedeAvanzarPaso1}
                    className="px-6 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-full hover:bg-tecsup-cyan/85 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleCrearProyecto}
                    disabled={!lider || creando}
                    className="px-6 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-full hover:bg-tecsup-cyan/85 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creando ? "Creando..." : "Asignar como Líder y Crear"}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}