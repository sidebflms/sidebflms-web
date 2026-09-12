/**
 * EL EQUIPO.
 *
 * ── DE DÓNDE SALEN ESTOS NOMBRES ─────────────────────────────────────────
 * De la lista de buzones de la empresa, que Mario pasó el 2026-09-10. Se
 * quitaron Fran y Joker, que ya no están.
 *
 * **Los correos NO se publican.** Están en la lista de origen, pero un correo
 * personal en una web comercial es una dirección más para el spam y no aporta
 * nada: el contacto del sitio es uno solo, `contact@sidebflms.com`.
 *
 * ── LO QUE FALTA, Y HAY QUE PEDIR ────────────────────────────────────────
 * `role` está en `null` en casi todos. Un equipo sin cargos se lee como una
 * lista de nombres; con cargos se lee como una productora que sabe quién hace
 * qué. Es lo que separa esta página de un directorio.
 *
 * NO SE INVENTAN. Poner «cámara» a alguien que es productor es de las cosas
 * que un cliente detecta en la primera llamada. La ficha se pinta sin cargo
 * mientras esté en `null`, que es feo pero no es mentira.
 *
 * ── QUÉ FOTO, DECIDIDO ───────────────────────────────────────────────────
 * DECISIÓN (Mario, 2026-09-12): **de cada uno TRABAJANDO**, no de carnet.
 *
 * Dos motivos, y el segundo es el que zanja:
 *   1. Es lo que la empresa vende. Un retrato de estudio dice «directorio de
 *      empleados»; una foto en el recinto, con el equipo en las manos, dice lo
 *      que se hace.
 *   2. El sitio es casi negro. Once retratos sobre fondo blanco serían once
 *      agujeros de luz en la rejilla. Los fondos de recinto encajan solos.
 *
 * CONDICIÓN: **que se le vea la cara**. La primera prueba que llegó era un
 * perfil mirando por el visor, y en una página de equipo hay que reconocer a
 * la persona. De tres cuartos, con la cámara o el mando, pero de cara.
 *
 * Si algún día se cambia a retratos de estudio, habrá que recortarlos sobre
 * fondo oscuro: tal cual no pegan.
 *
 * Faltan las fotos. La cuadrícula funciona sin ellas.
 *
 * ── CARAS: CONFIRMADO ────────────────────────────────────────────────────
 * Mario confirmó el 2026-09-12 que se pueden publicar las caras del equipo.
 * Queda en pie lo otro, que es distinto: que cada uno sepa CÓMO aparece
 * escrito, sobre todo quien sale con apodo (Galoguin, Jota, Kenny) y no con su
 * nombre. Eso no lo arregla un permiso general.
 */

export type Miembro = {
  /** Como quiere aparecer en la web. Apodo si es como se le conoce. */
  nombre: string;
  /**
   * Nombre del fichero de su foto, sin extensión, en `public/media/equipo/`.
   * Es fijo aunque cambie cómo aparece el nombre: así renombrar a alguien no
   * rompe su foto.
   */
  slug: string;
  /** `null` mientras no esté confirmado. NO se rellena a ojo. */
  role: { es: string; en: string } | null;
  /** Ruta en `public/media/equipo/`. `null` mientras no haya foto. */
  foto: string | null;
};

export const EQUIPO: Miembro[] = [
  { nombre: "Mario Bote", slug: "mario-bote", role: null, foto: null },
  { nombre: "Fernando", slug: "fernando", role: null, foto: null },
  { nombre: "Galoguin", slug: "galoguin", role: null, foto: null },
  { nombre: "Iván", slug: "ivan", role: null, foto: null },
  { nombre: "Jota", slug: "jota", role: null, foto: null },
  { nombre: "Kenny", slug: "kenny", role: null, foto: null },
  { nombre: "María", slug: "maria", role: null, foto: null },
  { nombre: "Nacho López", slug: "nacho-lopez", role: null, foto: null },
  { nombre: "Natalia", slug: "natalia", role: null, foto: null },
  { nombre: "Rubén", slug: "ruben", role: null, foto: null },
  { nombre: "Sergio", slug: "sergio", role: null, foto: null },
];

/**
 * La foto de grupo. Va a ancho completo encima de la rejilla.
 * `null` mientras no exista: la página simplemente no la pinta.
 *
 * ORIGEN: la exportación de Fotos del 2026-09-12 (`SIDEBFLMS BTS - 49 of 64`),
 * cuatro del equipo cruzando el campo con el escenario de DURO montándose
 * detrás. Se eligió ésta entre las de grupo por lo mismo que se decidió arriba
 * para los retratos: es una foto de trabajo, no una foto de posado, y además
 * viene apaisada, que es lo que pide el hueco 21:9.
 *
 * La otra candidata era la del equipo entero en Monegros delante de las letras
 * RAVE, pero es vertical y salen 18 personas, que no cuadra con las 11 de la
 * lista de aquí abajo. Está guardada por si se aclara.
 */
