/**
 * LAS CIFRAS DE LA EMPRESA — la ficha de «Nosotros».
 *
 * ── DE DÓNDE SALEN, EXACTAMENTE ──────────────────────────────────────────
 * De la exportación de proyectos del Studio Manager que pasó Mario el
 * 2026-09-14 (`sidebflms-proyectos-2026-09-14.csv`, 387 filas). No son
 * estimaciones ni números redondeados a ojo: están contados del fichero y se
 * pueden volver a contar.
 *
 * Se cuentan **sólo los proyectos en estado «Completado»** (329 de 387). Los
 * 54 «Próximo» son trabajos que aún no se han hecho —hay fechas hasta mayo de
 * 2027— y meterlos sería contar como hecho lo que está firmado.
 *
 * ── EL MATIZ QUE CAMBIA CÓMO SE ENUNCIAN ────────────────────────────────
 * **La exportación empieza el 1 de enero de 2026.** No hay ni un proyecto
 * anterior, así que esto NO es el histórico de la empresa: es lo que va de
 * 2026, probablemente porque el Studio Manager se empezó a usar entonces.
 *
 * Por eso el rótulo dice «En lo que va de 2026» y no «En números» a secas. Si
 * pusiera sólo «329 proyectos», cualquiera entendería que es todo lo que se ha
 * hecho nunca — y eso, además de no ser cierto, se queda CORTO. La cifra real
 * del histórico es mayor; lo que pasa es que no está en este fichero.
 *
 * Cuando exista el histórico completo, se cambian los números y el rótulo.
 *
 * ── POR QUÉ ESTAS CUATRO Y NO LAS QUE SE PIDIERON ───────────────────────
 * Mario pidió «eventos cubiertos, países, horas de vuelo, años rodando». Dos
 * salen del fichero y dos no:
 *
 *   · AÑOS RODANDO: **Mario dijo el 2026-09-14 que no se ponga.** (Para que
 *     conste: SIDEBFLMS empezó en marzo de 2022, o sea que el histórico real
 *     de la empresa es mucho mayor que lo que hay en la exportación.)
 *   · HORAS DE VUELO no está en la exportación, así que va ESTIMADA. Ver
 *     abajo, en su propia entrada, cómo se calcula y por qué se redondea a la
 *     baja.
 *
 * Además van dos que sí se pueden contar y dicen algo: los rodajes con drone
 * (104 de 329, o sea que el drone no es un extra, es un tercio del trabajo) y
 * las ciudades.
 */
/**
 * DOS TIPOS DE CIFRA, Y NO SE PUEDEN MEZCLAR.
 *
 * Cuatro de estas cinco están CONTADAS de la exportación del Studio Manager,
 * que empieza el 1 de enero de 2026: son lo que va de año. La quinta —las
 * horas de vuelo— no está en ninguna exportación: es una ESTIMACIÓN y además
 * acumulada, porque incluye horas de práctica y de simulador.
 *
 * Se pintaban las cinco juntas bajo el rótulo «En lo que va de 2026». Eso
 * presenta una estimación acumulada como un resultado del año, que es
 * exactamente lo que no se puede hacer con una cifra que un cliente puede
 * pedir por escrito. Ahora cada una lleva su periodo y la página las separa.
 */
export type Periodo = "2026" | "acumulado";

export type Cifra = {
  /** «2026» = contado de la exportación. «acumulado» = no es de este año. */
  periodo: Periodo;
  /** `true` si el número no está contado sino calculado. Se dice a la vista. */
  estimada?: boolean;
  /** El número, ya formateado como se quiera leer: "329", "6". */
  valor: string | null;
  etiqueta: { es: string; en: string };
};

export const CIFRAS: Cifra[] = [
  {
    // 329 de 387 filas en estado «Completado».
    periodo: "2026",
    valor: "329",
    etiqueta: { es: "Proyectos", en: "Projects" },
  },
  {
    // Tipo «Drone» entre los completados. Un tercio del total.
    periodo: "2026",
    valor: "104",
    etiqueta: { es: "Rodajes con drone", en: "Drone shoots" },
  },
  {
    // Ubicaciones distintas, sin contar el propio estudio.
    periodo: "2026",
    valor: "26",
    etiqueta: { es: "Ciudades", en: "Cities" },
  },
  {
    // España, Italia, Francia, Líbano, Reino Unido y Costa Rica.
    // «SPAIN» y «ESPAÑA» aparecen las dos en el fichero: es el mismo país.
    periodo: "2026",
    valor: "6",
    etiqueta: { es: "Países", en: "Countries" },
  },
  {
    /**
     * LA ÚNICA ESTIMADA DE LAS CINCO. Conviene saberlo antes de defenderla.
     *
     * No sale de un registro de vuelos: sale de la regla que dio Mario y de un
     * ajuste suyo posterior, los dos del 2026-09-14.
     *
     * Primero dio: unas 5 h de vuelo por cada trabajo de drone, más 5 h
     * semanales de práctica por piloto, y son 4 pilotos. Con eso salían 1.246 h
     * en lo que va de 2026:
     *
     *   rodajes          104 × 5 h ..........................   520 h
     *   práctica campo   4 pilotos × 5 h/sem × 36,3 sem ......   726 h
     *
     * Luego dijo que **también cuenta el simulador**, y que la cifra son 2.000.
     * La diferencia cuadra con su propia regla:
     *
     *   simulador        4 pilotos × ~5 h/sem × 36,3 sem .....   754 h
     *                                                          ────────
     *                                                           2.026 h
     *
     * (36,3 semanas = del 1 de enero al 12 de septiembre de 2026.)
     *
     * SE PUBLICA «+2.000», redondeando HACIA ABAJO. Si alguien la discute, que
     * la realidad esté por encima y no por debajo. Y un número redondo con un
     * «+» dice lo que es —un orden de magnitud— en vez de aparentar una
     * precisión que una estimación no tiene.
     *
     * ── UNA COSA QUE CONVIENE SABER SI UN CLIENTE PREGUNTA ──────────────
     * En aviación tripulada, las horas de simulador se anotan APARTE de las de
     * vuelo: no son lo mismo y un piloto no las suma. Aquí van sumadas porque
     * Mario lo pidió así, y en trabajo con drone el criterio no está reglado
     * como allí. Pero si algún día una productora o una aseguradora pide el
     * desglose, hay que poder darlo — por eso está escrito arriba.
     *
     * Si se prefiere cerrar la discusión antes de que empiece, basta con
     * cambiar la etiqueta a «Horas de vuelo y simulador». La cifra no cambia.
     *
     * Si algún día hay registro de verdad, se sustituye. Y si cambia el número
     * de pilotos o el periodo, hay que rehacer la cuenta: está aquí entera para
     * que se pueda.
     */
    periodo: "acumulado",
    estimada: true,
    valor: "+2.000",
    etiqueta: { es: "Horas de vuelo", en: "Flight hours" },
  },
];

/** Las que tienen número. Si está vacío, la sección no se pinta. */
export const CIFRAS_CON_DATO = CIFRAS.filter((c) => c.valor !== null);

/** Contadas de la exportación del Studio Manager: lo que va de 2026. */
export const CIFRAS_2026 = CIFRAS_CON_DATO.filter((c) => c.periodo === "2026");

/** No son de este año. Se pintan aparte y con su aviso. */
export const CIFRAS_ACUMULADAS = CIFRAS_CON_DATO.filter((c) => c.periodo === "acumulado");
