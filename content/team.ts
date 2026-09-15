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
 * PROVISIONALES DESDE EL 2026-09-13. Mario pidió ponerlos «igual que las
 * fotos, y ya te diré»: están repartidos a ojo entre los servicios que la
 * empresa ofrece de verdad (dirección, producción, cámara, dron, montaje,
 * color, foto, sonido), y **todos llevan `roleEsEjemplo: true`**.
 *
 * Marcados por lo mismo que las fotos: poner «cámara» a alguien que es
 * productor es de las cosas que un cliente detecta en la primera llamada. La
 * ficha los pinta apagados y con la marca mientras la bandera esté puesta, y
 * `HAY_EJEMPLOS` frena la apertura de la web igual que con las fotos.
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
  /** `null` mientras no haya ninguno. Si es provisional, ver `roleEsEjemplo`. */
  role: { es: string; en: string } | null;
  /** `true` = puesto a ojo para ver la página; falta que lo confirme Mario. */
  roleEsEjemplo?: boolean;
  /** Ruta en `public/media/equipo/`. `null` mientras no haya foto. */
  foto: string | null;
  /**
   * `true` = la foto NO es de esta persona, es un relleno para ver la rejilla.
   *
   * Existe para que una foto de otro NUNCA pueda salir publicada como si fuera
   * suya sin que se note: la ficha la pinta en gris y con la marca «ejemplo»
   * encima mientras esto esté a `true`.
   */
  fotoEsEjemplo?: boolean;
};

/**
 * ── DOS FOTOS SON DE VERDAD; LAS OTRAS NUEVE, DE RELLENO ─────────────────
 * Mario y Fernando ya tienen la suya. Se identificaron el 2026-09-12 con la
 * pista que dio Mario —«Mario es el rapado y Fernando es el que tiene pelo»—
 * cruzándola con la foto de los tres del recinto, donde salen los dos juntos:
 * el de la izquierda es el mismo que aparece en el retrato con la emisora, y el
 * del medio el mismo que lleva las gafas de FPV.
 *
 * A Fernando NO se le puso la de las gafas aunque sea la suya: le tapan la cara
 * y la condición escrita arriba es que se le vea. Su retrato está recortado de
 * la foto de los tres (`crop=660:825:1130:672` sobre el original de 2728×1830).
 *
 * ── 2026-09-15: TRES MÁS ─────────────────────────────────────────────────
 * Mario identificó cuatro por sus fotos: «colores rojo es kenny, la de foto
 * colorida es sergio, la de la naturaleza es jota y la del fondo blanco es
 * nacho». Tres de las cuatro estaban guardadas y ya están puestas.
 *
 * **La de Jota no se ha podido poner**: es la única de las cuatro que no se
 * guardó en el disco, así que hay que volver a pasarla.
 *
 * Ojo con la de Kenny: está de espaldas, con la cara fuera de cuadro, así que
 * incumple la condición escrita arriba. Se pone porque es la que eligió Mario
 * para él, pero si algún día se revisa la página de equipo, ésa es la que
 * canta.
 *
 * Las otras nueve siguen siendo fotos de OTRAS personas puestas de relleno para
 * poder ver la rejilla, y llevan `fotoEsEjemplo: true`. En cuanto se sepa quién
 * es quién, se quita esa marca y la foto pasa a color y sin aviso.
 */
export const EQUIPO: Miembro[] = [
  { nombre: "Mario Bote", slug: "mario-bote", role: { es: "Dirección", en: "Direction" }, roleEsEjemplo: true, foto: "/media/equipo/mario-bote.jpg" },
  { nombre: "Fernando", slug: "fernando", role: { es: "Producción", en: "Production" }, roleEsEjemplo: true, foto: "/media/equipo/fernando.jpg" },
  { nombre: "Galoguin", slug: "galoguin", role: { es: "Piloto de drone", en: "Drone pilot" }, roleEsEjemplo: true, foto: "/media/equipo/trabajando/gafas-fpv.jpg", fotoEsEjemplo: true },
  { nombre: "Iván", slug: "ivan", role: { es: "Piloto de drone", en: "Drone pilot" }, roleEsEjemplo: true, foto: "/media/equipo/trabajando/piloto-inspire.jpg", fotoEsEjemplo: true },
  { nombre: "Jota", slug: "jota", role: { es: "Cámara", en: "Camera" }, roleEsEjemplo: true, foto: "/media/equipo/trabajando/emisora-humo.jpg", fotoEsEjemplo: true },
  { nombre: "Kenny", slug: "kenny", role: { es: "Cámara", en: "Camera" }, roleEsEjemplo: true, foto: "/media/equipo/kenny.jpg" },
  { nombre: "María", slug: "maria", role: { es: "Producción", en: "Production" }, roleEsEjemplo: true, foto: "/media/equipo/trabajando/equipo-tres.jpg", fotoEsEjemplo: true },
  { nombre: "Nacho López", slug: "nacho-lopez", role: { es: "Montaje", en: "Editing" }, roleEsEjemplo: true, foto: "/media/equipo/nacho-lopez.jpg" },
  { nombre: "Natalia", slug: "natalia", role: { es: "Fotografía", en: "Stills" }, roleEsEjemplo: true, foto: "/media/equipo/trabajando/camara-grada.jpg", fotoEsEjemplo: true },
  { nombre: "Rubén", slug: "ruben", role: { es: "Etalonaje", en: "Colour" }, roleEsEjemplo: true, foto: "/media/equipo/trabajando/gafas-fpv.jpg", fotoEsEjemplo: true },
  { nombre: "Sergio", slug: "sergio", role: { es: "Sonido", en: "Sound" }, roleEsEjemplo: true, foto: "/media/equipo/sergio.jpg" },
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
 * ¿Queda alguna foto de relleno?
 *
 * **Esto es un freno, no un adorno.** Mientras sea `true` hay caras publicadas
 * bajo un nombre que no es el suyo, y eso no puede salir de detrás de la
 * contraseña. La página lo avisa arriba y marca cada ficha afectada.
 */
export const HAY_EJEMPLOS = EQUIPO.some(
  (m) => m.fotoEsEjemplo === true || m.roleEsEjemplo === true
);

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
