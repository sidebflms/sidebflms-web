# Actualizaciones

Qué cambió, por qué, y qué hay que hacer al traerse el repositorio. Lo más
reciente arriba.

---

## 2026-09-15 (58) — El sonido: qué se puede hacer y qué hace falta para hacerlo

Mario: «vuelve a codificar todo, pero el reel de portada que no lleve sonido, no
pasa nada». Antes de tocar nada hubo que comprobar de dónde sale cada pieza, y
la comprobación cambió el plan.

### De qué máster sale cada pieza (averiguado, no supuesto)

Nueve fichas de `content/projects.ts` tienen anotada su `FUENTE:` en el disco
de producción. Las otras doce no, así que **se identificaron comparando
fotogramas**: se saca el primer fotograma de la pieza publicada y se busca el
que encaja en cada máster candidato, aplicando antes el mismo recorte a 16:9
que hizo el script (sin ese recorte no encaja ninguno, que es lo que pasó en el
primer intento). Las doce dieron una coincidencia de diferencia casi cero.

### El hallazgo: los másters que hay en este Mac son mudos

Los doce másters que están en `~/Desktop/PARA-LA-WEB/` **no tienen pista de
audio**: son postales de dron, planos de recinto y el anuncio de MITT, grabados
sin sonido o exportados sin él. De los 41 ficheros de esa carpeta sólo nueve
llevan audio, y ninguno de esos nueve es una pieza del portfolio: son clips del
equipo trabajando.

O sea que **recodificar lo que hay en este ordenador no produciría un solo
segundo de sonido**. Lo que sí tendría música son los aftermovies y los
multicámara —Fátima Hajji, Adrián Mills, Fabrik 150, GORDO, Prospa— y sus
másters viven en el disco de producción, que no está conectado.

### `scripts/audio-a-las-piezas.sh`

Queda listo para lanzarlo en cuanto se conecte el disco:

```
./scripts/audio-a-las-piezas.sh
```

**No recodifica el vídeo, le añade el audio.** Copia el vídeo publicado tal
cual (`-c:v copy`) y le mete la pista del máster. Dos motivos:

1. **No se pierde calidad.** Recomprimir lo ya comprimido siempre resta.
2. **No cambia lo que se ve.** Volver a pasar el máster por `pieza-web.sh` no
   reproduce el mismo corte: el script arranca al 20 % de la duración, pero
   varias piezas se cortaron a mano antes de que el script existiera —la de
   DURO sale del segundo 171 de un máster de 4:22—. Recodificar movería el
   corte de esas piezas.

**Encuentra solo el segundo del máster del que sacar el audio**, con la misma
comparación de fotogramas: primero de segundo en segundo, luego afinando de 40
en 40 ms. Si no encuentra un encaje claro avisa y deja la pieza muda: antes eso
que un audio desplazado.

**Probado de punta a punta** el 2026-09-15 con material local, montando un
máster de mentira con audio: encontró el punto (segundo 3, diferencia 0,31),
añadió el AAC de 12 s y **el MD5 del flujo de vídeo salió idéntico al
original** — la imagen no se toca. El fichero pasó de 2,42 a 2,62 MB.

### El reel de la portada se queda mudo

Por decisión de Mario, y además arranca solo, así que iría `muted` de todas
formas.

### Lo que falta

Conectar `@SIDEB404L` y lanzar el script. Son ocho piezas × dos recortes.

---

## 2026-09-15 (57) — Las cintas ya no dejan hueco, y por qué no suena ningún vídeo

### El hueco de la fila de multicámara

Mario: «en multicam sale un hueco, tiene que salir siempre la línea entera de
contenido y que se repita tipo bucle».

**La causa.** El bucle funciona pintando la lista dos veces y desplazando el
50 %. Eso sólo se ve continuo si **una copia es más ancha que la pantalla**. Si
no lo es, llega un momento en que la segunda copia ya ha entrado entera y
detrás no hay nada: hueco a la derecha. Multicámara tiene tres piezas —unos
1.230 px— y él lo miraba en una pantalla de 2.000.

**La solución.** Cada copia lleva la lista repetida las veces que hagan falta
para cubrir la fila. Se calcula midiendo una pieza de verdad, no suponiendo su
ancho: cambia con el tamaño de pantalla (`h-40` / `lg:h-56`) y suponerlo sería
volver a tener el fallo en el siguiente ajuste de maqueta.

La duración se multiplica por las repeticiones, porque la distancia también:
sin eso, repetir la lista haría la fila el doble o el triple de rápida. Las
tres siguen moviéndose a la misma velocidad aparente.

**`ResizeObserver`, no el evento `resize`**: avisa de cualquier cambio de ancho
de la fila —zoom, barra de desplazamiento, cambio de maqueta— y no sólo de que
se redimensione la ventana. Con `resize` había casos en los que no llegaba a
recalcularse (comprobado a 2560 px).

Medido: a 1440 px las copias miden 4923 / 2461 / 2461 y a 2560 pasan a 4923 /
4923 / 3692, cubriendo la fila en los dos casos.

La fila pasa a ser su propio componente (`Fila`), porque necesita estado y
medir, y eso no se puede hacer dentro de un `map`.

### Por qué no suena ningún vídeo

**No es la web: los ficheros no tienen sonido.** Los 44 vídeos de
`public/media/` y también el reel están codificados **sin pista de audio**. Lo
hacía `scripts/pieza-web.sh`, que llevaba un `-an`.

Tenía su lógica —son bucles de fondo, y un vídeo que arranca solo tiene que ir
mudo o el navegador ni lo reproduce—, pero el efecto colateral fue que en toda
la web no hay un solo vídeo con sonido, **ni siquiera el reproductor con
controles de la ficha de cada trabajo**, que es donde el visitante sí puede
subir el volumen.

**Lo que se ha hecho ahora:** el script conserva el audio en AAC a 128 kb/s
(`-map 0:a:0?`, con el `?` para que no falle si un máster viene mudo). Cuesta
unos 16 kB por segundo de pieza, nada al lado del vídeo. Los bucles de fondo
siguen mudos igual, porque eso lo decide el `muted` del HTML, no el fichero.

**Lo que falta, y no se puede hacer sin Mario:**

1. **Volver a codificar las piezas desde los másters.** El disco de producción
   no está conectado ahora mismo (`/Volumes/@SIDEB404L` no aparece). Son 22
   piezas × 2 recortes.
2. **Decidir qué pasa con el reel de la portada.** Aunque se recodifique con
   audio, seguirá sonando a nada: arranca solo, así que va `muted` a la fuerza,
   y el botón de «Activar sonido» se quitó esta mañana. Si se quiere que el
   visitante pueda oírlo, hay que devolver ese control.

---

## 2026-09-15 (56) — En la barra, a la izquierda, sólo el casete

Ajuste de lo anterior. Al llevarse el menú el centro, el logotipo completo se
había pegado al casete para no perderlo. Mario: «en la izquierda deja sólo el
casete, el otro no hace falta que le pongas».

Así que con el menú puesto —o sea, en todas las páginas y en la portada en
cuanto se baja del hero— la barra queda: **casete** a la izquierda, **menú**
centrado, **redes e idioma** a la derecha. El logotipo completo sólo aparece,
centrado, en la primera pantalla de la portada.

No se pierde nada: el casete es el mismo logotipo de marca y sigue siendo el
enlace a la portada.

Comprobado a 1024 px: un solo elemento a la izquierda (72-108), menú de 309 a
700 con su centro clavado en el de la ventana, y el logotipo centrado
apareciendo y desapareciendo al subir y bajar en la portada.

---

## 2026-09-15 (55) — Un solo menú: centrado en la barra, igual en todas las páginas

Mario: «sí, pero que esté centrado y en las otras páginas igual, que salga en
el mismo sitio». Con eso se cierra el baile de sitios de hoy.

### Se borra `side-nav.tsx`

La columna del lado derecho que llevaban las páginas interiores desaparece. El
menú está ahora **en el centro de la barra de arriba, en todas las páginas**.

La única excepción es la primera pantalla de la portada: allí el menú vive
dentro del hero, debajo del titular, y en la barra no se pinta hasta que se
baja de esa pantalla. Si se pintara, estarían los dos a la vez.

Centrado respecto a la **ventana** (posición absoluta), no entre los bloques
laterales: el de la izquierda y el de la derecha miden distinto, así que
centrarlo «entre ellos» lo dejaría descentrado en pantalla. Medido: el centro
del menú cae en 504,5 y el de la ventana también.

### El logotipo se va a la izquierda cuando el menú ocupa el centro

No caben los dos: el menú mide 367 px. Así que el wordmark se pega al casete,
a la izquierda, y sólo se queda centrado en la primera pantalla de la portada,
que es cuando el centro está libre.

A 1024 px: izquierda de 72 a 245, menú de 309 a 700, derecha de 800 a 961.
Sin solapes.

### El `<nav>` principal, uno y sólo uno

En las páginas interiores el menú de la barra es el único del documento, así
que es el `<nav aria-label="Principal">`. En la portada no puede serlo: el del
hero sigue existiendo aunque esté fuera de pantalla, y dos navegaciones
principales le dicen a un lector de pantalla que hay dos menús distintos. Allí
se pinta como lista de enlaces: se usa igual con ratón y teclado, y la
navegación por regiones sigue encontrando un solo menú principal. Lo decide
`esElUnicoMenu` en `header.tsx`.

### Nota de verificación

En el navegador de pruebas, un `scrollTo()` por consola **no dispara el evento
`scroll`** (se comprobó: cero eventos recibidos), así que el menú parecía no
aparecer. Con un `dispatchEvent(new Event('scroll'))` —o, claro, scrolleando
de verdad— funciona. Es cosa del entorno de pruebas, no de la web; queda
apuntado para no volver a perseguirlo.

---

## 2026-09-15 (54) — Al bajar de la primera pantalla, el menú sube a la barra

Mario: «una vez bajes de la primera página, que salga arriba en esa barra el
menú». En la portada el menú vive dentro del hero, así que al dejar atrás el
hero no quedaba menú a la vista hasta el pie.

### Cuándo aparece

Al pasar el **80 % del alto de la ventana**, no el 100 %: así está puesto
cuando el titular acaba de salir de cuadro, en vez de llegar tarde. Lo calcula
el mismo oyente de scroll que ya decidía cuándo opacar la barra —es el mismo
evento y se dispara muchísimo, no tiene sentido tener dos.

Sólo en la portada. En el resto de páginas manda la columna del lado derecho,
que está siempre; si esto apareciera allí, habría dos menús a la vez.

### El logotipo del centro se retira mientras el menú está puesto

No caben: a 1024 px el menú ocupa de 409 a 776 y el logotipo centrado iba de
430 a 580. Se pisaban de lleno. No se pierde marca —el casete de la izquierda
es el mismo logotipo y lleva a la portada— y, con el centro libre, caben
además los tres iconos de redes. Al volver arriba, el logotipo vuelve.

Comprobado a 1024 px: bajando, menú de 409 a 776, sin logotipo central y sin
solaparse con el casete ni con las redes; subiendo, el logotipo vuelve a su
sitio y el menú desaparece.

### Por qué esa lista NO es un `<nav>`

Porque el menú del hero sigue existiendo en el documento aunque esté fuera de
pantalla. Dos `<nav aria-label="Principal">` a la vez le dicen a un lector de
pantalla que hay dos menús principales distintos, y eso es mentira. Siendo una
lista de enlaces dentro de la cabecera se usa igual —con ratón y con
teclado— y la navegación por regiones sigue encontrando un único menú
principal.

---

## 2026-09-15 (53) — El menú ocupa el sitio de las disciplinas, que se van a Servicios

Mario, señalando la línea de debajo del titular: «donde pone drone, live
production, es donde tienes que poner el menú, y con las barras también; y esa
parte de live production y demás se va a la página de services». Y: «en la hora
tienes que poner TC delante, simulando el timecode».

### El menú **sustituye** a la línea de disciplinas, no se suma

Sube de `mt-8` a `mt-6` —el hueco que tenía la línea que había ahí— y estrena
las mismas barras entre entradas. Sigue en blanco, no en el gris de aquella
línea: esto se pulsa, y el gris es el color de lo que sólo se lee.

Las barras son decoración y van marcadas como tal, así que un lector de
pantalla no oye «work barra services»: anuncia la lista de enlaces y ya.

### Las disciplinas se mudan a Servicios

`DRONE | LIVE PRODUCTION | CABLECAM | MULTICAM | PHOTO` pasa de `hero.sub` a
`services.disciplinas`, y se pinta bajo la entradilla de la página, alineada
con el titular. Encaja mejor ahí: en la portada era una etiqueta suelta, y
aquí resume de un vistazo lo que desarrollan las tarjetas de más abajo.

Se mantiene la regla de las barras a partir de `sm`: por debajo la línea parte
en dos y, como la barra va pegada al elemento que la sigue, la segunda línea
arrancaría con una barra suelta.

**En la portada, por debajo de 1024 px no queda nada bajo el titular**: el menú
del hero sólo se pinta desde `lg` (por debajo manda el botón de menú de la
cabecera) y la línea de disciplinas ya no está. El hero se queda con el
titular y la hora, que es lo que se pidió.

### La hora lleva «TC» delante

Como el monitor de una sala: `TC 17:13:07:18`. La etiqueta va más apagada que
los números —es la etiqueta, no el dato— y se pinta siempre, también en el
instante en que la hora aún no está, para que la línea no aparezca de golpe.

---

## 2026-09-15 (52) — El menú de la portada baja al hero, y el timecode es la hora

Dos peticiones de Mario sobre la primera pantalla: «pon ahí el menú y que
cuando pases por encima se ilumine en naranja» —señalando la línea de
servicios, debajo del titular— y «el timecode de la izquierda ponlo en medio y
que sea la hora».

### El menú, dentro del hero (sólo en la portada)

Debajo de la línea de servicios, centrado, en blanco y con el naranja de marca
(`rust-300`) al pasar por encima y en la página en la que estás.

**En las demás páginas no hay hero**, así que allí sigue mandando la columna
del lado derecho (`side-nav.tsx`). Quien decide cuál se pinta es la cabecera,
comparando la ruta con la portada; **nunca se pintan los dos a la vez**, que si
no habría dos `<nav aria-label="Principal">` compitiendo y un lector de
pantalla anunciaría dos menús principales.

Sí, el menú cambia de sitio entre la portada y el resto. Es a propósito: en la
portada el hero ocupa la pantalla entera y el menú forma parte de esa
composición; en una página con contenido, una fila centrada en mitad del texto
no tendría dónde vivir.

Las dos listas salen ahora de **`components/layout/enlaces-menu.ts`**. Estaban
duplicadas —la cabecera por un lado, el hero por otro— y con eso, añadir una
página quinta significaba acordarse de tocar dos ficheros. Olvidarse de uno no
rompe nada: simplemente falta una entrada en media web, que es la clase de
fallo que no se ve hasta tarde.

Al volver a construir rutas, **el hero necesita `locale` otra vez** (se lo
había quitado la entrada 49). `app/[locale]/page.tsx` se lo pasa.

### El timecode pasa a ser la hora, y se centra

Ya no cuenta el tiempo del vídeo: es la hora local del visitante, escrita como
timecode de montaje `HH:MM:SS:FF` a 25 fps, que es lo que en una sala se llama
*time of day*. Reaprovecha `timecode()` de `lib/utils.ts` pasándole los
segundos transcurridos del día.

Tres detalles que parecen menores y no lo son:

- **Arranca vacío y se rellena al montar.** La página se genera en el
  servidor; si el servidor pintara una hora, al llegar al navegador ya sería
  otra y React avisaría de que no coincide con lo que esperaba.
- **Se refresca cada 40 ms**, que es un fotograma a 25 fps. Menos, y el
  contador de fotogramas daría saltos; más, y se repintaría sin que cambie.
- **`min-h-4` en la línea.** Como el texto llega un instante después del
  primer pintado, sin esa altura reservada el hero daba un salto de 16 px.

Y no va dentro de `.shell`: sus márgenes izquierdo y derecho son distintos a
propósito —es la asimetría de la maqueta—, así que centrar ahí dentro dejaba
la hora 11 px a la derecha del centro real. Medido.

Con esto el hero deja de seguir la reproducción del vídeo: se van `hasVideo`,
`elapsed` y el bucle que hacía correr el timecode cuando no había metraje.

---

## 2026-09-15 (51) — El menú, en columna a la derecha; el hero, con línea de servicios

Corrección de lo anterior y un cambio de texto. Mario, al ver la cápsula
horizontal en la esquina: «no, pero me refería en vertical, a la derecha de
capture the energy». Y después: «el texto de *Drone, live production, cablecam
and multicam. Based in Spain.* mejor que ponga, en más pequeño o gris, en una
sola línea DRONE | LIVE PRODUCTION | CABLECAM | MULTICAM | PHOTO».

### `bottom-nav.tsx` pasa a ser `side-nav.tsx`

Ya no es una cápsula en el borde inferior sino una columna pegada al lado
derecho y centrada en vertical. «A la altura de capture the energy» es,
literalmente, el centro de la ventana: es donde el hero centra su titular. Con
`top`/`bottom` a cero y `items-center` queda ahí sea cual sea la pantalla.

Los rótulos **no** van girados: «en vertical» es la disposición, no el texto
tumbado. Texto a 90° ya hay en la página —la regleta de la izquierda— y es
decorativo a propósito; un menú hay que poder leerlo de un vistazo.

**Aparece a partir de 1024 px, no de 768.** Medido: a 768 la columna se metía
por encima de la frase de apoyo del hero (acababa en 633, la columna empezaba
en 605) y del titular de la página de Trabajo. Al subir ese corte hay que
subir el del botón de menú de la cabecera —de `md:hidden` a `lg:hidden`—, o
entre 768 y 1023 px no habría menú ninguno. Están acoplados: **si se toca uno,
se toca el otro**.

A 1440 px la columna queda a 154 px del titular y su centro coincide al píxel
con el de la ventana.

### Se deshacen dos parches que existían por la cápsula

- El timecode del hero vuelve a `bottom-8` en todos los tamaños (tenía un
  `md:bottom-24` para no quedar debajo de la cápsula).
- El pie pierde el `md:pb-20` que reservaba hueco para que la cápsula no
  tapara la línea del copyright.

Los dos sobraban en cuanto el menú dejó el borde inferior.

### La frase del hero pasa a ser una línea de servicios

`DRONE | LIVE PRODUCTION | CABLECAM | MULTICAM | PHOTO`, a 12 px y en gris
(`smoke`), para que no le dispute el sitio al titular: es una etiqueta de qué
hacemos, no una frase que leer. Va en inglés igual en ES y EN, como el
titular: son nombres de oficio.

En el diccionario es una **lista**, no un texto con barras dentro. El
separador lo pone el componente, y eso resuelve dos cosas:

- El lector de pantalla no oye «drone barra live production»: las barras van
  marcadas como decoración y la lista se anuncia como lista.
- **Las barras sólo se pintan a partir de `sm`.** Por debajo la línea parte en
  dos y, como la barra va pegada al elemento que la sigue, la segunda línea
  arrancaba con una barra suelta: «| CABLECAM | MULTICAM | PHOTO». Comprobado
  a 375 px. Sin barras, las dos líneas se leen igual y no queda nada colgando.

