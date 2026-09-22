import { conBase } from "@/lib/base";

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
 * color, foto, sonido). **Los once cargos los confirmó Mario el 2026-09-22** y
 * ya no hay ninguno provisional.
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
 * ── 2026-09-15: CUATRO MÁS. VAN NUEVE DE ONCE ───────────────────────────
 * Iván, Jota, María y Natalia. Faltan **Galoguin y Rubén**.
 *
 * Tres de las cuatro necesitaron trabajo antes de entrar:
 *
 *   · **Iván** llegó sólo en el portapapeles, sin fichero. Se volcó a disco con
 *     `osascript` leyendo el portapapeles como PNG. Es una captura, así que es
 *     la de menor resolución de las nueve (552×628) y se nota si se amplía.
 *   · **María** era una captura de una story de Instagram, con la barra de
 *     estado del móvil arriba y la de «Send message» abajo. Se recortó a mano
 *     (`crop=900:1125:417:926`) para quitar el interfaz.
 *
 *     **ATENCIÓN AL CRÉDITO:** la story llevaba «@minifont» sobreimpreso, que
 *     es presumiblemente quien hizo la foto. Publicarla en una web comercial
 *     necesita su permiso, igual que hizo falta el de las marcas. PENDIENTE de
 *     confirmar con Mario.
 *   · **Natalia** venía en HEIC y `ffprobe` decía 512×512 — era mentira: el
 *     HEIC va en baldosas de 512 y `sips` da el tamaño real, 3024×4032. Si se
 *     hubiera hecho caso a `ffprobe` se habría descartado una foto buena por
 *     inservible. Ella sale pequeña en el encuadre original, así que se recortó
 *     a mano (`crop=1280:1600:1250:1464`).
 *
 * **Ya no queda ninguna de relleno** (2026-09-16). Galoguin y Rubén llevaban
 * los dos la foto de otra persona (`gafas-fpv.jpg`) con `fotoEsEjemplo: true`;
 * ahora tienen la suya —la de Galoguin, de espaldas, por decisión de Mario—.
 *
 * `HAY_EJEMPLOS` YA ESTÁ APAGADO: ni fotos ni cargos de ejemplo. Los cargos
 * los mandó Mario el 2026-09-22 en inglés, y en español van en LA FORMA DE
 * LOS CRÉDITOS —«Realización», «Montaje», «Fotografía»— porque él pidió que
 * cambiaran con el idioma.
 *
 * Esa forma, además, evita tener que decidir el género de cada persona:
 * «Realización» vale para cualquiera, «Realizador» o «Realizadora» obligan a
 * saberlo, y no es algo que se deba suponer por el nombre. Si algún día se
 * quiere en esa otra forma, hace falta que cada quien diga la suya.
 * «VJ» se queda igual en los dos: no tiene traducción al uso.
 *
 * El cargo de Rubén, además, cuadra por fin con su foto: sale pilotando.
 */
const MIEMBROS: Miembro[] = [
  { nombre: "Mario Bote", slug: "mario-bote", role: { es: "Piloto de drone / Realización", en: "Drone Pilot / Filmmaker" }, foto: "/media/equipo/mario-bote.jpg" },
  { nombre: "Fernando", slug: "fernando", role: { es: "Piloto de drone / Realización", en: "Drone Pilot / Filmmaker" }, foto: "/media/equipo/fernando.jpg" },
  // Foto real desde el 2026-09-16, y DE ESPALDAS: en la mesa de control de
  // ITRAMUN, con el casete de SIDEBFLMS en el chaquetón. Se avisó de que en una
  // rejilla de caras no se le reconoce, y Mario decidió ponerla igual: es él, y
  // es mejor que la foto de OTRA persona que llevaba hasta ahora con el rótulo
  // de «Ejemplo». Si llega una de frente, se cambia aquí.
  { nombre: "Galoguin", slug: "galoguin", role: { es: "VJ", en: "VJ" }, foto: "/media/equipo/galoguin.jpg" },
  { nombre: "Iván", slug: "ivan", role: { es: "Realización / Fotografía", en: "Filmmaker / Photo" }, foto: "/media/equipo/ivan.jpg" },
  { nombre: "Jota", slug: "jota", role: { es: "Realización / Montaje", en: "Filmmaker / Edit" }, foto: "/media/equipo/jota.jpg" },
  { nombre: "Kenny", slug: "kenny", role: { es: "Realización / Montaje", en: "Filmmaker / Edit" }, foto: "/media/equipo/kenny.jpg" },
  { nombre: "María", slug: "maria", role: { es: "Fotografía", en: "Photographer" }, foto: "/media/equipo/maria.jpg" },
  { nombre: "Nacho López", slug: "nacho-lopez", role: { es: "Piloto de drone / Realización", en: "Drone Pilot / Filmmaker" }, foto: "/media/equipo/nacho-lopez.jpg" },
  { nombre: "Natalia", slug: "natalia", role: { es: "Realización / Fotografía", en: "Filmmaker / Photo" }, foto: "/media/equipo/natalia.jpg" },
  // Retrato real desde el 2026-09-16: la foto con la emisora del dron, entre
  // el confeti, junto a la valla. Recortada A MANO a 4:5 y no con
  // `scripts/fotos-equipo.sh`, que recorta por el centro: en el original está
  // desplazado a la derecha entre la valla y el público, y el recorte centrado
  // le partía. OJO: en la foto está pilotando, y el cargo provisional dice
  // «Etalonaje». Los cargos siguen todos sin confirmar.
  { nombre: "Rubén", slug: "ruben", role: { es: "Piloto de drone / Realización", en: "Drone Pilot / Filmmaker" }, foto: "/media/equipo/ruben.jpg" },
  { nombre: "Sergio", slug: "sergio", role: { es: "Realización / Montaje", en: "Filmmaker / Edit" }, foto: "/media/equipo/sergio.jpg" },
];

/** Con la ruta base delante de cada foto (lib/base.ts). */
export const EQUIPO: Miembro[] = conBase(MIEMBROS);

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
export const FOTO_GRUPO: string | null = conBase("/media/equipo/grupo.jpg");

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
export const FOTO_AMPLIACION: string | null = conBase("/media/equipo/monegros.jpg");

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
 * contraseña. La página marca cada ficha afectada; el aviso de arriba de la
 * sección se quitó a petición del cliente (2026-09-17), así que el freno vive
 * sólo aquí.
 */
export const HAY_EJEMPLOS = EQUIPO.some(
  (m) => m.fotoEsEjemplo === true || m.roleEsEjemplo === true
);

/*
 * «EN FAENA» — RETIRADA el 2026-09-16.
 *
 * Aquí estaba `FOTOS_TRABAJANDO`, la lista de fotos del equipo trabajando que
 * se pintaba como una tira en Nosotros. Mario la quitó entera: «las de en
 * faena vamos a quitar todas». Se borra la lista porque ya no la usa nadie.
 *
 * Los FICHEROS siguen en `public/media/equipo/trabajando/` y no se tocan:
 * tres ilustran las etapas de Servicios (content/etapas-fotos.ts) y
 * `gafas-fpv.jpg` es la foto provisional de Galoguin.
 */
