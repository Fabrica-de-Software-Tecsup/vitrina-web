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

export interface UsuarioActual {
  id: string;
  nombre: string;
  correo: string;
  fotoUrl: string | null;
  rol: string;
}

export async function obtenerUsuarioActual(): Promise<UsuarioActual | null> {
  const tokenData = obtenerUsuarioDesdeToken();
  if (!tokenData) return null;

  const { apiFetch } = await import("./api-client");
  try {
    return await apiFetch(`/usuarios/${tokenData.sub}`);
  } catch {
    return null;
  }
}