# Actualizaciones

Qué cambió, por qué, y qué hay que hacer al traerse el repositorio. Lo más
reciente arriba.

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