Comprobado a 375 px (dos líneas, sin desbordar), 640 (una línea con barras) y
1440 (una línea, 530 px de ancho).

**Se pierde «Con base en España»**, que era lo único que lo decía en el hero.
Sigue estando en el pie y en la página de Nosotros.

---

## 2026-09-15 (50) — Las marcas en cinta, el FAQ a Contacto, y el hero desnudo

Cuatro peticiones de Mario: «un slider con las marcas también, lo del FAQ en
contact» y, un rato después, «también tenemos que quitar lo de pause the reel,
unmute y scroll to see the work; y lo de work services about lo ponemos a la
derecha».

### Las marcas, en cinta

`components/sections/brand-strip.tsx` deja de ser una rejilla. Los nueve
nombres a seis columnas dejaban una segunda fila con tres y seis huecos; en
cinta no hay filas que cuadrar, da igual que sean nueve que veinte, y además
se lee como lo que es —una lista que sigue— en vez de como un cuadro cerrado.

Reutiliza el mecanismo de las cintas de la portada (`.cinta` / `.cinta-pista`
en `app/globals.css`), así que no hay CSS nuevo.

### Dos fallos del mecanismo de cinta, que venían de antes

**Uno: `prefers-reduced-motion` no se estaba respetando.** La hoja de estilos
tiene un `@media (prefers-reduced-motion: reduce) { .cinta-pista { animation:
none } }`, pero el componente ponía la animación en `style={{ animationName }}`
—en línea—, y un estilo en línea gana a cualquier hoja de estilos. O sea que
la regla estaba escrita y no llegaba a aplicarse nunca: con «reducir
movimiento» activado, las cintas de la portada se seguían deslizando.

Ahora el componente sólo pasa dos variables (`--cinta-sentido`,
`--cinta-duracion`) y la declaración vive en el CSS, donde la cascada sí
funciona. Comprobado.

**Dos: el bucle pegaba un salto en cada vuelta.** La lista se pinta dos veces
y se desplaza el 50 %, pero con las dos copias sueltas dentro de la misma fila
el ancho total es `2 × piezas + (2n − 1) huecos`: falta medio hueco por copia.
En la portada eran 6 px de salto cada vuelta; en las marcas habrían sido 32.

Cada copia pasa a ir en su propio grupo con un `padding-right` igual al hueco,
así que cada grupo mide exactamente la mitad de la pista. Medido en el
navegador: grupo 4922,6 px contra mitad de pista 4922,5.

### El FAQ se muda a Contacto

`app/[locale]/faq/` era una página huérfana: no la enlazaba nadie, ni el menú
ni el pie. Las preguntas que contiene —qué zonas cubrimos, cuánto tardamos,
qué hace falta para volar— son exactamente las que alguien se hace justo antes
de escribir, así que ahora van al final de `/contact`, debajo del formulario.

Se ha sacado a `components/sections/faq.tsx` para que la página de contacto no
crezca, y el JSON-LD de tipo `FAQPage` se va con ella: su `@id` apunta ya a
`/contact`, que es donde vive el contenido. Si se quedara apuntando a una URL
que devuelve 404, Google lo descarta.

Fuera también de `lib/routes.ts` y de `STATIC_KEYS` en `app/sitemap.ts`.

**Al traerse el repo:** `/es/faq` y `/en/faq` ahora devuelven 404. No había
enlaces internos, pero si alguien había guardado la URL, se la encuentra rota.

### El hero se queda sólo con el timecode

Fuera «Pausar el reel», «Activar sonido» y «Desplázate para ver el trabajo».
Con ellos se van del componente el estado `playing`/`muted` y los dos
manejadores, y de los diccionarios siete claves que ya no usa nadie (las cinco
de los controles más `ctaReel` y `ctaContact`, huérfanas desde que se quitaron
los botones).

**Dos consecuencias que conviene tener presentes:**

1. **El reel queda mudo y en bucle, sin forma de pararlo.** Lo de oírlo es una
   decisión de contenido. Lo de pausarlo roza el criterio 2.2.2 de la WCAG:
   todo lo que se mueve solo más de cinco segundos debería poder pararse. Lo
   que salva la situación es que con «reducir movimiento» activado el vídeo no
   arranca siquiera, que es el caso por el que existe ese criterio. Si algún
   día vuelve el control, vuelve a esa misma esquina.
2. El timecode se queda: es lo que hace que la esquina se lea como una línea
   de tiempo y no como un vídeo de fondo cualquiera.

### El menú, a la derecha

La cápsula pasa de `justify-center` a `justify-end` con el mismo margen
derecho que usa `.shell`, así que cae a plomo con los iconos de redes de la
cabecera. Y deja libre el centro de la pantalla, que es por donde cae el
titular del hero.

---

## 2026-09-15 (49) — El menú baja al pie de la ventana y el hero se queda solo

Tres peticiones de Mario que encajan entre sí: «watch the reel y tell us lo
quitamos; las pestañas de work, contact y demás las ponemos en la parte de abajo
en medio centradas; y lo de capture the energy ahora ponlo más pequeño y en todo
el medio».

### Fuera los dos botones del hero

Y no dejan nada sin camino: el reel se sigue viendo —es el fondo de la propia
sección— y para contactar está el menú. El hero se queda con el titular y la
frase de apoyo, nada más.

Al quitarlos, `locale` dejó de usarse en el componente: eran lo único que
construía rutas. Se quita también, junto con los imports que quedaban muertos.

### El titular, centrado de las dos maneras

En horizontal con `text-center`, y en vertical porque la sección pasa de
`justify-end` a `justify-center`. Sólo lo primero lo habría dejado centrado de
lado a lado pero pegado abajo, que es la mitad del encargo.

Y más pequeño: `text-display-xl` baja de `3.9vw / 5rem` a `3.2vw / 4rem`. **Es
la segunda bajada del día** —venía de `4.6vw / 6rem`— así que a 1440 px ha
pasado de ~66 px a **46**. Esa clase sólo la usa el hero, así que tocarla no
afecta a nada más.

### El menú, abajo y centrado

Sale de la cabecera y pasa a una cápsula fija en el borde inferior, centrada.
Fija y no al final del documento: es el menú, tiene que estar siempre a mano.

Lleva fondo y desenfoque porque flota sobre vídeo; sin eso los rótulos
desaparecen cada vez que pasa por debajo un plano claro. En móvil no se pinta:
ahí ya está el botón de menú de la cabecera, y dos menús para lo mismo —uno de
ellos tapando contenido en una pantalla pequeña— es peor que uno.

### Lo que esto desbloqueó

**El logotipo ya se centra en cualquier ancho.** Hasta hoy sólo a partir de
1536 px, porque a 1280 el menú arrancaba justo en el centro y se solapaban. Al
vaciarse la derecha de la cabecera —quedan tres iconos y el idioma, unos 150
px— la excepción se retira.

### Dos solapes que hubo que arreglar, y salieron de mirar

La cápsula flota a 24 px del borde, así que se puso encima de dos cosas:

1. **Los controles del reel** (pausar / sonido / desplázate), que estaban a
   `bottom-8`. Suben a `bottom-24` desde `md`, que es donde aparece la cápsula.
2. **La línea de copyright del pie**, que quedaba justo debajo. El pie gana
   `md:pb-20`.

Los dos comprobados midiendo las cajas antes y después: de solaparse a no
solaparse.

---

## 2026-09-15 (48) — El pie, más corto y reordenado

«Esta parte de abajo es muy grande, baja el tamaño de "Side B of every night" y
lo de la derecha reordénalo.»

### El lema

De `4.4vw` a `3vw`: a 1440 px pasa de ~63 px a **43**. Con el tamaño anterior el
lema ocupaba tres líneas enormes y el pie se comía una pantalla entera para
decir cuatro enlaces. Se recorta además el aire: el hueco entre el lema y las
columnas baja de 16 a 10, y el que separa la línea de copyright de 24 a 14.

**El pie entero queda en 408 px de alto.**

### El orden de las columnas

Pasa de **Síguenos · Menú · Legal** a **Menú · Síguenos · Legal**.

No es un capricho de simetría: quien baja al pie suele venir buscando una página
del sitio, no el Instagram. Y lo legal se queda el último porque es lo que menos
se busca y lo que la ley sólo exige que esté.

---

## 2026-09-15 (47) — Cabecera nueva, titular más pequeño y tres cintas en la portada

### La cabecera: casete a la izquierda, logotipo al centro, redes a la derecha

El logotipo **deja de ser texto**. Hasta ahora era «SIDE» + una B en `rust-500`
+ «FLMS» compuesto con la tipografía del sitio: se parecía, pero no era el
logotipo. El de verdad tiene su propio dibujo de letra, su bajada y el naranja
en las letras con la B en blanco —al revés que la imitación—. Ahora es
`public/logo/wordmark.png`, sacado de `PNG-15.png` del manual de marca.

(Mario pasó el logotipo por el chat, pero los adjuntos no llegan como fichero.
Se identificó cuál era de las nueve del manual por una pista: la suya se leía
«SIDE FLMS» con un hueco sobre fondo blanco, o sea que la B es BLANCA y
desaparecía contra el fondo. Sólo `PNG-15` cumple eso.)

Y tres iconos de redes arriba a la derecha, en SVG en línea para que hereden
`currentColor` y cambien de color con el `hover` sin duplicar ficheros. La lista
de URLs se movió a `components/layout/social-icons.tsx`: estaba dentro del pie,
y con las redes también en la cabecera habría dos listas que mantener.

**El logotipo se centra sólo a partir de 1536 px, y esto no es una rebaja
gratuita.** Se midió: a 1280 el menú arranca en el píxel 641 —o sea, justo en el
centro—, así que cualquier cosa centrada se le monta encima; a 1024, igual.
Encoger el logotipo no lo arregla: el problema es que a la derecha hay cuatro
enlaces, tres iconos y el idioma, y eso ocupa media pantalla. Por debajo de
1536, el logotipo vuelve al lado del casete. Comprobado a 1280 (sin solape) y a
1600 (centrado, sin solape).

### «Capture the energy», más pequeño

`text-display-xl` baja de `4.6vw / 6rem` a `3.9vw / 5rem`. A 1440 px pasa de
~66 px a 56. Sigue sin partirse en dos líneas en ningún ancho —que era la razón
del 4.6vw— y deja respirar al vídeo, que antes quedaba tapado de lado a lado.

### Tres cintas en la portada, una por disciplina

El mosaico de doce piezas se sustituye por **tres cintas que se deslizan
solas**: drone arriba (hacia la derecha), aftermovies en medio (hacia la
izquierda) y multicámara abajo (hacia la derecha). Sólo en la portada; la página
de Trabajo mantiene su mosaico quieto.

**El bucle**: cada fila pinta su lista dos veces y se desplaza exactamente el
50 % de su ancho. Al acabar, la segunda copia está donde empezó la primera, así
que el reinicio no se ve. Cualquier otro valor da un tirón. La copia lleva
`aria-hidden`: para un lector de pantalla los trabajos están una vez, no dos.

**La velocidad depende del número de piezas**, no es un tiempo fijo. Con uno
fijo, la fila de multicámara —tres piezas— iría disparada y la de drone —doce—
parecería parada, porque recorren distancias muy distintas. Sale: drone 84 s,
aftermovie 42 s, multicámara 21 s, o sea la misma velocidad aparente en las tres.

**Sin `shell`**: una cinta que empieza y acaba en el margen no se lee como una
cinta sino como una fila cortada; tiene que salirse por los dos lados.

**Reproducción.** Mario pidió que se reproduzcan todas a la vez y así es: todas
arrancan. Lo que hace el `IntersectionObserver` es pausar las que están fuera de
la ventana, incluida la copia duplicada —que es la mitad del total—. El efecto a
la vista es el pedido; lo que se evita es tener 43 vídeos decodificando a la vez
en un portátil. Medido: de 43 en el DOM, 10 activos con la sección a la vista.

**«Reducir movimiento» SÍ se respeta aquí**: las cintas no se deslizan solas,
pero la fila sigue siendo desplazable a mano, así que no se pierde contenido.
Consecuencia práctica: **en un Mac con esa preferencia activada la sección se ve
quieta.** No está rota.

Al pasar el ratón, la cinta se para: si no, habría que perseguir un título para
poder leerlo o pincharlo.

### Código que se va

`homeProjects()` en `content/projects.ts`. Ordenaba las piezas por rondas de
categoría para la portada, y la portada ya no la usa: ahora cada cinta filtra su
categoría. Se borra en vez de dejarla, porque su comentario decía «la selección
de la portada» y eso ya no es verdad.

---

## 2026-09-15 (46) — La portada se aprieta: marcas a Trabajo, dos bloques a la mitad

### La tira de marcas se va a Trabajo

«Han contado con nosotros» sale de la portada y entra en la página de Trabajo,
debajo del mosaico.

Tiene su lógica además de ser lo que se pidió: es una **credencial**, y una
credencial se enseña justo después del trabajo que la respalda, no antes de que
el visitante haya visto nada.

### El manifiesto y la llamada de contacto, a la mitad

Mario: «la de llegamos antes es demasiado grande, ocupa mucha pantalla y es muy
vacía, y pasa lo mismo con cuéntanos qué evento tienes».

Los dos tenían el mismo defecto: titular a `text-display-l`, mucho aire vertical
y el texto en una columna estrecha, así que ocupaban una pantalla entera para
decir cuatro frases y sobraba la mitad derecha.

- **Manifiesto**: pasa a dos columnas —titular a la izquierda, las cuatro
  frases a la derecha— y baja a `display-m` con `py-20`. De ~900 px de alto a
  **359**.
- **Contacto**: el reparto en dos columnas ya estaba bien; lo que sobraba era el
  tamaño. `display-m` y `py-16`. De ~900 a **297**.

La portada entera queda en 3.111 px. Antes de empezar a recortar, con el
showpiece y los seis bloques editoriales, pasaba de 7.000.

### El pie: @sidebflms

Donde ponía «Con base en España» ahora va el usuario, **enlazado a Instagram**:
un arroba que no se puede pinchar obliga a ir a buscarlo a mano. La URL sale de
la misma lista que los enlaces sociales de arriba, así que no hay dos sitios
donde cambiarla.

La decisión de 2026-09-10 sobre las ciudades —Madrid, Barcelona e Ibiza sólo en
el FAQ— **sigue en pie** para el resto del sitio; queda anotado en el
diccionario para que no se malinterprete este cambio.

---

## 2026-09-15 (45) — Cuatro retratos más: van nueve de once

Iván, Jota, María y Natalia. Faltan **Galoguin y Rubén**, y con ellos cae el
freno para abrir la web.

### Tres de las cuatro no entraron sin pelea

**Iván llegó sólo en el portapapeles**, sin fichero. Los adjuntos del chat no
aterrizan en el disco —se buscó en el directorio de la sesión y en las cachés, y
no hay nada—, pero el portapapeles del Mac sí se alcanza: se volcó a PNG con
`osascript` leyendo `«class PNGf»`.

Es una captura, así que es la de **menor resolución de las nueve** (552×628).
Entra, pero se nota si se amplía.

**María era una captura de una story de Instagram**, con la barra de estado del
móvil arriba y la de «Send message» abajo. Recortada a mano para quitar el
interfaz (`crop=900:1125:417:926`).

**ATENCIÓN AL CRÉDITO:** la story llevaba **«@minifont»** sobreimpreso, que es
presumiblemente quien hizo la foto. Publicarla en una web comercial necesita su
permiso, igual que hizo falta el de las marcas. Queda anotado en
`content/team.ts` y **pendiente de confirmar**.

**Natalia venía en HEIC y `ffprobe` decía 512×512.** Era mentira: los HEIC del
iPhone van en baldosas de 512, y `ffprobe` enseña las baldosas. `sips` da el
tamaño real: **3024×4032**.

Merece la pena retener esto, porque por poco se descarta una foto buena como
inservible: **para saber el tamaño de un HEIC hay que preguntarle a `sips`, no a
`ffprobe`.** Ella sale pequeña en el encuadre original, así que también se
recortó a mano (`crop=1280:1600:1250:1464`).

### Estado

Nueve de once con su cara, sin marca. Quedan Galoguin y Rubén, los dos con la
misma foto de relleno. Los cargos siguen todos sin confirmar (llevan asterisco),
así que `HAY_EJEMPLOS` sigue en `true` y el aviso sigue arriba de la sección.

---

## 2026-09-15 (44) — La portada: doce piezas, más pequeñas y en otro orden

Mario: «¿podrían ser más vídeos y más pequeños? Si quieren verlos en grande
pueden ir a la pestaña work. Y si puedes, en la principal ponlos en otro orden,
para que no sea igual que la de work».

### Doce en vez de siete, a cuatro por fila

El mosaico acepta ahora `porFila` (3 o 4) y `conDestacada`. La página de Trabajo
se queda como estaba —tres por fila, encabezando con la destacada— y la portada
usa la variante de cuatro **sin cabecera**: arranca directamente en rejilla.

Medido: doce piezas en tres filas de cuatro, con anchos de 438 y 197 px
alternando. Antes la pieza que encabezaba medía 963.

### El orden, y por qué no es aleatorio

Se ordena **por rondas de categoría**: una pieza de cada categoría, luego otra
de cada una, y así. Dos piezas seguidas casi nunca son del mismo tipo, y en las
primeras cuatro ya se ve aftermovie, multicámara, drone y fotografía. Eso es lo
que una portada tiene que decir —la variedad de lo que se hace— mientras que la
página de Trabajo mantiene el orden curado.

Comprobado que salen distintas:

    Trabajo:  holika · fátima · monegros · duro · metropolitano · gordo
    Portada:  fátima · gordo · holika · fitz · mitt motors · adrián mills

**Nada de barajar al azar**, y no por pereza: un orden aleatorio cambiaría en
cada carga, no coincidiría entre el servidor y el navegador —React avisaría del
desajuste— y haría imposible saber qué está viendo alguien cuando comente algo
de la portada.

### El motivo de fondo

Si las dos páginas enseñan lo mismo en el mismo orden, la portada no invita a
entrar en Trabajo: ya la has visto. Ahora la portada dice «esto es la variedad
de lo que hacemos» y Trabajo dice «míralo en grande».

---

## 2026-09-15 (43) — El giro de la regleta se quita entero

Mario, sobre la portada: «sigue saliendo la línea esa del drone».

### Por qué esto no era el mismo fallo de antes

En la entrada (41) se arregló el giro en las páginas interiores, donde era un
fallo claro: no hay hero, así que la línea cruzaba el contenido en diagonal
durante toda la página.

**En la portada no había fallo**: allí el giro hacía exactamente lo que estaba
diseñado —empezar horizontal sobre el hero, como aguja del reel, y bascular
hasta anclarse—. Lo que pasa es que el resultado tampoco gustaba.

Y cuando algo funciona como se diseñó y aun así molesta, el diseño es lo que
está mal. Así que el giro se va entero, no sólo donde fallaba.

### Lo que queda

Un solo estado: **anclada en vertical** en el margen izquierdo, siempre, en
todas las páginas. Sigue siendo indicador de progreso, navegación por secciones
y rótulo de contexto — es decir, sigue sirviendo para algo, que es lo que
justifica que exista.

