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

Nada de esto es código: es material y decisiones.

- **Las piezas reales que faltan.** Hay nueve proyectos con material de verdad,
  pero el archivo da para más.
- **Los logos de clientes.** La franja lleva los nombres reales, pero **falta el
  permiso de uso de marca por escrito** de cada uno. Publicar el nombre de una
  marca en una web comercial es usar su marca, aunque sea en texto.
- **«Qué entregamos»** está sin confirmar en las nueve fichas. Es una afirmación
  sobre encargos reales y sólo la puede escribir quien hizo el trabajo.
- **Tres fechas sin confirmar**: dos ficheros no la llevan y el de Prospa se
  llama `31132026` — el 31 del mes 13, que no existe.
- **El aviso legal no lleva CIF ni domicilio**, por decisión expresa. Eso lo
  deja incumpliendo el art. 10 de la LSSI-CE. Los cuatro sitios donde habría que
  ponerlos están señalados en el código.
- **La fuente de los titulares.** Akira Expanded es la demo de Typologic,
  licencia «free for personal use only»: **no cubre uso comercial**. Está
  marcado en `app/globals.css`. Hace falta comprar la licencia web antes de que
  el sitio sea público.

El día que esté todo, quitar la contraseña son dos órdenes, y están en
`despliegue/README.md`.
