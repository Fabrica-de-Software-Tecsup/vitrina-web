export interface UsuarioToken {
  sub: string;
  rol: string;
}

export function obtenerUsuarioDesdeToken(): UsuarioToken | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { sub: payload.sub, rol: payload.rol };
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}