Y sigue moviéndose el flujo naranja que la recorre: lento, continuo y **dentro**
de la propia línea, sin cruzarse por encima de nada. Es lo único del sitio que
no se detiene.

Comprobado en la portada a 0, 150, 400, 700, 1500 y 3000 px de scroll: vertical
en todos.

### Detalle de implementación

`state.dock` se queda fijo en 1 en vez de simplificar `endpoints()` a un único
juego de coordenadas. Es deliberado: así devolver el giro es cambiar una línea,
si algún día se quiere recuperar para la portada. El `data-hero` que se añadió
en (41) se retira, porque ya no lo lee nadie.

---

## 2026-09-15 (42) — La portada enseña los trabajos, sin rodeos

Mario, señalando la sección fijada del showpiece: «esto quítamelo, prefiero que
salgan directamente los trabajos en la página principal».

### Lo que había

Dos cosas, una detrás de otra:

1. El **`Showpiece`**: una sección que se quedaba fija mientras se scrolleaba y
   contaba UNA pieza plano a plano, con fichas de texto encima del vídeo
   («Despegue · 00:00 — Sobre el público, con los lanzallamas encendidos»).
2. Seis **`EditorialBlock`**, uno por cada destacado restante, a pantalla por
   proyecto.

Entre las dos, **había que bajar siete pantallas para ver siete trabajos**. Esa
es la razón de fondo de la queja, aunque no se dijera así.

### Lo que hay

El mismo mosaico que la página de Trabajo, con los siete destacados. Salen todos
a la vez en tres filas (2 + 3 + 2), cada uno arranca al pasar el ratón, y debajo
sigue el botón de ver todo el trabajo.

La página baja de altura de forma notable, y la portada pasa de contar una
historia a enseñar el catálogo, que es lo que se pidió.

### Los dos componentes no se han borrado

`showpiece.tsx` y `editorial-block.tsx` siguen en `components/sections/`, sin
usar. Se dejan por si se quieren recuperar: el `Showpiece` en particular es una
pieza de trabajo considerable —scroll fijado, fichas sincronizadas con el
vídeo— y rehacerla desde cero no sería rápido.

Si se decide que no vuelven, se borran y se llevan por delante también
`dict.featured.headline` y `dict.featured.viewProject`, que se quedan sin uso.

---

## 2026-09-15 (41) — La regleta en diagonal: un fallo de verdad, y tres retratos

### El fallo

Mario: «la barra del drone hace una animación rara, se queda como de lateral».
Tenía razón, y no era cosa de su Mac.

La regleta está pensada para el hero: empieza horizontal cruzando la parte baja
del vídeo —hace de scrubber del reel— y al scrollear bascula hasta quedar
vertical en el margen izquierdo. Eso está bien **en la portada**.

**Pero el giro se ejecutaba en todas las páginas**, y en las demás no hay hero.
Así que la línea empezaba cruzada en horizontal por encima del contenido y
tardaba en enderezarse el 70 % de una pantalla.

Lo que lo convierte en un fallo grave es la aritmética: el giro necesita
**630 px** de scroll y la página de contacto tiene **767 px en total**. O sea
que te recorres la página entera mirando una línea en diagonal cruzada sobre el
formulario. Medido, no supuesto:

    scroll   0 → horizontal  (y1=812, y2=812)
    scroll 300 → DIAGONAL    (y1=471, y2=831)
    scroll 600 → DIAGONAL    (y1=130, y2=850)
    scroll 760 → vertical     ← justo al final del scroll

### El arreglo

El hero se marca con `data-hero`, y la regleta mira si existe. Si no hay hero,
**arranca ya anclada** y no se crea el disparador del giro. Es lo mismo que ya
se hacía con «reducir movimiento».

**Una trampa al hacerlo:** el flujo naranja continuo —lo único que se mueve sin
parar en el sitio— estaba dentro del MISMO `if` que el giro. Sacarlo era
obligatorio: si no, al dejar de girar en las páginas interiores se habrían
quedado también sin flujo, y el arreglo habría roto otra cosa sin que nadie lo
notara hasta semanas después.

Comprobado con las dos condiciones:
- `/es/contact` (sin hero): vertical en 0, 200, 400, 700 y 760 px. Y el flujo
  animándose (`stroke-dashoffset` pasa de −225 a −27 en segundo y medio).
- `/es` (con hero): horizontal en 0, girando en 300, vertical en 700 y 2000.

Para lo segundo hizo falta despertar el panel del navegador: con el panel oculto
`requestAnimationFrame` va a 0 fps y ScrollTrigger no puede actualizar, así que
la portada parecía rota cuando no lo estaba.

### Tres retratos más

Mario identificó cuatro por sus fotos: «colores rojo es kenny, la de foto
colorida es sergio, la de la naturaleza es jota y la del fondo blanco es nacho».

**Kenny, Sergio y Nacho ya están puestos** con su cara y sin la marca de
ejemplo. Van cinco de once.

**La de Jota no**: es la única de las cuatro que no se guardó en el disco, así
que hay que volver a pasarla.

Y un apunte sobre la de Kenny: está de espaldas, con la cara fuera de cuadro,
así que incumple la condición escrita en `content/team.ts` de que se le vea la
cara. Se pone porque es la que eligió Mario, pero es la que canta si algún día
se revisa la página.

---

## 2026-09-14 (40) — Las cifras, contadas de la exportación del Studio Manager

Mario pasó `sidebflms-proyectos-2026-09-14.csv`, la exportación de proyectos del
Studio Manager: 387 filas. La sección de «Nosotros» ya tiene números, y no son
estimaciones — están contados del fichero y se pueden volver a contar.

| Cifra | De dónde sale |
|---|---|
| **329** proyectos | filas en estado «Completado» (de 387) |
| **104** rodajes con drone | tipo «Drone» entre los completados |
| **26** ciudades | ubicaciones distintas, sin contar el propio estudio |
| **6** países | España, Italia, Francia, Líbano, Reino Unido y Costa Rica |

### Sólo lo completado

329 de 387. Los 54 «Próximo» son trabajos que aún no se han hecho —hay fechas
hasta mayo de 2027— y contarlos sería dar por hecho lo que está firmado.

### El matiz que cambia cómo se enuncian

**La exportación empieza el 1 de enero de 2026** y no hay ni un proyecto
anterior: esto no es el histórico de la empresa, es lo que va de 2026. Por eso
el rótulo dice **«En lo que va de 2026»** y no «En números».

Sin esa fecha, «329 proyectos» se lee como todo lo que se ha hecho nunca — y
además de no ser cierto, **se queda corto**: la cifra real del histórico es
mayor, sólo que no está en este fichero.

### Dos de las cuatro que se pidieron no se podían sacar

- **Horas de vuelo** no está en la exportación. Sigue pedida, y es la más
  potente de todas para quien se vende como especialista en drone.
- **Años rodando** tampoco: con datos que arrancan el 1 de enero de 2026 saldría
  «0,7 años», que es falso y además ridículo.

En su lugar van dos que sí se pueden contar y dicen algo. Sobre todo la de
drone: **104 de 329 es un tercio del trabajo**, o sea que el drone no es un
extra de la cobertura, que es exactamente lo que la web afirma en la portada.

### Después: las horas de vuelo, estimadas

Mario dio la regla el 2026-09-14: unas **5 h de vuelo por cada trabajo de
drone**, más **5 h semanales de práctica por piloto**, y son **4 pilotos**.
Aplicada al mismo periodo que el resto:

    rodajes   104 × 5 h ................................   520 h
    práctica  4 pilotos × 5 h/sem × 36,3 semanas ........   726 h
                                                          ────────
                                                           1.246 h

Después Mario añadió que **también cuenta el simulador**, y que la cifra son
2.000. La diferencia cuadra con su propia regla: 754 h más son unas 5 h de
simulador por piloto y semana, el mismo ritmo que la práctica en campo.

    simulador  4 pilotos × ~5 h/sem × 36,3 sem ........   754 h
                                                        ────────
                                                         2.026 h

**Se publica «+2.000»**, redondeando HACIA ABAJO a propósito: si alguien la
discute, que la realidad esté por encima y no por debajo. Y un número redondo
con un «+» dice lo que es —un orden de magnitud— en vez de aparentar la
precisión que una estimación no tiene.

**Un apunte que queda escrito en `content/cifras.ts` por si un cliente
pregunta:** en aviación tripulada las horas de simulador se anotan APARTE de
las de vuelo, no se suman. Aquí van sumadas porque así se pidió, y en trabajo
con drone ese criterio no está reglado igual. Si algún día una productora o una
aseguradora pide el desglose, hay que poder darlo — por eso la cuenta está
entera en el fichero. Y si se prefiere cerrar la discusión antes de empezarla,
basta con cambiar la etiqueta a «Horas de vuelo y simulador»: la cifra no
cambia.

**Es la única estimada de las cinco**, y está escrito en `content/cifras.ts`
con la cuenta entera, para que se pueda rehacer si cambia el número de pilotos
o el periodo. Las otras cuatro salen de contar filas.

### «Años rodando» se descarta por decisión de Mario

Dijo que no se ponga. Queda anotado, porque importa para lo de arriba:
**SIDEBFLMS empezó en marzo de 2022**, así que el histórico real de la empresa
es mucho mayor que lo que hay en la exportación, y confirma que el rótulo «En
lo que va de 2026» es lo correcto.

### Y la fila, centrada

Al pasar de cuatro cifras a cinco volvía a quedar una suelta con cuatro
columnas. Mismo arreglo que en la rejilla del equipo: `flex-wrap` con
`justify-center`, así que sobren las que sobren la última fila queda centrada.

El número baja de `text-display-l` a `-m`: con `-l`, «1.200+» no cabía en una
columna de cinco y el «+» se caía él solo a la línea de abajo.

### Lo que NO se ha publicado del fichero

Presupuestos, facturación, quién trabajó en cada proyecto y los nombres de los
77 clientes. Están en la exportación y no pintan nada en una web pública.

---

## 2026-09-14 (39) — La lista de Mario: marcas, servicios, formularios y fotos

Siete apuntes de Mario. Seis hechos, uno aplazado por él mismo y dos que se
quedan a la espera de un dato que sólo él tiene.

### Marcas: tres más, y fuera el cartel de «pendiente de permiso»

Añadidas **NICO MORENO, RICHIE HAWTIN y BRESH**. Y como los permisos están
concedidos desde el 2026-09-13, desaparece el rótulo «Logos pendientes de
permiso de uso» que había debajo de la tira.

Queda anotado en el componente algo que conviene no perder: los seis primeros
nombres salen del propio archivo —cada uno aparece en el nombre de un fichero o
en un rótulo del metraje— y **estos tres no**. Se publican porque Mario lo pide
y responde de ellos, pero no se pueden respaldar enseñando el trabajo.

«Richie Hawtin» va con la grafía correcta del artista, no con la de la nota.

**Faltan más:** la lista venía con un «etc.».

### Servicios: VJ y Podcast

Dos servicios nuevos en «Qué hacemos». El ejemplo de Podimo que Mario mencionó
**no se ha puesto**: dijo «que tendremos», o sea que todavía no existe, y una
web no puede enseñar un trabajo que no se ha hecho.

### Fotos en «Cómo lo hacemos»

Una por etapa, que era el motivo: «se hace más visible y no tanto texto».

Tres de las cuatro tienen foto, y **no son fotos de relleno**: en cada una se
está haciendo lo que dice la etiqueta. La cuarta, Postproducción, está a `null`
porque **no hay ninguna foto del equipo montando o etalonando**; poner ahí un
plano de festival sería ilustrar con lo que haya. Mientras falte, esa etapa se
pinta como siempre, sin hueco ni marco vacío.

Hubo que reequilibrar las columnas: con la foto dentro, el texto se quedaba en
tres y «PREPRODUCCIÓN» se partía a media palabra. El número baja a una columna
—de sobra para dos cifras— y el texto sube a cinco. Comprobado: los cuatro
títulos en una sola línea.

### Contacto: la fecha y el «otros»

«Fecha» pasa a **«Fecha prevista del evento»**. Mario tenía razón en que no se
entendía: parecía la fecha de envío de la consulta.

Y se añade **«Otros»** a los tipos de cobertura. Ojo al detalle: las casillas
salen de `CATEGORIES`, que es la lista con la que se clasifican los trabajos
publicados, y meter «otros» ahí crearía un filtro «Otros» en la página de
Trabajo que no clasificaría nada. Así que la casilla se añade sólo en el
formulario. Hace falta porque lo que se pregunta es otra cosa: una boda o un
podcast no encajan en ninguna de las cinco.

### Página nueva: «Trabaja con nosotros»

En `/work-with-us`, con los trece campos que pidió Mario y su propia Server
Action y su propio correo.

**Sólo cuatro campos son obligatorios**: nombre, correo, especialidad y el
consentimiento. Trece preguntas obligatorias no son un formulario, son un
interrogatorio, y la gente abandona a la quinta. Cada campo lleva a la vista si
es obligatorio u opcional.

El carnet va con botones de radio y no con una casilla: con una casilla sin
marcar no se sabe si es un «no» o si no la ha visto.

El enlace va **en el pie y no en el menú de arriba**: el menú es para quien
viene a contratar, que es a quien la web tiene que atender primero.

El asunto del correo **no lleva el nombre** de quien escribe, al revés que el de
las consultas. Una lista de asuntos en el buzón con nombres y apellidos de gente
buscando trabajo es otra cosa que una lista de nombres de eventos.

### Y por tanto, la política de privacidad

Esto no es opcional: el formulario nuevo recoge **edad, nacionalidad, localidad
y teléfono**, que es dato personal de otra categoría que el de una consulta. Se
añade un apartado nuevo, «Qué datos se recogen», y se actualizan la finalidad y
los plazos de conservación (las candidaturas, 12 meses).

**Si se añade o se quita un campo del formulario, hay que volver a tocarla.**
Queda escrito en `lib/correo.ts`.

### Lo que NO se ha hecho, y por qué

**El showreel al entrar.** El propio Mario lo marcó como «plan a futuro».

**Las cifras de «Nosotros»** (eventos cubiertos, países). La sección está hecha
en `content/cifras.ts` pero con todos los valores a `null`, así que **no se
pinta**. No se pueden deducir de nada: el portfolio tiene 23 piezas, pero son
los trabajos publicados, no los hechos, y contarlos y llamarlo «23 eventos
cubiertos» es el tipo de cifra que un cliente comprueba en la primera reunión.
Una cifra en una web es una afirmación y sólo la sabe quien hizo el trabajo.

---

## 2026-09-13 (38) — Nosotros: la foto de grupo arriba y los retratos más pequeños

Mario pasó de referencia la página de equipo de Ventour y pidió dos cosas:
retratos más pequeños con más aire y más por fila, y la foto de grupo arriba, a
la derecha del titular, «para completar ese hueco».

### La foto de grupo sube a la cabecera

Estaba a todo lo ancho encima de la rejilla de nombres. Ahora va en la cabecera,
en media columna al lado del titular. Dos motivos:

- El titular de esta página es corto y dejaba **medio ancho vacío** a la derecha.
- Y la foto responde a la pregunta —«quién está detrás de esto»— **antes** que la
  lista de nombres, que es el orden en que se lee.

En móvil no hay dos columnas: la foto pasa debajo. A 375 px, partir la cabecera
deja las dos mitades ilegibles.

**Y hubo que regenerar la foto.** Estaba recortada a 21:9, que es lo que pedía
ir a todo lo ancho; en media columna eso queda como un sello. Ahora es 3:2, que
además recorta menos: el original es 3578×2433, o sea casi 3:2 ya. El cambio
está hecho en `scripts/fotos-equipo.sh`, no a mano, para que se pueda repetir.

### Cinco por fila en vez de cuatro

Con once personas, a cuatro por fila salían tres filas y la última con tres
huecos. A cinco salen 5+5+1 y el retrato baja de 306 px de alto a 245 de ancho:
el equipo se lee de un vistazo en vez de ocupar media pantalla.

Más aire vertical que horizontal, y fuera la línea de separación que llevaba
cada ficha: a cinco por fila, once líneas horizontales cortas convertían el
bloque en una reja.

### Y después: las filas, centradas

A cinco por fila quedaba 5 + 5 + **1**, y esa última suelta pegada a la
izquierda es lo que Mario dijo que quedaba mal.

**Once no se reparte en partes iguales**: once es primo, así que cualquier
número de columnas deja la última fila coja. Lo que se puede arreglar no es el
reparto, es **dónde queda el hueco**.

Se cambia la rejilla por `flex-wrap` con `justify-center`: la fila incompleta se
centra y el bloque se lee simétrico. A seis por fila sale **6 + 5**, o sea falta
un solo sitio, y centrado parece decidido en vez de un descuadre.

El ancho de cada ficha va fijado con `basis` restando la parte de hueco que le
toca. Sin eso, `flex` estiraría las de la última fila para rellenarla y saldrían
cinco retratos gigantes debajo de seis pequeños.

Comprobado: 6 y 5, ficha de 201 px, la segunda fila empieza en x=182 contra los
72 de la primera —o sea centrada— y sin desbordamiento horizontal.

### El aviso de «cargo por confirmar», reducido a un asterisco

Esto salió de mirarlo, no de pensarlo: a cinco por fila la columna mide 245 px y
«Dirección · CARGO POR CONFIRMAR» partía en dos líneas y se comía la ficha.

Ahora la ficha lleva sólo un `*` en naranja, y el aviso completo va **una vez**,
arriba de la sección: «Provisional: las fotos marcadas no son de esa persona y
los cargos con * están sin confirmar». Misma información, una sola vez, y las
fichas vuelven a medir 14 px de alto en esa línea.

El texto largo sigue estando en el `title` del elemento, para quien pase el ratón.

---

## 2026-09-13 (37) — El portfolio, de 14 a 23 piezas

«Usa todas las piezas», dijo Mario. Se han usado, pero **agrupando por asunto**:
de las ocho postales de Madrid rodadas la misma tarde salen dos fichas, no ocho.
Ocho puestas de sol casi idénticas como ocho trabajos distintos empeorarían el
portfolio en vez de llenarlo.

### Las nueve nuevas

| Pieza | Categoría | Fecha |
|---|---|---|
| DURO — el recinto de noche | drone | 14 sep 2025 |
| Cabina y público | aftermovie | 19 oct 2025 |
| Sala llena | aftermovie | 29 oct 2025 |
| El recinto lleno, desde el aire | drone | 9 nov 2025 |
| Sala en rojo | aftermovie | 2 ene 2026 |
| En cabina | multicámara | 18 ene 2026 |
| Madrid — las Cuatro Torres | drone | 17 may 2026 |
| El pueblo sobre el mar | drone | 21 may 2026 |
| Monegros — el recinto | drone | 8 sep 2026 |

Reparto por categoría: drone 12, aftermovie 6, multicámara 3, fotografía 2,
publicidad 1. En pantalla: **ocho filas**, 2 + 3×7.

### Los nombres que SÍ se ponen y los que no

