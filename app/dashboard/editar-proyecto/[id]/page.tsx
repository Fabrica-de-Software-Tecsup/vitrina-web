"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";

export default function EditProjectPage() {
  const [step, setStep] = useState(1);
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState(["React", "Node.js", "PostgreSQL"]);
  const [memberEmail, setMemberEmail] = useState("");

  const addTech = () => {
    if (techInput.trim() && !technologies.includes(techInput)) {
      setTechnologies([...technologies, techInput]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech));
  };

  return (
    <div className="bg-tecsup-gray min-h-full flex flex-col">
      <Header role="student" />

      {/* Contenedor con escala del 90% */}
      <div className="flex-1 w-[90%] mx-auto transform scale-[0.9] origin-top">
        <div className="max-w-6xl mx-auto px-6 py-8">
          
          {/* Cabecera y Aviso Crítico */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-tecsup-dark">Editando: EcoCajero</h1>
                <p className="text-sm text-gray-400 mt-1">Campos bloqueados asignados por el docente</p>
              </div>
              <button className="px-5 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-full hover:bg-tecsup-cyan/85 shadow-sm">
                Guardar Cambios
              </button>
            </div>
            
            {/* Banner Amarillo de Aviso */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-xs text-amber-700 font-medium">
                Los campos de Nombre, Curso y Categoría fueron asignados por tu docente y no pueden ser modificados.
              </p>
            </div>
          </div>

          {/* Stepper Horizontal */}
          <div className="flex items-center gap-2 mb-8 bg-white p-3 rounded-xl border border-gray-200 overflow-x-auto">
            {["1 General", "2 Equipo", "3 Multimedia", "4 Reflexión"].map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i + 1)}
                className={step === i + 1 ? "bg-tecsup-cyan text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" : "text-gray-400 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Layout de 2 Columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ================= COLUMNA IZQUIERDA ================= */}
            <div className="space-y-8">
              {/* PASO 1: Info General */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">PASO 1: Información General</h2>
                
                {/* CAMPO BLOQUEADO: Nombre */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Nombre del proyecto 🔒</label>
                  <input type="text" value="EcoCajero — Recompensas por reciclaje" readOnly className="w-full px-4 py-3 text-sm bg-tecsup-gray text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed" />
                </div>

                {/* CAMPO BLOQUEADO: Curso */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Curso 🔒</label>
                  <input type="text" value="Desarrollo de Aplicaciones Web" readOnly className="w-full px-4 py-3 text-sm bg-tecsup-gray text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed" />
                </div>

                {/* CAMPO BLOQUEADO: Categoría */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Categoría 🔒</label>
                  <input type="text" value="DAW" readOnly className="w-full px-4 py-3 text-sm bg-tecsup-gray text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed" />
                </div>

                <div className="border-t border-dashed border-gray-200 my-6"></div>

                {/* CAMPO EDITABLE: Descripción corta */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descripción corta</label>
                  <input type="text" placeholder="Un resumen de una línea" className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all" />
                </div>

                {/* CAMPO EDITABLE: Descripción larga */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Descripción larga</label>
                  <textarea rows={4} placeholder="Explica a detalle de qué trata el proyecto..." className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none" />
                </div>

                {/* CAMPO EDITABLE: Tecnologías */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tecnologías</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {technologies.map((tech) => (
                      <span key={tech} className="bg-tecsup-gray text-gray-600 pl-3 pr-1 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                        {tech}
                        <button onClick={() => removeTech(tech)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
                    <button onClick={addTech} className="px-3 py-2 bg-tecsup-dark text-white text-xs font-bold rounded-lg hover:bg-tecsup-dark/85">+ Agregar</button>
                  </div>
                </div>
              </div>

              {/* PASO 2: Equipo */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">PASO 2: Equipo</h2>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Buscar estudiante por correo</label>
                  <input type="email" value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="nombre@tecsup.edu.pe" className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all" />
                </div>

                {/* LÍDER CON CANDADO (No se puede eliminar) */}
                <div className="flex items-center justify-between p-4 bg-tecsup-gray rounded-xl border border-gray-100 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name="Valeria Cáceres" size="md" />
                    <div>
                      <p className="font-semibold text-sm text-tecsup-dark">Valeria Cáceres</p>
                      <p className="text-xs text-gray-400">vccama@tecsup.edu.pe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-tecsup-purple/15 text-tecsup-purple text-[11px] font-semibold rounded-full uppercase">Líder</span>
                    <span className="text-gray-400" title="No se puede eliminar">🔒</span>
                  </div>
                </div>

                {/* OTRO MIEMBRO (Sin candado, SÍ se puede eliminar) */}
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar name="Carlos Quispe" size="md" />
                    <div>
                      <p className="font-semibold text-sm text-tecsup-dark">Carlos Quispe</p>
                      <p className="text-xs text-gray-400">cquispe@tecsup.edu.pe</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-semibold rounded-full uppercase">Miembro</span>
                    <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= COLUMNA DERECHA ================= */}
            <div className="space-y-8">
              {/* PASO 3: Multimedia */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">PASO 3: Multimedia</h2>
                
                {/* Dropzone Portada */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-5 hover:border-tecsup-cyan/50 transition-colors">
                  <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12m0 0l-3-3" /></svg>
                  <p className="text-sm text-gray-500 font-medium">Arrastra o sube la portada</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG o WebP (Max 5MB)</p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Video (YouTube)</label>
                  <input type="url" placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all" />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Enlace a GitHub</label>
                  <input type="url" placeholder="https://github.com/..." className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all" />
                </div>

                {/* Archivo Subido (Simulado) */}
                <div className="flex items-center justify-between p-3 bg-tecsup-gray rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2v5a2 2 0 01-2 2zm0 0h8a2 2 0 002-2V9a2 2 0 00-2-2V7a2 2 0 00-2-2v5a2 2 0 002 2zm-3 4h2v4H9v-4z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-tecsup-dark">compilado.zip</p>
                      <p className="text-xs text-gray-400">24 MB</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              {/* PASO 4: Reflexiones */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-3 mb-6">PASO 4: Reflexiones</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">¿Cómo lo construyeron?</label>
                    <textarea rows={3} className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">¿Qué retos superaron?</label>
                    <textarea rows={3} className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">¿Cuál fue la mayor lección aprendida?</label>
                    <textarea rows={3} className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">¿Qué harían diferente?</label>
                    <textarea rows={3} className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones Finales */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
            <button onClick={() => window.history.back()} className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">
                Guardar Borrador
              </button>
              <button className="px-6 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-full hover:bg-tecsup-cyan/85 transition-colors shadow-sm">
                Publicar Proyecto
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}