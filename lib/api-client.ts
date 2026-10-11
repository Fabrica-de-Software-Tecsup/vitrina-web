const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

interface TokensRespuesta {
  accessToken: string;
  refreshToken: string;
}

function tokenExpirado(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp: number };
    const margenSegundos = 10;
    return Date.now() / 1000 >= payload.exp - margenSegundos;
  } catch {
    return true;
  }
}

async function refrescarAccessToken(): Promise<string | null> {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as TokensRespuesta;
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

function limpiarSesionYRedirigir() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/auth/login";
}

async function obtenerTokenValido(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  if (tokenExpirado(token)) {
    if (!refreshPromise) {
      refreshPromise = refrescarAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    return refreshPromise;
  }

  return token;
}

/** Error del API con su código HTTP, para distinguir un 404 de un servidor que aún no despierta (502/503/504). */
export class ErrorApi extends Error {
  constructor(
    mensaje: string,
    readonly status: number,
  ) {
    super(mensaje);
    this.name = "ErrorApi";
  }
}

/** Mensaje de error legible a partir de la respuesta del API (class-validator manda arrays). */
function mensajeDeError(data: unknown, status: number): string {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (Array.isArray(m)) return m.join(". ");
    if (typeof m === "string") return m;
  }
  return `Error ${status}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  _retry = false,
): Promise<T> {
  const token = await obtenerTokenValido();

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !_retry) {
    // Solo tiene sentido reintentar si habia sesion; un anonimo con 401 no debe ir al login a la fuerza.
    if (!token) throw new Error("No autorizado");
    if (!refreshPromise) {
      refreshPromise = refrescarAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const nuevoToken = await refreshPromise;
    if (nuevoToken) {
      return apiFetch<T>(path, options, true);
    }
    limpiarSesionYRedirigir();
    throw new Error("Sesion expirada, redirigiendo al login");
  }

  if (!res.ok) {
    const data: unknown = await res.json().catch(() => ({}));
    throw new ErrorApi(mensajeDeError(data, res.status), res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
