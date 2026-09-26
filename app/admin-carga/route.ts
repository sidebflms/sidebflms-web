import { getPayload } from "payload";
import config from "@payload-config";

import { CIFRAS } from "@/content/cifras";
import { CIUDAD_DRONE, CIUDADES_DRONE } from "@/content/ciudades-drone";
import { CLIENTES } from "@/content/clientes";
import { CAMARAS_DE_ACCION, CAPACIDADES, DRONES } from "@/content/fleet";
import { PROJECTS } from "@/content/projects";
import { EQUIPO } from "@/content/team";
import { DRONE_SECCIONES_FICHERO, PREGUNTAS_FICHERO, TEXTOS_FICHERO, type ClaveTexto, type SeccionConItems } from "@/lib/contenido";

/**
 * CARGA EL CONTENIDO DE LOS FICHEROS EN EL PANEL.
 *
 *   curl -X POST "http://localhost:3005/admin-carga?clave=LA_CLAVE"
 *
 * Lee todo lo que hasta ahora vivía en código —proyectos, equipo, cifras,
 * clientes, preguntas frecuentes, las páginas de ciudad y las entradillas de
 * página— y lo mete en la base de datos. Se puede repetir: si algo ya está,
 * lo actualiza en vez de duplicarlo, así que sirve igual para la primera
 * carga que para rehacerla. NO borra nada que no venga de los ficheros.
 *
 * IMPORTANTE con Ciudades: las ejecuta DESPUÉS de Proyectos, porque su
 * relación a fichas de trabajo se resuelve por `slug` contra lo que YA
 * esté guardado — si algún día esto se reordena, Ciudades tiene que
 * seguir yendo después.
 *
 * ── EL MATERIAL NO ENTRA AQUÍ (Fase 3) ───────────────────────────────────
 * Vídeo, póster y foto son campos `upload` desde la Fase 3: hacen falta los
 * bytes del fichero, no una ruta de texto, así que esta ruta no los toca —ni
 * para crear ni para actualizar, así que reejecutarla nunca los borra—. Los
 * 199 que ya existían se migraron una vez con `/admin-migra-material`; los
 * nuevos se suben desde el propio panel, en la ficha del proyecto o la
 * persona.
 *
 * ── POR QUÉ ES UNA RUTA DE LA WEB Y NO UN SCRIPT SUELTO ─────────────────
 * Porque `content/projects.ts` importa `@/lib/base`, y ese alias sólo lo
 * entiende la propia aplicación. Un script por fuera —probado— se queda en
 * «Cannot find package '@/lib'». Dentro de la web, todo resuelve.
 *
 * ── POR QUÉ PIDE UNA CLAVE ──────────────────────────────────────────────
 * Porque machaca contenido. La clave es `PAYLOAD_SECRET`, que ya existe y no
 * sale de la máquina. Sin ella, responde 404: quien no deba saber que esto
 * existe, no se entera.
 *
 * ── OJO CON LA RUTA BASE ────────────────────────────────────────────────
 * `PROJECTS` y `EQUIPO` pasan por `conBase(...)`. En la web normal esa función
 * no añade nada, pero si esto se ejecutara en la versión de pruebas bajo una
 * ruta secreta, se guardarían las rutas con el prefijo dentro. Ejecutarlo en
 * la web normal.
 */
