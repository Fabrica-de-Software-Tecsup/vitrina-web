import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { type SeccionLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Qué datos trata Vitrina, para qué, dónde se alojan, qué es público y cómo ejercer tus derechos o eliminar tu cuenta.",
  alternates: { canonical: "/privacidad" },
};

const CONTACTO = "bpareja.me@gmail.com";

const secciones: SeccionLegal[] = [
  {
    id: "responsable",
    titulo: "Quién es responsable",
    contenido: (
      <>
        <p>
          Vitrina es el portafolio de proyectos de los estudiantes de Tecsup. La opera el equipo de Vitrina (Coresearch Studio), que gestiona la
          plataforma para la comunidad de Tecsup y es responsable del tratamiento de los datos descritos aquí.
        </p>
        <p>
          Para cualquier consulta sobre tus datos escríbenos a <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>
      </>
    ),
  },
  {
    id: "datos",
    titulo: "Qué datos tratamos",
    contenido: (
      <>
        <p>Solo los necesarios para que tengas un perfil y puedas publicar proyectos:</p>
        <ul>
          <li>
            <strong>De tu cuenta de Google institucional:</strong> nombre, correo <code>@tecsup.edu.pe</code>, foto de perfil y un identificador
            interno de Google. No recibimos tu contraseña.
          </li>
          <li>
            <strong>Lo que completas en tu perfil:</strong> carrera, ciclo y sede y, si quieres, biografía, ciudad, experiencia, enlaces (GitHub,
            LinkedIn, portafolio) y tu CV en PDF.
          </li>
          <li>
            <strong>El contenido de tus proyectos:</strong> textos, enlaces, integrantes del equipo, docentes involucrados, imágenes y archivos
            que subas, y el historial de revisión (cambios de estado y observaciones de los docentes).
          </li>
          <li>
            <strong>Datos técnicos mínimos:</strong> los registros del servidor necesarios para operar y proteger el servicio (por ejemplo, para
            limitar intentos abusivos). También contamos las vistas de cada proyecto de forma agregada, sin identificar a quién lo vio.
          </li>
        </ul>
        <p>Vitrina no muestra publicidad, no usa herramientas de analítica de terceros y no vende ni cede tus datos.</p>
      </>
    ),
  },
  {
    id: "finalidad",
    titulo: "Para qué los usamos y con qué base",
    contenido: (
      <>
        <p>
          Usamos tus datos para crear tu cuenta, mostrar tu perfil y tus proyectos en el portafolio público, permitir que los docentes los
          revisen y avisarte por correo de cambios en tus proyectos.
        </p>
        <p>
          La base es tu consentimiento: lo das al iniciar sesión con tu cuenta institucional y al publicar contenido. Puedes retirarlo cuando
          quieras eliminando tu cuenta.
        </p>
      </>
    ),
  },
  {
    id: "publico",
    titulo: "Qué es público",
    contenido: (
      <>
        <p>
          Cualquier persona, sin iniciar sesión, puede ver tu perfil (nombre, foto, carrera, ciclo, sede y los datos opcionales que añadas) y
          los proyectos que un docente haya publicado, con el nombre de sus integrantes.
        </p>
        <p>
          Tu correo solo lo ven usuarios que han iniciado sesión con una cuenta de Tecsup. Los proyectos en borrador o en revisión solo los ven
          su equipo, los docentes involucrados y los administradores.
        </p>
      </>
    ),
  },
  {
    id: "proveedores",
    titulo: "Dónde se alojan",
    contenido: (
      <>
        <p>Para funcionar, Vitrina usa estos proveedores, que tratan los datos solo por nuestra cuenta:</p>
        <ul>
          <li>
            <strong>Vercel</strong>: aloja la web.
          </li>
          <li>
            <strong>Render</strong>: ejecuta el servidor de la aplicación.
          </li>
          <li>
            <strong>Neon</strong>: base de datos con perfiles y proyectos.
          </li>
          <li>
            <strong>Cloudflare R2</strong>: almacenamiento de imágenes y archivos subidos.
          </li>
          <li>
            <strong>Google</strong>: inicio de sesión con tu cuenta institucional.
          </li>
        </ul>
        <p>Algunos de estos servicios guardan los datos fuera del Perú, con las garantías de seguridad propias de cada proveedor.</p>
      </>
    ),
  },
  {
    id: "retencion",
    titulo: "Cuánto tiempo los guardamos",
    contenido: (
      <>
        <p>Mientras tu cuenta exista. Si la eliminas:</p>
        <ul>
          <li>Tus datos personales se borran de inmediato y tu perfil deja de mostrarse.</li>
          <li>Tus borradores que no compartías con nadie se eliminan junto con sus imágenes.</li>
          <li>
            Los proyectos ya publicados se conservan como registro académico de Tecsup, pero tu nombre se reemplaza por «Usuario eliminado».
          </li>
        </ul>
        <p>Las copias de seguridad técnicas se renuevan solas y desaparecen en pocos días.</p>
      </>
    ),
  },
  {
    id: "derechos",
    titulo: "Tus derechos",
    contenido: (
      <>
        <p>
          Puedes acceder a tus datos y corregirlos desde tu perfil en cualquier momento. También puedes pedirnos una copia, oponerte a un
          tratamiento concreto o solicitar que retiremos un contenido escribiendo a <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a>.
        </p>
        <p>
          Para borrar tu cuenta tú mismo, sigue los pasos de <Link href="/eliminar-cuenta">Eliminar tu cuenta</Link>.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    titulo: "Seguridad y menores",
    contenido: (
      <>
        <p>
          Las conexiones van cifradas, el acceso se hace solo con cuentas institucionales de Google y cada persona solo puede modificar lo que
          le corresponde según su rol.
        </p>
        <p>Vitrina está pensada para la comunidad de Tecsup y no está dirigida a menores de edad fuera de ella.</p>
      </>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en esta política",
    contenido: (
      <p>
        Si cambiamos algo importante lo indicaremos en esta página con una nueva fecha de actualización y, cuando corresponda, te avisaremos
        dentro de la plataforma.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      eyebrow="Legal"
      titulo="Política de privacidad"
      resumen={<p>En corto: usamos tu cuenta de Tecsup para que tengas un portafolio público de tus proyectos. Nada de publicidad ni analítica de terceros, y puedes borrar tu cuenta cuando quieras.</p>}
      actualizado="10 de octubre de 2026"
      secciones={secciones}
    />
  );
}