export const FOTO_GRUPO: string | null = "/media/equipo/grupo.jpg";

/**
 * LA FOTO DE MONEGROS — el equipo ampliado.
 *
 * Aquí salen 18 personas y en `EQUIPO` hay 11. No es un descuadre: para
 * Monegros **se amplió el equipo temporalmente**, y Mario quiere que eso se
 * vea, porque es una capacidad y no una nota al pie — dice que la productora
 * sabe montar y dirigir un equipo grande cuando el trabajo lo pide.
 *
 * Por eso va con su propio texto al lado y no mezclada con las de grupo: sin
 * explicación, dieciocho caras encima de una lista de once se lee como un error.
 */
export const FOTO_AMPLIACION: string | null = "/media/equipo/monegros.jpg";

/**
 * ¿Se pintan los retratos individuales?
 *
 * Sólo si TODOS tienen foto. Con la mitad, la rejilla se ve a medio hacer —
 * seis caras y cinco huecos—, que es peor que ninguna foto. Mientras falte una
 * sola, se queda la versión de sólo nombres, que está completa.
 *
 * Así no hay que acordarse de nada: el día que entre la última foto, los
 * retratos aparecen solos.
 */
export const HAY_RETRATOS = EQUIPO.length > 0 && EQUIPO.every((m) => m.foto !== null);

/**
 * EL EQUIPO TRABAJANDO — la tira de fotos de la página de Nosotros.
 *
 * ── POR QUÉ ESTO EXISTE Y NO SON YA LOS RETRATOS ─────────────────────────
 * Las fotos llegaron (2026-09-12) pero llegaron SIN NOMBRES: se ve quién está
 * en cada una, pero no se sabe cuál de las once personas de `EQUIPO` es. Y un
 * retrato con el nombre cambiado es peor que no poner retrato.
 *
 * Así que de momento van como tira, sin pie de foto y sin nombre. Enseñan lo
 * que hay que enseñar —el equipo en faena, que es lo que se decidió arriba—
 * sin afirmar quién es quién.
 *
 * ── QUÉ HACER CUANDO LLEGUEN LOS NOMBRES ─────────────────────────────────
 * Renombrar cada fichero con el slug de la persona, volver a pasar
 * `scripts/fotos-equipo.sh` y rellenar su `foto`. Cuando las once estén,
 * `HAY_RETRATOS` se pone solo a `true` y la rejilla pasa a enseñar caras con
 * nombre. Esta tira se puede quitar entonces, o dejarse: no estorba.
 *
 * El texto alternativo describe lo que se ve, no quién es. Es lo único que se
 * puede escribir con verdad ahora mismo.
 */
export type FotoTrabajando = { src: string; alt: { es: string; en: string } };

export const FOTOS_TRABAJANDO: FotoTrabajando[] = [
  {
    src: "/media/equipo/trabajando/camara-grada.jpg",
    alt: {
      es: "Operador con la cámara al hombro en la grada de un estadio",
      en: "Operator shouldering a camera in a stadium stand",
    },
  },
  {
    src: "/media/equipo/trabajando/emisora-retrato.jpg",
    alt: {
      es: "Piloto con la emisora del dron en las manos",
      en: "Pilot holding the drone controller",
    },
  },
  {
    src: "/media/equipo/trabajando/gafas-fpv.jpg",
    alt: {
      es: "Piloto con las gafas de FPV puestas junto al escenario",
      en: "Pilot wearing FPV goggles beside the stage",
    },
  },
  {
    src: "/media/equipo/trabajando/piloto-inspire.jpg",
    alt: {
      es: "Piloto con el dron de cine posado en la carretera al atardecer",
      en: "Pilot with the cinema drone on the road at sunset",
    },
  },
  {
    src: "/media/equipo/trabajando/emisora-humo.jpg",
    alt: {
      es: "Piloto de perfil entre el humo del escenario",
      en: "Pilot in profile through stage haze",
    },
  },
  {
    src: "/media/equipo/trabajando/equipo-tres.jpg",
    alt: {
      es: "Tres del equipo en el recinto, con la cámara y la emisora",
      en: "Three of the crew on site, with camera and controller",
    },
  },
  {
    src: "/media/equipo/trabajando/emisora-recinto.jpg",
    alt: {
      es: "Dos del equipo montando entre los contenedores del recinto",
      en: "Two of the crew setting up among the site containers",
    },
  },
];
