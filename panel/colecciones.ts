import path from "node:path";
import { fileURLToPath } from "node:url";

import type { CollectionConfig, GlobalConfig } from "payload";

/** La carpeta del material subido: `media/`, junto a `public/`, pero NUNCA
 * dentro de ella. Ver el comentario de `Media` más abajo. */
const CARPETA_MEDIA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "media");

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

/**
 * Vuelve a generar las páginas de la web tras un cambio en el panel.
 *
 * `next/cache` se pide AQUÍ DENTRO y no arriba del todo a propósito: estas
 * colecciones también las lee la herramienta de línea de comandos de Payload
 * —la que crea y aplica las migraciones—, y ahí no hay Next que valga. Con el
 * import arriba, cualquier migración fallaba con «Cannot find module
 * next/cache». (2026-09-23)
 */
const avisaALaWeb = async ({ doc }: { doc?: { _status?: string } } = {}) => {
  // Un borrador (Proyectos, ver más abajo) no se enseña en la web pública:
  // regenerar 71 páginas por cada guardado intermedio sería trabajo tirado.
  // `_status` sólo existe en colecciones con `versions.drafts`; en las demás
  // (Equipo, Preguntas) viene `undefined` y esto no cambia nada para ellas.
  if (doc?._status === "draft") return;
  try {
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    // Fuera de la web no hay páginas que caducar, y no es un error.
  }
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
    defaultColumns: ["slug", "year", "venue", "featured", "_status"],
    group: "Contenido",
    description:
      "Las fichas de Trabajo. El orden de esta lista es el orden en que salen en la web.",
  },
  // Se puede dejar una ficha a medias sin que salga en la web: «Guardar
  // borrador» en vez de «Publicar». La web pública SIGUE viendo la última
  // versión publicada —`lib/contenido.ts` no pide borradores— hasta que se
  // publique el cambio. Sin `autosave`: que Payload guarde solo mientras se
  // escribe dispararía `avisaALaWeb` a cada rato para nada, ya que un
  // borrador no cambia lo que ve el público.
  versions: { drafts: { autosave: false } },
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
    // Subidas a la colección Media, no rutas de texto: ver el comentario de
    // `Media` más abajo. El fichero que se sube tiene que venir YA
    // convertido a su versión ligera —el máster se prepara en el Mac—.
    {
      type: "collapsible",
      label: "Material",
      fields: [
        { name: "video", type: "upload", relationTo: "media" },
        { name: "poster", type: "upload", relationTo: "media" },
        { name: "verticalVideo", label: "Vídeo vertical", type: "upload", relationTo: "media" },
        { name: "verticalPoster", label: "Póster vertical", type: "upload", relationTo: "media" },
        {
          name: "gallery",
          label: "Galería (sólo fotografía)",
          type: "array",
          // Sigue llamándose «ruta» aunque ya no lo sea: si se renombra, la
          // herramienta de migraciones lo confunde con un renombrado de
          // columna y pregunta de forma interactiva —no se puede automatizar
          // desde un despliegue—. El nombre del campo no lo ve Mario, sólo
          // la `label`.
          fields: [{ name: "ruta", label: "Archivo", type: "upload", relationTo: "media", required: true }],
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
    { name: "foto", type: "upload", relationTo: "media" },
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

export const Preguntas: CollectionConfig = {
  slug: "preguntas",
  hooks: {
    afterChange: [avisaALaWeb],
    afterDelete: [avisaALaWeb],
  },
  labels: { singular: "Pregunta", plural: "Preguntas frecuentes" },
  admin: {
    useAsTitle: "q",
    defaultColumns: ["q", "orden"],
    group: "Contenido",
    description: "El FAQ de la web. El orden de la lista es el de la web.",
  },
  defaultSort: "orden",
  fields: [
    { name: "orden", type: "number", required: true, defaultValue: 0, admin: { position: "sidebar" } },
    { name: "q", label: "Pregunta", type: "text", required: true, localized: true },
    { name: "a", label: "Respuesta", type: "textarea", required: true, localized: true },
  ],
};

/**
 * EL MATERIAL: fotos y vídeos YA PREPARADOS.
 *
 * «Ya preparados» es la palabra que importa: esto NO convierte el máster de
 * dos gigas en la versión ligera de la web —eso lo siguen haciendo
 * `scripts/pieza-web.sh` y `scripts/cinta-web.sh` en el Mac, ver el punto 5 de
 * `docs/panel-de-contenido.md`—. Lo que hace el panel es la parte que antes
 * era código: guardar el fichero ya convertido y enlazarlo con la ficha, sin
 * tocar `content/projects.ts` ni volver a desplegar.
 *
 * ── DÓNDE SE GUARDA, Y POR QUÉ NO EN `public/` ───────────────────────────
 * En `media/`, junto al repositorio pero fuera de él: no está en Git
 * (`.gitignore`) ni lo toca el despliegue (excluido del `rsync --delete`,
 * igual que `.env`). Así el repositorio deja de engordar con cada proyecto
 * —154 MB a fecha de la Fase 3, y subiendo— y lo que se sube desde el panel
 * sobrevive a cada `git pull` en vez de perderse en el primer despliegue.
 *
 * Los 199 ficheros que YA estaban en `public/media` antes de la Fase 3 se
 * migraron aquí con `/admin-migra-material` (ver ese fichero): a partir de
 * esa migración, `public/media` es historia en el repositorio, no la fuente
 * de la que lee la web.
 *
 * ── CÓMO SE SIRVE ─────────────────────────────────────────────────────────
 * Por la propia ruta de la API de Payload (`/api/media/file/…`), que ya
 * existe desde la Fase 0 —`app/(payload)/api/[...slug]/route.ts`—. Mientras
 * la web siga con contraseña, pasa por Apache igual que todo lo demás; el día
 * que se abra al público, sumarla a la ruta rápida de `publicar.sh` (la que
 * hoy sirve `public/` y `.next/static` directamente por nginx) es trabajo
 * pendiente, anotado allí.
 */
export const Media: CollectionConfig = {
  slug: "media",
  // SIN ESTO, 403 PARA TODO EL MUNDO. Por defecto Payload exige estar
  // identificado hasta para LEER —da igual la colección—, y hasta ahora daba
  // igual: la web sólo pedía el contenido por la API local (`lib/contenido.ts`),
  // que no pasa por aquí. El material es distinto: el `<img>`/`<video>` que
  // pinta la página lo pide el NAVEGADOR DEL VISITANTE, sin sesión ninguna,
  // así que su lectura tiene que ser pública. Crear, editar y borrar se
  // quedan como estaban —sólo quien tenga usuario del panel—.
  access: { read: () => true },
  hooks: {
    afterChange: [avisaALaWeb],
    afterDelete: [avisaALaWeb],
  },
  labels: { singular: "Archivo", plural: "Material" },
  admin: {
    group: "Contenido",
    description:
      "Fotos y vídeos ya convertidos a su versión ligera. El máster se prepara en el Mac; aquí sólo se sube el resultado.",
  },
  upload: {
    staticDir: CARPETA_MEDIA,
    mimeTypes: ["image/*", "video/*"],
    // El tamaño máximo del fichero se limita en payload.config.ts
    // (`upload.requestSizeLimit`): es un límite de la petición entera, no de
    // esta colección en concreto, así que va ahí y no aquí.
  },
  fields: [
    {
      name: "alt",
      label: "Descripción",
      type: "text",
      admin: { description: "Para quien no puede ver la imagen. No sale en pantalla." },
    },
  ],
};

/**
 * ── LOS GLOBALS: CONTENIDO DEL QUE SÓLO HAY UNA COPIA ────────────────────
 *
 * `Cifras`, `Clientes` y `Textos` no son listas de fichas con su propia
 * dirección —como Proyectos o Equipo—: son bloques únicos de la web. Payload
 * los llama «globals» y se editan en su propia pantalla, sin lista de por
 * medio. Mismo aviso al guardar, mismo plan B en `lib/contenido.ts` si la
 * base no responde.
 */

export const Cifras: GlobalConfig = {
  slug: "cifras",
  hooks: { afterChange: [avisaALaWeb] },
  label: "Cifras",
  admin: {
    group: "Contenido",
    description: "La ficha técnica de la portada y de Nosotros. El orden de la lista es el de la web.",
  },
  fields: [
    {
      name: "items",
      label: "Cifras",
      type: "array",
      fields: [
        {
          name: "valor",
          label: "Número",
          type: "text",
          admin: { description: "«329», «+2.000». Vacío: esa cifra no se pinta." },
        },
        { name: "etiqueta", label: "Rótulo", type: "text", required: true, localized: true },
      ],
    },
  ],
};

export const Clientes: GlobalConfig = {
  slug: "clientes",
  hooks: { afterChange: [avisaALaWeb] },
  label: "Clientes",
  admin: {
    group: "Contenido",
    description: "La cinta de nombres de Trabajo. Mismo nombre en los dos idiomas.",
  },
  fields: [
    {
      name: "items",
      label: "Clientes",
      type: "array",
      fields: [{ name: "nombre", type: "text", required: true }],
    },
  ],
};

export const Textos: GlobalConfig = {
  slug: "textos",
  hooks: { afterChange: [avisaALaWeb] },
  label: "Textos",
  admin: {
    group: "Contenido",
    description:
      "La entradilla de cada página: el párrafo bajo el titular. Vacío: se ve el texto de siempre. " +
      "Los titulares y los rótulos del menú no están aquí a propósito: son arrays de líneas para la " +
      "animación de entrada, ver content/dictionaries/es.ts.",
  },
  fields: [
    { name: "servicesIntro", label: "Servicios — entradilla", type: "textarea", localized: true },
    { name: "portfolioIntro", label: "Trabajo — entradilla", type: "textarea", localized: true },
    { name: "jobsIntro", label: "Trabaja con nosotros — entradilla", type: "textarea", localized: true },
    { name: "contactIntro", label: "Contacto — entradilla", type: "textarea", localized: true },
    { name: "aboutIntro", label: "Nosotros — entradilla", type: "textarea", localized: true },
    { name: "aboutWhereBody", label: "Nosotros — dónde operamos", type: "textarea", localized: true },
    { name: "faqIntro", label: "Preguntas frecuentes — entradilla", type: "textarea", localized: true },
    { name: "droneIntro", label: "Drone — entradilla", type: "textarea", localized: true },
  ],
};
