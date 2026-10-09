"use client";

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { guardarTokens } from "@/lib/auth";
import { useSesion } from "@/components/sesion/SesionProvider";

interface RespuestaLogin {
  accessToken: string;
  refreshToken: string;
  usuario: { rol: string; perfilCompleto: boolean };
}

export default function LoginPage() {
  const router = useRouter();
  const { recargar } = useSesion();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar(cred: CredentialResponse) {
    setError(null);
    setCargando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: cred.credential }),
      });
      const data = (await res.json()) as RespuestaLogin & { message?: string | string[] };
      if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message.join(". ") : data.message || "No se pudo iniciar sesión");
      guardarTokens(data.accessToken, data.refreshToken);
      await recargar();
      router.push(!data.usuario.perfilCompleto && data.usuario.rol === "ALUMNO" ? "/onboarding" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="bg-mesh relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Vitrina · Tecsup</p>
          <h1 className="mt-4 max-w-md font-display text-4xl font-extrabold leading-tight">Tu proyecto merece una página, no una carpeta olvidada.</h1>
        </div>
        <ul className="relative space-y-3 text-sm text-white/85">
          {["Entra con tu correo institucional. No hay contraseñas que recordar.", "Publica en 10 minutos: frase, descripción, fotos y equipo.", "Tu docente lo revisa y te avisa por correo.", "Comparte la URL en LinkedIn y en tu CV."].map((t, i) => (
            <li key={t} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold">{i + 1}</span>{t}</li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="card w-full max-w-md p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-ink-900">Inicia sesión</h2>
          <p className="mt-1 text-sm text-ink-500">Usa tu cuenta <span className="font-semibold text-ink-800">@tecsup.edu.pe</span>. Si es tu primera vez, se crea tu perfil automáticamente.</p>
          <div className="mt-8 flex justify-center">
            <GoogleLogin onSuccess={entrar} onError={() => setError("No se pudo conectar con Google")} shape="pill" size="large" text="continue_with" width="320" />
          </div>
          {cargando && <p className="mt-4 text-center text-sm text-ink-500">Verificando…</p>}
          {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">{error}</p>}
          <p className="mt-8 text-center text-xs text-ink-400">
            ¿Eres docente? Entra con tu correo: si tu administrador ya te dio de alta, verás el panel docente. <Link href="/proyectos" className="font-semibold text-brand-700">Explorar sin cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
