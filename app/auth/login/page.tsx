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
      <div className="hidden border-r border-linea p-12 lg:flex lg:flex-col lg:justify-between xl:p-20">
        <p className="titular max-w-[12ch] text-ink-default">Tu proyecto merece una página, no una carpeta olvidada.</p>
        <ol className="max-w-md divide-y divide-linea border-y border-linea">
          {["Entra con tu correo institucional. No hay contraseñas que recordar.", "Publica en 10 minutos: frase, descripción, fotos y equipo.", "Tu docente lo revisa y te avisa por correo.", "Comparte el enlace en LinkedIn y en tu CV."].map((t, i) => (
            <li key={t} className="flex gap-4 py-3.5 text-ink-default"><span className="num w-5 shrink-0 font-display text-title leading-none text-ink-muted">{i + 1}</span>{t}</li>
          ))}
        </ol>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <h1 className="titular-2 text-ink-default">Entrar</h1>
          <p className="mt-3 text-ink-muted">Usa tu cuenta <span className="font-semibold text-ink-default">@tecsup.edu.pe</span>. Si es tu primera vez, se crea tu perfil automáticamente.</p>
          <div className="mt-8">
            <GoogleLogin onSuccess={entrar} onError={() => setError("No se pudo conectar con Google")} shape="rectangular" size="large" text="continue_with" width="320" />
          </div>
          {cargando && <p className="mt-4 text-center text-sm text-ink-muted">Verificando…</p>}
          {error && <p className="mt-4 rounded-sm bg-surface-sunken px-4 py-3 text-center text-sm text-state-danger">{error}</p>}
          <p className="mt-10 border-t border-linea pt-6 text-body-small text-ink-muted">
            ¿Eres docente? Entra con tu correo: si tu administrador ya te dio de alta, verás el panel docente. <Link href="/proyectos" className="font-medium text-brand-primary hover:underline">Explorar sin cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
