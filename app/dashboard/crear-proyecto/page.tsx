"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Avatar from "@/components/ui/Avatar";

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderAdded, setLeaderAdded] = useState(false);

  const handleAddLeader = () => {
    if (leaderEmail.includes("@tecsup.edu.pe")) {
      setLeaderAdded(true);
    }
  };

  return (
    <div className="bg-tecsup-gray min-h-full flex flex-col">
      <Header role="teacher" />

      <div className="flex-1 w-[85%] mx-auto transform scale-[0.85] origin-top">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Cabecera */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-tecsup-dark">
              Crear Nuevo Proyecto
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Completa los datos para asignar un proyecto a un equipo de
              estudiantes.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200">
            <button
              onClick={() => setStep(1)}
              className={
                step === 1
                  ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-tecsup-cyan text-white"
                  : "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-gray-50"
              }
            >
              <span
                className={
                  step === 1
                    ? "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-white"
                    : "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-gray-300"
                }
              >
                1
              </span>
              General
            </button>

            <div className="flex-1 h-px bg-gray-200"></div>

            <button
              onClick={() => setStep(2)}
              className={
                step === 2
                  ? "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-tecsup-cyan text-white"
                  : "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:bg-gray-50"
              }
            >
              <span
                className={
                  step === 2
                    ? "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-white"
                    : "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs border-gray-300"
                }
              >
                2
              </span>
              Asignar Líder
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8">
            {/* PASO 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-2">
                  Información General
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Nombre del proyecto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: EcoCajero"
                    className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Curso asociado
                    </label>
                    <select className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all text-gray-600">
                      <option value="">Seleccionar curso...</option>
                      <option>Desarrollo de Aplicaciones Web</option>
                      <option>Internet de las Cosas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                      Categoría
                    </label>
                    <select className="w-full px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all text-gray-600">
                      <option value="">Seleccionar categoría...</option>
                      <option>DAW</option>
                      <option>IOT</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Visibilidad inicial
                  </label>
                  <p className="text-xs text-gray-400 mb-2">
                    Oculto solo es visible para los miembros del equipo. Público
                    aparece en la landing y perfiles de los estudiantes.
                  </p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="visibility"
                        value="Oculto"
                        defaultChecked
                        className="w-4 h-4 text-tecsup-cyan accent-tecsup-cyan"
                      />
                      <div>
                        <span className="text-sm font-medium text-tecsup-dark group-hover:text-tecsup-cyan transition-colors">
                          Oculto
                        </span>
                        <p className="text-[10px] text-gray-400">
                          Solo el equipo lo ve
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="visibility"
                        value="Publicado"
                        className="w-4 h-4 text-tecsup-cyan accent-tecsup-cyan"
                      />
                      <div>
                        <span className="text-sm font-medium text-tecsup-dark group-hover:text-tecsup-cyan transition-colors">
                          Publicado
                        </span>
                        <p className="text-[10px] text-gray-400">
                          Visible para todos
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-tecsup-dark border-b pb-2">
                  Asignar Líder del Proyecto
                </h2>
                <p className="text-sm text-gray-500">
                  El líder será el encargado de completar los detalles del
                  proyecto.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Buscar estudiante por correo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      placeholder="nombre@tecsup.edu.pe"
                      className="flex-1 px-4 py-3 text-sm bg-white rounded-xl border border-gray-200 focus:border-tecsup-cyan/40 focus:outline-none transition-all"
                    />
                    <button
                      onClick={handleAddLeader}
                      className="px-5 py-3 bg-tecsup-dark text-white text-sm font-semibold rounded-xl hover:bg-tecsup-dark/85 transition-colors"
                    >
                      Buscar
                    </button>
                  </div>
                </div>

                {leaderAdded && (
                  <div className="flex items-center justify-between p-4 bg-tecsup-gray rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <Avatar name="Valeria Ccama" size="md" />
                      <div>
                        <p className="font-semibold text-sm text-tecsup-dark">
                          Valeria Cáceres Ccama
                        </p>
                        <p className="text-xs text-gray-400">
                          vccama@tecsup.edu.pe
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 bg-tecsup-cyan/15 text-tecsup-cyan text-[11px] font-semibold rounded-full uppercase">
                        Líder
                      </span>
                      <button
                        onClick={() => {
                          setLeaderAdded(false);
                          setLeaderEmail("");
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
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
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
              <button
                onClick={() =>
                  step === 2 ? setStep(1) : window.history.back()
                }
                className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                {step === 1 ? "Cancelar" : "Volver"}
              </button>
              <button
                onClick={() => {
                  if (step === 1) setStep(2);
                }}
                className="px-6 py-2.5 bg-tecsup-cyan text-white text-sm font-semibold rounded-full hover:bg-tecsup-cyan/85 transition-colors shadow-sm"
              >
                {step === 1 ? "Siguiente" : "Asignar como Líder y Crear"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