`DURO` y `Monegros` se nombran porque **las letras del escenario se leen en el
propio metraje** —que es la fuente que la cabecera de este fichero admite— y
`Madrid` porque las Cuatro Torres son inconfundibles. Las seis restantes van con
`venue: "Por confirmar"`: se ve una sala llena, no se ve en qué sala. Poner un
nombre a ojo en la ficha de un cliente es exactamente lo que este fichero no
hace.

Las fechas, en cambio, son todas fiables: salen del `creation_time` del máster.

### El tope de duración del script

`scripts/pieza-web.sh` ahora corta a **12 segundos** y arranca al 20 % del clip,
para saltarse el despegue o la corrección de encuadre del principio.

No es cosmético. Los másters de esta tanda llegan a 69 segundos, y sin tope una
pieza salía a **14 MB** — cinco veces lo que pesan las demás. En un mosaico
donde puede haber ocho vídeos precargados eso se nota de verdad. Con el tope,
las nueve quedan entre 2,1 y 2,8 MB, igual que el resto.

### Comprobado

23 fichas, las nueve rutas nuevas responden 200, los cinco filtros cuadran, y
las ocho filas se pintan con 21 vídeos y 2 pósters (las dos piezas de fotografía
no tienen vídeo).

---

## 2026-09-13 (36) — Tres piezas más, cargos provisionales y la óptica del Inspire

Cuatro encargos de Mario del 2026-09-13, resueltos con el mismo criterio de
siempre: lo comprobable se comprueba, lo que no se sabe se marca.

### Tres piezas nuevas: el portfolio pasa de 11 a 14

Del material que Mario fue pasando y que está en `~/Desktop/PARA-LA-WEB/`:

| Pieza | De dónde sale | Fecha |
|---|---|---|
| **MITT MOTORS** | anuncio de la marca de motos | 16 jul 2026 |
| **Madrid desde el aire** | postales de dron sobre la ciudad | 17 may 2026 |
| **La costa desde el aire** | bahía con barcos fondeados | 21 may 2026 |

**Las fechas son fiables**, y eso es nuevo: tres de las nueve fichas anteriores
tienen «Por confirmar» porque el nombre del fichero no daba fecha. Estos másters
conservan la etiqueta `creation_time` del aparato, que es la del rodaje y no la
de una copia. Leída con `ffprobe`.

**Lo que no se sabe, no se escribe:** dónde es exactamente esa costa —se ve una
bahía con barcos, y poner «Ibiza» o «Mallorca» a ojo en la ficha de un cliente es
justo lo que este fichero no hace— y dónde se rodó el anuncio. Las dos van con
`venue: "Por confirmar"`.

### Categoría nueva: Publicidad

El anuncio de la moto no encajaba en ninguna de las cuatro que había. Se añade
`ads` a `CATEGORIES` y a los dos diccionarios; el filtro la recoge solo, porque
se construye a partir de esa lista. El recuento queda: Todo 14, Aftermovie 3,
Multicámara 2, Drone 7, Fotografía 2, Publicidad 1.

### Un script para preparar el metraje

`scripts/pieza-web.sh` saca de un máster los cuatro ficheros que necesita una
pieza: apaisado 1280×720, vertical 1080×1350 y sus dos pósters, con las mismas
medidas y el mismo bitrate que las piezas que ya había, para que el portfolio
pese y se vea igual de una a otra.

**La trampa que costó encontrar:** los HEVC de DJI declaran DOS flujos de vídeo.
Sin `-map 0:v:0`, ffmpeg falla con «Error reinitializing filters», que no dice
nada de la causa. Queda escrito en la cabecera del script.

### Cargos: puestos, y marcados

Mario pidió ponerlos «igual que las fotos, y ya te diré». Están repartidos a ojo
entre los servicios que la empresa ofrece de verdad, y **todos llevan
`roleEsEjemplo: true`**: se pintan apagados y con un «Cargo por confirmar» al
lado. `HAY_EJEMPLOS` ahora mira las dos cosas —fotos y cargos—, así que el freno
para abrir la web sigue puesto hasta que se confirmen.

Poner «cámara» a alguien que es productor es de las cosas que un cliente detecta
en la primera llamada; por eso se marcan en vez de escribirlos a secas.

### La óptica del Inspire 3

Comprobada en dji.com: cámara **X9-8K Air** de fotograma completo, hasta 8K
(8192×4320), montura DL con ópticas de **18, 24, 35, 50 y 75 mm**.

Ojo a la distinción, que está escrita en `content/fleet.ts`: eso es lo que
EXISTE para el aparato, que es lo comprobable y lo que pidió Mario. **Cuáles
están de verdad en el maletín sigue sin confirmar.** Si una producción pide el
75 mm y no está, el problema sale el día del rodaje.

---

## 2026-09-13 (35) — El mosaico ya es la página de Trabajo

Mario aprobó la v5. Pasa a ser `/portfolio` de verdad, y **se borran las ocho
páginas de prueba** y sus siete componentes. Están en el historial de git si
hicieran falta.

### El filtro sigue mandando

La página de Trabajo no era sólo una rejilla: tenía filtro por categoría y
recuento de resultados, y eso se conserva entero. Lo que llega al mosaico es la
lista YA filtrada, y el mosaico se recompone con lo que haya. Comprobado los
cuatro: aftermovie 3, multicámara 2, drone 4, fotografía 2. Con cuatro piezas
salen dos filas de dos; con once, cuatro filas (2, 3, 3, 3).

### Ahora sí se respeta «Reducir movimiento»

En las pruebas no se comprobaba a propósito, porque el Mac desde el que se
valoraba la tiene puesta y las páginas se habrían visto muertas. En producción
sí, y esto es lo que se quita:

- El **paralaje**, que se mueve solo con el scroll.
- El **arranque automático en pantallas táctiles**, que es lo que suple al ratón
  en el teléfono.

Y esto NO se toca: **pasar el ratón por encima sigue arrancando el vídeo**. Eso
es una respuesta a un gesto del visitante, no movimiento que se le impone; quien
no quiera ver nada moverse, sencillamente no pasa por encima.

### Código que se va

`components/ui/project-card.tsx` se borra: era la ficha de la rejilla antigua y
ya no la usaba nadie. Comprobado con `grep` en todo el proyecto antes de
tocarla.

Los componentes `portfolio-mosaic-v2` a `-v8` también. El elegido pasa a
llamarse `portfolio-mosaic.tsx` a secas, con la historia de las ocho versiones
escrita en su cabecera para quien llegue nuevo.

---

## 2026-09-13 (34) — La v5 elegida, y más densa

Mario se queda con la **v5** (la maqueta en filas con paralaje, donde el vídeo
sólo corre bajo el ratón). Pero pedía «más vídeos, tipo collage»: con dos por
fila cabían tres piezas en pantalla y el portfolio parecía más corto de lo que
es.

### Añadido después: la prueba, con las piezas repetidas

Mario pidió verla «más llena». La página de prueba repite la lista tres veces:
**once filas y 31 huecos** en vez de cuatro filas y once. (Son 31 y no 33 porque
la pieza destacada es el mismo objeto repetido, y al apartarla se van las tres
copias — no importa, es una página para mirar.)

Sólo ocurre en `/portfolio-prueba-5`: **no toca `content/projects.ts`**. Y lo
avisa en pantalla, no sólo en un comentario, porque si no la página da a
entender que hay treinta y tres trabajos.

La clave de React pasa de ser el slug a ser la posición: con piezas repetidas el
slug deja de ser único.

**Lo que enseña esta prueba y conviene no olvidar:** a mitad de página los 25
vídeos han pasado ya a `preload: auto`. El observador sube la precarga al
acercarse y nunca la vuelve a bajar. Con once piezas reales eso son ocho o nueve
vídeos y no pasa nada; con treinta y una sería mucha descarga. Si algún día el
portfolio crece de verdad, hay que hacer que la precarga se baje al alejarse.

### De dos por fila a tres

Y la destacada deja de ir sola a todo lo ancho: comparte fila con una vertical.
Sigue mandando —ocupa casi el triple— pero ya no se come una pantalla entera
ella sola, que era parte del problema.

Con las once piezas salen **cuatro filas: 2, 3, 3, 3**. Medido en el navegador,
los anchos de cada fila: 963+330, luego 523+235+523, luego 303+674+303, y
523+523+235. Alturas iguales dentro de cada fila sin calcular nada, porque el
ancho sale de `flex: <aspecto> 1 0%` y la altura de `aspect-ratio`.

### Tres patrones que se turnan

Si todas las filas fueran «apaisado, vertical, apaisado» esto sería una
cuadrícula con dos anchos, no un collage. Con tres patrones alternándose,
ninguna fila se parece a la de arriba. Es la misma corrección que hubo que hacer
en la v7 con los ocho paneles iguales seguidos.

### Los títulos, a dos líneas

Con tres por fila el hueco más estrecho ronda los 235 px, y `truncate` dejaba
cosas como «DURO — el show d…». Cortar el nombre de un trabajo en una página de
trabajos es justo lo que no puede pasar: ahora `line-clamp-2`. Comprobado: de
los once títulos, ninguno se queda cortado.

### Permisos de marca: concedidos

Mario confirmó el 2026-09-13 que **están todos**. Se puede publicar DURO,
Monegros, MITT MOTORS, HEAD, UNVRS y Fabrik. Deja de ser un bloqueante.

---

## 2026-09-12 (33) — Analítica propia, sin cookies y sin banner

Montada en el servidor. Mide visitas, páginas más vistas, procedencia, país y
dispositivo, **sin poner una sola cookie**.

### No es Umami, y conviene saber por qué

Se recomendó Umami y no se ha podido: **necesita un servidor de base de datos y
en este VPS no se puede crear una**. El usuario no tiene `sudo`; las órdenes de
Hestia le responden «permiso denegado» porque necesitan root; y el único rol de
PostgreSQL disponible —el de la app de inventario, cuyas credenciales están en
`~/gear-inventario/.env`— **no tiene permiso para crear bases** (`rolcreatedb`
está a `f`, comprobado). Docker está instalado pero el usuario no puede usarlo.

La única forma de meter Umami habría sido poner sus tablas DENTRO de la base del
inventario. Se descartó: una restauración del inventario se llevaría por delante
la analítica, y al revés.

**GoatCounter** (v2.7.0) hace lo mismo para lo que hace falta y es un binario
estático de Go con SQLite dentro: ni servidor de base de datos, ni root, ni
Docker. Licencia libre, sin restricción para uso comercial autoalojado.

### Sin cookies, y por qué eso importa más de lo que parece

No es sólo ahorrarse el cartel. Con Google Analytics **no se cuenta a nadie
hasta que acepta**, y la mayoría no acepta: se acaba midiendo peor. Aquí se
cuenta a todo el mundo y no se guarda ningún dato personal —ni cookies, ni
identificador por visitante, ni IP—, así que no hay consentimiento que pedir.

### Cómo está montado

    ~/analitica/bin/goatcounter      binario
    ~/analitica/datos/…sqlite3       base de datos
    ~/analitica/analitica.sh         arrancar / parar / estado / vigilar
    ~/analitica/credenciales.txt     usuario y clave del panel (chmod 600)

Escucha en `127.0.0.1:3400`. El gestor sigue el mismo patrón que la web: **para
por puerto y no por nombre**, porque en esta máquina conviven varios procesos del
mismo usuario. Y un vigilante en el cron cada minuto que comprueba que
CONTESTA, no sólo que el proceso exista — ya son cuatro servicios con el mismo
apaño, que es el que haría systemd si alguien pudiera activar `enable-linger`.

**Un fallo que costó encontrar:** la primera versión del script se quedaba
colgada para siempre en la segunda orden. El demonio heredaba el descriptor del
cerrojo (`flock`) y no lo soltaba nunca, así que el siguiente `flock` esperaba a
un proceso que no iba a terminar. Se cierra con `9>&-` al lanzarlo. Merece la
pena mirar si `sidebflms-web.sh` tiene lo mismo.

### Lo que falta, y sólo lo puede hacer Mario

Crear el subdominio `analitica.sidebflms.com` en el panel de Hestia: crear
dominios necesita root y el usuario no lo tiene. Los dos ficheros del proxy
—mismo apaño que en la web— están listos en `despliegue/analitica/`, con las
órdenes exactas en su README.

Hasta entonces el servicio funciona pero sólo se llega por dentro del servidor.
Comprobado con `curl`: la página de acceso responde y `/count.js` devuelve 200.

**En el `.htaccess` del subdominio NO se pone contraseña, y no es un olvido.**
GoatCounter trae la suya para el panel, y `/count` y `/count.js` tienen que
quedar abiertos: son los que llama el navegador de cada visitante. Una
contraseña de Apache ahí dejaría la web sin contar nada.

### El script, apagado hasta que haya URL

`components/layout/analitica.tsx` sólo pinta algo si existe
`NEXT_PUBLIC_ANALITICA`. Sin esa variable no se carga nada: en local ensuciaría
las cifras, y mientras el subdominio no exista daría un fallo de red en la
consola de cada visita.

---

## 2026-09-12 (32) — Tres versiones más: índice, rollo y columnas

Mario pidió mirar cómo lo resuelven otras productoras y hacer tres versiones más
con criterio propio. Salen tres patrones que **no** estaban cubiertos por la
v3/v4/v5, que son las tres variantes de lo mismo: una parrilla de vídeo.

### v6 — Índice (`/portfolio-prueba-6`)

Una lista de títulos en tipografía grande; al pasar el ratón, el metraje aparece
en un panel que persigue al cursor y las demás filas se apagan. Es el patrón de
A24 y de varias distribuidoras.

**Por qué aquí tiene sentido:** las otras versiones enseñan imagen y esconden el
dato —quién, dónde, cuándo—. Ésta hace lo contrario, y con once piezas cabe
entera de un vistazo. Quien busca a alguien para un recinto o una fecha concreta
lee una lista mucho más rápido que un collage.

**Es la más ligera de todas con diferencia:** no hay once elementos de vídeo,
hay **uno**, al que se le cambia la fuente según la fila. La v3 llega a tener
seis a la vez.

El panel persigue al cursor con `gsap.quickTo` y medio segundo de retraso: sin
ese retraso parece un tooltip; con él, parece que arrastra el metraje.

### v7 — Rollo (`/portfolio-prueba-7`)

El portfolio se recorre de lado, como una bobina.

**Lo que se ha hecho distinto:** esa clase de páginas casi siempre secuestra el
scroll —capturan la rueda y mueven un `transform`—, y entonces desaparece la
barra, el teclado deja de funcionar y el navegador ya no sabe por dónde vas.
Aquí el contenedor se desplaza de verdad, con anclajes nativos; lo único que se
añade es traducir la rueda vertical en avance horizontal, porque un ratón normal
no tiene eje lateral. Y **se suelta en los extremos**, para que la página siga
bajando y no se quede uno atrapado.

El `IntersectionObserver` mira contra el PROPIO contenedor, no contra la
ventana: aquí «estar a la vista» es estar dentro del rollo.

**Un fallo que hubo que corregir:** el ancho de cada panel se decidía mirando si
la pieza tenía máster vertical, y como casi todas lo tienen salían ocho paneles
idénticos seguidos. Ahora se decide por posición, alternando estrecho y ancho.
Medido: 992, 352, 640, 352, 640… Sin esa alternancia el ojo no tiene dónde
agarrarse para saber cuánto ha avanzado.

**El riesgo, dicho claro:** moverse de lado no es lo que la gente espera.
Compensa con once piezas; deja de compensar en cuanto sean cuarenta.

### v8 — Columnas a distinta velocidad (`/portfolio-prueba-8`)

Tres columnas que bajan a ritmos distintos al hacer scroll. A diferencia de la
v3 —donde el marco está quieto y el metraje se desliza por dentro— aquí se mueve
**la columna entera**, así que la composición cambia constantemente: las piezas
de una columna y otra nunca se alinean dos veces igual.

**Es la única de las seis que aguanta crecer.** Con treinta piezas se reparten
entre las tres columnas y ya está; la v4 tendría que inventar plantillas nuevas y
la v7 se haría interminable.

Dos trampas de la técnica, resueltas: al desplazar las columnas quedan huecos en
los extremos, así que cada columna lleva un margen propio del tamaño exacto de su
recorrido; y por debajo de `lg` no se desplaza nada, porque con una sola columna
no se cruza con nada y sólo se vería raro.

**`prefers-reduced-motion`:** ésta es la versión que más lo necesita en
producción, porque lo que se mueve es la página y no un vídeo. Se escribió
comprobándolo, y **se quitó a propósito**: este Mac tiene «Reducir movimiento»
puesto y con la comprobación la página se veía idéntica a una parrilla normal, o
sea que no se podía valorar. La línea está comentada en el componente con la
nota de devolverla al pasar a producción. Es la misma decisión ya tomada en la
v3, la v4 y la v5.

### Cómo se comprobó

Con medidas del DOM, no con capturas: el panel del navegador va oculto y ahí
Chromium congela `requestAnimationFrame` y suspende los vídeos, así que una
captura en negro no prueba nada. Lo verificado: en la v6, once filas y **un solo
vídeo** en la página, el panel a opacidad 0 en reposo y la fuente cambiando al
señalar cada fila; en la v7, ancho total 6360 px contra 1353 de ventana, anclaje
nativo activo, el desplazamiento funcionando y el observador subiendo a
`preload: auto` sólo las cinco piezas que había alcanzado; en la v8, tres
columnas de 4/4/3 piezas con un desplazamiento distinto cada una.

---

## 2026-09-12 (31) — Mosaico v5: la maqueta de la v3, pero sólo corre lo que tocas

En `/portfolio-prueba-5`. Lo pidió Mario: la v3 le valía de maqueta, pero quería
que **el vídeo no arranque hasta que el cursor se pone encima**.

Misma maqueta que la v3 —filas que alternan apaisado y vertical, cambiando de
lado, con el paralaje del metraje dentro de su marco— y lo único que cambia es
cuándo arranca el vídeo. En reposo no se mueve nada; al salir el ratón, para y
vuelve al principio, así que el mosaico siempre vuelve al mismo sitio.

### Tres cosas que había que resolver para que no quedara peor que la v3

**1. Que se note que hay vídeo debajo.** Una pieza parada es indistinguible de
una foto, y nadie descubre solo que hay que pasar el ratón. Cada pieza con vídeo
lleva un ▶ discreto arriba a la derecha, que desaparece en cuanto arranca.

**2. Que el primer segundo no sea un parón.** Si el vídeo empezara a descargarse
en el `mouseenter`, la primera pasada de cada pieza se vería a tirones. Un
`IntersectionObserver` sube el `preload` a `auto` cuando la pieza se acerca a la
ventana, **pero no la reproduce**: al llegar el ratón ya hay metraje listo, y lo
que está a cinco pantallas sigue sin descargarse.

**3. El póster, como capa y no como atributo `poster`.** Esto no se vio venir: el
atributo sólo se ve hasta que el vídeo arranca la primera vez, y después ya no
vuelve — al rebobinar a 0 lo que queda es el primer fotograma del clip. Se
midieron los once con ffmpeg: ninguno es negro, pero varios empiezan mucho más
flojos que su póster (el de Fátima arranca a 26 de brillo sobre 255), así que el
mosaico se habría ido apagando según lo recorres. Con el póster como capa que se
desvanece al reproducir, en reposo se ve siempre el fotograma elegido, y de paso
desaparece el parpadeo de la primera carga. No cuesta una descarga de más: es la
misma imagen.

