"use client";

export default function LoginPage() {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* ═══════════════ CONTENIDO PRINCIPAL (Ocupa todo el espacio menos el footer) ═══════════════ */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ═══════════════ PANEL IZQUIERDO ═══════════════ */}
        <div className="hidden lg:flex lg:w-1/2 flex-col relative bg-gradient-to-br from-tecsup-cyan via-tecsup-purple/80 to-tecsup-purple overflow-y-auto">
          
                  {/* FRANJA CELESTE CON LOGOS */}
          <div className="bg-tecsup-cyan p-6 flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">T</span>
            </div>
            <span className="text-white/80 text-sm font-medium">Tecsup</span>
            
            <div className="w-px h-6 bg-white/30 mx-2" />
            
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 bg-white/30 rounded-lg rotate-45" />
              <div className="absolute inset-1 bg-transparent rounded-md rotate-45 border border-white/30" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Vitrina</span>
          </div>

          {/* Contenido del medio (Se ajusta automáticamente) */}
          <div className="flex-1 flex flex-col justify-between p-12 relative z-10">
            {/* Elementos decorativos */}
            <div className="absolute top-10 left-10 w-64 h-64 border border-white/10 rounded-2xl rotate-12 pointer-events-none" />
            <div className="absolute bottom-24 right-12 w-48 h-48 border border-white/10 rounded-full pointer-events-none" />

            {/* Texto principal */}
            <div className="max-w-md mt-8">
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
                MUESTRA TU TALENTO
                <br />
                <span className="text-white/40">/</span> INSPIRA AL MUNDO
              </h1>
              <p className="mt-4 text-white/50 text-sm leading-relaxed">
                Documenta tus proyectos, construye tu portafolio y demuestra lo
                que sabes hacer. Tu futuro profesional empieza aquí.
              </p>
            </div>

            {/* Imagen decorativa */}
            <div className="flex justify-center mb-8">
              <div className="relative w-72 h-48 rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs">Estudiante con visor VR</p>
                  <p className="text-[10px] text-white/40 mt-1">(Reemplazar con imagen real)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ PANEL DERECHO ═══════════════ */}
        <div className="w-full lg:w-1/2 bg-tecsup-gray flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
          <div className="w-full max-w-md">
            {/* Logo móvil (solo visible en mobile) */}
            <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-tecsup-cyan rounded-lg rotate-45" />
                <div className="absolute inset-1 bg-white rounded-md rotate-45" />
                <div className="absolute inset-2 bg-tecsup-cyan/60 rounded-sm rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-tight text-tecsup-dark">
                Vitrina
              </span>
            </div>

            {/* Card de login */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-tecsup-dark text-center">
                Inicia sesión
              </h2>
              <p className="mt-2 text-sm text-gray-400 text-center">
                Accede a tu portafolio de proyectos
              </p>

              <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
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
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 text-sm bg-tecsup-gray rounded-xl border border-transparent focus:border-tecsup-cyan/40 focus:bg-white focus:outline-none transition-all duration-200 placeholder:text-gray-400 pr-12"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

      {/* ═══════════════ FOOTER SIEMPRE FIJO ABAJO ═══════════════ */}
      {/* El footer se renderiza automáticamente desde app/layout.tsx */}
    </div>
  );
}