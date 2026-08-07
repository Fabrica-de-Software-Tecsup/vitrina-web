"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerUsuarioDesdeToken, cerrarSesion } from "@/lib/auth";
import { apiFetch } from "@/lib/api-client";

interface Perfil {
  id: string;
  nombre: string;
  correo: string;
  fotoUrl: string | null;
  rol: string;
}

// Datos de ejemplo mientras el backend de Proyectos no existe todavia
const proyectosMock = [
  { id: "1", nombre: "RivVirtual", curso: "Desarrollo Web", estado: "Publicado", vistas: 1245, actualizado: "12/07/2026" },
  { id: "2", nombre: "Kanban Pro", curso: "Desarrollo Web", estado: "Publicado", vistas: 832, actualizado: "28/06/2026" },
  { id: "3", nombre: "EcoRiego", curso: "Internet de las Cosas", estado: "En Desarrollo", vistas: 0, actualizado: "10/07/2026" },
];

const coloresEstado: Record<string, string> = {
  Publicado: "bg-tecsup-green/20 text-tecsup-green",
  "En Desarrollo": "bg-tecsup-cyan/20 text-tecsup-cyan",
  Bloqueado: "bg-red-100 text-red-600",
  "Por Revisar": "bg-yellow-100 text-yellow-700",
};

export default function DashboardPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usuarioToken = obtenerUsuarioDesdeToken();

    if (!usuarioToken) {
      router.push("/auth/login");
      return;
    }

    apiFetch(`/usuarios/${usuarioToken.sub}`)
      .then((data) => setPerfil(data))
      .catch(() => setError("No se pudo cargar tu perfil"))
      .finally(() => setCargando(false));
  }, [router]);

  function manejarLogout() {
    cerrarSesion();
    router.push("/auth/login");
  }

  if (cargando) {
    return <div className="p-10 text-center text-gray-500">Cargando...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-tecsup-gray">
      {/* Header */}
      <header className="bg-tecsup-cyan text-white px-10 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Vitrina</span>
        <nav className="flex items-center gap-6">
          <span className="cursor-pointer">Explorar</span>
          <span className="cursor-pointer">Estudiantes</span>
          <span className="cursor-pointer">Cursos</span>
          <span className="cursor-pointer font-semibold">+ Nuevo proyecto</span>
          <button
            onClick={manejarLogout}
            className="w-9 h-9 rounded-full bg-white text-tecsup-dark flex items-center justify-center font-bold text-sm"
            title="Cerrar sesion"
          >
            {perfil?.nombre?.slice(0, 2).toUpperCase() || "??"}
          </button>
        </nav>
      </header>

      <main className="px-10 py-8">
        <h1 className="text-2xl font-bold text-tecsup-dark">Hola, {perfil?.nombre?.split(" ")[0]}</h1>
        <p className="text-gray-500 mb-6">Tienes {proyectosMock.length} proyectos registrados</p>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-3">Proyecto</th>
                <th className="px-6 py-3">Curso</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Vistas</th>
                <th className="px-6 py-3">Últ. edición</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectosMock.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-6 py-4 font-medium">{p.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">{p.curso}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${coloresEstado[p.estado]}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">{p.vistas}</td>
                  <td className="px-6 py-4 text-gray-500">{p.actualizado}</td>
                  <td className="px-6 py-4">
                    <a href="#" className="text-tecsup-cyan font-medium mr-3">Editar</a>
                    <a href="#" className="text-tecsup-cyan font-medium">Ver</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}