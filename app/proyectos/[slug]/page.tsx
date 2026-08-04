"use client";

import { useEffect, useState } from "react";
import { obtenerUsuarioDesdeToken } from "@/lib/auth";

// Datos de ejemplo - el backend real de Proyectos aun no existe
const proyectoMock = {
  nombre: "Qhatu",
  subtitulo: "Marketplace de productores locales",
  curso: "Desarrollo de Aplicaciones Web",
  ciclo: "2026-I",
  estado: "Publicado",
  vistas: 1245,
  vecesCompartido: 38,
  descripcion:
    'Qhatu ("mercado" en quechua) conecta a productores agricolas de la campiña arequipeña con compradores urbanos, sin intermediarios. Los productores publican su oferta semanal desde el celular y los compradores arman su pedido con entrega programada.',
  equipo: [
    { iniciales: "DM", nombre: "Diego Mamani Q.", rol: "Backend & despliegue" },
    { iniciales: "VC", nombre: "Valeria Ccama H.", rol: "Frontend & UI" },
    { iniciales: "JA", nombre: "Jose Apaza T.", rol: "QA & documentacion" },
  ],
  tecnologias: ["React", "NestJS", "PostgreSQL", "Docker"],
  enlaces: {
    repo: "#",
    demo: "#",
    figma: "#",
    documentacion: "#",
  },
};

export default function DetalleProyectoPage() {
  const [esDocenteOAdmin, setEsDocenteOAdmin] = useState(false);

  useEffect(() => {
    const usuario = obtenerUsuarioDesdeToken();
    if (usuario && (usuario.rol === "DOCENTE" || usuario.rol === "ADMIN")) {
      setEsDocenteOAdmin(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-tecsup-cyan text-white px-10 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Vitrina</span>
        <nav className="flex items-center gap-6 text-sm">
          <span className="cursor-pointer">Explorar</span>
          <span className="cursor-pointer">Estudiantes</span>
          <span className="cursor-pointer">Cursos</span>
        </nav>
      </header>

      <main className="px-10 py-8 max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-tecsup-dark">
              {proyectoMock.nombre}
              <span className="text-gray-400 font-normal ml-3">— {proyectoMock.subtitulo}</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-tecsup-cyan/10 text-tecsup-cyan">
                Web
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-tecsup-green/20 text-tecsup-green">
                {proyectoMock.estado}
              </span>
            </div>
          </div>

          {/* Acciones condicionales por rol */}
          <div className="flex gap-3">
            {esDocenteOAdmin ? (
              <>
                <button className="px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
                  Solicitar Cambios
                </button>
                <button className="px-4 py-2 bg-tecsup-cyan text-white rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">
                  Publicar
                </button>
              </>
            ) : (
              <>
                <button className="px-4 py-2 bg-tecsup-cyan text-white rounded-lg text-sm font-medium cursor-pointer hover:opacity-90">
                  Compartir en LinkedIn
                </button>
                <button className="px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50">
                  Copiar enlace
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-gray-500 mb-6">
          Curso: {proyectoMock.curso} · Ciclo {proyectoMock.ciclo} · {proyectoMock.vistas} vistas
        </p>

        <div className="grid grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="col-span-2">
            <div className="bg-gray-100 rounded-xl aspect-video mb-6 flex items-center justify-center text-gray-400">
              Imagen del proyecto
            </div>

            <h2 className="text-xl font-bold text-tecsup-dark mb-2">Sobre el proyecto</h2>
            <p className="text-gray-600 leading-relaxed">{proyectoMock.descripcion}</p>
          </div>

          {/* Columna derecha */}
          <aside className="bg-gray-50 rounded-xl p-6 h-fit">
            <h3 className="font-bold text-tecsup-dark mb-4">Equipo</h3>
            {proyectoMock.equipo.map((m) => (
              <div key={m.nombre} className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-tecsup-purple text-white flex items-center justify-center text-xs font-bold">
                  {m.iniciales}
                </div>
                <div>
                  <p className="text-sm font-medium">{m.nombre}</p>
                  <p className="text-xs text-gray-500">{m.rol}</p>
                </div>
              </div>
            ))}

            <hr className="my-4" />

            <h3 className="font-bold text-tecsup-dark mb-3">Tecnologías</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {proyectoMock.tecnologias.map((t) => (
                <span key={t} className="px-3 py-1 bg-white border rounded-full text-xs">
                  {t}
                </span>
              ))}
            </div>

            <hr className="my-4" />

            <h3 className="font-bold text-tecsup-dark mb-3">Enlaces</h3>
            <ul className="space-y-2 text-sm text-tecsup-cyan">
              <li><a href={proyectoMock.enlaces.repo}>Repositorio en GitHub</a></li>
              <li><a href={proyectoMock.enlaces.demo}>Demo en vivo</a></li>
              <li><a href={proyectoMock.enlaces.figma}>Prototipo en Figma</a></li>
              <li><a href={proyectoMock.enlaces.documentacion}>Documentación técnica</a></li>
            </ul>
          </aside>
        </div>
      </main>
    </div>
  );
}