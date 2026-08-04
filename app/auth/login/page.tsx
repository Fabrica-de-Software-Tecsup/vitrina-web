"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function manejarLoginExitoso(credentialResponse: CredentialResponse) {
    setError(null);
    setCargando(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "No se pudo iniciar sesión");
      }

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - branding */}
      <div className="hidden md:flex md:w-1/2 flex-col bg-tecsup-dark text-white">
        <div className="bg-tecsup-cyan px-10 py-6 flex items-center justify-between">
          <span className="font-bold text-xl">Tecsup</span>
          <span className="font-bold text-xl">Vitrina</span>
        </div>
        <div className="px-10 py-12">
          <h1 className="text-3xl font-bold mb-4">
            MUESTRA TU TALENTO / INSPIRA AL MUNDO
          </h1>
          <p className="text-gray-300">
            Documenta tus proyectos, construye tu portafolio y demuestra lo que sabes hacer.
            Tu futuro profesional empieza aquí.
          </p>
        </div>
      </div>

      {/* Panel derecho - login */}
      <div className="flex-1 flex items-center justify-center bg-tecsup-gray px-6">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold text-tecsup-dark mb-2">Inicia sesión</h2>
          <p className="text-gray-500 mb-8">
            Usa tu cuenta institucional para mostrar tus proyectos
          </p>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={manejarLoginExitoso}
              onError={() => setError("No se pudo conectar con Google")}
              locale="es"
            />
          </div>

          {cargando && (
            <p className="text-center text-gray-500 mt-4">Verificando...</p>
          )}

          {error && (
            <p className="text-center text-red-500 mt-4 text-sm">{error}</p>
          )}

          <p className="text-center text-gray-400 text-sm mt-8">
            Solo se permiten cuentas @tecsup.edu.pe
          </p>
        </div>
      </div>
    </div>
  );
}