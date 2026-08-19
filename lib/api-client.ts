const API_URL = process.env.NEXT_PUBLIC_API_URL;

let refreshPromise: Promise<string | null> | null = null;

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
    const data = await res.json();
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

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  _retry = false,
): Promise<any> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && !_retry) {
    if (!refreshPromise) {
      refreshPromise = refrescarAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const nuevoToken = await refreshPromise;
    if (nuevoToken) {
      return apiFetch(path, options, true);
    }
    limpiarSesionYRedirigir();
    throw new Error("Sesion expirada, redirigiendo al login");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Error ${res.status}`);
  }

  return res.json();
}