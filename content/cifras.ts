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
 *   · HORAS DE VUELO no está en la exportación. Es la más potente de todas
 *     para una productora que se vende como especialista en drone, así que
 *     merece la pena pedirla: la sabe el piloto.
 *   · AÑOS RODANDO tampoco: con datos que empiezan el 1 de enero de 2026,
 *     saldría «0,7 años», que es falso y además ridículo.
 *
 * En su lugar van dos que sí se pueden contar y dicen algo: los rodajes con
 * drone (104 de 329, o sea que el drone no es un extra, es un tercio del
 * trabajo) y las ciudades.
 */
export type Cifra = {
  /** El número, ya formateado como se quiera leer: "329", "6". */
  valor: string | null;
  etiqueta: { es: string; en: string };
};

export const CIFRAS: Cifra[] = [
  {
    // 329 de 387 filas en estado «Completado».
    valor: "329",
    etiqueta: { es: "Proyectos", en: "Projects" },
  },
  {
    // Tipo «Drone» entre los completados. Un tercio del total.
    valor: "104",
    etiqueta: { es: "Rodajes con drone", en: "Drone shoots" },
  },
  {
    // Ubicaciones distintas, sin contar el propio estudio.
    valor: "26",
    etiqueta: { es: "Ciudades", en: "Cities" },
  },
  {
    // España, Italia, Francia, Líbano, Reino Unido y Costa Rica.
    // «SPAIN» y «ESPAÑA» aparecen las dos en el fichero: es el mismo país.
    valor: "6",
    etiqueta: { es: "Países", en: "Countries" },
  },
  {
    // PENDIENTE: la sabe el piloto, no está en la exportación.
    valor: null,
    etiqueta: { es: "Horas de vuelo", en: "Flight hours" },
  },
];

/** Las que tienen número. Si está vacío, la sección no se pinta. */
export const CIFRAS_CON_DATO = CIFRAS.filter((c) => c.valor !== null);
