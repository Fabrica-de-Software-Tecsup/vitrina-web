"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIAS_MOCK = ["Web", "Mobile", "IoT", "Datos e IA", "Redes"];
const TECNOLOGIAS_MOCK = ["React", "NestJS", "Next.js", "PostgreSQL", "Docker", "Python", "Flutter", "Firebase"];
const CURSOS_MOCK = ["Desarrollo de Aplicaciones Web", "Internet de las Cosas", "Inteligencia Artificial", "Redes y Comunicaciones"];

interface Miembro {
  correo: string;
  nombre: string;
  rol: string;
  esLider: boolean;
}

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);

  // Paso 1
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cursosSeleccionados, setCursosSeleccionados] = useState<string[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<string[]>([]);
  const [tecnologiasSeleccionadas, setTecnologiasSeleccionadas] = useState<string[]>([]);

  // Paso 2
  const [correoNuevoMiembro, setCorreoNuevoMiembro] = useState("");
  const [miembros, setMiembros] = useState<Miembro[]>([]);

  // Paso 3
  const [enlaceVideo, setEnlaceVideo] = useState("");
  const [enlaceRepo, setEnlaceRepo] = useState("");

  // Paso 4
  const [comoLoConstruyeron, setComoLoConstruyeron] = useState("");
  const [queRetosSuperraron, setQueRetosSuperaron] = useState("");

  function alternarSeleccion(lista: string[], setLista: (v: string[]) => void, valor: string) {
    if (lista.includes(valor)) {
      setLista(lista.filter((v) => v !== valor));
    } else {
      setLista([...lista, valor]);
    }
  }

  function agregarMiembro() {
    if (!correoNuevoMiembro.trim()) return;
    setMiembros([
      ...miembros,
      { correo: correoNuevoMiembro, nombre: correoNuevoMiembro.split("@")[0], rol: "Miembro", esLider: miembros.length === 0 },
    ]);
    setCorreoNuevoMiembro("");
  }

  function quitarMiembro(correo: string) {
    setMiembros(miembros.filter((m) => m.correo !== correo));
  }

  function guardarBorrador() {
    // TODO: conectar a POST /proyectos cuando el backend de Dustin este listo
    alert("Guardado como borrador (simulado - backend de proyectos pendiente)");
    router.push("/dashboard");
  }

  function publicarProyecto() {
    // TODO: conectar a POST /proyectos + PATCH estado cuando el backend este listo
    alert("Proyecto publicado (simulado - backend de proyectos pendiente)");
    router.push("/dashboard");
  }

  const pasos = ["General", "Equipo", "Multimedia", "Reflexión"];

  return (
    <div className="min-h-screen bg-tecsup-gray">
      <header className="bg-tecsup-cyan text-white px-10 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Vitrina</span>
        <nav className="flex items-center gap-6 text-sm">
          <span className="cursor-pointer">Explorar</span>
          <span className="cursor-pointer">Estudiantes</span>
          <span className="cursor-pointer">Cursos</span>
          <span className="cursor-pointer font-semibold">Mis proyectos</span>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-xl font-bold text-tecsup-dark mb-6">
            {nombre ? `Editando: ${nombre}` : "Crear nuevo proyecto"}
          </h1>

          {/* Indicador de pasos */}
          <div className="flex items-center mb-8">
            {pasos.map((p, i) => (
              <div key={p} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ${
                      paso === i + 1
                        ? "bg-tecsup-cyan text-white"
                        : paso > i + 1
                        ? "bg-tecsup-green text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                    onClick={() => setPaso(i + 1)}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{p}</span>
                </div>
                {i < pasos.length - 1 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>

          {/* PASO 1: General */}
          {paso === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del proyecto</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Qhatu"
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción corta</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Un proyecto que..."
                  className="w-full border rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cursos asociados</label>
                <div className="flex flex-wrap gap-2">
                  {CURSOS_MOCK.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => alternarSeleccion(cursosSeleccionados, setCursosSeleccionados, c)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${
                        cursosSeleccionados.includes(c)
                          ? "bg-tecsup-cyan text-white border-tecsup-cyan"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categorías</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIAS_MOCK.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => alternarSeleccion(categoriasSeleccionadas, setCategoriasSeleccionadas, c)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${
                        categoriasSeleccionadas.includes(c)
                          ? "bg-tecsup-purple text-white border-tecsup-purple"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tecnologías del catálogo</label>
                <div className="flex flex-wrap gap-2">
                  {TECNOLOGIAS_MOCK.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => alternarSeleccion(tecnologiasSeleccionadas, setTecnologiasSeleccionadas, t)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer border ${
                        tecnologiasSeleccionadas.includes(t)
                          ? "bg-tecsup-green text-white border-tecsup-green"
                          : "bg-white text-gray-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: Equipo */}
          {paso === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Buscar estudiante por correo</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={correoNuevoMiembro}
                    onChange={(e) => setCorreoNuevoMiembro(e.target.value)}
                    placeholder="nombre@tecsup.edu.pe"
                    className="flex-1 border rounded-lg px-4 py-2"
                  />
                  <button
                    onClick={agregarMiembro}
                    className="px-4 py-2 bg-tecsup-cyan text-white rounded-lg cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {miembros.length === 0 && (
                  <p className="text-gray-400 text-sm">Aún no has agregado miembros al equipo</p>
                )}
                {miembros.map((m) => (
                  <div key={m.correo} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-tecsup-purple text-white flex items-center justify-center text-xs font-bold">
                        {m.nombre.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m.nombre}</p>
                        <p className="text-xs text-gray-500">{m.correo}</p>
                      </div>
                      {m.esLider && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Líder</span>
                      )}
                    </div>
                    <button onClick={() => quitarMiembro(m.correo)} className="text-red-500 cursor-pointer text-sm">
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: Multimedia */}
          {paso === 3 && (
            <div className="space-y-5">
              <div className="border-2 border-dashed rounded-xl p-10 text-center text-gray-400">
                Portada del proyecto (JPG, PNG)
                <br />
                Arrastra o haz clic para subir
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Enlace de video (YouTube)</label>
                <input
                  type="text"
                  value={enlaceVideo}
                  onChange={(e) => setEnlaceVideo(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Repositorio en GitHub</label>
                <input
                  type="text"
                  value={enlaceRepo}
                  onChange={(e) => setEnlaceRepo(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            </div>
          )}

          {/* PASO 4: Reflexión */}
          {paso === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">¿Cómo lo construyeron?</label>
                <textarea
                  value={comoLoConstruyeron}
                  onChange={(e) => setComoLoConstruyeron(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">¿Qué retos superaron?</label>
                <textarea
                  value={queRetosSuperraron}
                  onChange={(e) => setQueRetosSuperaron(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setPaso(Math.max(1, paso - 1))}
              disabled={paso === 1}
              className="px-4 py-2 border rounded-lg text-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Atrás
            </button>

            <div className="flex gap-3">
              <button
                onClick={guardarBorrador}
                className="px-4 py-2 border rounded-lg text-sm cursor-pointer hover:bg-gray-50"
              >
                Guardar Borrador
              </button>
              {paso < 4 ? (
                <button
                  onClick={() => setPaso(paso + 1)}
                  className="px-4 py-2 bg-tecsup-cyan text-white rounded-lg text-sm cursor-pointer hover:opacity-90"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  onClick={publicarProyecto}
                  className="px-4 py-2 bg-tecsup-cyan text-white rounded-lg text-sm cursor-pointer hover:opacity-90"
                >
                  Publicar Proyecto
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}