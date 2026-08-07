"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Badge from "@/components/ui/Badge";

// Datos de prueba del panel del alumno
const myProjects = [
  { id: "1", name: "RivVirtual", course: "Desarrollo Web", status: "Publicado" as const, views: "1,245", cycle: "2026-I", members: 3, image: "/images/projects/RivVirtual-1.png" },
  { id: "2", name: "Kanban Pro", course: "Desarrollo Web", status: "Publicado" as const, views: "832", cycle: "2026-I", members: 3, image: "/images/projects/KanbanPro-1.png" },
  { id: "3", name: "EcoRiego", course: "Internet de las Cosas", status: "En Desarrollo" as const, views: "0", cycle: "2026-I", members: 3, image: "/images/projects/AquaSense-1.png" },
   {id: "4", name: "SafeBus", course: "Redes y Comunicaciones", status: "Bloqueado" as const, views: "311", cycle: "2026-I", members: 3, image: "/images/projects/SafeBus-1.png" },
  { id: "5", name: "NutriScan", course: "Inteligencia Artificial", status: "Publicado" as const, views: "540", cycle: "2026-I", members: 3, image: "/images/projects/NutriScan-1.png" },
];

const tabs = [
  { name: "Todos", count: 8, status: "all" },
  { name: "Publicados", count: 5, status: "Publicado" },
  { name: "Borradores", count: 2, status: "En Desarrollo" },
  { name: "Ocultos", count: 1, status: "Oculto" },
];

const stats = [
  { value: "12", label: "proyectos documentados" },
  { value: "2,928", label: "vistas acumuladas" },
  { value: "38", label: "veces compartido" },
  { value: "6", label: "tecnologías dominadas" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProjects = activeTab === "all" 
    ? myProjects 
    : myProjects.filter(p => p.status === activeTab);

  return (
    <div className="bg-tecsup-gray min-h-full">
      {/* Usamos el Header real aquí, porque el dashboard no está en (public) */}
      <Header role="student" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Banner de aviso amarillo */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">🟠</span>
          <p className="text-sm text-amber-800 font-medium">
            Ventana de edición abierta hasta el 15/08/2026 — después tus proyectos del ciclo pasan a solo lectura.
          </p>
        </div>

        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-tecsup-dark">Hola, Maria</h1>
          <p className="text-gray-500 text-sm mt-1">
            Tienes 2 borradores sin publicar. Un proyecto documentado es un proyecto que existe.
          </p>
        </div>

        {/* ⚠️ SIN BOTÓN "NUEVO PROYECTO" AQUÍ (Regla de negocio) */}

        {/* Tabs de filtro */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.status
                  ? "bg-tecsup-dark text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Tabla de proyectos */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Proyecto</th>
                <th className="px-6 py-4">Curso</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Vistas</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                        <Image src={project.image} alt={project.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-tecsup-dark">{project.name}</p>
                        <p className="text-xs text-gray-400">{project.members} integrantes · Ciclo {project.cycle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{project.course}</td>
                  <td className="px-6 py-4">
                    <Badge variant={project.status}>{project.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{project.views}</td>
                  <td className="px-6 py-4 text-right">
                    {/* Solo botón editar para el alumno */}
                    <button className="text-tecsup-cyan hover:text-tecsup-cyan/80 font-medium text-sm cursor-pointer">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-extrabold text-tecsup-dark">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}