import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { type SeccionLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Eliminar tu cuenta",
  description: "Cómo eliminar tu cuenta de Vitrina desde la app o la web, qué datos se borran y qué se conserva.",
  alternates: { canonical: "/eliminar-cuenta" },
};

const CONTACTO = "contact@coresearch.studio";

const secciones: SeccionLegal[] = [
  {
    id: "app",
    titulo: "Desde la app",
    contenido: (
      <ul>
        <li>Abre Vitrina e inicia sesión con tu cuenta de Tecsup.</li>
        <li>
          Ve a <strong>Panel → Cuenta</strong>.
        </li>
        <li>
          Toca <strong>Eliminar mi cuenta</strong> y confirma.
        </li>
      </ul>
    ),
  },
  {
    id: "web",
    titulo: "Desde la web",
    contenido: (
      <ul>
        <li>
          <Link href="/auth/login?next=/dashboard">Inicia sesión</Link> con tu cuenta de Tecsup.
        </li>
        <li>
          Entra a <strong>Mis proyectos</strong> (o <strong>Panel docente</strong>) y baja hasta la sección <strong>Cuenta</strong>.
        </li>
        <li>
          Pulsa <strong>Eliminar mi cuenta</strong>, escribe <code>ELIMINAR</code> para confirmar y listo.
        </li>
      </ul>
    ),
  },
  {
    id: "correo",
    titulo: "Si no puedes entrar",
    contenido: (
      <p>
        Escríbenos desde tu correo institucional a <a href={`mailto:${CONTACTO}?subject=Eliminar%20mi%20cuenta%20de%20Vitrina`}>{CONTACTO}</a>{" "}
        con el asunto «Eliminar mi cuenta de Vitrina». Verificaremos que la solicitud venga del titular y la atenderemos en un plazo máximo de
        30 días.
      </p>
    ),
  },
  {
    id: "se-borra",
    titulo: "Qué se borra",
    contenido: (
      <ul>
        <li>Tu nombre, correo, foto y el vínculo con tu cuenta de Google.</li>
        <li>Tu carrera, ciclo, sede, biografía, ciudad, experiencia, enlaces y CV.</li>
        <li>Tu participación en los equipos de proyectos y como docente involucrado.</li>
        <li>Los proyectos en borrador o en revisión que creaste y no compartías con nadie, junto con sus imágenes.</li>
        <li>Todas tus sesiones abiertas, en la web y en la app.</li>
      </ul>
    ),
  },
  {
    id: "se-conserva",
    titulo: "Qué se conserva",
    contenido: (
      <>
        <p>
          Los proyectos que ya fueron publicados son parte del registro académico de Tecsup y se mantienen visibles, pero tu nombre aparece como
          «Usuario eliminado». Lo mismo ocurre con los proyectos que compartías con otros integrantes: siguen siendo de su equipo.
        </p>
        <p>
          Si quieres que además se retire un proyecto publicado del que eres autor, escríbenos a <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>{" "}
          con el enlace y lo coordinaremos con tu equipo y tu docente.
        </p>
      </>
    ),
  },
  {
    id: "despues",
    titulo: "Después de eliminarla",
    contenido: (
      <p>
        La eliminación es inmediata y no se puede deshacer. Si vuelves a iniciar sesión con tu cuenta de Tecsup más adelante, empezarás con un
        perfil nuevo y vacío.
      </p>
    ),
  },
];

export default function EliminarCuentaPage() {
  return (
    <PaginaLegal
      eyebrow="Tu cuenta"
      titulo="Eliminar tu cuenta de Vitrina"
      resumen={<p>Puedes borrar tu cuenta en cualquier momento desde la app o la web. Aquí te contamos cómo y qué pasa con tus datos y proyectos.</p>}
      actualizado="10 de octubre de 2026"
      secciones={secciones}
    />
  );
}
