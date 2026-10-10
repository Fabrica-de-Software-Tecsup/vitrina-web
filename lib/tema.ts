/** Preferencia de tema por dispositivo: "sistema" sigue a prefers-color-scheme; "claro"/"oscuro" fijan data-theme. */
export type Tema = "sistema" | "claro" | "oscuro";

export const CLAVE_TEMA = "tema";
const EVENTO = "vitrina:tema";

export function leerTema(): Tema {
  try {
    const t = localStorage.getItem(CLAVE_TEMA);
    return t === "claro" || t === "oscuro" ? t : "sistema";
  } catch {
    return "sistema";
  }
}

export function aplicarTema(tema: Tema) {
  const raiz = document.documentElement;
  if (tema === "sistema") raiz.removeAttribute("data-theme");
  else raiz.setAttribute("data-theme", tema === "oscuro" ? "dark" : "light");
  try {
    if (tema === "sistema") localStorage.removeItem(CLAVE_TEMA);
    else localStorage.setItem(CLAVE_TEMA, tema);
  } catch {
    /* sin almacenamiento: el tema dura lo que la pestaña */
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: tema }));
}

export function suscribirTema(cb: () => void) {
  window.addEventListener(EVENTO, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENTO, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Script anti-parpadeo: se ejecuta antes de pintar y fija data-theme desde localStorage. */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem("${CLAVE_TEMA}");if(t==="oscuro")document.documentElement.setAttribute("data-theme","dark");else if(t==="claro")document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`;
