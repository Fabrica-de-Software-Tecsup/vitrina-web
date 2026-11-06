"use client";

import { useId } from "react";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { MAX_INTEGRANTES, type DatosEnvio, type EnlacesEnvio, type EnvioPrivado } from "@/lib/api-jams";

export interface ValoresEnvio {
  nombre: string;
  frase: string;
  descripcion: string;
  equipoNombre: string;
  integrantes: { nombre: string; rol: string; enlace: string }[];
  categoria: string;
  enlaces: Required<Record<keyof EnlacesEnvio, string>>;
  contactoCorreo: string;
}

/** Límites del API (dto de envíos): se avisan aquí para no esperar al servidor. */
export const LIMITES = { nombre: 80, frase: 160, descripcion: 4000, equipoNombre: 80, integrante: 80, rol: 60, correo: 200 } as const;
export const MIN_DESCRIPCION = 20;

const integranteVacio = () => ({ nombre: "", rol: "", enlace: "" });

export const valoresVacios = (): ValoresEnvio => ({
  nombre: "",
  frase: "",
  descripcion: "",
  equipoNombre: "",
  integrantes: [integranteVacio()],
  categoria: "",
  enlaces: { demo: "", repositorio: "", video: "", presentacion: "" },
  contactoCorreo: "",
});

export function valoresDe(e: EnvioPrivado): ValoresEnvio {
  return {
    nombre: e.nombre,
    frase: e.frase,
    descripcion: e.descripcion,
    equipoNombre: e.equipoNombre,
    integrantes: e.integrantes.length ? e.integrantes.map((i) => ({ nombre: i.nombre, rol: i.rol ?? "", enlace: i.enlace ?? "" })) : [integranteVacio()],
    categoria: e.categoria ?? "",
    enlaces: { demo: e.enlaces?.demo ?? "", repositorio: e.enlaces?.repositorio ?? "", video: e.enlaces?.video ?? "", presentacion: e.enlaces?.presentacion ?? "" },
    contactoCorreo: e.contactoCorreo ?? "",
  };
}

/** «github.com/equipo» → «https://github.com/equipo»: en el teléfono casi nadie escribe el protocolo. */
export function normalizarUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : `https://${u.replace(/^\/+/, "")}`;
}

/** Lo que espera el API: sin cadenas vacías (un enlace vacío no pasa la validación de URL). */
export function aDatos(v: ValoresEnvio): DatosEnvio {
  const enlaces = Object.fromEntries(
    Object.entries(v.enlaces)
      .map(([k, u]) => [k, normalizarUrl(u)])
      .filter(([, u]) => u),
  ) as EnlacesEnvio;
  return {
    nombre: v.nombre.trim(),
    frase: v.frase.trim(),
    descripcion: v.descripcion.trim(),
    equipoNombre: v.equipoNombre.trim(),
    integrantes: v.integrantes
      .filter((i) => i.nombre.trim())
      .map((i) => ({
        nombre: i.nombre.trim(),
        ...(i.rol.trim() ? { rol: i.rol.trim() } : {}),
        ...(i.enlace.trim() ? { enlace: normalizarUrl(i.enlace) } : {}),
      })),
    ...(v.categoria ? { categoria: v.categoria } : {}),
    enlaces,
    contactoCorreo: v.contactoCorreo.trim(),
  };
}

interface Props {
  valores: ValoresEnvio;
  onChange: (v: ValoresEnvio) => void;
  categorias: string[];
}

function Bloque({ titulo, texto, children }: { titulo: string; texto?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-linea pt-6">
      <legend className="float-left w-full font-display text-title font-medium text-ink-default">{titulo}</legend>
      {texto && <p className="clear-left pt-1 text-body-small text-ink-muted">{texto}</p>}
      <div className="clear-left space-y-5 pt-5">{children}</div>
    </fieldset>
  );
}

const ENLACES: { clave: keyof EnlacesEnvio; label: string; placeholder: string }[] = [
  { clave: "demo", label: "Demo", placeholder: "mi-proyecto.vercel.app" },
  { clave: "repositorio", label: "Repositorio", placeholder: "github.com/equipo/proyecto" },
  { clave: "video", label: "Video", placeholder: "youtu.be/…" },
  { clave: "presentacion", label: "Presentación", placeholder: "docs.google.com/presentation/…" },
];

