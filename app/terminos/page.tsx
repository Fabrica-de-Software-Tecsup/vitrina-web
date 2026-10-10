import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal, { type SeccionLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones para usar Vitrina: cuentas institucionales, contenido de los proyectos, revisión docente y uso aceptable.",
  alternates: { canonical: "/terminos" },
};

const CONTACTO = "bpareja.me@gmail.com";

const secciones: SeccionLegal[] = [
  {
    id: "servicio",
    titulo: "El servicio",
    contenido: (
      <p>
        Vitrina es un portafolio público donde los estudiantes de Tecsup muestran sus proyectos. La opera el equipo de Vitrina (Coresearch
        Studio) para la comunidad de Tecsup. Al usar la web o la app aceptas estos términos y la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    ),
  },
  {
    id: "cuentas",
    titulo: "Cuentas institucionales",
    contenido: (
      <>
        <p>
          Para publicar necesitas iniciar sesión con tu cuenta de Google <code>@tecsup.edu.pe</code>. La cuenta es personal: eres responsable de
          lo que se haga con ella y de mantener tu perfil con datos veraces.
        </p>
        <p>
          Los roles (alumno, docente, administrador) los asigna Tecsup o el equipo de Vitrina. Si dejas de pertenecer a la institución, tu
          contenido publicado puede mantenerse como registro académico.
        </p>
      </>
    ),
  },
  {
    id: "contenido",
    titulo: "Tu contenido",
    contenido: (
      <>
        <p>
          <strong>Los proyectos son de sus autores.</strong> Tú y tu equipo conservan la autoría y los derechos sobre lo que publican.
        </p>
        <p>
          Al publicar un proyecto concedes a Vitrina y a Tecsup una licencia gratuita, no exclusiva y mundial para mostrarlo, reproducirlo en la
          plataforma y difundirlo con fines académicos e institucionales (por ejemplo, en la página de un curso o en redes de Tecsup), siempre
          citando a los autores.
        </p>
        <p>
          Antes de subir algo asegúrate de tener permiso de tu equipo y de que no infringe derechos de terceros (imágenes, código, marcas o datos
          de otras personas).
        </p>
      </>
    ),
  },
  {
    id: "revision",
    titulo: "Revisión por docentes",
    contenido: (
      <p>
        Un proyecto solo se hace público cuando un docente lo aprueba. Los docentes pueden publicarlo, devolverlo con observaciones u ocultarlo.
        Cada nueva versión de un proyecto publicado pasa otra vez por revisión, y las versiones anteriores quedan como historial.
      </p>
    ),
  },
  {
    id: "uso-aceptable",
    titulo: "Uso aceptable",
    contenido: (
      <>
        <p>No está permitido:</p>
        <ul>
          <li>Publicar contenido ofensivo, discriminatorio, sexual, violento o ilegal.</li>
          <li>Hacerse pasar por otra persona o atribuirse el trabajo de otros.</li>
          <li>Subir datos personales de terceros sin su consentimiento.</li>
          <li>Subir software malicioso o enlaces engañosos.</li>
          <li>Intentar acceder a cuentas o datos ajenos, o sobrecargar o vulnerar el servicio.</li>
        </ul>
      </>
    ),
  },
  {
    id: "retiro",
    titulo: "Retiro de contenido",
    contenido: (
      <p>
        Podemos ocultar o retirar contenido que incumpla estos términos y, en casos graves o repetidos, suspender la cuenta. Si crees que algo
        publicado infringe tus derechos o es inapropiado, escríbenos a <a href={`mailto:${CONTACTO}`}>{CONTACTO}</a> indicando el enlace y lo
        revisaremos.
      </p>
    ),
  },
  {
    id: "baja",
    titulo: "Dar de baja tu cuenta",
    contenido: (
      <p>
        Puedes eliminar tu cuenta cuando quieras. Los pasos y lo que se conserva están en <Link href="/eliminar-cuenta">Eliminar tu cuenta</Link>.
      </p>
    ),
  },
  {
    id: "responsabilidad",
    titulo: "Limitación de responsabilidad",
    contenido: (
      <>
        <p>
          Vitrina se ofrece tal cual, como herramienta académica y sin costo. Hacemos lo posible por mantenerla disponible y segura, pero no
          garantizamos que funcione sin interrupciones ni errores.
        </p>
        <p>
          Cada equipo responde por el contenido que publica y por los enlaces externos que incluye. Vitrina no se hace responsable de los
          proyectos, aplicaciones o sitios de terceros enlazados desde la plataforma.
        </p>
      </>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en estos términos",
    contenido: (
      <p>
        Podemos actualizar estos términos. Publicaremos la nueva versión en esta página con su fecha y, si el cambio es importante, lo
        avisaremos dentro de la plataforma. Seguir usando Vitrina después del cambio implica aceptarlo.
      </p>
    ),
  },
];

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Términos de uso"
      resumen={<p>Las reglas para usar Vitrina: tu trabajo sigue siendo tuyo, los docentes revisan antes de publicar y todos cuidamos lo que se comparte.</p>}
      actualizado="10 de octubre de 2026"
      secciones={secciones}
    />
  );
}