export async function POST(peticion: Request): Promise<Response> {
  const clave = new URL(peticion.url).searchParams.get("clave");
  if (!process.env.PAYLOAD_SECRET || clave !== process.env.PAYLOAD_SECRET) {
    return new Response("No encontrado", { status: 404 });
  }


  const payload = await getPayload({ config });

  let creados = 0;
  let actualizados = 0;

  for (const [i, p] of PROJECTS.entries()) {
    const datos = {
      orden: i,
      slug: p.slug,
      placeholder: p.placeholder,
      featured: p.featured,
      showpiece: p.showpiece ?? false,
      tone: p.tone,
      year: p.year,
      venue: p.venue ?? undefined,
      categories: p.categories,
      // El material NO va aquí, ver la nota de arriba.
    };

    const existente = await payload.find({
      collection: "proyectos",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });

    // Los campos por idioma se escriben en dos pasadas, una por idioma: es como
    // Payload guarda lo que está marcado como `localized`.
    const porIdioma = (locale: "es" | "en") => ({
      title: p.title[locale],
      hardFact: p.hardFact[locale],
      brief: p.brief[locale],
      metaDescription: p.metaDescription[locale],
      date: p.date?.[locale] ?? undefined,
    });

    if (existente.docs.length > 0) {
      const id = existente.docs[0].id;
      await payload.update({ collection: "proyectos", id, locale: "es", data: { ...datos, ...porIdioma("es") } });
      await payload.update({ collection: "proyectos", id, locale: "en", data: porIdioma("en") });
      actualizados += 1;
    } else {
      const creado = await payload.create({
        collection: "proyectos",
        locale: "es",
        data: { ...datos, ...porIdioma("es") },
      });
      await payload.update({ collection: "proyectos", id: creado.id, locale: "en", data: porIdioma("en") });
      creados += 1;
    }
  }

  const resumenProyectos = `Proyectos: ${creados} creados, ${actualizados} actualizados.`;

  creados = 0;
  actualizados = 0;

  for (const [i, m] of EQUIPO.entries()) {
    const datos = {
      orden: i,
      slug: m.slug,
      nombre: m.nombre,
      // La foto NO va aquí, ver la nota de arriba.
      fotoEsEjemplo: m.fotoEsEjemplo ?? false,
      roleEsEjemplo: m.roleEsEjemplo ?? false,
    };

    const existente = await payload.find({
      collection: "equipo",
      where: { slug: { equals: m.slug } },
      limit: 1,
    });

    if (existente.docs.length > 0) {
      const id = existente.docs[0].id;
      await payload.update({ collection: "equipo", id, locale: "es", data: { ...datos, role: m.role?.es } });
      await payload.update({ collection: "equipo", id, locale: "en", data: { role: m.role?.en } });
      actualizados += 1;
    } else {
      const creado = await payload.create({
        collection: "equipo",
        locale: "es",
        data: { ...datos, role: m.role?.es },
      });
      await payload.update({ collection: "equipo", id: creado.id, locale: "en", data: { role: m.role?.en } });
      creados += 1;
    }
  }

  const resumenEquipo = `Equipo: ${creados} creados, ${actualizados} actualizados.`;

  // ── Preguntas frecuentes ──────────────────────────────────────────────
  // Sin `slug` que las identifique: se emparejan por posición (`orden`), que
  // es estable porque `PREGUNTAS_FICHERO` sale de un array fijo del código.
  creados = 0;
  actualizados = 0;

  for (const [i, p] of PREGUNTAS_FICHERO.entries()) {
    const existente = await payload.find({
      collection: "preguntas",
      where: { orden: { equals: i } },
      limit: 1,
    });

    if (existente.docs.length > 0) {
      const id = existente.docs[0].id;
      await payload.update({ collection: "preguntas", id, locale: "es", data: { orden: i, q: p.q.es, a: p.a.es } });
      await payload.update({ collection: "preguntas", id, locale: "en", data: { q: p.q.en, a: p.a.en } });
      actualizados += 1;
    } else {
      const creado = await payload.create({
        collection: "preguntas",
        locale: "es",
        data: { orden: i, q: p.q.es, a: p.a.es },
      });
      await payload.update({ collection: "preguntas", id: creado.id, locale: "en", data: { q: p.q.en, a: p.a.en } });
      creados += 1;
    }
  }

  const resumenPreguntas = `Preguntas: ${creados} creadas, ${actualizados} actualizadas.`;

  // ── Ciudades (páginas de drone por ciudad) ──────────────────────────────
  // El titular se guarda con saltos de línea de verdad (`\n`), no como
  // array: ver la nota de `headline` en `Ciudades`, panel/colecciones.ts.
  creados = 0;
  actualizados = 0;

  for (const [i, slug] of CIUDADES_DRONE.entries()) {
    const c = CIUDAD_DRONE[slug];

    // La relación a Proyectos guarda IDs, no slugs: hay que resolverlos
    // antes de guardar. Si algún slug no existe todavía como proyecto
    // (fuera de orden en un `admin-carga` a medias), se omite sin más —no
    // es motivo para que falle toda la carga.
    const relacionados = await payload.find({
      collection: "proyectos",
      where: { slug: { in: c.proyectos } },
      limit: c.proyectos.length,
      depth: 0,
    });
    const idPorSlug = new Map(relacionados.docs.map((p) => [p.slug, p.id]));
    const idsEnOrden = c.proyectos.map((s) => idPorSlug.get(s)).filter((id): id is number => id != null);

    const datos = {
      orden: i,
      slug,
      nombre: c.nombre,
      proyectos: idsEnOrden,
    };
    const porIdioma = (locale: "es" | "en") => ({
      headline: c.headline[locale].join("\n"),
      intro: c.intro[locale],
      cuerpo: c.cuerpo[locale],
    });

    const existente = await payload.find({
      collection: "ciudades",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (existente.docs.length > 0) {
      const id = existente.docs[0].id;
      await payload.update({ collection: "ciudades", id, locale: "es", data: { ...datos, ...porIdioma("es") } });
      await payload.update({ collection: "ciudades", id, locale: "en", data: porIdioma("en") });
      actualizados += 1;
    } else {
      const creado = await payload.create({
        collection: "ciudades",
        locale: "es",
        data: { ...datos, ...porIdioma("es") },
      });
      await payload.update({ collection: "ciudades", id: creado.id, locale: "en", data: porIdioma("en") });
      creados += 1;
    }
  }

  const resumenCiudades = `Ciudades: ${creados} creadas, ${actualizados} actualizadas.`;

  // ── Cifras, clientes y textos: los tres Globals, sólo hay una copia ────
  //
  // OJO con el array de «items»: a diferencia de un campo suelto, si la
  // segunda pasada (inglés) no lleva el `id` que Payload le puso a cada fila
  // en la primera, no la actualiza: crea filas NUEVAS. Y como esas filas
  // nuevas nunca reciben una traducción en español, la etiqueta en español
  // se queda vacía —y `valor`, que no está marcado `localized` pero vive
  // dentro del array, se pierde de las filas viejas que se quedan huérfanas—.
  // Por eso se guardan los `id` de la primera pasada y se reutilizan en la
  // segunda: así las dos escriben sobre las mismas cinco filas.
  const cifrasEs = await payload.updateGlobal({
    slug: "cifras",
    locale: "es",
    data: { items: CIFRAS.map((c) => ({ valor: c.valor ?? undefined, etiqueta: c.etiqueta.es })) },
  });
  const idsCifras = (cifrasEs.items ?? []).map((item) => item.id);
  await payload.updateGlobal({
    slug: "cifras",
    locale: "en",
    data: {
      items: CIFRAS.map((c, i) => ({
        id: idsCifras[i] ?? undefined,
        valor: c.valor ?? undefined,
        etiqueta: c.etiqueta.en,
      })),
    },
  });

  await payload.updateGlobal({
    slug: "clientes",
    data: { items: CLIENTES.map((nombre) => ({ nombre })) },
  });

  // Mismo motivo que Cifras arriba: `drones` y `capacidades` llevan un campo
  // `localized` dentro del array, así que la segunda pasada (inglés) tiene
  // que reutilizar los `id` de la primera o crea filas nuevas y huérfanas.
  const camarasAccion = CAMARAS_DE_ACCION.map((modelo) => ({ modelo }));
  const equipoEs = await payload.updateGlobal({
    slug: "equipo-tecnico",
    locale: "es",
    data: {
      drones: DRONES.map((d) => ({ modelo: d.modelo, uso: d.uso.es })),
      camarasAccion,
      capacidades: CAPACIDADES.map((c) => ({ texto: c.es, prueba: c.prueba })),
    },
  });
  const idsDrones = (equipoEs.drones ?? []).map((d) => d.id);
  const idsCapacidades = (equipoEs.capacidades ?? []).map((c) => c.id);
  await payload.updateGlobal({
    slug: "equipo-tecnico",
    locale: "en",
    data: {
      drones: DRONES.map((d, i) => ({ id: idsDrones[i] ?? undefined, modelo: d.modelo, uso: d.uso.en })),
      camarasAccion,
      capacidades: CAPACIDADES.map((c, i) => ({
        id: idsCapacidades[i] ?? undefined,
        texto: c.en,
        prueba: c.prueba,
      })),
    },
  });

  // Mismo motivo que Cifras y Equipo técnico arriba: los `items` de cada
  // sección llevan campos `localized`, así que la segunda pasada (inglés)
  // tiene que reutilizar los `id` de la primera.
  const datosSeccionEs = (s: SeccionConItems) => ({
    label: s.label.es,
    intro: s.intro.es,
    items: s.items.map((item) => ({ heading: item.heading.es, body: item.body.es })),
  });
  const droneSeccionesEs = await payload.updateGlobal({
    slug: "drone-secciones",
    locale: "es",
    data: {
      permisos: datosSeccionEs(DRONE_SECCIONES_FICHERO.permisos),
      presupuesto: datosSeccionEs(DRONE_SECCIONES_FICHERO.presupuesto),
      encargos: datosSeccionEs(DRONE_SECCIONES_FICHERO.encargos),
    },
  });
  const idsDe = (grupo?: { items?: ({ id?: string | null } | null)[] | null }): (string | undefined)[] =>
    (grupo?.items ?? []).map((it) => it?.id ?? undefined);
  const datosSeccionEn = (s: SeccionConItems, ids: (string | undefined)[]) => ({
    label: s.label.en,
    intro: s.intro.en,
    items: s.items.map((item, i) => ({ id: ids[i] ?? undefined, heading: item.heading.en, body: item.body.en })),
  });
  await payload.updateGlobal({
    slug: "drone-secciones",
    locale: "en",
    data: {
      permisos: datosSeccionEn(DRONE_SECCIONES_FICHERO.permisos, idsDe(droneSeccionesEs.permisos)),
      presupuesto: datosSeccionEn(DRONE_SECCIONES_FICHERO.presupuesto, idsDe(droneSeccionesEs.presupuesto)),
      encargos: datosSeccionEn(DRONE_SECCIONES_FICHERO.encargos, idsDe(droneSeccionesEs.encargos)),
    },
  });

  const claves = Object.keys(TEXTOS_FICHERO) as ClaveTexto[];
  const datosTextos = (locale: "es" | "en") =>
    Object.fromEntries(claves.map((clave) => [clave, TEXTOS_FICHERO[clave][locale]]));
  await payload.updateGlobal({ slug: "textos", locale: "es", data: datosTextos("es") });
  await payload.updateGlobal({ slug: "textos", locale: "en", data: datosTextos("en") });

  return Response.json({
    proyectos: resumenProyectos,
    equipo: resumenEquipo,
    preguntas: resumenPreguntas,
    ciudades: resumenCiudades,
    cifras: `${CIFRAS.length} cifras cargadas.`,
    clientes: `${CLIENTES.length} clientes cargados.`,
    equipoTecnico: `${DRONES.length} drones, ${CAMARAS_DE_ACCION.length} cámaras de acción, ${CAPACIDADES.length} capacidades cargadas.`,
    droneSecciones: `permisos: ${DRONE_SECCIONES_FICHERO.permisos.items.length}, presupuesto: ${DRONE_SECCIONES_FICHERO.presupuesto.items.length}, encargos: ${DRONE_SECCIONES_FICHERO.encargos.items.length}.`,
    textos: `${claves.length} entradillas cargadas.`,
  });
}
