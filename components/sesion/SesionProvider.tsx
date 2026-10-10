"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMiPerfil } from "@/lib/api-usuarios";
import { cerrarSesion as borrarTokens, haySesion } from "@/lib/auth";
import type { PerfilPropio } from "@/lib/tipos";

interface SesionContexto {
  usuario: PerfilPropio | null;
  cargando: boolean;
  esDocente: boolean;
  esAdmin: boolean;
  recargar: () => Promise<void>;
  cerrarSesion: () => void;
}

const Ctx = createContext<SesionContexto | null>(null);

/** Carga una sola vez el perfil propio y lo comparte con header, dashboard y formularios. */
export function SesionProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<PerfilPropio | null>(null);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    if (!haySesion()) {
      setUsuario(null);
      setCargando(false);
      return;
    }
    try {
      setUsuario(await getMiPerfil());
    } catch {
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    // Se difiere un tick para no tocar estado de forma sincrona dentro del efecto.
    const t = setTimeout(() => void recargar(), 0);
    return () => clearTimeout(t);
  }, [recargar]);

  const valor = useMemo<SesionContexto>(
    () => ({
      usuario,
      cargando,
      esDocente: usuario?.rol === "DOCENTE" || usuario?.rol === "ADMIN",
      esAdmin: usuario?.rol === "ADMIN",
      recargar,
      cerrarSesion: () => {
        borrarTokens();
        setUsuario(null);
      },
    }),
    [usuario, cargando, recargar],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useSesion(): SesionContexto {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}
