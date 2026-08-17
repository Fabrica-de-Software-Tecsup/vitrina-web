"use client";

import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex overflow-hidden">
        {/* ═══════════════ PANEL IZQUIERDO ═══════════════ */}
        <div className="hidden lg:flex lg:w-1/2 flex-col relative bg-[#17425B]">
          {/* FRANJA CELESTE CON LOGOS */}
          <div className="bg-tecsup-cyan px-4 py-0.05 flex items-center shrink-0">
            <div className="w-35 h-20 relative">
              <Image
                src="/images/logo-tecsup.svg"
                alt="TECSUP"
                fill
                className="object-contain"
                sizes="160px"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <div className="w-15 h-15 rounded-xl bg-white/25 flex items-center justify-center p-2">
                <Image
                  src="/images/logo-vitrina.png"
                  alt="Vitrina"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">
                Vitrina
              </span>
            </div>
          </div>

          {/* Texto principal */}
          <div className="px-12 pt-3 pb-2 relative z-10">
            <div className="absolute top-8 left-8 w-64 h-64 border border-white/5 rounded-2xl rotate-12 pointer-events-none" />
            <div className="max-w-md">
              <h1 className="text-3xl lg:text-2xl font-extrabold text-white leading-tight">
                MUESTRA TU TALENTO
                <br />
                <span className="text-white/40">/</span> INSPIRA AL MUNDO
              </h1>
              <p className="mt-4 text-white/50 text-sm leading-relaxed">
                Documenta tus proyectos, construye tu portafolio y demuestra lo
                que sabes hacer. Tu futuro profesional empieza aquí.
              </p>
            </div>
          </div>

          {/* Imagen — ocupa el espacio restante */}
          <div className="flex-1 relative min-h-0">
            <Image
              src="/images/login-hero.png"
              alt="Estudiante TECSUP"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>
        </div>

        {/* ═══════════════ PANEL DERECHO ═══════════════ */}
        <div className="w-full lg:w-1/2 bg-tecsup-gray flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Logo móvil */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
              <div className="w-8 h-8 relative">
                <Image
                  src="/images/logo-vitrina.png"
                  alt="Vitrina"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
            </div>

            {/* Card de login */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-tecsup-dark text-center">
                Inicia sesión
              </h2>
              <p className="mt-2 text-sm text-gray-400 text-center">
                Accede a tu portafolio de proyectos
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Correo institucional
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="nombre@tecsup.edu.pe"
                    className="w-full px-4 py-3 text-sm bg-tecsup-gray rounded-xl border border-transparent focus:border-tecsup-cyan/40 focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 text-sm bg-tecsup-gray rounded-xl border border-transparent focus:border-tecsup-cyan/40 focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-gray-400 pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-tecsup-dark text-white text-sm font-semibold rounded-full hover:bg-tecsup-dark/85 transition-colors duration-200 shadow-sm"
                >
                  Iniciar sesión
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                ¿No tienes cuenta?{" "}
                <span className="text-gray-500 font-medium cursor-default">
                  Contacta a tu docente
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