/** Campos del envío, compartidos por «Subir» y «Editar». El formulario y el envío los pone quien lo usa. */
export default function CamposEnvio({ valores: v, onChange, categorias }: Props) {
  const id = useId();
  const cambiar = <K extends keyof ValoresEnvio>(k: K, valor: ValoresEnvio[K]) => onChange({ ...v, [k]: valor });
  const cambiarIntegrante = (i: number, k: "nombre" | "rol" | "enlace", valor: string) =>
    cambiar(
      "integrantes",
      v.integrantes.map((x, j) => (j === i ? { ...x, [k]: valor } : x)),
    );

  return (
    <div className="space-y-10">
      <Bloque titulo="El proyecto">
        <Field label="Nombre del proyecto" htmlFor={`${id}-nombre`} required contador={{ actual: v.nombre.length, max: LIMITES.nombre }}>
          <Input id={`${id}-nombre`} value={v.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required minLength={2} maxLength={LIMITES.nombre} autoComplete="off" enterKeyHint="next" />
        </Field>
        <Field label="Frase" htmlFor={`${id}-frase`} required hint="Una línea que diga qué hace. «Riega solo cuando la planta lo necesita»." contador={{ actual: v.frase.length, max: LIMITES.frase }}>
          <Input id={`${id}-frase`} value={v.frase} onChange={(e) => cambiar("frase", e.target.value.replace(/\n/g, " "))} required minLength={2} maxLength={LIMITES.frase} autoComplete="off" enterKeyHint="next" />
        </Field>
        <Field
          label="Descripción"
          htmlFor={`${id}-descripcion`}
          required
          hint={v.descripcion.trim().length < MIN_DESCRIPCION ? `Qué problema resuelve, cómo funciona y qué usaron. Al menos ${MIN_DESCRIPCION} caracteres.` : "Qué problema resuelve, cómo funciona y qué usaron."}
          contador={{ actual: v.descripcion.length, max: LIMITES.descripcion }}
        >
          <Textarea id={`${id}-descripcion`} value={v.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} required minLength={MIN_DESCRIPCION} maxLength={LIMITES.descripcion} rows={5} />
        </Field>
        {categorias.length > 0 && (
          <Field label="Categoría" htmlFor={`${id}-categoria`} required>
            <Select id={`${id}-categoria`} value={v.categoria} onChange={(e) => cambiar("categoria", e.target.value)} required>
              <option value="" disabled>
                Elige una
              </option>
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </Bloque>

      <Bloque titulo="El equipo" texto={`De 1 a ${MAX_INTEGRANTES} personas. El enlace (LinkedIn, GitHub o portafolio) es opcional.`}>
        <Field label="Nombre del equipo" htmlFor={`${id}-equipo`} required>
          <Input id={`${id}-equipo`} value={v.equipoNombre} onChange={(e) => cambiar("equipoNombre", e.target.value)} required maxLength={LIMITES.equipoNombre} autoComplete="off" />
        </Field>
        <ol className="space-y-4">
          {v.integrantes.map((p, i) => (
            <li key={i} className="rounded-md border border-linea p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-label text-ink-default">Integrante {i + 1}</p>
                {v.integrantes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => cambiar("integrantes", v.integrantes.filter((_, j) => j !== i))}
                    className="-mr-2 inline-flex h-9 items-center gap-1 rounded-sm px-2 text-body-small text-ink-muted hover:bg-surface-sunken hover:text-state-danger"
                    aria-label={`Quitar al integrante ${i + 1}`}
                  >
                    <Icono nombre="cerrar" tam={16} />
                    Quitar
                  </button>
                )}
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Input value={p.nombre} onChange={(e) => cambiarIntegrante(i, "nombre", e.target.value)} placeholder="Nombre y apellido" aria-label={`Nombre del integrante ${i + 1}`} required={i === 0} maxLength={LIMITES.integrante} autoComplete="off" />
                <Input value={p.rol} onChange={(e) => cambiarIntegrante(i, "rol", e.target.value)} placeholder="Rol (opcional)" aria-label={`Rol del integrante ${i + 1}`} maxLength={LIMITES.rol} autoComplete="off" />
                <Input
                  value={p.enlace}
                  onChange={(e) => cambiarIntegrante(i, "enlace", e.target.value)}
                  placeholder="linkedin.com/in/… o github.com/… (opcional)"
                  aria-label={`Enlace del integrante ${i + 1}`}
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="sm:col-span-2"
                />
              </div>
            </li>
          ))}
        </ol>
        {v.integrantes.length < MAX_INTEGRANTES && (
          <Button variant="outline" onClick={() => cambiar("integrantes", [...v.integrantes, integranteVacio()])} icon={<Icono nombre="mas" tam={18} />}>
            Añadir integrante
          </Button>
        )}
      </Bloque>

      <Bloque titulo="Enlaces" texto="Todos opcionales. Pega la dirección tal cual; no hace falta escribir https://.">
        <div className="grid gap-5 sm:grid-cols-2">
          {ENLACES.map((e) => (
            <Field key={e.clave} label={e.label} htmlFor={`${id}-${e.clave}`}>
              <Input
                id={`${id}-${e.clave}`}
                value={v.enlaces[e.clave]}
                onChange={(ev) => cambiar("enlaces", { ...v.enlaces, [e.clave]: ev.target.value })}
                placeholder={e.placeholder}
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                maxLength={500}
              />
            </Field>
          ))}
        </div>
      </Bloque>

      <Bloque titulo="Contacto">
        <Field label="Correo del equipo" htmlFor={`${id}-correo`} required hint="Privado, solo para la organización: no aparece en la página pública.">
          <Input id={`${id}-correo`} type="email" value={v.contactoCorreo} onChange={(e) => cambiar("contactoCorreo", e.target.value)} required maxLength={LIMITES.correo} autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} />
        </Field>
      </Bloque>
    </div>
  );
}