### El teléfono no tiene cursor

Dejarlo tal cual convertiría la página en una pared de fotos fijas. Con
`matchMedia("(hover: hover)")`, en puntero grueso se vuelve al comportamiento de
la v3: arranca lo que está en pantalla y para lo que sale.

Se descartó «arrancar al tocar» porque la pieza es un enlace: el toque ya
significa entrar en el proyecto y no puede significar dos cosas.

### Comprobado con ratón de verdad, no simulado

Un `mouseenter` sintético no llega a React (lo deriva de `mouseover`), así que se
probó moviendo el puntero: al entrar, `play` y a los cuatro segundos el vídeo va
por el segundo 4; al salir, `pause` y `currentTime` de vuelta a 0. En reposo,
0 de 9 vídeos en marcha y los 11 pósters visibles.

### También con el teclado

`onFocus`/`onBlur` además del ratón. La pieza es un enlace, y quien la recorre
tabulando merece ver lo mismo.

---

## 2026-09-12 (30) — Mario y Fernando ya tienen su retrato

La pista fue de Mario: «Mario es el rapado y Fernando es el que tiene pelo».

### Cómo se resolvió quién es quién

Cruzando esa frase con **la foto de los tres del recinto**, que es la única donde
los dos salen juntos y se les ve la cara: el de la izquierda lleva el pelo muy
corto y es el mismo que aparece en el retrato con la emisora entre el humo; el
del medio tiene más pelo y es el mismo que sale con las gafas de FPV. Con eso
quedan atados dos rostros a dos nombres sin tener que adivinar nada.

### A Fernando no se le puso la de las gafas, siendo suya

Le tapan la cara, y la condición escrita en `content/team.ts` desde el principio
es que en una página de equipo hay que reconocer a la persona. Su retrato sale
recortado de la foto de los tres: `crop=660:825:1130:672` sobre el original de
2728×1830, y de ahí a los 800×1000 de siempre. Queda centrado, con la camiseta
de SIDEBFLMS y la emisora en la mano.

Se probó antes un recorte más ancho (880×1100) y se descartó: entraban los otros
dos por los lados y no se leía como un retrato suyo.

### Estado

Dos de once con foto de verdad, en color y sin marca. Las otras nueve siguen con
`fotoEsEjemplo: true`, en gris y con el aviso. `HAY_EJEMPLOS` sigue en `true`, o
sea que **el freno para abrir la web sigue puesto**.

---

## 2026-09-12 (29) — La rejilla de retratos, con fotos de relleno marcadas

Mario pidió ver la rejilla de equipo **con fotos**, aunque no fueran de cada uno:
las suyas y las de Fernando de verdad, y el resto de ejemplo.

### El problema, y lo que se ha hecho con él

Las siete fotos de `trabajando/` no vienen con nombre, así que **no se sabe cuál
es Mario y cuál es Fernando**. Se buscó en el historial la foto que él pasó en su
día diciendo que era la suya y no está recuperable.

Así que están las siete repartidas entre los once, y **las once llevan
`fotoEsEjemplo: true`**. En cuanto se sepa quién es quién, se quita esa marca
de esa persona y su foto pasa a color y sin aviso. No hay que tocar nada más.

### Cómo se ve que son de relleno

Tres avisos, porque una cara publicada bajo un nombre que no es el suyo no puede
colarse en producción por descuido:

1. Encima de la rejilla, un aviso en naranja de marca —no en gris como el de
   cargos pendientes—: «Fotos de ejemplo: todavía no son de cada persona».
2. En cada ficha, una marca «EJEMPLO» en la esquina.
3. La foto va en gris y apagada (`brightness-75`). Se probó `brightness-50` y se
   descartó: dejaba la rejilla tan oscura que no se podía juzgar la maqueta, que
   es justo para lo que está puesta. Lo que de verdad avisa es la marca.

Y una cuarta que no se ve pero cuenta: **el texto alternativo de una foto de
ejemplo NO lleva el nombre** de la persona. Si lo llevara, un lector de pantalla
estaría afirmando que esa cara es esa persona.

### El freno

`HAY_EJEMPLOS` en `content/team.ts`. Mientras sea `true` hay caras publicadas
bajo un nombre que no es el suyo, y **eso no puede salir de detrás de la
contraseña**. Está escrito ahí mismo.

---

## 2026-09-12 (28) — El Inspire 3, el equipo ampliado y las caras

Tres respuestas de Mario del 2026-09-12 que cierran tres cosas que estaban
abiertas.

### El dron de cine: DJI Inspire 3

Estaba escrito en `content/fleet.ts` que faltaba por confirmar si había dron de
cine, porque en los metadatos del archivo no aparecía ninguno. Ya está: es un
**DJI Inspire 3**, y encabeza la flota en `/drone`.

Es **el único aparato de la lista que no sale de los metadatos**, y eso queda
escrito en el fichero para que nadie lo dé por comprobado igual que el resto. No
aparece por lo mismo que ya se explicaba allí: lo que se monta en DaVinci y se
exporta pierde la etiqueta del aparato. Lo respalda, además, la foto del piloto
con él posado en la carretera, que es la que está publicada en Nosotros.

Por eso cambia también el texto de la flota. Decía «sacada de los metadatos de
nuestro propio archivo», y con el Inspire dentro eso ya no era cierto del todo.
Ahora dice que no es un catálogo de alquiler y que **casi todo** se puede
rastrear en los metadatos, que es la verdad y sigue siendo el argumento fuerte.

**Sigue faltando la óptica del Inspire 3.** Se sabe el aparato, no con qué
objetivos vuela, y en una ficha técnica de cine eso es justo lo que preguntan.

### Los 18 de Monegros no eran un descuadre

En la ficha hay once personas y en la foto de Monegros salen dieciocho. Para ese
trabajo **se amplió el equipo temporalmente**, y Mario quiere que se vea, porque
es una capacidad: la productora sabe montar y dirigir un equipo grande.

Así que la foto va en Nosotros con su propio texto al lado, justo detrás de la
lista de once. Foto y texto **no se separan**: sin la explicación, dieciocho
caras encima de una lista de once se leen como un error.

### Caras: se pueden publicar

Confirmado. Se quita esa reserva de `content/team.ts`.

Queda en pie lo otro, que es distinto y no lo arregla un permiso general: que
cada uno sepa **cómo** aparece escrito, sobre todo quien sale con apodo
(Galoguin, Jota, Kenny) y no con su nombre.

### La tipografía: licencia confirmada y el aviso, cambiado

Mario confirmó el 2026-09-12 que **ya tiene la licencia comercial** de Akira
Expanded. Eso levanta el bloqueante que estaba anotado en la cabecera de
`app/globals.css` desde que se instaló la tipografía: el `.otf` de partida era
la demo de Typologic («free for personal use only»), que no cubre uso comercial
ni `@font-face` en producción. Ya no aplica, y era **lo último del código que
impedía abrir la web al público**.

El fichero que sirve el sitio se ha regenerado desde el `.otf` de marca con
fontTools:

- El aviso de copyright traía todavía el marcador del diseñador, «Typeface ©
  (your company)». Ahora pone **«Typeface © SIDEBFLMS. 2020. All Rights
  Reserved»**.
- Se añade la descripción de licencia (nameID 13), que no existía, para que el
  fichero deje constancia y no sea sólo un texto cambiado.
- Se tocaron **las dos plataformas** de la tabla `name`, Mac y Windows. Cambiar
  sólo una deja a cada sistema leyendo una cosa distinta, que es peor que no
  tocarlo.

**Los contornos no se han tocado**, y está comprobado, no supuesto: 105 glifos,
104 entradas en el `cmap`, mismas unidades por em y las métricas horizontales
idénticas glifo a glifo frente al fichero anterior. Importa porque un cambio de
métricas habría movido la maqueta en todos los titulares del sitio, y el ancho
de Akira está calibrado a mano en varios sitios de `globals.css`.

Comprobado en el navegador después del cambio: `Akira Expanded 800 loaded`, y el
`h1` de Nosotros la está usando.

**El `.otf` original de Mario no se ha tocado.** El corregido está al lado, como
`SIDEBFLMS TIPOGRAFIA (c SIDEBFLMS).otf`, en la carpeta de marca.

---

## 2026-09-12 (27) — Las fotos del equipo, ya en Nosotros

Llegaron las 64 fotos y vídeos exportados de Fotos. Venían con nombre
`SIDEBFLMS BTS - N of 64`, que no dice nada, así que los he visto uno a uno y
los he repartido en carpetas en `~/Desktop/PARA-LA-WEB`, con un `INDICE.md` que
explica qué es cada número. **No he renombrado ningún original**: el número
sigue siendo el de Fotos.

### La foto de grupo

`FOTO_GRUPO` ya apunta a `/media/equipo/grupo.jpg`: cuatro del equipo cruzando
el campo con el escenario de DURO montándose detrás. Se eligió ésa entre las de
grupo por lo mismo que se decidió para los retratos —es una foto de trabajo, no
un posado— y porque viene apaisada, que es lo que pide el hueco 21:9.

La otra candidata era el equipo entero en Monegros delante de las letras RAVE,
pero es vertical y salen 18 personas frente a las 11 de la ficha. Está guardada.

### Una tira nueva: «En faena»

Las fotos de gente trabajando llegaron **sin nombres**: se ve quién está en cada
una, pero no cuál de las once personas de `EQUIPO` es. Y un retrato con el
nombre cambiado es peor que no poner retrato.

Así que van como tira al final de la sección de equipo, sin pie y sin nombre
(`FOTOS_TRABAJANDO` en `content/team.ts`). Enseñan lo que hay que enseñar sin
afirmar quién es quién. El texto alternativo describe lo que se ve, que es lo
único que ahora mismo se puede escribir con verdad.

**Cuando lleguen los nombres**: renombrar cada fichero con el slug de la
persona, volver a pasar `scripts/fotos-equipo.sh` y rellenar su `foto`. Con las
once, `HAY_RETRATOS` se pone solo a `true` y la rejilla pasa a enseñar caras con
nombre; la tira se puede quitar entonces o dejarse.

### El script de fotos, arreglado y ampliado

Decía que aceptaba `.heic` y **era mentira**: este ffmpeg decodifica los HEIC
montando por dentro un filtergraph complejo (la imagen viene en baldosas), y
entonces ya no admite un `-vf` encima — «Simple and complex filtering cannot be
used together». Ahora los pasa antes por `sips` y luego recorta. Afectaba
también a los retratos y a la foto de grupo, no sólo a lo nuevo.

Y procesa una subcarpeta `trabajando/` si existe: mismo recorte 4:5 anclado
arriba, pero sin exigir que el fichero se llame como un slug.

### Comprobado en el navegador

Las ocho imágenes salen con su texto alternativo; `next/image` sirve `w=750`
para una caja de 317 px a doble densidad, que es lo correcto (el original es de
800 px, así que no hay más que dar). En móvil, dos columnas y sin desbordamiento.

### El naranja, confirmado contra el logo

Con la carpeta de marca a mano he sacado el color directamente del fichero del
logo: **#E8451D**, que es exactamente el `--color-rust-500` que ya tenía la web.
Queda confirmado contra el original y no contra el manual.

### La tipografía de marca es Akira Expanded Super Bold

El fichero está en `00 Logos & Branding/LOGO_SIDEBFMLS/SIDEBFLMS TIPOGRAFIA.otf`.
Leyendo la tabla `name`: familia «Akira Expanded», estilo «Super Bold», versión
1.00 de 2020, 105 glifos. **El aviso de copyright viene sin rellenar** («Typeface
© (your company)»), que es lo que traen las descargas gratuitas, no una licencia
a nombre de nadie.

Tener el fichero no es tener derecho a incrustarlo en una web: la licencia de
escritorio y la de web son distintas. **Sigue pendiente** conseguir la licencia
web antes de servir la tipografía desde el sitio.

---

## 2026-09-12 (26) — Mosaico v4: pantallas que se recomponen enteras

En `/portfolio-prueba-4`. La v3 gustó, pero lo que se pidió después fue otra
cosa: **pasar de pantalla y que el mosaico se rehaga de golpe**, como en la web
del competidor, «no lo mismo pero algo parecido sí».

### El portfolio deja de ser un scroll y pasa a ser una baraja

Cada pantalla son cuatro piezas que ocupan la ventana entera. Se pasa con las
flechas del teclado, con los botones o con las rayitas del pie.

### Lo que hace que no canse: cada pantalla lleva una composición distinta

Si todas repartieran las piezas igual, pasar de pantalla sería cambiar las fotos
de sitio y nada más. Las plantillas están escritas como mapas de celdas al
principio de `components/sections/portfolio-mosaic-v4.tsx`:

    4: [
      { mapa: ["a a b", "c d b"], altas: ["b"] },
      { mapa: ["a b b", "a c d"], altas: ["a"] },
      { mapa: ["a b c", "a b d"], altas: ["a", "b"] },
    ]

`altas` no es decorativo: de cada pieza hay dos recortes —el apaisado y el 4:5
sacado del máster— y en un hueco alto hay que servir el vertical, porque con el
apaisado `object-cover` recorta los lados y se come el encuadre. **Qué hueco es
alto cambia con la plantilla**, así que no se puede dar por fijo.

Comprobado en el navegador con las 11 piezas: salen 3 pantallas (4 + 4 + 3) y
las tres rejillas son distintas entre sí.

### Entran todas a la vez

Barrido desde el centro con `clip-path`, `stagger: 0`. Escalonarlas construiría
la pantalla «pieza a pieza», que es justo lo contrario de lo que se pidió.

### Y pesa menos que la v3

Sólo existen en la página las piezas de la pantalla actual: las demás **ni están
en el DOM**. Cuatro vídeos como mucho, siempre, sin nada que vigilar.

### Dos trampas que costaron encontrar

**El estilo en línea gana a las media queries.** La composición se pasaba como
`style={{gridTemplateAreas: ...}}` y por tanto se habría aplicado también en
móvil, donde no hay rejilla de áreas. Ahora va como variables CSS (`--areas`,
`--cols`, `--rows`, y `--ga` para cada pieza) que sólo se usan a partir de `lg:`.
Verificado a 390 px: `grid-template-areas: none`, una sola columna y sin
desbordamiento horizontal.

**Un `push` dentro del render dejaba fuera al compilador de React.** La lista de
pantallas se construía mutando un array, y eso hace que el compilador no pueda
conservar la memoización manual y **se salte el componente entero** — justo
donde hay cuatro vídeos a la vez. Ahora se construye con `Array.from` y el `ir`
no lleva `useCallback`: el compilador ya lo memoiza solo, y ponerlo a mano con
una lista de dependencias que no coincide con la que él deduce era precisamente
lo que le hacía renunciar. `npx eslint` sale limpio, sin avisos.

### Qué hay que decidir antes de que esto sustituya al portfolio de verdad

`prefers-reduced-motion`, igual que en la v3. Aquí no se comprueba a propósito,
porque si se comprobara la página de prueba se vería muerta justo en el Mac
desde el que se está valorando. Pero cuatro vídeos que arrancan solos **sí** son
lo que esa preferencia quiere evitar: en producción hay que enseñar el póster y
un botón de reproducir, y cambiar de pantalla sin el barrido.

### Aviso para quien verifique esto en el panel del navegador

Con el panel oculto, `requestAnimationFrame` va a **0 fotogramas por segundo** y
Chromium suspende todos los vídeos menos uno. Se ve como si la animación no
existiera y como si los vídeos no arrancaran, y no es verdad: los cuatro
`play()` resuelven bien. Y el primer fotograma tarda en pintarse, así que una
pieza puede salir negra en una captura y verse perfecta en la siguiente. Medir
el DOM, no fiarse de la captura.

---

## 2026-09-12 (25) — Mosaico v3: la página se mueve sola

En `/portfolio-prueba-3`. Mario descartó la v2: **pedía algo al visitante**, y
lo que quería era una página viva como la del competidor.

### Todo reproduciéndose, pero sólo lo que se ve

Allí los 15 vídeos de la página se reproducen a la vez, estén donde estén. En
un móvil con datos eso es una página que no carga.

Aquí un `IntersectionObserver` arranca la pieza al entrar en pantalla y la
pausa al salir. Y el vídeo **ni se descarga** hasta que se acerca:
`preload="none"` de partida, que sube a `auto` justo antes.

Medido en la página ya montada, con 9 vídeos:

```
en pantalla:      3
reproduciéndose:  5   (los 3 + 2 que entran, por el margen de 20 %)
sin descargar:    4
```

Da igual que el portfolio crezca a cincuenta piezas: en marcha nunca hay más de
las que caben en la ventana.

### Paralaje, que ellos no tienen

El metraje se desplaza dentro de su marco a distinta velocidad que la página.
Es lo que da profundidad en vez de tablón de recortes. El marco recorta y la
capa de dentro va un 12 % más alta, para que haya recorrido sin dejar hueco.

Con GSAP ScrollTrigger, que es la herramienta que este sitio usa para todo lo
que depende del scroll. Comprobado: el transform pasa de −4,5 px a +15,3 px al
desplazarse.

### Menos ficha, más pieza

En reposo sólo el título. La disciplina, el recinto y la fecha aparecen al
acercarse. El mosaico tiene que leerse como vídeo, no como un listado — que era
lo que lastraba las dos versiones anteriores.

### Pendiente antes de que esto sustituya al portfolio

`prefers-reduced-motion` **no se comprueba** en esta página de prueba, porque
si no se vería muerta justo en la máquina desde la que se está valorando. Pero
un vídeo de fondo que arranca solo **sí** es lo que esa preferencia quiere
evitar —al contrario que el rebobinado de la v2, que lo movía el visitante—,
así que en producción lo honesto es enseñar el póster y un control a quien la
tenga activada.

---

## 2026-09-12 (24) — Los cuatro rótulos de la pieza destacada se salían

Sólo lo veía quien tuviera **«reducir movimiento»** activado, que es
precisamente el caso de Mario.

Sin esa preferencia, la sección destacada enseña **un** rótulo que va cambiando
con el vídeo. Con ella, no puede: enseña **los cuatro a la vez**. Y esos cuatro
iban apilados en vertical y en `absolute` sobre el metraje — cuatro tarjetas de
dos líneas miden más que el hueco, así que la última se veía cortada por abajo,
y de paso tapaban el centro del plano, que es lo que la sección quiere enseñar.

Ahora, en ese modo, van **debajo del vídeo y en fila de cuatro**. No pueden
desbordar porque los limita el ancho y no el alto. El modo de un solo rótulo
—el que ve todo el mundo— se queda como estaba, encima del vídeo.

Comprobado a 1440: los cuatro a la misma altura, repartidos a lo ancho, y
ninguno se sale de la sección.

### Decidido: las fotos de equipo, trabajando

Anotado en `content/team.ts`. Retrato de estudio sobre blanco descartado por
dos razones: dice «directorio de empleados» en vez de lo que se hace, y en un
sitio casi negro once fondos blancos son once agujeros de luz.

