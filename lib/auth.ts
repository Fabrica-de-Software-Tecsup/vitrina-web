import type { Rol } from "./tipos";

export interface UsuarioToken {
  sub: string;
  rol: Rol;
}

export function guardarTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function obtenerUsuarioDesdeToken(): UsuarioToken | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { sub: string; rol: Rol };
    return { sub: payload.sub, rol: payload.rol };
  } catch {
    return null;
  }
}

export function haySesion(): boolean {
  return typeof window !== "undefined" && !!localStorage.getItem("refreshToken");
}

export function cerrarSesion() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
