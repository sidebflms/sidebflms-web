# sidebflms.com

Web de **SIDEBFLMS**, productora audiovisual de música electrónica: aftermovies,
multicámara en directo, drone y fotografía.

Next.js 16 (App Router), bilingüe español/inglés, autoalojada en un VPS propio.

> **Ahora mismo está publicada con contraseña.** Es intencionado: falta material
> y faltan permisos. Ver «Lo que falta antes de abrirla» al final.

---

## Empezar

```bash
npm ci
npm run dev
```

Y ya. No hace falta ningún `.env` para desarrollar: lo único que hay
configurable es el correo del formulario de contacto, que en local no va a
salir de todas formas y lo dice por consola.

**No ejecutes `npm run build` con `npm run dev` corriendo.** Corrompe `.next` y
el servidor de desarrollo empieza a dar 500 con «Cannot find module
'./vendor-chunks/...'». No es un fallo del código: se arregla con `rm -rf .next`
y volver a arrancar.

---

## Antes de tocar nada, lee esto

Este repositorio lleva mucho razonamiento escrito **dentro** de los ficheros,
no aquí. Los comentarios largos no son ruido: explican por qué algo está hecho
de una forma que parece rara y qué se rompe si lo cambias. Los que más importan:

| Fichero | Qué te va a ahorrar |
|---|---|
| `despliegue/README.md` | El montaje del servidor entero. **Léelo antes de tocar el VPS.** |
| `content/projects.ts` | Qué datos de las fichas están verificados y cuáles no. Importa: mezclarlos es cómo se publica una credencial falsa. |
| `components/layout/reglet.tsx` | La línea que cruza el sitio, que es el elemento firma. |
| `components/ui/placeholder-media.tsx` | Por qué la marca de «material pendiente» no se puede quitar con una prop. |
| `lib/correo.ts` | Por qué el remitente es nuestro y el visitante va en `Reply-To`. |
| `ACTUALIZACIONES.md` | Qué cambió, por qué, y qué hacer al traerte el repositorio. |

Y `AGENTS.md`, que avisa de lo primero de todo: **este Next.js no es el que
conoces**. La versión 16 cambió convenciones. La documentación está en
`node_modules/next/dist/docs/` — mírala antes de escribir código, no después.

---

## Cómo está montado

```
app/[locale]/          Las rutas. El idioma es un segmento: /es/..., /en/...
proxy.ts               Antes «middleware». Elige idioma y redirige. Nada más.
content/dictionaries/  TODO el texto del sitio, en los dos idiomas.
content/projects.ts    Las fichas de portfolio.
components/            Secciones, UI y las dos piezas de movimiento.
public/media/          Vídeo y fotografía reales (38 MB).
despliegue/            Lo que hace falta en el servidor.
```

**El castellano es la fuente de verdad.** `en.ts` se tipa contra `es.ts`, así
que si falta una cadena en inglés **el build falla** en vez de caer al
castellano en silencio. Es a propósito.

**La frontera de animación, que no se cruza:** GSAP + ScrollTrigger para todo
lo que dependa del scroll; Motion sólo para la transición de ruta en
`app/[locale]/template.tsx`. Ninguna toca lo de la otra. Si se mezclan, esto se
pudre en un mes.

---

## Desplegar

**Empujar a `main`.** Nada más. El workflow sube el código al VPS, compila
allí, reinicia y comprueba desde fuera que responde.

Para hacerlo a mano, o cuando algo va mal, todo está en
[`despliegue/README.md`](despliegue/README.md): los mandos, el vigilante que la
repone si se cae, cómo se pone y se quita la contraseña —y por qué después hay
que volver a desplegar, que no es evidente— y una tabla de síntomas.

---

## Dos cosas que parecen fallos y no lo son

**El hero se ve como una imagen fija.** Si tu equipo tiene «reducir movimiento»
activado, el vídeo no arranca solo: es exactamente lo que esa preferencia pide
evitar. Y como el póster ES el primer frame del vídeo, se ve congelado. El
botón «Reproducir el reel» lo arranca.

**El formulario de contacto no envía en local.** Entrega por SMTP contra el
servidor de correo de la propia máquina, que en tu portátil no existe. Lo dice
por consola. En el servidor sí sale.

---

## Lo que falta antes de abrirla al público

Revisado de verdad el 2026-09-24 (no de memoria: consultando la base de datos
de producción, `content/projects.ts` y los propios ficheros). Nada de esto es
código: es material y decisiones, y de las que sólo puede tomar Mario.

**Ya resuelto, aunque lo hayas visto anotado aquí antes:** los permisos de
marca de los clientes (concedidos el 2026-09-13, ver `content/clientes.ts`), la
licencia comercial de Akira Expanded (confirmada el 2026-09-12, ver
`app/globals.css`) y los once cargos y fotos del equipo (ya no hay ninguno de
relleno). Si vuelves a ver alguno de estos tres en una lista de bloqueantes en
otro sitio, esa lista está desactualizada, no esto.

**Lo que sigue de verdad pendiente:**

- **Los textos de «qué entregamos» de cada proyecto son provisionales**
  (`content/projects.ts`, desde el 2026-09-17): se escribieron sólo con lo que
  se puede medir del propio fichero —título, sitio, fecha, disciplina—, sin
  inventar el encargo real. Sólo quien hizo el trabajo puede escribir el texto
  de verdad.
- **Cinco fichas sin fecha**: `holika-portal`, `monegros-hora-dorada`,
  `duro-pyroshow`, `metropolitano`, `prospa-multicam` (éste último tiene un
  nombre de fichero, `31132026`, que sería el 31 del mes 13 — no existe).
- **El aviso legal no lleva CIF ni domicilio**, por decisión expresa de Mario
  (`content/dictionaries/es.ts`, sección `legal`). Eso deja el aviso
  incumpliendo el art. 10 de la LSSI-CE mientras la web sea pública.
- **La política de privacidad afirma algo que el código no hace**: dice que
  el sitio usa «cookies técnicas para recordar tu idioma», pero esa cookie no
  se llega a escribir en ningún sitio (`proxy.ts` sólo la LEE, nunca la
  guarda) — comprobado el 2026-09-24. O se implementa de verdad, o se quita
  la frase: tal como está, es una afirmación legal falsa.
- **Las tres redes del pie** (`components/layout/social-icons.tsx`) no se han
  verificado contra las cuentas reales desde que se escribieron.
- **El archivo da para más piezas** de las 23 que hay hoy, si se quiere seguir
  ampliando antes de abrir.

El día que esté todo, quitar la contraseña son dos órdenes, y están en
`despliegue/README.md`.
