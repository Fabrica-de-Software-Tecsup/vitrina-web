"use client";

import { useEffect, useState } from "react";
import type { Project } from "./mock-data";

export interface ProjectOverride {
  status: Project["status"];
  observaciones?: string;
  updatedAt: string;
}

const STORAGE_KEY = "vitrina_project_overrides";
const EVENT_NAME = "vitrina-overrides-changed";

type OverridesMap = Record<string, ProjectOverride>;

function readOverrides(): OverridesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OverridesMap) : {};
  } catch {
    return {};
  }
}

function writeOverrides(data: OverridesMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Notifica a otros componentes montados en la misma pestaña
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

/** Devuelve el override guardado para un proyecto, si existe */
export function getProjectOverride(
  projectId: string,
): ProjectOverride | undefined {
  return readOverrides()[projectId];
}

/**
 * Guarda o actualiza el override de un proyecto.
 * Ej: setProjectOverride("5", { status: "Publicado" })
 *     setProjectOverride("5", { status: "En Desarrollo", observaciones: "..." })
 */
export function setProjectOverride(
  projectId: string,
  data: Partial<Omit<ProjectOverride, "updatedAt">>,
) {
  const current = readOverrides();
  current[projectId] = {
    status: data.status ?? current[projectId]?.status ?? "Por Revisar",
    observaciones:
      data.observaciones !== undefined
        ? data.observaciones
        : current[projectId]?.observaciones,
    updatedAt: new Date().toISOString(),
  };
  writeOverrides(current);
}

/** Aplica los overrides guardados sobre un array base de proyectos (solo el status) */
export function applyOverrides<
  T extends { id: string; status: Project["status"] },
>(baseProjects: T[]): T[] {
  const overrides = readOverrides();
  return baseProjects.map((p) => {
    const override = overrides[p.id];
    if (!override) return p;
    return { ...p, status: override.status };
  });
}

/**
 * Hook: incrementa un contador cada vez que cambian los overrides
 * (en esta pestaña o en otra). Úsalo como dependencia de useMemo
 * para que la UI se refresque cuando cambia el estado de un proyecto.
 */
export function useOverridesVersion(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener(EVENT_NAME, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(EVENT_NAME, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  return version;
}