Condición: **que se le vea la cara**. La primera prueba era un perfil mirando
por el visor.

---

## 2026-09-12 (23) — DURO y Metropolitano: dos piezas que estaban descartadas

Mario enseñó fotos de esos dos trabajos, y resultó que **el material ya estaba
en el disco**. Se habían descartado en la primera pasada por tamaño —el máster
de DURO son 634 MB y hay otro de 8,3 GB— sin mirar lo que tenían dentro. Eran
de lo mejor del archivo.

El portfolio pasa de 9 a 11 piezas. La categoría de drone, de 2 a 4.

### Un detalle del máster de DURO que habría estropeado el corte

`DURO PYROSHOW 2 HORIZONTAL.mp4` **mezcla planos horizontales con insertos
verticales pillarboxed**. Cortar por donde pareciera bonito habría metido
bandas negras en la pieza.

El tramo se eligió midiendo con `cropdetect`: 168-171 s da 3226 px de ancho
—hay bandas— y 171-183 da 3840 en todo el tramo. De ahí sale el corte.

### Las dos son plano único

Verificado con detección de escena sobre las piezas ya publicadas: **cero
cortes** en las dos. El Metropolitano es un descenso continuo desde fuera del
estadio hasta el césped; DURO aguanta el abanico de pirotecnia entero en la
misma toma.

### Lo que sigue sin saberse

Ninguna de las dos lleva fecha en el nombre del fichero, así que las dos dicen
«Por confirmar». Y el `delivered` sigue pendiente, como en todas.

### Material que queda sin usar y merece la pena

- `@sidebflms_DURO_FESTIVAL-11.jpg` — **10095×8076, 81 megapíxeles**. Es una de
  las que Mario enseñó por el chat. Da para la ficha de fotografía de DURO.
- `DURO BOMBA 1 V2.mp4` — **vertical nativo** 2160×3840, no recortado.
- `CLIP CIERRE DURO.mp4` — 4K, 2:28.
- `06 VENDEX DURO FESTIVAL.mp4` — 8,3 GB, casi una hora: parece la grabación
  entera del evento, no una pieza.

---

## 2026-09-12 (22) — Mosaico v2: rebobinar la pieza con el ratón

En `/portfolio-prueba-2`. Conviven las tres para comparar: `/portfolio` (el de
verdad, intacto), `/portfolio-prueba` (v1) y esta.

### Qué cambia

En la v1 pasar el ratón **reproducía** el clip. Aquí lo **rebobina**: la
posición horizontal del cursor es la posición en la pieza, con cabezal, barra
de progreso y el timecode corriendo en naranja.

Por qué, y no simplemente «más animación»:

- **Lo hace el visitante.** Un autoplay se ignora a los dos segundos; un clip
  que responde al ratón se recorre entero, que es lo que quiere un portfolio.
- **Es el oficio.** Son montadores y la regleta del sitio ya es una línea de
  tiempo: rascar un clip para ver qué tiene dentro es su gesto.
- **No pesa.** Sólo se descarga el clip que se está tocando.

### Dos decisiones que se apartan de lo que hace el resto del sitio

**`prefers-reduced-motion` NO se comprueba aquí**, y es deliberado. En el resto
del sitio esa preferencia apaga movimiento que ocurre sin que nadie lo pida —el
reel de la portada, el cabeceo del drone—. Esto es lo contrario: cada fotograma
lo pone el visitante con su propio ratón, igual que la barra de un reproductor,
que nadie desactiva por esa preferencia. Apagarlo sólo dejaría la página muerta
para quien la tenga activada, que es mucha gente que la puso por la batería.

**No se llama a `load()`** al entrar: reiniciaría el elemento y provocaría un
parpadeo. Basta con subir `preload` a `auto`; al saltar a un punto el navegador
pide por rango el trozo que necesita, que es justo para lo que los mp4 se
generaron con `faststart`.

### Un fallo encontrado al probarlo

Al principio, quien pasaba el ratón y lo dejaba quieto se quedaba mirando el
**fotograma 0**, que no tiene nada que ver con dónde apunta: el clip parecía
roto hasta que movías. Ahora se salta al punto de entrada en el mismo
`mouseenter`, usando su `clientX`.

De paso, el manejador de movimiento estaba conectado sólo cuando la ficha ya
estaba activa, así que **el primer movimiento se perdía**. Ahora escucha
siempre.

Comprobado con el cursor de verdad: entrando por el 80,7 % del ancho salta a
9,68 s de 12; moviendo al 13,4 %, a 1,61 s. El cabezal cae en el mismo
porcentaje.

### Con teclado

`onFocus` tiene su propio manejador: no hay cursor, así que no hay punto al que
saltar y la pieza se enseña desde el principio. Rebobinar necesita ratón, pero
al menos quien navega con tabulador ve la pieza y no se queda con el póster.

---

## 2026-09-11 (21) — Nosotros, preparada para fotos de equipo

La página ya sabe pintar una **foto de grupo** a ancho completo y un **retrato**
por persona. **No hay fotos todavía**: en el archivo no hay ninguna del
equipo, sólo de eventos y artistas, y no se generan ni se toman prestadas —
en una página de «quiénes somos» sería justo lo contrario de lo que tiene que
transmitir.

### Todos o ninguno

Los retratos sólo se pintan si **todas** las personas tienen foto
(`HAY_RETRATOS` en `content/team.ts`). Seis caras y cinco huecos se ven a medio
hacer, y eso es peor que ninguna foto. Mientras falte una, se queda la rejilla
de nombres, que está completa. El día que entre la última, aparecen solos.

### En blanco y negro, con color al pasar el ratón

Once fotos hechas en sitios distintos rara vez casan de color. En gris se leen
como una serie aunque vengan de once cámaras.

### `scripts/fotos-equipo.sh`

Recorta y escala todas igual: retratos a 4:5 y 800×1000 **anclados arriba**
(en un retrato importa la cabeza, y centrar en vertical la corta cuando la foto
es de cuerpo entero), la de grupo a 21:9 y 2400 de ancho. Admite JPG, PNG y
HEIC. Los ficheros de entrada van **nombrados por el slug** de cada persona,
que está en `content/team.ts`.

Probado con imágenes sintéticas en los cuatro casos —apaisada, vertical,
cuadrada y de grupo— sin escribir en el repositorio (`OUT_EQUIPO` lo redirige).

---

## 2026-09-11 (20) — Drone con página propia, siete servicios y un mosaico de prueba

### La empresa ya no se presenta sólo como «música electrónica»

Mario lo aclaró: se hace producción en directo, **drone para cine, series y
publicidad**, cablecam, multicámara, aftermovie, publicidad y fotografía. El
drone es la especialidad.

Cambia el título de la portada («Productora audiovisual y especialistas en
drone»), su descripción, la línea de la primera pantalla y el título de
Servicios — que decía «Aftermovies, multicámara, drone y fotografía» y ahora
se quedaba corto. **El lema «CAPTURE THE ENERGY» no se toca**: es la línea de
marca y está marcado en el código como fijo.

### Servicios: los siete, antes de las etapas

La página listaba las cuatro etapas de un encargo, que es CÓMO se hace, no QUÉ
se ofrece. Ahora van primero los siete servicios y debajo las etapas, bajo
«Cómo lo hacemos». El de drone es el único que enlaza a más.

Ningún servicio nombra un rodaje concreto: son capacidades, no créditos.

### `/drone` — la especialidad, con la flota

**La flota no la escribió nadie: sale de los metadatos de los propios ficheros.**
Cada vídeo de un DJI lleva grabado el modelo del aparato, y se leyó con
`ffprobe` sobre el archivo: Mavic 4 Pro (la plataforma principal), Mini 5 Pro,
Mini 4 Pro, y dos cámaras de acción. Cada capacidad de la página —vertical
nativo, RAW de 100 MP, FPV— apunta en `content/fleet.ts` al fichero que la
respalda.

**Y lo que falta está anotado, no inventado**: no aparece ningún dron de cine
en el archivo, el FPV de Holika perdió la etiqueta al exportarse, y no hay nada
de cablecam. Esta página se enseña a producciones que piden la ficha técnica.

### El mosaico de portfolio, en prueba

En `/portfolio-prueba`, **sin tocar `/portfolio`**, para comparar.

Sale de medir el de un competidor: 15 piezas, todas vídeo, dos formatos a la
misma altura alternando de lado. Aquí, además, cada pieza dice qué es, el
showpiece abre a ancho entero, el vídeo arranca al pasar el ratón en vez de
quince a la vez, y los verticales son de verdad.

**Los verticales se recortaron del máster, no de la horizontal.** Los másters
son 4:3 con encuadre abierto, así que de ahí sale un 4:5 con resolución de
sobra; recortar la horizontal de 720 habría sido recortar un recorte. Mismo
tramo y mismo póster que la horizontal, para que sean la misma pieza.

`noindex` y fuera de rutas, menú y sitemap: si convence, pasa a `/portfolio` y
esta página se borra.

### Peso

El material en git pasa de 38 a unos 60 MB con los verticales. Sigue lejos de
donde conviene sacarlo del repositorio, pero crece rápido.

---

## 2026-09-10 (19) — Las ciudades, sólo en el FAQ

Decisión de Mario. Madrid, Barcelona e Ibiza aparecían en seis sitios por
idioma; ahora aparecen **en uno**: la respuesta del FAQ a «¿Dónde trabajáis?».

Fuera de la primera pantalla, del pie, de las descripciones para buscadores y
del título de Nosotros. En todos esos sitios queda **«Con base en España»**.

El razonamiento, para que no se deshaga sin querer: una lista de ciudades en la
portada se lee como un **límite** —«entonces no vais a mi festival de Huesca»—
mientras que la misma lista en el FAQ se lee como la respuesta a una pregunta
que el visitante ya se estaba haciendo. El mismo dato, leído al revés según
dónde esté.

Queda anotado en `es.ts`, junto a `builtNote`.

---

## 2026-09-10 (18) — Dos páginas nuevas, sociales al día y títulos para buscar

Sale de comparar la web con la de un competidor directo (ventour.co), que
opera en las mismas plazas y con el mismo argumento.

### Nosotros (`/about`)

La web no decía **quién** está detrás. Para un servicio donde se contrata a
gente para meterse en tu recinto a las cuatro de la mañana, era el hueco más
grande que había.

Once personas, de la lista de buzones de la empresa. **Los correos no se
publican**: el contacto del sitio es uno solo.

**Faltan los cargos**, y están a `null` en `content/team.ts` en vez de
inventados: poner «cámara» a quien es productor se detecta en la primera
llamada. La ficha se pinta sin cargo mientras tanto, y el rótulo de «pendiente»
desaparece **solo** cuando se rellenen — no hay que acordarse de quitarlo.

El apartado de «cómo trabajamos» **reutiliza** `dict.manifesto` en vez de
reescribirlo. Duplicar ese texto es cómo se acaba con dos versiones que dicen
cosas distintas.

### Preguntas frecuentes (`/faq`)

Nueve preguntas, y todas se responden con cosas que la empresa ya hace:
entrega en 24-48 h, piloto certificado, cortes verticales desde máster abierto,
qué hace falta para presupuestar.

Lleva **JSON-LD `FAQPage`**, que es lo que permite que Google despliegue las
preguntas en el resultado de búsqueda. Y sale del **mismo array** que se pinta
en pantalla, no de una copia: un JSON-LD que dice algo distinto de lo que se ve
es motivo de penalización, y es exactamente lo que pasa cuando son dos listas y
alguien actualiza una.

Sin acordeón, todas abiertas. Un acordeón esconde ocho de nueve respuestas y
obliga a un clic por duda, cuando el visitante viene buscando una concreta.

### Vimeo fuera, LinkedIn y YouTube dentro

Quien contrata producción para una marca o un festival está en LinkedIn.

**⚠️ Las tres URLs están sin confirmar**, incluida la de Instagram, que ya
estaba deducida del nombre de la marca desde el principio y nunca se verificó.
Están marcadas en `components/layout/footer.tsx`. Un enlace social roto en el
pie es de lo más barato de arreglar y de lo que peor sienta.

### Títulos de página orientados a búsqueda

Eran de marca («Trabajo — SIDEBFLMS»). Ahora llevan delante lo que alguien
teclearía, sin pasar de 62 caracteres:

- «Portfolio de festivales y clubes — SIDEBFLMS»
- «Aftermovies, multicámara, drone y fotografía — SIDEBFLMS»
- «Pide presupuesto de cobertura audiovisual — SIDEBFLMS»

### El pie dice el país y el hero las plazas

`builtNote` pasa a «Con base en España». Es deliberado que no repita las
ciudades: el pie responde a «¿dónde está esta empresa?» y el hero a «¿venís a
mi evento?», y ahí lo útil son Madrid, Barcelona e Ibiza.

### Pendiente

Cargos y fotos del equipo. Y que cada persona sepa que aparece con su nombre —
sobre todo quien sale con apodo.

---

## 2026-09-10 (17) — La empresa no está en Mallorca, está en Madrid

El pie decía «Mallorca, Islas Baleares» y el hero «Mallorca, Ibiza y donde haga
falta». **Las oficinas principales están en Madrid.** Mallorca venía del texto
de relleno inicial y nadie lo había corregido.

Corregido en los **seis** sitios donde estaba —no en uno—: `footer.builtNote`,
`hero.sub` y `meta.home.description`, en los dos idiomas.

| | Antes | Ahora |
|---|---|---|
| Pie | Mallorca, Islas Baleares | **Madrid, España** |
| Hero y buscadores | Mallorca, Ibiza y donde haga falta | **Madrid, Barcelona, Ibiza y donde haga falta** |

Barcelona e Ibiza entran porque son plazas donde se cubre mucho trabajo. **No
son sedes**, y por eso no aparecen en el pie: ahí va dónde está la empresa, no
dónde trabaja.

### Un detalle de SEO que obligó a recortar

La descripción para buscadores se corta a unos 160 caracteres. Añadir Barcelona
la pasaba de largo, así que se acortó «Productora audiovisual **especializada
en** música electrónica» a «Productora audiovisual **de** música electrónica».
Queda en 147 caracteres; la inglesa, en 139.

Comprobado en la página servida, no sólo en el fichero: subtítulo, pie y
etiqueta `description` los tres correctos.

Queda una nota en `es.ts` diciendo que son seis sitios, para que el día que
cambie la sede no se corrija sólo el pie y el hero siga diciendo otra cosa.

---

## 2026-09-10 (16) — El naranja de la web no era el naranja de la marca

Lo cazó Mario mirándola. La web usaba `#ae4b2f`, un teja apagado que **no sale
del manual de marca**. Ahora usa el de verdad.

| | Antes | Ahora | Manual |
|---|---|---|---|
| Acento | `#ae4b2f` | `#e8451d` | `brand-500` |
| Acento legible | `#c97a55` | `#ff6a3d` | `brand-400` |
| Fondo del botón primario | `#ae4b2f` | `#bb4223` | `brand-600` |

**Los fondos NO se tocan.** Sigue todo sobre `#1e1e1e`. Esto es sólo la familia
del acento, que es lo que estaba mal.

### El contraste mejora, pero la restricción se queda

Medido sobre el fondo actual, no estimado:

```
rust-500   3.05:1  →  4.21:1
rust-300   5.08:1  →  5.86:1
```

Sube, pero **4,21 sigue por debajo de 4,5**, así que la regla de que `rust-500`
no vale para texto corrido NO se levanta. La tabla de `app/globals.css` está
recalculada con estos números.

### El botón primario tenía que cambiar, y hay un número detrás

