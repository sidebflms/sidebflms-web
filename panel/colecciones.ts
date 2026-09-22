import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

/**
 * LAS COLECCIONES DEL PANEL.
 *
 * Son la misma forma que tienen hoy `content/projects.ts` y `content/team.ts`,
 * traducida al idioma de Payload. Eso es deliberado: la web sigue recibiendo
 * exactamente los mismos objetos que recibía —ver `lib/contenido.ts`—, así que
 * NINGÚN componente cambia. Lo único que cambia es de dónde salen.
 *
 * ── QUÉ PASA AL GUARDAR ─────────────────────────────────────────────────
 * Las páginas de la web se generan una vez y se guardan hechas, que es lo que
 * hace que vayan rápidas. Por eso, al guardar aquí hay que AVISARLAS de que
 * caducaron; si no, seguirían enseñando lo de antes hasta el siguiente
 * despliegue. De eso se encarga `avisaALaWeb`, enganchado a las dos
 * colecciones.
 *
 * Avisa de TODA la web y no sólo de la página tocada, a propósito: un mismo
 * proyecto sale en la portada, en Trabajo, en su ficha y en el sitemap, y
 * acertar con la lista exacta es la clase de detalle que se olvida al añadir
 * una sección. Con 71 páginas, regenerarlas cuesta tres segundos.
 *
 * ── QUÉ SIGNIFICA `localized` ───────────────────────────────────────────
 * Que ese campo se guarda una vez por idioma. Es el equivalente exacto de los
 * `Record<Locale, string>` del código de hoy: `title`, `date`, `hardFact` y
 * `brief`. Los demás campos —rutas de vídeo, categorías, el sitio— son los
 * mismos en las dos versiones.
 */

/** Vuelve a generar las páginas de la web tras un cambio en el panel. */
const avisaALaWeb = () => {
  revalidatePath("/", "layout");
};

/** Las mismas cinco de `content/projects.ts`, y en el mismo orden. */
const CATEGORIAS = [
  { label: "Aftermovie", value: "aftermovie" },
  { label: "Multicámara", value: "multicam" },
  { label: "Drone", value: "drone" },
  { label: "Fotografía", value: "photo" },
  { label: "Publicidad", value: "ads" },
] as const;

export const Usuarios: CollectionConfig = {
  slug: "usuarios",
  auth: true,
  admin: { useAsTitle: "email", group: "Panel" },
  labels: { singular: "Usuario", plural: "Usuarios" },
  fields: [
    {
      name: "nombre",
      type: "text",
      admin: { description: "Para saber quién ha tocado qué." },
    },
  ],
};

export const Proyectos: CollectionConfig = {
  slug: "proyectos",
  hooks: {
    afterChange: [avisaALaWeb],
    afterDelete: [avisaALaWeb],
  },
  labels: { singular: "Proyecto", plural: "Proyectos" },
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "year", "venue", "featured"],
    group: "Contenido",
    description:
      "Las fichas de Trabajo. El orden de esta lista es el orden en que salen en la web.",
  },
  // El orden importa: la web pinta los proyectos en el orden del array, así
  // que se le da a Payload un campo para ordenarlos a mano.
  defaultSort: "orden",
  fields: [
    {
      name: "orden",
      type: "number",
      required: true,
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Menor primero. Es el orden en el que salen en la web.",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description:
          "La dirección de la ficha: /trabajo/ESTO. Si se cambia, el enlace antiguo deja de funcionar.",
      },
    },
    {
      name: "placeholder",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Marcado: la ficha se pinta como material pendiente.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Sale en los destacados de la portada." },
    },
    {
      name: "showpiece",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "La pieza central. Sólo una." },
    },
    {
      name: "tone",
      type: "number",
      defaultValue: 0,
      min: 0,
      max: 3,
      admin: { position: "sidebar", description: "0 a 3: varía el tono del bloque." },
    },

    // ── Lo que se lee ──────────────────────────────────────────────────
    { name: "title", label: "Nombre", type: "text", required: true, localized: true },
    {
      name: "hardFact",
      label: "Línea corta",
      type: "text",
      localized: true,
      admin: { description: "La frase de una línea que va bajo el nombre." },
    },
    {
      name: "brief",
      label: "Texto",
      type: "textarea",
      localized: true,
      admin: {
        description:
          "El cuerpo de la ficha. Los párrafos se separan con una línea en blanco.",
      },
    },
    {
      name: "date",
      label: "Fecha escrita",
      type: "text",
      localized: true,
      admin: {
        description:
          "Tal como se lee: «17 de enero de 2026» / «17 January 2026». Vacío si no se sabe.",
      },
    },
    { name: "year", type: "text", admin: { description: "«2026», o «—» si no se sabe." } },
    { name: "venue", label: "Sitio", type: "text", admin: { description: "«Fabrik». Vacío si no aplica." } },
    {
      name: "categories",
      label: "Disciplinas",
      type: "select",
      hasMany: true,
      required: true,
      options: [...CATEGORIAS],
    },

    // ── El material ────────────────────────────────────────────────────
    // Rutas de fichero, NO subidas: en esta fase el vídeo se sigue preparando
    // con los scripts y se copia a `public/media`. La Fase 3 cambia esto.
    {
      type: "collapsible",
      label: "Material",
      fields: [
        { name: "video", type: "text", admin: { description: "/media/loquesea.mp4" } },
        { name: "poster", type: "text", admin: { description: "/media/loquesea.jpg" } },
        { name: "verticalVideo", label: "Vídeo vertical", type: "text" },
        { name: "verticalPoster", label: "Póster vertical", type: "text" },
        {
          name: "gallery",
          label: "Galería (sólo fotografía)",
          type: "array",
          fields: [{ name: "ruta", type: "text", required: true }],
        },
      ],
    },
  ],
};

export const Equipo: CollectionConfig = {
  slug: "equipo",
  hooks: {
    afterChange: [avisaALaWeb],
    afterDelete: [avisaALaWeb],
  },
  labels: { singular: "Persona", plural: "Equipo" },
  admin: {
    useAsTitle: "nombre",
    defaultColumns: ["nombre", "slug", "orden"],
    group: "Contenido",
    description: "La rejilla de Nosotros. El orden de la lista es el de la web.",
  },
  defaultSort: "orden",
  fields: [
    { name: "orden", type: "number", required: true, defaultValue: 0, admin: { position: "sidebar" } },
    { name: "slug", type: "text", required: true, unique: true, admin: { position: "sidebar" } },
    { name: "nombre", type: "text", required: true },
    {
      name: "role",
      label: "Cargo",
      type: "text",
      localized: true,
      admin: { description: "En español va en la forma de los créditos: «Realización / Montaje»." },
    },
    { name: "foto", type: "text", admin: { description: "/media/equipo/quien.jpg" } },
    {
      name: "fotoEsEjemplo",
      label: "La foto es de relleno",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Marcado: la web avisa de que esa foto no es suya." },
    },
    {
      name: "roleEsEjemplo",
      label: "El cargo está sin confirmar",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
};
