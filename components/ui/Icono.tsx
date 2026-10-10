import { cn } from "@/lib/utils";

/**
 * Set de iconos propio de Vitrina: trazo 1.5 sobre retícula de 24, dibujado a 20 px por defecto.
 * Un solo grosor y extremos redondeados en todos; sin rellenos salvo puntos.
 */
const trazos = {
  buscar: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.4-4.4" /></>,
  filtros: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  "flecha-izq": <path d="M19 12H5m6-6-6 6 6 6" />,
  "flecha-der": <path d="M5 12h14m-6-6 6 6-6 6" />,
  "chevron-izq": <path d="m14.5 6-6 6 6 6" />,
  "chevron-der": <path d="m9.5 6 6 6-6 6" />,
  "chevron-abajo": <path d="m6 9.5 6 6 6-6" />,
  externo: <path d="M8 16 16.5 7.5M9 7h8v8" />,
  compartir: <><path d="M12 15V4m-4 4 4-4 4 4" /><path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" /></>,
  enlace: <><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" /><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" /></>,
  descargar: <><path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5" /><path d="M5 20h14" /></>,
  subir: <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M5 20h14" /></>,
  video: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m10.5 9.5 4 2.5-4 2.5z" /></>,
  codigo: <path d="m8.5 8-4 4 4 4m7-8 4 4-4 4M13.5 5l-3 14" />,
  diseno: <><path d="M14.5 5.5 18.5 9.5 9 19H5v-4z" /><path d="m12.5 7.5 4 4" /></>,
  paquete: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  demo: <><rect x="3" y="4.5" width="18" height="12" rx="1.5" /><path d="M9 20h6m-3-3.5V20" /></>,
  sol: <><circle cx="12" cy="12" r="3.75" /><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1" /></>,
  luna: <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />,
  sistema: <><circle cx="12" cy="12" r="8" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  cerrar: <path d="m6 6 12 12M18 6 6 18" />,
  mas: <path d="M12 5v14M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  alerta: <><path d="M12 4 21 19.5H3z" /><path d="M12 10v4" /><circle cx="12" cy="16.75" r="0.6" fill="currentColor" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="8" r="0.6" fill="currentColor" /></>,
  editar: <><path d="M15 5.5 18.5 9 9 18.5H5.5V15z" /><path d="M5 21h14" /></>,
  borrar: <><path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13" /></>,
  imagen: <><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><circle cx="9" cy="10" r="1.5" /><path d="m20.5 16-5-5-8 8" /></>,
  azar: <><path d="M4 7h3.5c4.5 0 4.5 10 9 10H20m0 0-2.5-2.5M20 17l-2.5 2.5" /><path d="M4 17h3.5c1.4 0 2.3-1 3-2.3M13.5 9.3c.7-1.3 1.6-2.3 3-2.3H20m0 0-2.5-2.5M20 7l-2.5 2.5" /></>,
  usuario: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  equipo: <><circle cx="9" cy="9" r="3" /><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5" /><path d="M15 6.2a3 3 0 0 1 0 5.6M17 14.8c1.8.5 3.1 1.9 3.5 4.2" /></>,
  estrella: <path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.2 7.2 18.8l1-5.4-4-3.7 5.4-.7z" />,
  ojo: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.75" /></>,
  carpeta: <path d="M3.5 7.5v10A1.5 1.5 0 0 0 5 19h14a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 19 7.5h-7L10 5H5a1.5 1.5 0 0 0-1.5 1.5z" />,
  bandeja: <><path d="M3.5 13.5 6 5.5h12l2.5 8V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z" /><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5" /></>,
  birrete: <><path d="M2.5 9.5 12 5l9.5 4.5L12 14z" /><path d="M6.5 11.5V16c1.5 1.5 3.5 2.2 5.5 2.2s4-.7 5.5-2.2v-4.5M21.5 9.5V15" /></>,
  bandera: <path d="M5.5 21V4.5m0 0h11l-2 4 2 4h-11" />,
  foco: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5" /></>,
  salir: <><path d="M14 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H14" /><path d="M10 12h10m-3.5-3.5L20 12l-3.5 3.5" /></>,
  reloj: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  correo: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="m4 7 8 6 8-6" /></>,
  copiar: <><rect x="8.5" y="8.5" width="11" height="11" rx="1.5" /><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" /></>,
  ajustes: <><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  historial: <><path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5" /><path d="M4 4.5v4h4M12 8v4.5l3 1.5" /></>,
  documento: <><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5A.5.5 0 0 1 6.5 20V4a.5.5 0 0 1 .5-.5Z" /><path d="M13.5 3.5v4.5h4.5M9.5 13h5M9.5 16.5h5" /></>,
} as const;

export type NombreIcono = keyof typeof trazos;

interface Props {
  nombre: NombreIcono;
  /** Tamaño en px; 20 por defecto. */
  tam?: number;
  className?: string;
  /** Texto para lectores de pantalla; si falta, el icono es decorativo. */
  titulo?: string;
}

export default function Icono({ nombre, tam = 20, className, titulo }: Props) {
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden={titulo ? undefined : true}
      role={titulo ? "img" : undefined}
      aria-label={titulo}
      focusable="false"
    >
      {trazos[nombre]}
    </svg>
  );
}