El texto de los botones es `bone` (#f2ece4), no blanco puro:

```
bone sobre #bb4223 (brand-600)  4.57:1  cumple AA
bone sobre #e8451d (rust-500)   3.38:1  NO cumple
```

Es decir: **el naranja de marca a pleno no vale como fondo de botón.** Si se
hubiera puesto `rust-500` ahí sin mirar, el botón principal del sitio habría
quedado por debajo de AA. Va en `brand-600` y al pasar el ratón sube a
`rust-500`, que es lo que dice el manual y ahora también el porqué.

*(El manual dice 5,4:1 para ese botón. Es cierto para blanco puro; con `bone`
el número real es 4,57. Cumple, con menos margen del que parece.)*

### Un detalle de nombres

Los tokens se siguen llamando `rust-*` y no `brand-*`: renombrarlos eran 68
sitios y ninguna ganancia visible. Queda anotado en `globals.css` que lo que
designan es la familia `brand-*` del manual.

---

## 2026-09-10 (15) — Fuera la monoespaciada: Montserrat también en la interfaz

El sitio tenía **tres** familias. Ahora tiene **dos**: Akira Expanded para los
titulares y Montserrat para absolutamente todo lo demás.

JetBrains Mono cubría el menú, los botones, los rótulos en mayúsculas, los
filtros del portfolio, las fechas y los timecodes — unas 57 aplicaciones
contando la clase `.label`. Por eso al cambiar sólo `--font-sans` en la entrada
anterior **la interfaz no se movió**: el menú y los botones nunca dependieron de
esa variable.

### Se retira, no se disfraza

La tentación era apuntar `--font-mono` a Montserrat y no tocar nada más: una
línea. Se descartó porque dejaba 57 sitios diciendo `font-mono` sobre algo que
no es monoespaciado, y eso muerde a quien venga después.

Lo hecho: fuera la clase `font-mono` de los 15 componentes que la usaban (21
usos), fuera el token `--font-mono` de `@theme`, `.label` pasa a `--font-sans`,
y fuera JetBrains Mono de `lib/fonts.ts`.

### Lo que se pierde, y qué se hizo al respecto

**La monoespaciada alineaba las cifras por columna sin ayuda.** Montserrat las
alinea igual, pero sólo con `tabular-nums`. Dos sitios ya la llevaban —el
timecode del hero y la numeración de servicios—; los rótulos de la pieza
destacada **no**, y muestran timecodes (`00:00`, `00:03`, `00:07`, `00:10`) uno
debajo de otro. Se les añadió.

A partir de ahora `tabular-nums` no es opcional en ningún sitio donde los
dígitos tengan que cuadrar. Queda escrito en `app/globals.css`.

Comprobado: sin scroll lateral ni desbordes a 375 ni a 1440, en portada,
portfolio y ficha de proyecto.

---

## 2026-09-10 (14) — El texto pasa a Montserrat

Por decisión de Mario. **Los titulares NO cambian**: siguen en Akira Expanded.
Lo que cambia es `--font-sans`, que es todo el texto corrido.

Montserrat está bajo SIL Open Font License, así que cubre el uso comercial —
al contrario que la Akira actual, que sigue siendo la demo y sigue pendiente.

Los cuatro pesos que usaba el sitio (400/500/600/700) existen igual, así que no
hubo que tocar ni una clase. Se retiran los cuatro `.woff2` de General Sans, que
quedaban sin usar; siguen en el historial de git si hiciera falta volver.

### Lo que hay que mirar al cambiar una fuente de texto

Montserrat es **más ancha y de ojo más grande** que General Sans al mismo
tamaño, así que el mismo párrafo ocupa más líneas. En la portada, el subtítulo
del hero pasa de dos líneas a tres. Eso no es un fallo, pero conviene saberlo
antes de asustarse.

Comprobado que no rompe nada: sin scroll lateral **ni a 375 px ni a 1440**, en
portada, contacto, privacidad y ficha de proyecto. Y el titular de contacto
—«CUÉNTANOS QUÉ EVENTO TIENES», el que ya se partió una vez— sigue entero,
porque va en Akira y no le afecta.

---

## 2026-09-10 (13) — El hero se veía gris con el vídeo sonando por detrás

Tocado: una palabra en `components/sections/hero.tsx`. La palabra es `isolate`.

### El síntoma

Al cargar, el hero se quedaba en un **gris liso**. Y no era que el vídeo
fallara: el timecode corría, el botón decía «Pausar el reel» y el audio estaba
ahí. Simplemente no se veía la imagen.

### La causa

El `<video>` va en `-z-10` para quedar por detrás del titular. Pero la sección
que lo contiene era `relative` con `z-index: auto`, y **eso no crea contexto de
apilado**. Ningún ancestro lo creaba tampoco. Así que ese `-10` se escapaba
hasta el contexto raíz, y ahí se pintaba **por debajo del fondo del `<body>`**
(`bg-ink-800`, que es exactamente ese gris).

No es un fallo del navegador: por las reglas de pintado de CSS, dentro de un
contexto de apilado los z-index negativos se dibujan **antes** que los fondos
de los bloques descendientes. El fondo del body es uno de esos.

### Por qué no se había visto antes

Porque **con el póster funcionaba**. Un póster se pinta como el contenido de
una imagen normal y se veía perfectamente. En cuanto arranca la reproducción,
el navegador promociona el vídeo a su propia capa de composición, y ahí el
`-10` sí se aplica: el hero se queda gris.

Y en la máquina de desarrollo estaba **«reducir movimiento» activado**, así que
el vídeo nunca arrancaba solo y siempre se veía el póster. El fallo era
invisible justo donde se estaba mirando. Se reprodujo forzando `play()` a mano.

### El arreglo

`isolate` en la sección del hero: crea contexto de apilado, y con eso el `-10`
se queda **dentro** de la sección en vez de escaparse al raíz.

Comprobado con el vídeo reproduciéndose de verdad, no con el póster.

**Si alguien quita ese `isolate` para «limpiar clases», el hero vuelve a ser
gris.** Por eso lleva un comentario largo encima explicándolo.

---

## 2026-09-10 (12) — El control del reel decía «Pausar» con el vídeo parado

`toggle` en `components/sections/hero.tsx` hacía esto:

```js
void video.play();   // lanza la promesa y la tira
setPlaying(true);    // afirma que reproduce, pase lo que pase
```

Cuando el navegador se niega —y se niega más de lo que parece: políticas de
autoplay, pestaña en segundo plano, ahorro de energía— el botón pasaba a decir
«Pausar el reel» con el vídeo quieto en el primer frame. **El control mentía**,
y encima quedaba una promesa rechazada sin capturar ensuciando la consola.

Ahora el estado lo dictan `onPlay` y `onPause` del propio elemento, así que el
botón no puede decir otra cosa de la que está pasando, la arranque quien la
arranque. Comprobado con las dos: con una reproducción rechazada el botón se
queda en «Reproducir el reel» en vez de mentir; con una aceptada pasa a
«Pausar» y el tiempo corre.

**El fallo llevaba ahí desde el principio y no se veía**: sin reel, `hasVideo`
era falso y ese control ni se pintaba. Ha salido a la luz al meter el material.

### Lo que NO se cambió, y conviene saberlo

Que con «reducir movimiento» activado el vídeo **no arranque solo**. Es
deliberado: un vídeo de fondo en bucle es exactamente lo que esa preferencia
del sistema pide evitar, y a quien tiene migrañas o vértigo le importa. El
visitante conserva el control de «Reproducir el reel», que es la diferencia
entre respetar la preferencia y esconderle el contenido.

Efecto secundario que despista: como el póster ES el primer frame del vídeo,
en un equipo con esa preferencia activada el hero se ve como una imagen fija.
No está roto — está respetando el ajuste.

---

## 2026-09-10 (11) — La portada vuelve a cuatro destacados

Al meter los proyectos reales quedaron **cinco** marcados como destacados donde
antes había cuatro.

La portada maqueta el showpiece más el resto como bloques editoriales
alternados, así que eso metía un bloque de más y cambiaba el ritmo de la
página. Y sobre todo dejaba el texto mintiendo: el titular de esa sección dice
«Cuatro noches que no se repiten», y debajo salían cinco.

`fitz-directos` sale de destacados —sigue en el portfolio— y queda anotado en
su ficha por qué, para que el próximo que añada un proyecto no vuelva a subir
la cuenta sin darse cuenta.

---

## 2026-09-10 (10) — Material real: se acabaron los proyectos inventados

Entran 38 MB de vídeo y fotografía sacados de los 82 GB del archivo de la
productora, y salen los ocho proyectos que estaban inventados.

### Cómo se hizo, porque importa para repetirlo

**El disco original NO se tocó.** `/Volumes/@SIDEB404L/` es material de
producción: todo el trabajo se hizo leyendo y escribiendo en otro sitio.
Comprobado al terminar: 84 ficheros, 82 GB, **cero modificados**.

Tres agentes en paralelo, cada uno midiendo lo que entregaba en vez de
estimarlo. Los intermedios y las hojas de contactos quedaron fuera del
repositorio.

### El reel de la portada

`reel-1920.mp4` (5,17 MiB), `reel-720.mp4` (2,27 MiB, recorte **vertical**
reencodeado, no el de escritorio escalado) y `reel-poster.jpg` (169 KiB).
Ninguno lleva pista de audio: el hero arranca silenciado y el audio son megas
tirados.

Sale del aftermovie de Fabrik del 14 de marzo, del segundo 11,92 al 33,36. El
tramo no se eligió a ojo: se midió la luminancia media de los cinco
aftermovies y se buscó la ventana más oscura, porque encima va un titular
blanco. Y **los dos extremos son cortes de plano reales**, así que el bucle se
lee como un corte de montaje y no como un salto.

El `poster` ya está conectado en `hero.tsx`. Es el LCP de la página: sin él el
LCP pasa a ser el vídeo. Y es exactamente el primer frame del vídeo, así que
al arrancar la reproducción no hay salto.

### Nueve proyectos reales

Siete de vídeo y dos de fotografía, con 16 fotos en tres tamaños cada una.

**Lee la cabecera de `content/projects.ts` antes de tocarlo.** No todos los
campos tienen el mismo grado de certeza, y mezclarlos es cómo se acaba
publicando una credencial falsa:

- `hardFact` y `media` salen de **medir** los ficheros. Comprobables con
  `ffprobe`.
- Los nombres y las fechas salen del nombre del fichero original o de rótulos
  legibles dentro del metraje. Cada ficha lleva anotado de dónde sale el suyo.
- `brief` describe **sólo lo que se ve en pantalla**.
- `delivered` se titula «Qué entregamos» y **está sin confirmar**: es una
  afirmación sobre un encargo real y sólo la puede escribir quien hizo el
  trabajo. Lo que hay describe la pieza, no la entrega.

**Tres fichas no llevan fecha a propósito.** Holika y Monegros porque el
fichero no la lleva; Prospa porque el suyo se llama `31132026` — el 31 del mes
13. Ese mes no existe, así que el nombre está mal puesto y no sirve de fuente.
«Por confirmar» es mejor que un mes inventado en la ficha de un cliente.

### `PlaceholderMedia` ya pinta el trabajo

Antes pintaba **siempre** el bloque oscuro de «material pendiente», incluso si
había fichero. Ahora enseña el material real cuando existe.

Lo que decide **no es una prop**: es `project.media.poster`. Si hay fichero se
enseña el trabajo, y si no lo hay se enseña el bloque con su marca. No existe
el interruptor para pedir «lo real» en una pieza sin material ni para quitarle
la marca a una que la necesita — que era exactamente el razonamiento con el
que se escribió el componente original.

### La franja de clientes, con nombres reales

FABRIK, MONEGROS, HOLIKA, FITZ, GORDO y PROSPA, todos sacados del propio
archivo. Se acabaron los inventados.

**El rótulo de «pendiente de permiso de uso» se queda**, y no por inercia: lo
que falta ya no es el dato, es el permiso. Publicar el nombre de una marca en
una web comercial es usar su marca, aunque sea en texto y no en logotipo.

### Un drone en la regleta

La cabecera de `reglet.tsx` ya definía la línea como «timeline de edición y
traza de vuelo de drone». El playhead era un círculo; ahora es un
cuadricóptero de 16 px que recorre la línea con el scroll y **cabecea tres
píxeles arriba y abajo**, porque un drone parado en el aire no está parado.

Dos grupos anidados y no uno: el exterior lleva la posición sobre la línea
(que cambia en cada fotograma de scroll) y el interior el cabeceo. Si
compartieran `transform`, el scroll pisaría la animación.

Hereda `--color-rust-500`, así que si cambia la paleta el drone cambia con
ella.

Con «reducir movimiento» activado **no cabecea**, pero se sigue viendo y sigue
recorriendo la línea: eso es navegación, no decoración.

### Peso

`public/media/` son 38 MB en el repositorio. Es asumible, pero si el portfolio
crece hay que plantearse sacarlo de git.

---

## 2026-09-10 (9) — «CUÉNTANOS» se partía en «CUÉNTAN / OS»

Apareció comprobando en el navegador el arreglo de hidratación de la entrada
(5). En la página de Contacto, en castellano, el titular no se leía
«CUÉNTANOS / QUÉ EVENTO / TIENES» sino con la primera palabra rota por la
mitad. Es el titular de marca, en la página a la que lleva el botón principal
del sitio.

### Qué pasaba

Los titulares se escriben en los diccionarios como un **array de líneas**, y
cada línea se pinta en su propio `<span class="block">`: la intención es que
cada span ocupe UNA línea. Cuando no cabe, salta el `overflow-wrap: anywhere`
de `.font-display` — que está puesto a propósito como última red de seguridad
para no desbordar la viewport, y cuyo comentario decía que los `clamp` «ya se
calibraron para no llegar a este límite».

Pues se llegaba, por un motivo que no es del copy: **`.text-display-l` mide el
cuerpo de letra contra la VIEWPORT (`6vw`), pero el titular no vive en el
ancho de la página.** Contacto lo mete en `lg:col-span-5`, o sea un tercio
escaso. A partir de `lg` la viewport crece y el cuerpo con ella, pero la
columna no da para tanto:

| viewport | ancho de la columna | cuerpo | resultado |
|---|---|---|---|
| 375 | 335 px | 28 px | bien, 3 líneas |
| **1024** | 333 px | 61 px | **«CUÉNTAN / OS»** |
| **1440** | 506 px | 64 px | **«CUÉNTAN / OS»** |
| 1920 | 706 px | 64 px | bien, 3 líneas |

Es decir: fallaba justo entre 1024 px y ~1900 px, que es donde está la mayoría
de los portátiles — el 1440 de un MacBook incluido. Y no se veía ni en móvil ni
en una pantalla grande, que es donde se suele mirar.

El **pie** tenía lo mismo por otra vía: su lema no está en una columna de
rejilla sino en un ítem flex, y lo que lo aprieta es el hueco que le deja la
tabla de enlaces (276 px a 1024). Ahí se partía «NOCHE».

### Cómo se ha arreglado

Una clase nueva, `.en-columna`, para el titular que **no** ocupa el ancho de la
página. A partir de `lg` le da un `clamp` calibrado contra el ancho real de su
columna en vez del de la viewport. El número se ajusta por sitio con
`--display-en-columna`, porque cada columna es de un ancho distinto: 3.4vw en
Contacto, 4.4vw en el pie.

**Calibrado midiendo, no a ojo.** La medida que importa es *ancho natural de la
línea ÷ cuerpo de letra*, que con una tipografía dada es una constante. Con la
Akira real: «qué evento» ocupa 8.66×, «CUÉNTANOS» 8.25×, «de cada» (pie)
5.97×. De ahí salen los dos coeficientes, con margen para que un cambio de
copy no lo rompa a la primera.

En el pie hizo falta además `lg:shrink-0`. Sin eso había un lazo que no
converge: el ítem flex encoge en proporción a su contenido, así que al bajar el
cuerpo de letra encogía también la caja y el lema seguía sin caber.

**Nada de lo que ya cabía ha cambiado de tamaño.** La regla vive dentro de
`@media (width >= 64rem)` y sólo aplica a quien lleve `.en-columna`:
comprobado que en portada, Trabajo, Servicios y ficha de proyecto los cuerpos
siguen siendo exactamente los de antes (`l:64 m:36 xl:66` a 1440).

### Qué hacer al traerte el repositorio

**Nada.** No hay dependencias nuevas ni pasos extra.

La regla, para no volver a romperlo:

> Si metes un titular `text-display-l` en una columna que **no** es el ancho de
> la página, ponle `.en-columna` y calibra su `--display-en-columna`. Si cambias
> la rejilla de Contacto o el pie, los números de ahora dejan de valer y hay que
> rehacerlos. Está explicado, con el método, en `app/globals.css`.

### Comprobado

Cargando limpio en 375, 768, 1024, 1280, 1440 y 1920 px, en `es` y en `en`, en
portada, Trabajo, Servicios, Contacto, ficha de proyecto y aviso legal:
**ninguna palabra partida por la mitad en ningún sitio**, y ningún desbordamiento
horizontal.

Dos avisos para quien vuelva a medir esto:

- **Redimensionar la ventana del panel de pruebas NO recalcula los estilos.**
  Da valores de la medida anterior y hace creer que algo está roto (o
  arreglado) cuando no lo está. Hay que **recargar** en cada ancho. Pasa con
  cualquier unidad relativa, `vw` incluida — se ve porque `.text-lead` también
  se queda con el valor viejo.
- Un `<span>` de titular que ocupa dos líneas **no siempre es un fallo**: los
  títulos de proyecto («Amanecer en la Tramuntana») fluyen a propósito y no se
  escriben como array. Sólo cuentan los que se pintan con `span.block`.

### Lo que NO se ha tocado, y es una decisión tuya

El titular del **manifiesto** de la portada («LLEGAMOS ANTES / DE QUE ABRAN /
LAS PUERTAS») parte «Llegamos antes» en dos líneas — **entre palabras**, no por
la mitad, así que se lee bien; simplemente no respeta el ritmo de 3 líneas que
marca el diccionario.

No es cuestión de anchos: pasa **también a 375 px**. La línea es más larga que
su bloque a cualquier tamaño, porque Akira Expanded es muy ancha y «Llegamos
antes» ocupa 12.72× el cuerpo de letra mientras el bloque (`max-w-3xl`) da para
648 px. Las salidas son dos, y las dos son de diseño:

1. **Bajar el cuerpo** del manifiesto a ~50 px (de 64). Cabe, pero encoge un 22%
   la frase principal del sitio.
2. **Acortar la línea** en los diccionarios, partiéndola distinto.

Se deja como está a la espera de que se decida. Lo que se ha arreglado aquí es
lo que de verdad estaba roto: la palabra partida por la mitad.

---

## 2026-09-10 (8) — El servidor ya no se queda sin historia

Tocado: `.github/workflows/deploy.yml`.

El rsync del despliegue no excluye el `.git`, así que el que acaba en el
servidor es el del runner. Con el `fetch-depth: 1` que trae `actions/checkout`
por defecto, eso dejaba allí **un clon superficial de un solo commit**.
Comprobado en nastos justo después del despliegue automático de hoy:

```
$ git rev-list --count HEAD
1
```

Que el servidor quede exactamente en el commit publicado es lo que se quiere
—su `git status` vuelve a ser una señal y no ruido— pero sin historia no se
puede mirar allí de dónde viene lo que está corriendo, que es justo lo que hace
falta cuando algo va mal a las tres de la mañana.

Con `fetch-depth: 0` el runner se trae la historia entera y el rsync la lleva.
El repositorio es pequeño; el coste es de segundos.

---

## 2026-09-10 (7) — Clave de despliegue propia para la web

El despliegue automático iba a usar `~/.ssh/nastos_gear_inventario`, que es la
clave del inventario. Funcionaba, y estaba mal: una sola clave abriendo dos
aplicaciones significa que **revocarla las tumba las dos**, justo lo que el
README del inventario dice que hay que evitar.

Ahora la web tiene la suya: `~/.ssh/nastos_web`, ed25519, creada el 2026-09-10
como `github-actions-deploy-web@20260910`, con la pública dada de alta en el
`~/.ssh/authorized_keys` del VPS (que **no** lo gestiona Hestia — comprobado —
así que no lo va a sobrescribir).

Comprobado que entra y que puede hacer lo que el despliegue necesita, y
comprobado también que la del inventario sigue entrando: añadir una clave no
retira las otras.

Para retirarla algún día: borrar su línea de `~/.ssh/authorized_keys` en el
VPS. Nada más.

---

## 2026-09-10 (6) — Un reinicio ya no pelea con el vigilante por el puerto

Tocado: `despliegue/sidebflms-web.sh`, `despliegue/README.md` y `.gitignore`.
Nada de la web en sí.

### Qué cambia

`arrancar`, `parar` y `reiniciar` cogen ahora un cerrojo antes de tocar nada, y
el vigilante del cron lo respeta: mientras hay una operación en marcha no
levanta la web por su cuenta, lo anota y espera al siguiente vistazo.

### Por qué

`publicar.sh` termina llamando a `reiniciar`, que hace `parar` y luego
`arrancar`. Entre las dos cosas la web está caída unos cuatro segundos, y el
vigilante mira cada cinco: en cada publicación había muchas papeletas de que
mirase justo en esa ventana, viera la web caída —correcto— y la levantara
—correcto— a la vez que la levantaba el propio `reiniciar`.

Dos `npm start`, un solo puerto: el que llega tarde muere con
`EADDRINUSE (errno -98)` en `sidebflms-web.log`. Se cura solo —queda un único
árbol `npm` → `sh` → `next-server` escuchando—, así que no se cae nada; el daño
es el registro, que se llena de un error rojo con pinta de grave que no lo es,
justo donde hay que mirar cuando algo va mal de verdad.

Aquí todavía no había pasado nunca (`sidebflms-web.log` tenía **cero**
EADDRINUSE), pero es la misma carrera que sí se estaba viendo en el inventario,
con el mismo código y el mismo cron. Era cuestión de publicar unas cuantas
veces más.

El razonamiento completo, con las medidas de antes y después, está en el
`ACTUALIZACIONES.md` del repositorio del inventario, entrada
«2026-09-10 (2)». El resumen de cómo funciona:

- **Dos cerrojos, no uno.** `.vigilante.lock` es el de siempre y evita que dos
  pasadas del cron se solapen, pero lo coge los 55 segundos que dura la ronda.
  Si las operaciones manuales esperasen a ése, cada publicación se quedaría
  plantada casi un minuto. El nuevo, `.operacion.lock`, protege sólo lo que de
  verdad no puede hacerse dos veces: parar o arrancar.
- Las operaciones manuales lo esperan hasta 90 segundos y, si no lo consiguen,
  **avisan y no siguen**. El vigilante no lo espera nada: si no puede, se
  aparta y lo dice.
- Es reentrante (`reiniciar` lo coge una vez para `parar` y `arrancar`), se
  suelta con `trap` al salir, al fallar y con Ctrl-C o TERM, y si aun así
  quedara huérfano lleva dentro el PID de quien lo cogió: el siguiente
  comprueba si ese proceso existe todavía y, si no, lo retira. Un cerrojo
  eterno sería peor que ninguno.

### El vigilante ahora dice cuándo se aparta

Una línea en `vigilante.log`, y sólo cuando de verdad ha coincidido:

```
[2026-09-10 13:15:08] caída, pero hay una operación en marcha: no me meto
```

Sin ella no habría forma de distinguir *el vigilante se apartó* de *el
vigilante no llegó a mirar*, ni de explicar un hueco de servicio durante una
publicación.

### Comprobado en nastos, no sólo que el script no da error

Seis reinicios seguidos, escalonados para caer en puntos distintos del ciclo de
cinco segundos del vigilante, con el cron corriendo:

| | Resultado |
|---|---|
| EADDRINUSE nuevos en `sidebflms-web.log` | **0 de 6** |
| El vigilante llegó a ver la caída | **2 veces, y se apartó las dos** |
| Procesos escuchando en el 3200 al terminar | 1 |
| `http://127.0.0.1:3200/es` al terminar | 200 |
| `https://sidebflms.com/` por fuera | 401, o sea la contraseña sigue puesta |

Los cerrojos se probaron además por separado, en un directorio de usar y tirar,
contra los seis casos que importan (dos a la vez, reentrada, cerrojo de proceso
muerto, cerrojo de proceso vivo, cerrojo recién puesto, y muerte por TERM).

### El aviso sobre el inventario, que ya no era verdad

La cabecera del script y el `despliegue/README.md` seguían diciendo que
`gear-inventario.sh` mata por nombre de proceso y que **cada despliegue del
inventario tumba esta web**. Eso se arregló allí el 10-09-2026: ahora para por
puerto, igual que este script. Corregido en los dos sitios; un aviso falso en
mayúsculas hace que dejen de leerse los que sí valen.

### Qué hay que hacer al actualizar

Nada. El cron no cambia. Los cerrojos son directorios que se crean solos en la
raíz del repositorio en el servidor, y están en el `.gitignore`.

---

## 2026-09-10 (5) — El error de hidratación: era la transición de ruta

Era el último punto pendiente que quedaba del código (ver la entrada (4)). En
el navegador, **todas** las páginas soltaban el mismo error en consola:

```
Error: Hydration failed because the server rendered HTML didn't match the client
```

### Qué pasaba

`app/[locale]/template.tsx` es el barrido en rust de las transiciones de ruta,
y **envuelve todas las rutas**: por eso el error salía en todas las páginas y
no en una.

Ese componente empezaba mirando la preferencia del equipo:

```tsx
const reduced = useReducedMotion();     // de motion/react
if (reduced) return <>{children}</>;    // ← árbol distinto
```

`useReducedMotion()` lee `matchMedia` **durante el primer render de cliente**
(por dentro es `useState(prefersReducedMotion.current)`, ver
`node_modules/framer-motion/…/use-reduced-motion.mjs`). En el servidor no hay
`matchMedia` que leer, así que allí vale siempre `false`.

Resultado, en un equipo con «Reducir movimiento» activado:

| | Qué renderizaba |
|---|---|
| Servidor | el barrido + el envoltorio del fundido |
| Cliente, primer render | `<main>` pelado |

Dos árboles distintos donde React esperaba el mismo. El diagnóstico exacto lo
daba el propio panel de Next: `+ <main id="main">` contra
`- <div class="…fixed inset-0 …bg-rust-500">`.

**Se reproduce sólo si tienes activado «Reducir movimiento»** (en macOS,
Ajustes → Accesibilidad → Pantalla). Por eso a quien no lo tenga le parecerá
que no pasa nada: no es que esté arreglado a medias, es que la condición no se
da. El aviso *«You have Reduced Motion enabled on your device»* que salía en
consola justo antes del error era la pista.

No tenían nada que ver ni el `proxy.ts`, ni la cookie `sideb_locale`, ni el
`Accept-Language`, ni GSAP, ni `lib/use-media-query.ts` — ese último, de
hecho, está bien hecho: `useSyncExternalStore` usa su *snapshot* de servidor
**también** en el render de hidratación, así que servidor y cliente coinciden.

### Cómo se ha arreglado

El template ya **no mira la preferencia**. Renderiza siempre el mismo árbol,
pase lo que pase, y lo que cambia según «Reducir movimiento» lo aplica el
navegador con una media query en `app/globals.css`, contra dos atributos
nuevos:

| | |
|---|---|
| `[data-route-sweep]` | el barrido en rust → `display: none` |
| `[data-route-fade]` | el envoltorio del contenido → `opacity: 1` |

Ambos con `!important`, que aquí no es pereza: motion escribe `transform` y
`opacity` en el `style` en línea, y una regla de hoja de estilos sólo le gana
así. Sin el `opacity: 1 !important` el contenido se quedaría **invisible**
esperando una animación que no queremos que ocurra.

Que lo decida el CSS y no el JavaScript arregla dos cosas de golpe:

1. **El servidor no tiene que adivinar nada**, que era el origen del problema.
2. **Ya no hay parpadeo.** Antes, aun con movimiento reducido, el barrido
   venía en el HTML del servidor y no se iba hasta que hidrataba: una pantalla
   naranja de cuerpo entero durante un instante. El navegador aplica la media
   query en el primer pintado, así que ahora no llega a verse.

### Qué hacer al traerte el repositorio

**Nada.** No hay dependencias nuevas ni pasos extra: `npm ci` y `npm run dev`
como siempre.

Lo único que conviene saber es la regla, porque volver a romperlo es fácil:

> En `template.tsx` —y en cualquier componente cliente que renderice el
> servidor— **no se puede decidir qué se renderiza mirando algo que sólo
> existe en el navegador**: `matchMedia`, `window`, `navigator`,
> `localStorage`, la hora, un aleatorio. Si el aspecto depende de una media
> query, va en CSS. Si de verdad hace falta en JavaScript, usa
> `lib/use-media-query.ts` y no `useReducedMotion()` de motion.

### Comprobado

Con «Reducir movimiento» **activado**, que es la condición que lo rompía:
portada, `/portfolio` y `/contact`, en `es` y en `en`, más navegación por
enlace y cambio de idioma. Consola limpia en las seis, en `next dev` y contra
`npm run build` + `npm start`. Y con la media query invertida a mano para
simular un equipo sin la preferencia, para ver que el barrido sigue
animándose: sube y desaparece como antes.

Queda en consola un `404` de `/media/reel-720.mp4` en la portada. **No tiene
que ver con esto**: es el vídeo del reel, que todavía no existe (está
señalado como pendiente en `components/sections/hero.tsx`).

---

## 2026-09-10 (4) — Cobertura aérea: confirmado, y fuera el cartel

Mario confirma que **hay piloto certificado**. Era el último TODO marcado como
BLOQUEANTE ANTES DE PUBLICAR.

Lo que se veía hasta ahora: en la página de Servicios, junto al título
«Cobertura aérea», se le pintaba al visitante un **cartel naranja que decía
"Redacción pendiente de verificación"**. Una nota interna, en la web, a la
vista de cualquiera. Ya no está: `pending` pasa a `false` en los dos idiomas.

**La redacción se deja tal cual, genérica a propósito.** Lo confirmado es que
hay piloto certificado, y eso es exactamente lo que el texto dice, ni más ni
menos. Concretar más —la categoría de vuelo, el número de operador, qué se
coordinó con ENAIRE— exigiría sacarlo del papeleo, y eso no se escribe de
memoria: todo el argumento de venta del sitio es "somos los que sí tienen los
permisos", así que es el peor sitio posible para una imprecisión.

Con esto **no queda ningún TODO bloqueante** en el código. Lo que sigue
pendiente es material, no texto: los logos reales de clientes (con su permiso
de uso por escrito), las piezas de vídeo y foto de verdad, y el error de
hidratación.

---

## 2026-09-10 (3) — La dirección de correo, los logos y el compromiso de 24 h

### `hola@` pasa a ser `contact@`

La web anunciaba `hola@sidebflms.com` en el pie, en la página de contacto y en
los dos textos legales. **Ese buzón no existe**: todo el que escribiera ahí a
mano recibía un rebote, y nadie se enteraba de que había escrito.

Cambiado a `contact@sidebflms.com`, que sí existe como buzón en la máquina —
10 sitios entre `es.ts` y `en.ts`. Ahora coincide con el destinatario al que
ya entregaba el formulario, así que hay una sola dirección en todo el sistema
en vez de dos.

Si algún día se cambia la dirección visible, hay que cambiarla **también** en
`lib/correo.ts` (`CORREO_DESTINO`), o vuelve a haber dos y una de ellas
vuelve a ser mentira.

### Los nombres de la franja de clientes

Eran «Festival A», «Club B», «Festival C»… Tan sosos que no dejaban juzgar si
el diseño de la franja funcionaba. Sustituidos por nombres con la forma y la
longitud de wordmarks reales.

**Y son inventados. Ni uno corresponde a un cliente ni a un local que exista.**
Están puestos para ver el diseño. Publicarlos como clientes sería mentir, y el
que suenen creíbles es justo lo que los hace peligrosos: un visitante no puede
distinguirlos de los de verdad.

Por eso el rótulo «Logos pendientes de permiso de uso» **sigue visible debajo**
y no se quita hasta que estén los logos reales. Sigue haciendo falta el
permiso de uso de marca por escrito de cada cliente antes de publicar ninguno
— el brief lo marca como condición, no como formalidad.

### El compromiso de 24 h laborables: confirmado

Era el TODO que quedaba desde el principio. Mario confirma que es real, así
que la frase se queda. Sigue apareciendo una sola vez, en el acuse de recibo.

### El aviso legal se queda como está

Sin CIF ni domicilio, por decisión expresa. Queda incumpliendo el art. 10 de
la LSSI-CE; los sitios donde habría que ponerlos siguen señalados en el código
por si algún día se quiere arreglar.

---

## 2026-09-10 (2) — Los textos, al castellano de España

Todos los cambios son de copy y de textos legales; no se ha tocado nada del
despliegue ni del código.

### El castellano estaba en voseo rioplatense

«Contanos qué evento tenés», «Podés marcar varias», «Elegí una opción»,
«Seguinos», «Filtrá por disciplina», «Probá otra vez»… La empresa es española
y el grueso del tráfico llega de España, donde eso se lee como escrito por
alguien de fuera. Pasado entero a castellano peninsular: 15 cadenas en
`es.ts`.

**Comprobado a 375 px**, que es donde importa: los titulares son arrays de
líneas porque Akira Expanded es extremadamente ancha, y «Cuéntanos» es más
largo que «Contanos». Encaja, y la fuente tiene la É acentuada — que era el
riesgo de verdad, no el ancho.

### El aviso legal: sólo SIDEBFLMS

Tenía `[Razón social] · [CIF] · [Domicilio fiscal]` sin rellenar. Por decisión
de Mario se queda **sólo «SIDEBFLMS»** y los otros dos se quitan *de momento*.

**Que conste, porque no es gratis:** el art. 10 de la LSSI-CE obliga a que un
sitio comercial publique nombre, NIF y domicilio de quien lo opera. Sin ellos
el aviso legal **no cumple**. Cuando se quieran poner, están señalados con un
comentario en `es.ts` y en `en.ts`, en el aviso legal y en el responsable de
la política de privacidad.

### La privacidad decía que la web está en Vercel, y ya no lo está

Decía «El sitio se aloja en Vercel Inc., que actúa como encargado del
tratamiento». Desde el despliegue de hoy eso es **falso**, y en un documento
legal un dato falso es peor que un hueco.

Comprobado quién es el proveedor real antes de escribirlo (RDAP de la IP
161.97.179.70): **Contabo GmbH, Alemania**. Así que ahora dice eso, y que los
datos no salen de la Unión Europea — que además es verdad y es información que
al visitante le sirve.

También se quitó el `[12]` de los corchetes del plazo de conservación: son 12
meses.

### La línea del aéreo ya dice algo

En la pieza destacada, la fila «Aéreo» decía literalmente «Redacción pendiente
de verificación» — visible en la web. Ahora dice **«Un drone por encima del
aforo»**.

Eso respeta el TODO original, que prohibía publicar afirmaciones sobre
permisos de vuelo sin el papeleo delante: esta frase describe el plano y no
afirma nada sobre categoría ni autorizaciones.

**Sigue pendiente** el bloque de «Cobertura aérea» en Servicios, que sí dice
«piloto certificado» y sigue sin contrastar.

### La promesa de 24 h estaba dos veces

Aparecía en la introducción de Contacto y otra vez en el acuse de recibo. Se
queda sólo en el acuse, que es donde el visitante la necesita — acaba de
enviar y quiere saber cuándo le contestan. Sigue **sin confirmarse que sea
real**; hay una nota en el código junto a la frase.

### Ojo, un fallo que ya venía de antes

Las páginas dan un **error de hidratación** de React en el navegador.
Comprobado que **no lo provocan estos cambios**: sale igual con el código
original (probado apartando los cambios con `git stash`). No se ha tocado,
pero está ahí y conviene mirarlo antes de abrir la web al público: en
producción hace que React vuelva a dibujar en el cliente, y eso se ve como un
parpadeo.

---

## 2026-09-10 — La web se publica en nastos

Hasta ahora esto era un proyecto que sólo corría en el portátil de quien lo
estuviera tocando. Ahora vive en el VPS **nastos.barrasa.dev**, detrás de
`sidebflms.com` y **con contraseña** mientras no se abra al público.

### Qué hacer si te traes el repositorio

1. `npm ci` — hay una dependencia nueva (`nodemailer`).
2. Nada más para desarrollar: `npm run dev` sigue funcionando igual. El
   formulario de contacto intentará enviar correo por `127.0.0.1:25`, no lo
   conseguirá en tu máquina, y lo dirá en la consola. Es lo esperado.
3. Si vas a tocar el despliegue, lee **`despliegue/README.md`** entero antes.

### Lo nuevo

**`despliegue/`** — todo el montaje del servidor. Es una copia adaptada del de
`gear.sidebflms.com`, que ya llevaba meses funcionando en la misma máquina, y
por las mismas razones: el usuario `bote` no tiene sudo ni Docker, así que no
hay systemd ni contenedores. Un proceso Node en `127.0.0.1:3200`, Apache
delante a través de un `proxy.php`, y un vigilante en el cron cada minuto.

Tres cosas que **no** son copia:

- **`sidebflms-web.sh` para el proceso por PUERTO**, no con
  `pkill -f next-server` como hace el del inventario. Da igual el nombre del
  proceso: se pregunta quién escucha en el 3200 y se mata a ése.

  *Por qué importa:* ahora hay **dos** aplicaciones Next.js con el mismo
  usuario en la misma máquina. Un `pkill` por nombre mata las dos. (Y eso es
  exactamente lo que sigue haciendo `gear-inventario.sh`, así que cada
  despliegue del inventario tumba esta web unos segundos hasta que el
  vigilante la repone. Conviene arreglarlo en aquel repositorio.)

- **La contraseña se activa con la sola presencia de un fichero.** Si existe
  `public_html/.htpasswd`, Apache la pide; si no, la web es pública. El
  bloque va dentro de un `<IfFile>`, y eso no es adorno: sin él, un
  `AuthUserFile` apuntando a un fichero que no está da **500 en toda la web**,
  no «sin contraseña».

  Y el despliegue **cambia lo que sirve** según eso. Con contraseña no deja ni
  un fichero estático en `public_html`, porque nginx los serviría sin pasar
  por Apache y las imágenes y los vídeos quedarían descargables saltándose la
  puerta. Sin contraseña sí los deja, y entonces nginx los sirve desde disco
  con `expires max` sin despertar a PHP ni a Node.

- **El despliegue automático empuja, no tira.** El workflow del inventario
  hace `git pull` dentro del servidor, lo que obliga a darle al servidor una
  deploy key de GitHub. Aquí el runner ya tiene el código y ya tiene llave del
  VPS: se lo lleva con rsync. Una credencial menos que crear y que rotar.

### El formulario de contacto ahora envía de verdad

**Antes no enviaba nada.** Validaba, decía «Recibido» al visitante, y escribía
la consulta en el log del servidor. Cualquiera que rellenara el formulario se
perdía sin que nadie se enterara — ni el visitante, que veía un acuse de
recibo, ni nosotros. El propio código lo tenía marcado como bloqueante.

Ahora va por SMTP contra el **Exim de la propia máquina**, sin proveedor
externo ni claves de API: el buzón de destino está en ese mismo servidor, así
que es entrega local y el mensaje ni sale a internet.

Dos detalles que parecen menores y no lo son, explicados en `lib/correo.ts`:

- El **`From` es nuestro y el visitante va en `Reply-To`**. Poner al visitante
  en el `From` es lo intuitivo, y es justo lo que el SPF de *su* dominio
  prohíbe: nuestro servidor no está autorizado a mandar correo en nombre de
  gmail.com. Acabaría en spam. Al responder desde el buzón, la respuesta le
  llega igual.
- **Si el envío falla, el formulario lo dice.** La pantalla ya sabía mostrar
  un error general; ahora se usa. Es mejor pedirle al visitante que escriba a
  mano que decirle «recibido» y perder la consulta.

Se configura por `~/sidebflms-web/.env` en el servidor, y es opcional:
`CORREO_DESTINO`, `CORREO_REMITENTE`, `SMTP_HOST`, `SMTP_PORT`. Sin fichero,
todo va a `contact@sidebflms.com` por `127.0.0.1:25`.

### `public/__mockup-preview.html` sale de `public/`

Está ahora en `docs/mockup-final.html`. Todo lo que hay en `public/` lo sirve
Next.js en internet tal cual, así que cualquiera podía abrir
`https://sidebflms.com/__mockup-preview.html` y bajarse 3,5 MB con la fuente
comercial **Akira Expanded incrustada en base64** dentro. No se ha borrado —
sigue a mano para consultarlo—, sólo se ha sacado de lo que se publica.

### Pendiente, y bloquea abrir la web al público

- **`hola@sidebflms.com` no existe.** La web lo anuncia en el pie, en la
  página de contacto y en los textos legales. Quien escriba ahí a mano recibe
  un rebote. Hay que crear el buzón en Hestia o cambiar los textos. El
  formulario, mientras tanto, entrega en `contact@`, que sí lo lee alguien.
- **Los textos legales tienen huecos sin rellenar**: `[Razón social]`,
  `[CIF]`, `[Domicilio fiscal]`. En España esos datos en el aviso legal son
  obligatorios (LSSI-CE).
- **Los textos en castellano están en voseo rioplatense** — «Contanos qué
  evento tenés», «Podés marcar varias», «Elegí una opción», «Seguinos». La
  empresa es española y el grueso del tráfico llega de España, donde eso se
  lee como escrito por alguien de fuera.
- **La promesa de «respondemos en 24 horas laborables»** aparece dos veces y
  el propio código la marca como pendiente de confirmar. Si no es real, hay
  que quitarla, no rebajarla.
