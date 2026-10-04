# Actualizaciones

Qué cambió, por qué, y qué hay que hacer al traerse el repositorio. Lo más
reciente arriba.

---

## 2026-10-04 (143) — Formularios: avisan al salir del campo y quitan el aviso al corregir

Salido de las auditorías de diseño (VectorLab `forms`): los dos formularios (contacto y
«trabaja con nosotros») solo validaban en el servidor, al enviar. Quien se equivocaba en
el correo se enteraba al final, y el aviso seguía ahí aunque ya lo hubiera corregido,
hasta el siguiente envío.

**Cómo se comporta ahora**
- Al **salir de un campo** (nombre, email, nombre del evento) en el que ya se escribió
  algo, si no vale se avisa en el acto, con el mismo mensaje y `role="alert"` de siempre.
  Pasar por un campo con el tabulador sin tocarlo **no** avisa: ya lo dirá el envío.
- Al **escribir** en un campo con aviso, el aviso se quita al instante (y se vuelve a
  comprobar al salir). Las casillas (consentimiento, especialidad) pierden el aviso al
  marcarlas; no se validan al salir.
- Tras un envío rechazado por el servidor, **sus errores mandan** y todo lo demás sigue
  como antes: se conserva lo escrito y el foco va al primer campo con error.

**Cómo está hecho:** un hook compartido `useErroresEnVivo` en `lib/use-formulario.ts`
(un manejador en el `<form>`, sin tocar cada campo) y `reglas.requerido` / `reglas.correo`.
El validador de correo se movió a `lib/email-valido.ts` —antes vivía en
`lib/formularios.ts`, que es solo de servidor— para que el navegador y el servidor
apliquen **la misma regla**; `lib/formularios.ts` la sigue exportando, así que las dos
acciones del servidor no cambian.

**Comprobado en un Chrome real, escribiendo y tabulando** (sin enviar ningún formulario
válido, así que no sale ningún correo): email «abc» → sin aviso mientras se escribe, aviso
al salir; completarlo a «abc@x.es» → el aviso se va al teclear; nombre sin tocar → sin
aviso; envío incompleto → errores del servidor, email conservado y foco en el nombre;
escribir el nombre → su aviso se va; marcar consentimiento y especialidad → sus avisos
se van; en «trabaja con nosotros», email «mal» → aviso al salir. `tsc` y `eslint` limpios.

**Al actualizar:** nada especial. Si al fusionar hay un conflicto en este archivo con
otra entrada, se conservan las dos.

## 2026-10-04 (141) — Pulido táctil en móvil: scroll, toque, logo y cursor traducido

Salido de la segunda opinión de diseño (reglas de Vercel, VectorLab y redesign) sobre
el código de la web. Cuatro cambios pequeños; no cambia la estética.

**1. `overscroll-behavior: contain` en el menú móvil y en el modal del reel**
(`header.tsx`, `reel-modal.tsx`): el scroll del menú ya no se «cuela» a la página que
hay detrás al llegar al final. Medido: el menú abierto devuelve `contain`.

**2. `touch-action: manipulation`** en enlaces, botones, resúmenes, etiquetas y campos
(`app/globals.css`): quita el retardo del doble toque para ampliar en lo que se pulsa;
el pellizco para ampliar la página sigue funcionando. Ningún componente declaraba su
propio `touch-action`, así que no pisa nada.

**3. Zona táctil del logo de la cabecera** (`header.tsx`): de 166×14 px a 166×44 px en
móvil (54 px en escritorio) con `py-[15px]` dentro de una barra que ya medía 64 px; la
barra no cambia de alto ni el logo de sitio. Medido en 20 combinaciones.

**4. Rótulo del cursor sobre «Ver reel»** (`hero-frame.tsx`): estaba fijo en inglés
(«Play») también en la web en español; ahora sale del diccionario («Reproducir» / «Play»).

**Comprobado:** sin desbordamiento horizontal a 320, 375, 430 y 1024 px en portada
(es y en), servicios, contacto y portfolio; cabecera de 64 px en todas; `eslint` y
`tsc` limpios.

**Revisado y NO incluido, y por qué:**
- Estado vacío del filtro de trabajo con salida: no es alcanzable; el filtro oculta a
  propósito las disciplinas sin proyectos (decisión de 2026-10-01).
- `env(safe-area-inset-*)`: sin `viewport-fit=cover`, Safari ya mantiene el contenido
  dentro del área segura; añadirlo no hace nada.
- Estado de pulsación (`:active`): los componentes `Button` solo se usan en la 404; casi
  todos los CTA llevan clases en línea. Haría falta antes un componente de botón común.
- Validación de formularios al salir del campo: cambia comportamiento; irá en su propia PR.

**Al actualizar:** nada especial; solo CSS y clases de Tailwind.

## 2026-10-04 (140) — Legibilidad: cuerpo móvil a 14 px, «Saltar» legible y rótulos mínimos

Salido de la primera auditoría de diseño de la web (skill `sidebflms-design`). Las
decisiones de tamaño se tomaron con el criterio de la skill de diseño «taste» y
midiendo el efecto real en producción antes de tocar nada.

**1. Cuerpo de texto en móvil: 12 px → 14 px** (`app/globals.css`, `body` y `.text-lead`).
La decisión del cliente del 2026-09-17 era «en móvil no debe medir lo mismo que en
escritorio y alargaba las tarjetas»; se mantiene la diferencia (14 móvil / 17 desde
tableta) y se mantiene «un solo tamaño para todo lo que no es titular» (cuerpo y
entradilla suben a la vez). 12 px era ilegible; 16 px (lo que pide taste) se probó y se
descartó: alargaba las tarjetas de servicios y las fichas de proyecto un 15-16 %. A 14 px
las páginas crecen entre un 1 y un 5 % y Montserrat, ancha, se lee bien.
Medido a 320, 375 y 430 px en portada, servicios, contacto y sobre nosotros: sin
desbordamiento horizontal y todo texto de más de 40 caracteres a 14 px como mínimo.

**2. Botón «Saltar» de la intro** (`.intro-casete-saltar`): el texto pasa de `rust-500`
(#e8451d, 4,2:1) a `rust-300` (#ff6a3d, 5,9:1). A 12 px es texto pequeño y, según la
tabla de contraste del propio CSS, `rust-500` solo vale para display grande. El casete,
el fondo y el anillo de foco siguen en `rust-500`.

**3. Rótulo «So far in 2026» / «En lo que va de 2026»** de la muesca de cifras en
escritorio (`hero-frame.tsx`): 10 px → 12 px.

**4. Pastillas secundarias de Contacto en móvil** («Solicitar presupuesto», «FAQ»;
`contacto/comun.tsx`): 10 px → 11 px. A 320 px la más ancha termina en 300 px: caben.

**Lo que NO se ha tocado, y por qué:** los ~40 rótulos de 9-11 px del lenguaje «HUD»
(numeraciones «01 / 23», contadores de filtros, marcas de timecode). Son decorativos o
redundantes y parte de la estética; taste pide además poca etiqueta en mayúsculas, no
más. Regla fijada en la skill: decorativo/redundante puede quedarse en 10 px; lo que
informa o se pulsa, mínimo 11-12 px.

**Al actualizar:** nada especial; solo CSS y una clase de Tailwind.
## 2026-10-04 (139) — SEO de «drone Madrid»: título, descripción, preguntas, datos estructurados y enlaces desde las fichas

La parte de código del plan para posicionar «drone madrid» (la parte de Mario: ficha
de Google Business, reseñas y enlaces entrantes, sigue pendiente). Todo sale de lo
que el sitio YA dice; no se añade ningún dato nuevo.

1. **Título de la página de Madrid** (`app/[locale]/ciudad-drone/[ciudad]/page.tsx`):
   «Grabación con drone en Madrid: cine y publicidad — SIDEBFLMS» (60 caracteres) y
   «Drone filming in Madrid for film and advertising — SIDEBFLMS». **Sólo Madrid:**
   tiene un encargo publicitario real (MITT MOTORS); Barcelona es un festival y
   Mallorca, material de recurso, y un título que prometiera publicidad ahí no sería
   verdad (se probó primero con las tres y se corrigió). Barcelona y Mallorca
   conservan el suyo de antes.
2. **Descripción de Madrid**, escrita en el código (152 y 151 caracteres) en vez de
   salir de la `intro` del panel, que no decía «drone» ni a qué se dedica la empresa:
   «Grabación con drone en Madrid para cine, publicidad y eventos: estadios, clubes
   y la ciudad desde el aire. Operador UAS dado de alta en AESA desde 2022.»
3. **Bloque «Preguntas sobre drone en Madrid»** (4 preguntas, `drone.madridFaq` en
   `es.ts`/`en.ts`): permiso para volar (alta en AESA desde 2022, zonas restringidas
   y aeropuerto en preproducción), desde dónde se trabaja (el equipo vive en Madrid),
   qué se ha rodado (vuelo del Metropolitano en un plano, MITT MOTORS, postales
   aéreas) y cómo pedir presupuesto. Visible en la página y como `FAQPage`. Google
   ya no suele mostrar el desplegable de FAQ, pero es texto con las preguntas que
   la gente teclea.
4. **Datos estructurados `Service`** en las tres páginas de ciudad, con su zona de
   servicio (`areaServed: City`).
5. **Enlace desde cada ficha de drone a la página de su ciudad**
   (`portfolio/[slug]/page.tsx`, `ficha-proyecto.tsx`, `detail.cityLink`):
   «Grabación con drone en Madrid», que sale de la lista de proyectos que ya pinta
   cada ciudad (Metropolitano, Cuatro Torres… a Madrid; DURO a Barcelona); las
   fichas que no son de drone (Prospa, FITZ…) no llevan ese enlace.

**Ojo:** el TEXTO largo de las ciudades vive en el panel (`/admin`, ciudades) y manda
sobre el código; aquí no se ha tocado. Lo que SÍ se ve en producción es todo lo
anterior (título, descripción, preguntas, enlaces, datos estructurados).

**Qué hacer al actualizar:** nada. Comprobado en local (JSON-LD parseado, títulos y
descripciones medidos, enlaces correctos en 5 fichas, captura del bloque a 1280 y
375 px sin desbordes ni errores de hidratación; `tsc` y `eslint` limpios). Los
títulos de ciudad ya indexados tardarán unos días en reflejarse.

---

## 2026-10-03 (138) — Seguridad: nodemailer y undici parcheados, y GraphQL cerrado a propósito

Issues #6 y #8 de la ronda de auditoría. `npm audit --omit=dev` pasa de **15 avisos
(2 altos) a 7 (0 altos)**.

**1. `nodemailer` 10.0.3 → 10.0.13** (dependencia directa, la del correo de los
formularios). Tenía 3 avisos altos (recursividad cuadrática en el analizador de
direcciones, denegación de servicio) y uno moderado. Es un salto de parche dentro
de la misma versión mayor. Comprobado que el transporte y `sendMail` siguen
funcionando (`jsonTransport`); no se ha mandado ningún correo real.

**2. `undici` 7.29.0 → 7.30.0 por `overrides`** (`package.json`). Lo trae `payload`
fijado a 7.29.0 (también en su última versión, la 3.90.2, así que subir Payload no
lo arregla) y tenía 8 avisos, 3 de ellos altos (validación de certificados TLS,
denegación de servicio por WebSocket). `overrides` obliga a la versión parcheada
sin tocar Payload. Es un salto de parche. Comprobado con una compilación de
producción local completa y arrancada: portada, portfolio, contacto, candidaturas,
servicios, `/admin`, sitemap y `robots.txt` responden 200, la API REST sigue
funcionando (la sesión devuelve 200 y un listado sin permisos, 403) y el registro no
trae errores salvo ese 403 esperado. El `package-lock.json` sólo cambia esas dos
entradas y conserva los 38 `libc`.

**3. GraphQL cerrado** (`payload.config.ts`, `graphQL: { disable: true }`). Issue #6:
se sospechaba que la introspección de GraphQL estaba expuesta. NO lo estaba:
Payload la apaga en producción por defecto (`disableIntrospectionInProduction: true`,
que el issue no encontró), y además `/api/graphql` ni siquiera funciona: el
esquema no llega a construirse («Schema must contain uniquely named types but
contains multiple types named "Texto"») y contestaba 500. Nadie lo usa (el panel va
por REST, la web por la API local). Se cierra explícitamente para no depender de
ese fallo: ahora `POST /api/graphql` da 404.

**Lo que queda en `npm audit` (7, ninguno alto):** `esbuild` (cadena de
`drizzle-kit`, herramienta de migraciones que sólo corre en desarrollo y en el
despliegue, no sirve nada al público; arreglarlo exige bajar Payload a 3.85.1) y
`dompurify` (bajo, vía Payload). Siguen anotados en el issue #8.

**Qué hacer al actualizar:** nada; el despliegue hace `npm ci` porque cambia el lock.

---

## 2026-10-02 (137) — Los formularios ya no pierden lo escrito tras un error, y errores accesibles

**El fallo (comprobado en local con un Chrome real).** Si el servidor rechazaba un
envío (un email sin arroba, el consentimiento sin marcar), React 19 VACIABA todo el
formulario: nombre, email, nombre del evento y el mensaje quedaban en blanco, y el
foco caía en `<body>`. Para quien pide presupuesto es perder lo escrito. Los
errores tampoco se anunciaban a lectores de pantalla (WCAG 3.3.1, 4.1.3).

**Arreglo** (contacto y «trabaja con nosotros»):
- `lib/formularios.ts` (`valoresDe`) + `lib/use-formulario.ts` (nuevo): la acción
  devuelve en `values` lo recibido (sin el honeypot ni campos internos) y un efecto
  lo vuelve a poner DESPUÉS de que React vacíe el formulario, incluidas casillas y
  botones de radio. Funciona igual si falla el correo o el freno de envíos.
- El mismo efecto manda el foco al primer campo con error (antes, a `<body>`).
- Los mensajes de error por campo llevan `role="alert"`; el aviso de «enviado»
  recibe el foco al aparecer (el botón que lo tenía ha desaparecido).
- Contacto marca los obligatorios con `*` y lo explica arriba («Los campos con * son
  obligatorios»); antes los opcionales llevaban un « ·» que no decía nada.

**Voz hacia cine y publicidad** (`es.ts` / `en.ts`): «Cuéntanos qué evento tienes» →
«Cuéntanos qué proyecto tienes» (Contacto y las tarjetas de contacto de servicios y
Nosotros), «Nombre del evento» → «Nombre del proyecto o evento», «Aforo» y
«Escenarios» con «(si aplica)», y el texto de apoyo habla de fechas y localizaciones
antes que de aforo. Mismo cambio en inglés.

**Ojo, no se ve en producción: las preguntas del FAQ.** Las respuestas del FAQ salen
del PANEL (`/admin`, colección de preguntas), que manda sobre el diccionario; los
textos nuevos de `es.ts`/`en.ts` sólo valen de respaldo. Para que cambien hay que
editar esas dos respuestas en `/admin`: «¿Qué hacéis exactamente?» («Rodamos para
cine, publicidad y eventos: drone, multicámara, aftermovies y fotografía.
Normalmente un mismo equipo cubre todo el encargo, no una pieza suelta.») y «¿Qué
necesitáis para darme un presupuesto?» («Fecha, localización y qué tipo de
cobertura quieres; y, si es un evento, aforo estimado y número de escenarios.
Con eso sale un presupuesto cerrado. …»).

**Qué hacer al actualizar:** nada. Comprobado: contacto y candidaturas conservan
nombre, email, mensaje, casillas y radios tras un error, con el foco en el primer
campo con error y `role="alert"`; `tsc` y `eslint` limpios. **No probado:** el envío
correcto (mandaría un correo real) ni lectores de pantalla (VoiceOver).

---

## 2026-10-02 (136) — Lote «fácil» de la segunda auditoría: contraste de campos, selector de idioma, titulares, SEO de fichas

Seis cambios pequeños, todos comprobados en local (Chrome real y `curl`).

1. **Bordes de los campos del formulario** (`components/ui/campos-cristal.ts`): de
   `white/12` (1,7:1, casi invisibles; WCAG 1.4.11 pide 3:1) a `white/35`, y el hover
   a `white/55`. Afecta a los campos y a las pastillas de «tipo de cobertura»:
   ahora se ven con su contorno claro.
2. **Selector de idioma y rutas internas** (`lib/routes.ts`, `translatePath`;
   `proxy.ts`). `usePathname()` devuelve la carpeta física tras los `rewrites`
   (`/en/drone`, `/en/ciudad-drone/madrid`), así que el selector mandaba a
   `/es/drone` y `/es/ciudad-drone/madrid` (direcciones viejas). Ahora lleva a
   `/es/grabacion-con-drone`, `/es/grabacion-con-drone-madrid`, etc. Además
   `/es|en/ciudad-drone/<ciudad>` ya no sirve 200: da **301** a la dirección
   buena (como ya hacían `/es/drone` y `/es/services`).
3. **Titulares con espacio entre líneas** (14 ficheros + `nosotros/comun.tsx`):
   «Lo que» + «hemos rodado» salía «Lo quehemos rodado» en el texto plano
   (lectores de pantalla, texto extraído). Cada línea lleva ahora un espacio al
   final (`{" "}`); visualmente no cambia nada (son `block`).
4. **Imagen para compartir por ficha** (`lib/metadata.ts`, parámetro `imagen`;
   `portfolio/[slug]/page.tsx`): `og:image` y `twitter:image` pasan a ser el póster
   de la propia ficha (`/api/media/file/...`, que Google ya puede ver tras la 131)
   en vez del logo genérico. Las demás páginas siguen con la imagen de marca.
5. **`lastmod` en el sitemap** de las 46 URLs de fichas (`app/sitemap.ts`,
   `lib/contenido.ts`, tipo `Project.actualizado`): la fecha REAL de la última
   edición en el panel (`updatedAt`). Las páginas estáticas no llevan, y si el
   proyecto viene de los ficheros de respaldo tampoco: sin fecha antes que con una
   inventada. Ojo: si una importación masiva tocó todo a la vez, las fechas
   coincidirán (es lo que dice la base).
6. **Enlaces internos desde las fichas** (`ficha-proyecto.tsx`, y dos textos nuevos
   en `es.ts`/`en.ts`, `detail.moreDrone` y `moreServices`): «Ver todos los
   servicios» siempre y «Más sobre grabación con drone» sólo en las piezas que
   llevan la categoría drone (también MITT MOTORS, que la declara). Antes la página
   de drone recibía un solo enlace interno. Enlaces de 44 px de alto.

**Qué hacer al actualizar:** nada. **Ojo con la caché de Google:** el `og:image` y
los 301 tardan en reflejarse; para ver la imagen nueva al compartir en
WhatsApp/LinkedIn puede hacer falta «volver a obtener» la URL en sus depuradores.

---

## 2026-10-02 (135) — Tarjeta de contacto al final de las fichas y zonas pulsables de 44 px

Revisión de lo que pidió la auditoría de otro chat (2026-10-02). Medido en
producción a 375 px con un Chrome real antes de tocar nada.

1. **Las fichas de proyecto acaban con la tarjeta «Cuéntanos qué quieres grabar»**
   (`components/sections/proyecto/ficha-proyecto.tsx`). Terminaban en
   «anterior / siguiente» y el pie, sin invitar a pedir presupuesto, cuando todas
   las demás páginas (portada, FAQ, drone, ciudades, servicios, Nosotros) ya la
   llevan y la ficha es donde más convence. Es el mismo componente (`ContactCta`)
   con los textos de la página de drone. Para que la tarjeta, que lleva su propio
   `shell`, no sume dos márgenes, el `shell` de `<main>` baja a un `div` interior;
   el aspecto del resto no cambia (`.shell` y `.pagina` son independientes).
2. **«← Volver al trabajo» de la ficha en móvil**: medía 14 px de alto (único objetivo
   por debajo del mínimo de 24 px de WCAG 2.5.8). Ahora tiene 44 px de zona pulsable
   con un `::after` invisible, sin mover nada (comprobado con `elementFromPoint`).
3. **Filtros del portfolio en móvil** (`trabajo-feed.tsx`): texto de 11 a 12 px (el
   contador de 10 a 11) y zona pulsable de 44 px con el mismo truco. Como la lista
   tiene `overflow-x-auto` y eso también recorta en vertical, se reservó el hueco
   con relleno y margen negativo en el `ul`: las pastillas siguen en el mismo sitio
   (arriba 315 px en los dos, antes y después) y el contenido de debajo se mueve 1-2
   px. Las pastillas quedan 2 px más bajas (32 en vez de 34) porque el interlineado
   deja de heredarse.
4. **Botones redondos de sonido (tarjetas del portfolio) y de ver, sonido y
   pantalla completa (ficha)**: de 40 × 40 a 44 × 44 px (`h-11 w-11`).

**No se ha tocado:** el resto de textos de 10 a 11 px (etiquetas «REC», contadores,
marcas de categoría) por ser parte del estilo de la web, y las marcas de
categoría de 30 px de alto (pasan el mínimo de 24).

**Qué hacer al actualizar:** nada. Comprobado en local con un Chrome real a 375 y a
1280 px: la tarjeta sale y enlaza a Contacto, sin desbordes; el enlace de volver
responde a ±15 px; los filtros a ±4 px; `tsc` y `eslint` limpios.

---

## 2026-10-02 (134) — Se retira el botón «Contacto» de la cabecera móvil: dejaba el «Menú» fuera de la barra

**Qué pasó.** La 127 (punto 1) añadió un botón «Contacto» a la barra flotante del
móvil y dejó «Menú» sólo con el icono. Lo vio otra revisión de la web el
2026-10-02: en producción, a 360, 375, 390 y 412 px el botón de menú (48 px) quedaba
FUERA de la barra: a 375 px se veían 21 px y a 360 px, 6. Sin ese botón no se puede
abrir el menú en esas páginas, que son la mayoría de móviles. Medido con un Chrome
real en producción antes del arreglo (`menu: [354,402]` con la barra acabando en
355) y después en local.

**Causa, y mi fallo.** Comprobé que «cabía» a 375 px midiendo el ancho de cada
elemento, pero el logo estaba siendo ENCOGIDO (119 px en vez de sus 174 px, o sea
deformado). Luego le puse `shrink-0` para que no se deformara y ya no cabía: logo
174 + contacto 108 + menú 48 + huecos > 335 px de barra. No volví a medir a 375
después de ese último cambio.

**Arreglo.** Se revierte la cabecera móvil a como estaba antes de la 127
(`components/layout/header.tsx`): sólo «Menú» (con su texto y su icono) y sin
`shrink-0` en el logo. Medido en local en `/es/servicios` y `/es/portfolio` a 320,
360, 375, 390, 412, 430 y 768 px: el botón de menú queda siempre dentro de la barra,
y no hay desbordes. El logo se estrecha un poco en pantallas pequeñas (166 px a 375),
como siempre.

**Lo que se pierde:** el acceso a Contacto en un solo toque desde la barra del
móvil (la 127, punto 1). Contacto sigue a dos toques (Menú, Contacto). Si se quiere
recuperar, no cabe en una barra de 335 px sin quitar o reducir el logo: es decisión
de diseño, no un ajuste de clases.

**Qué hacer al actualizar:** nada.

---

## 2026-10-01 (133) — Foco del teclado en el menú y el reel, y cinco contrastes

De la auditoría de accesibilidad (WCAG 2.2 AA). Para quien navega con ratón o con
el dedo no cambia nada del funcionamiento; los contrastes son un ajuste de claridad
de pocos puntos.

**Foco del teclado.** El menú móvil y el reel eran `role="dialog" aria-modal="true"`,
pero `aria-modal` no bloquea nada: con Tab el foco se escapaba a la página de
detrás (que no se ve) y al cerrar no volvía al botón que lo abrió.
- `lib/aisla-fondo.ts` (nuevo): al abrir un diálogo, marca como `inert` todo lo que
  hay detrás (foco, clics y lectores de pantalla). Sube desde el diálogo hasta el
  `<body>`, así que vale tanto para el reel (portal) como para el menú. Sólo
  deshace lo que marcó él: la barra de arriba ya lleva su propio `inert` cuando
  está escondida y no se le quita.
- `components/layout/header.tsx` (menú) y `components/glass/reel-modal.tsx`: usan
  `aislaFondo` y, al cerrar, devuelven el foco al elemento que tenía antes
  (el botón «Menú», el botón «Ver reel»).

**Contrastes** (cálculos sobre los colores reales de `app/globals.css`):
| Qué | Antes | Ahora |
|---|---|---|
| Enlace «Saltar al contenido» (`layout.tsx`) | bone sobre rust-500: 3,38 | sobre `brand-600`: 4,57 |
| Texto de ejemplo en los campos (`campos-cristal.ts`) | smoke/70: ~3,1 | `bone/55`: ~4,8 |
| Marca «Opcional» de candidaturas (`jobs-form.tsx`) | smoke/60: ~2,6 | `bone/55`: ~4,9 |
| Etiqueta «TC» del reel (`hero-frame.tsx`) | smoke/50: ~2,2 | `smoke` |
| `--color-smoke` sobre tarjetas (`globals.css`) | #8f8a85: 4,43 sobre ink-700 | #938e89: 4,66 |
La regla de la casa ya decía «smoke NUNCA con opacity»; esos tres la incumplían.
Subir `--color-smoke` toca todos los textos secundarios de la web, de forma casi
imperceptible (un punto de claridad).

**Comprobado** en local con un Chrome real (Tab, Enter y Escape): el menú móvil
abre con el foco en «Cerrar», 14 Tab seguidos sólo recorren el menú (los enlaces,
las redes, «Cerrar»; el resto es la barra del navegador, nunca la página), Escape
cierra y el foco vuelve al botón «Menú», y no queda nada inerte por error. Igual con
el reel («Ver reel»). `tsc` y `eslint` limpios.

**Qué hacer al actualizar:** nada. **No medido:** el texto sobre el vídeo de la
portada (depende de cada imagen) y lectores de pantalla reales (VoiceOver).

---

## 2026-10-01 (132) — Lote de textos de la segunda auditoría

Sólo lo que es objetivo o ya estaba acordado; lo que depende de datos o de una
decisión de Mario NO se ha tocado (ver el final).

1. **Plazo de entrega unificado a «24-48 horas».** «Nosotros» decía «Entregamos
   en 48 horas» (`content/dictionaries/es.ts` y `en.ts`) y Servicios, FAQ y Drone
   decían «24-48 horas»: ahora dicen lo mismo en todas partes.
2. **«drone», no «dron»** en la sección de permisos de la página de drone (5
   apariciones en `es.ts`; en el resto de la web ya era «drone», que es lo que
   la gente busca y lo que lleva el título de la página).
3. **«solo», sin tilde** (`es.ts`, 4 líneas de texto visible): la RAE lo pide
   desde 2010 y la web mezclaba las dos grafías. Sólo se tocaron cadenas de texto
   visibles, ni comentarios ni código.
4. **El filtro del portfolio ya no enseña categorías vacías**
   (`components/sections/trabajo/medios.ts`, `opcionesFiltro`, que usan el feed
   móvil y el reproductor de escritorio). Salía «Cine 0» en una web que se
   posiciona en cine y publicidad, y al pulsarla decía «no hay proyectos». En
   cuanto un proyecto lleve la categoría «Cine» en el panel, la pestaña aparece
   sola.
5. **Títulos de las 23 fichas de proyecto**
   (`app/[locale]/portfolio/[slug]/page.tsx`, `tituloDeFicha`). Antes
   «Metropolitano — SIDEBFLMS» (25 caracteres, sin ninguna palabra que dijera qué
   es) y, en los nombres con raya larga, dos rayas («Adrián Mills — Area 19 —
   SIDEBFLMS») sin saber cuál separaba la marca. Ahora «Metropolitano: grabación
   con drone — SIDEBFLMS»: el nombre (su raya interna pasa a coma), la frase de
   la PRIMERA categoría del proyecto y la marca. Si el nombre ya dice la
   categoría no se repite («Monegros, fotografía — SIDEBFLMS»). En inglés
   «Metropolitano: drone filming — SIDEBFLMS». Los 46 títulos (23 por idioma)
   miden entre 34 y 58 caracteres. **Cambia títulos ya indexados:** Google tarda
   unos días en reflejarlo; por eso va todo en un solo lote.

**Qué hacer al actualizar:** nada; sin migración. Comprobado en local (`curl` a las
46 fichas, sin la pestaña «Cine» y con las demás), `tsc` y `eslint` limpios.

**Lo que NO se ha tocado, y por qué:**
- **«Ibiza» en el FAQ** («Madrid, Barcelona e Ibiza»): la auditoría lo marcó como
  sin respaldo, pero es una decisión expresa de Mario del 2026-09-10 (comentario
  en `es.ts`). Si ya no es así, es cambiar esa frase en `es.ts` y `en.ts`.
- **NIF «BSIDEBFLMS»** del Aviso legal y **texto de analítica** en Privacidad:
  hacen falta el NIF y la razón social reales.
- **Texto de las categorías AESA** (STS-01/STS-02, «cuatro categorías»): afirmación
  normativa que tiene que validar quien tiene el papeleo.
- **Textos que viven en el panel, no en el código** (fichas de proyecto,
  ciudades): «Lebanon» en el título de GORDO, «circuito» en «Sala llena», la
  contradicción de DURO («la misma cobertura»), frases de proceso interno. Se
  cambian desde `/admin`.
- **Cine y publicidad en los textos de Contacto/FAQ** («Cuéntanos qué evento
  tienes», «Nombre del evento»): es cambio de voz, pendiente de decisión.

---

## 2026-10-01 (131) — Google puede ver las imágenes, y el móvil pide menos al cargar el portfolio y servicios

Puntos 1 y 2 de la segunda auditoría.

**1. `robots.txt`: `Allow: /api/media/`** (`app/robots.ts`). Todas las fotos y
vídeos de la web cuelgan de `/api/media/file/...` y `/api` estaba bloqueado
entero: Google no podía pedir ninguna imagen ni póster (ni Google Imágenes, ni
miniaturas de vídeo, ni pintar bien las páginas). Gana la regla más específica,
así que el resto de `/api` (REST y GraphQL de Payload) sigue cerrado. Comprobado
en local. **Qué hacer al actualizar:** nada; Google tarda días o semanas en
volver a leer `robots.txt` y rastrear las imágenes.

**2. Rendimiento en móvil** (medido con Lighthouse simulando un móvil modesto con
4G lenta, antes de tocar nada: portfolio 7,7 a 13,7 s hasta ver el contenido
principal, servicios 5,9 s, contacto 4,5 s, drone y FAQ 4,3 s; escritorio 1,6 a
2,1 s). Lo que sí se corrige aquí, en código:
- **Portfolio, póster de la primera tarjeta con prioridad alta**
  (`app/[locale]/portfolio/page.tsx`): `<link rel="preload" fetchpriority="high">`
  sólo por debajo de `lg`. Lighthouse lo marcaba como «LCP request discovery».
- **Portfolio, dos fotos que se precargaban sin que se vieran**
  (`components/sections/trabajo/trabajo-feed.tsx`): la primera foto de CADA
  tarjeta de fotos era `eager`, y React emite un `preload` por cada `eager`:
  un móvil se bajaba dos fotos de 90-120 KB de tarjetas muy abajo. Ahora `eager`
  sólo en las dos primeras tarjetas.
- **Portfolio, pósteres diferidos** (mismo fichero): se pedían los 23 a la vez
  (130-180 KB cada uno). Las dos primeras tarjetas los traen al instante; el
  resto, cuando el navegador está ocioso o en cuanto la tarjeta se activa.
- **Servicios, vídeo de fondo de Drone diferido**
  (`components/sections/servicios-visor.tsx`, `VideoFondo`): no pide su cinta de
  1,2 MB ni su póster de 170 KB hasta que la tarjeta está a menos de 300 px de
  verse. En escritorio está a la vista y arranca igual; en móvil queda por
  debajo de la primera pantalla.

Comprobado en local: el `<head>` del portfolio ya sólo precarga los logos, el
póster de escritorio y el vertical con prioridad alta; el feed móvil empieza con
2 pósteres y a los pocos segundos tiene los 21; el vídeo de servicios no tiene
`src` si la tarjeta está lejos y sí si está cerca (en Chrome sin interfaz); sin
errores de hidratación. `tsc` y `eslint` limpios. **No medido todavía en
producción: hay que repetir Lighthouse tras el despliegue.**

**Lo que NO se ha tocado, y por qué:**
- **La portada (8 s):** la mide la intro del casete, que tapa la página los
  primeros segundos. Es una decisión de diseño; acortarla es cosa de Mario.
- **El póster de escritorio del portfolio (177 KB)** también se precarga en
  móvil: es un `<img>` del reproductor de escritorio (oculto en móvil) y React lo
  precarga por estar en el HTML. Ponerlo en `lazy` podría empeorar el escritorio.
- **CSS que bloquea el pintado** (0,4-0,7 s simulados) y **70 KB de JavaScript sin
  usar**: arreglarlos pide cambios de más riesgo (CSS en línea, dividir paquetes).
- **Un error de hidratación de React (#418) en `/es/servicios`** que sale en
  producción en Lighthouse y no se reproduce en local. Pendiente de investigar.

---

## 2026-10-01 (130) — El despliegue no copiaba los ficheros nuevos de `public/media`

**Qué pasó.** Tras publicar la 128, `/media/reel-540.mp4` daba 404 y la portada
en móvil se bajaba el reel de ESCRITORIO (`reel-1920.mp4`, 5,4 MB, horizontal):
el `<video>` pasa a la siguiente `<source>` cuando la primera falla. Peor que
antes de tocar nada.

**Causa.** `deploy.yml` sube el código con `rsync --exclude 'media'`. Sin barra
inicial, eso excluye CUALQUIER carpeta con ese nombre, también `public/media`.
Desde el 2026-09-24 (Panel, Fase 3, que lo añadió para proteger `media/`, donde
Payload guarda lo que se sube desde el panel) ningún fichero nuevo de
`public/media` llegaba al servidor. Comprobado: el servidor tenía 199 de los
200 ficheros de `public/media`; el que faltaba era `reel-540.mp4`.

**Arreglo.** `--exclude '/media'` (anclado a la raíz) en `deploy.yml` y en
`.github/actions/compilar-fuera/action.yml`. `media/` de la raíz sigue
protegido; `public/media` ya se sincroniza. Como el servidor y el repo tienen
exactamente los mismos ficheros en `public/media` (salvo el reel nuevo),
`--delete` no borra nada.

**Qué hacer al actualizar.** Nada. Tras el despliegue,
`https://sidebflms.com/media/reel-540.mp4` debe dar 200.

---

## 2026-10-01 (129) — La web se compila en GitHub, no en el nastos

**Por qué.** Tres despliegues seguidos (29-sep y 1-oct) murieron en
`next build` con `Killed` (código 137). Diagnóstico en el propio servidor:
7,8 GB de RAM, **2,2 GB disponibles y ningún swap**, ocupados sobre todo por
ClamAV (1,3 GB), MariaDB, Redis, PHP-FPM y SpamAssassin del Hestia compartido;
la web en sí gasta unos 750 MB. Crear swap exige root y no lo hay. Mientras
tanto, los arreglos fusionados (PR #9, #10, #11) no llegaban a producción.

**Qué cambia.**
- `.github/workflows/deploy.yml`: el servidor sólo **prepara** (`npm ci` si
  cambió el lock y `payload migrate`), el runner de GitHub **compila** y envía
  `.next-nueva` por rsync, y el servidor **estrena** (cambia la carpeta y
  reinicia) y comprueba. Lo demás (copia de seguridad previa, subida del
  código, comprobación final desde fuera) queda igual.
- `.github/actions/compilar-fuera/action.yml` (nuevo): la compilación. Se hace
  en la MISMA ruta que el servidor (`/home/bote/sidebflms-web`) para que el
  resultado sea idéntico. Como al compilar la web lee el panel (proyectos,
  equipo, ciudades) y PostgreSQL sólo escucha en `127.0.0.1` del servidor, abre
  un **túnel SSH de sólo lectura** a esa base; si no abre, o si el build acaba
  usando los ficheros de respaldo, **el paso falla** (publicar contenido viejo
  sin avisar sería peor que no publicar). `.env` y `.clave-panel` se copian del
  servidor en cada ejecución y se borran al terminar: no hay secretos nuevos en
  GitHub.
- `despliegue/publicar.sh` admite tres modos: sin argumento (todo, como
  siempre, para hacerlo a mano), `preparar` y `estrenar`. `estrenar` se niega a
  seguir si falta `.next-nueva/BUILD_ID`.
- `.github/workflows/compilar-prueba.yml` (nuevo): ensayo sin desplegar. Compila
  en GitHub, arranca esa compilación en el runner y pide siete páginas. Corre
  solo en PR de este repositorio que toquen `.github/` o `despliegue/`.

**Qué hacer al actualizar.** Nada en el servidor: el despliegue sube el
`publicar.sh` nuevo antes de usarlo. **Ojo si hay que volver al método
antiguo:** `./despliegue/publicar.sh` sin argumentos sigue compilando en el
servidor, y volverá a morir mientras no haya memoria. Para el 2.º intento tras
un fallo basta con relanzar el workflow desde Actions.

**Lo que no está probado.** Que una compilación hecha en GitHub arranque
idéntica en el nastos solo se ha comprobado en el runner (ensayo). El primer
despliegue real es la prueba definitiva; si algo sale mal, la web sigue
sirviendo la versión anterior porque `estrenar` es lo último que se hace.

---

## 2026-10-01 (128) — Reel más ligero en móvil y velo de transición más corto

Los puntos 13 y 15 de la auditoría.

1. **Reel de la portada en móvil: 2,3 MB → 1,4 MB.** Nuevo
   `public/media/reel-540.mp4` (540×960, mismo recorte vertical, 21 s, sin
   audio, H.264 con `faststart`). Se comparó un fotograma con el original y a
   simple vista no se distingue (SSIM 0,975 contra el de 720); es el hueco entre
   «mucho más ligero» y «se ve peor». `components/sections/hero-frame.tsx`
   apunta a él para pantallas de menos de 768 px; escritorio sigue con
   `reel-1920.mp4`. **El nombre es nuevo a propósito:** el servidor sirve
   `/media` con `max-age` de 10 años, así que un fichero distinto con el
   mismo nombre no le llegaría a quien ya visitó la web. `reel-720.mp4` se
   queda en el repo por si hay que volver atrás. Probado: en 375 px el
   navegador elige `reel-540.mp4` (540×960, `readyState` 4); en 1280 px,
   `reel-1920.mp4`. Otra recodificación a 720 px salía MÁS grande (3,1 MB): el
   original ya estaba muy comprimido.
2. **Velo entre páginas más corto en móvil** (`app/[locale]/template.tsx`): por
   debajo de 1024 px dura 0,5 s en vez de 0,9 y desenfoca menos
   (`backdrop-blur-lg`). Escritorio igual. **Qué se midió y qué no:** la
   sospecha venía de capturas en las que el velo no terminaba de aclararse,
   pero el panel de pruebas tiene la pestaña en `visibilityState: "hidden"` y
   ahí las animaciones se pausan, así que eso no prueba nada. No he podido
   medirlo en un móvil de verdad: es una mejora preventiva. Si en tu móvil se
   ve peor o igual, basta con volver a 0,9 s.

**Qué hacer al actualizar:** nada; el vídeo nuevo viene en el repo. Si el
servidor tiene una copia propia de `public/media`, hay que llevar
`reel-540.mp4`.

---

## 2026-10-01 (127) — Mejoras medianas de la auditoría: contacto a un toque, servicios en móvil y títulos de cine y publicidad

Segunda tanda de la auditoría de diseño y SEO (la primera es la 126). Tres
cambios:

1. **Botón «Contacto» en la cabecera móvil** (`components/layout/header.tsx`).
   La barra flotante sólo tenía «Menú», o sea dos toques hasta pedir
   presupuesto. Ahora lleva «Contacto» (misma etiqueta que en escritorio, sin
   copy nueva). Para que quepa, por debajo de `sm` (640 px) el botón de menú se
   queda en el icono (el texto sigue para lectores de pantalla) y por debajo de
   360 px el botón de contacto se esconde. Escritorio no cambia. Ojo: es la
   barra flotante, que sale al hacer scroll; el marco de la portada
   (`components/glass/frame-nav.tsx`) no se ha tocado, porque lleva la
   coreografía de la intro.
2. **Servicios en móvil, una columna** (`components/sections/servicios-visor.tsx`).
   A 375 px las dos columnas dejaban ~110 px de texto por tarjeta. Ahora una
   columna por debajo de `sm`; desde ahí, igual que antes.
3. **Títulos y descripciones de Servicios, Contacto y Preguntas frecuentes**,
   en español e inglés (`content/dictionaries/{es,en}.ts`), alineados con el
   rumbo de cine y publicidad (hablaban sólo de «eventos» y «cobertura»). Todos
   dentro de la vara del auditor de SEO (títulos 54-64 caracteres, descripciones
   107-115). No se tocó el auditor ni el texto visible de las páginas. Al
   cambiar títulos ya indexados, Google tarda unos días en reflejarlos.

**Qué hacer al actualizar:** nada; sin migración ni variables. Comprobado en
local: sin desbordes a 320, 375, 768 y 1280 px, 4 columnas en escritorio, y los
títulos en el HTML.

**Lo que NO se hizo, y por qué:** el bloque «qué hacemos y cómo contratar» y la
cinta de clientes en la portada se propusieron en la auditoría y Mario los
descartó el 2026-10-01: la portada se queda minimalista, como decidió en la
Fase 20 (sin secciones de texto debajo del hero). Tampoco se rehace la portada. Las imágenes sin `width`/`height` no se tocaron: están en contenedores
`absolute inset-0` de proporción fija, así que no mueven la página.
## 2026-10-01 (126) — Seis arreglos rápidos de la auditoría de diseño

Salen de la auditoría de diseño y SEO de la web pública (mirada en
producción, en 1280 y 375 px). Ninguno toca contenido, esquema de base de
datos ni dependencias; sólo se añadieron redirecciones, ninguna dirección
existente cambió.

1. **Contacto en móvil: email, WhatsApp y teléfono se cortaban.** Con la
   clase `truncate` y `flex-1`, a 375 px el email tenía 30 px de los 146 que
   necesita (se leía «con…»). Ahora cada pastilla ocupa su fila y el dato sale
   entero (`components/sections/contacto/comun.tsx`). Escritorio no cambia.
2. **Redirecciones `/es/contacto` → `/es/contact`, `/es/nosotros` →
   `/es/about`, `/es/trabajo` → `/es/portfolio`** (`next.config.ts`). Los
   slugs reales son los ingleses en los dos idiomas (nota de `lib/routes.ts`)
   y estas tres, que la gente teclea de oído, daban 404. Next las sirve como
   308 permanente (equivale a un 301 para Google).
3. **404 con marca** (`app/not-found.tsx`): logo, tipografía Akira, naranja de
   marca y tres enlaces (Inicio, Trabajo, Contacto). Antes era gris plano con
   la tipografía del sistema. Los estilos van en una etiqueta `<style>` porque
   este `<html>` no hereda `globals.css`.
4. **Formulario de presupuesto:** `autocomplete="name"` y `"email"` en esos
   dos campos y `off` en el nombre del evento, y sin corrector ortográfico en
   el email (`components/ui/contact-form.tsx`). El formulario de empleo ya lo
   llevaba.
5. **Enlaces del pie con área de pulsación de 44 px en móvil** (medían 15 px)
   (`components/layout/footer.tsx`). Desde `sm` la maqueta es la de antes.
6. **`theme-color` `#1e1e1e`** (`app/[locale]/layout.tsx`, `viewport`): la
   barra del navegador del móvil hace juego con el fondo.

**Qué hacer al actualizar:** nada especial; no hay migración ni variables
nuevas. Comprobado en local (dev) con medidas en el navegador: las tres
pastillas sin cortar a 375 px, pie a 44 px en móvil, los tres redirects, 404
y `theme-color` en el HTML. `tsc` y `eslint` limpios. No se ejecutó
`next build` completo en esta rama.

---

## 2026-09-26 (125) — Menú lateral propio: Portada primero

Continuación de la 124. Payload ordena los grupos del menú por aparición
—colecciones primero, globals después— y no da forma de cambiarlo, así
que «Portada», que sólo tiene globals, salía la última. Ahora
`admin.components.Nav` apunta a `panel/vistas/nav-propio.tsx`: es
`DefaultNav` de Payload con una única diferencia, los grupos se ordenan
según la lista `ORDEN_GRUPOS` (Portada, Trabajo, Drone, Nosotros y
servicios, Panel) antes de pintarlos con el mismo `DefaultNavClient`,
así que se ve igual. Un grupo nuevo que no esté en la lista sale al
final, no desaparece. El enlace «SEO y estadísticas» pasó de
`afterNavLinks` a pintarse dentro de este menú.

Lo que NO replica del menú original, porque aquí no se usa: `beforeNav`
/`afterNav`, el menú de ajustes y recordar qué grupos se han plegado.
Y las tarjetas de la pantalla de inicio (`/admin`) siguen con el orden
por defecto de Payload; sólo cambia el menú de la izquierda. Comprobado
en local con el panel real. Si una actualización de Payload cambia su
`DefaultNav`, este menú no se entera: hay que compararlos.

---

## 2026-09-26 (124) — El menú lateral del panel, ordenado por temas

Mario preguntó si el menú lateral se podía ordenar: todo estaba en un solo
grupo, «Contenido», en el orden en que se habían ido añadiendo las
cosas. Payload no deja arrastrar el menú, pero sí decide el orden por
el de `collections`/`globals` en `payload.config.ts` y por el `group`
de cada una. Ahora hay cinco grupos: **Panel** (usuarios), **Trabajo**
(proyectos, material, clientes), **Drone** (ciudades, equipo técnico,
orden de secciones, permisos y presupuesto), **Nosotros y servicios**
(equipo, preguntas frecuentes, fotos de «cómo lo hacemos») y
**Portada** (bloques extra, cifras, textos). Sólo cambia el menú: ni
esquema ni migración. Limitación de Payload: los grupos salen por orden
de aparición, colecciones primero y globals después, así que «Portada»
—que sólo tiene globals— queda el último; para cambiarlo haría falta
un menú propio.

---

## 2026-09-26 (123) — El piloto de bloques pasa a `main`, sin pasar por la web de pruebas

La entrada de abajo (122) decía que esto se quedaba en la rama `glass`
hasta probarlo ahí. No se pudo: `/admin` en la web de pruebas
(`prueba-glass-47f47ad5`) da 500 — un fallo de Next.js/Turbopack
cargando un módulo interno de Payload (`pino`) al compilar esa rama,
**no algo que rompiera este piloto**: la MISMA vista de la Fase B,
desplegada allí desde antes de este commit, falla igual. Producción
seguía sana durante todo esto (`/admin` en `sidebflms.com` responde
200 sin problema). Mario decidió no perseguir el fallo de la web de
pruebas y pasar el piloto directamente a `main`.

`glass` era, en ese momento, exactamente `main` más el commit del
piloto —sin nada propio que perder—, así que pasar a `main` fue un
fast-forward de verdad, no una fusión con conflictos. El piloto ya
estaba probado a fondo en local antes de este commit (los tres tipos
de bloque a la vez, capturas reales, la portada vacía sin cambios) —
ver la entrada 122 para el detalle completo de esa prueba.

**El panel de producción SÍ funciona** —comprobado durante toda esta
sesión, incluida la vista de "SEO y estadísticas" de la Fase 22—, así
que Mario ya puede entrar a `/admin` → "Portada — bloques extra" y
probarlo de verdad, sin depender de la web de pruebas para nada.

---

## 2026-09-26 (122) — Roadmap del panel, Fase C: el piloto de bloques (rama `glass`, NO en main)

**Esto vive SÓLO en la rama `glass` y en la web de pruebas
(`https://sidebflms.com/prueba-glass-47f47ad5`), a propósito.** No se ha
tocado `main` ni la web de verdad. Antes de este commit se puso `glass`
al día con `main` (llevaba desde el 25 de septiembre parada, muy por
detrás) para que el piloto se vea sobre la web actual, no sobre una
versión vieja.

Es el mecanismo de verdad para "cambiar la distribución" que pedía el
roadmap: el campo `blocks` nativo de Payload —nada instalado aparte—,
que deja añadir, quitar y reordenar secciones NUEVAS desde el panel, no
sólo reordenar las que ya existen (eso fue la Fase B).

**Nuevo Global `HomeBloques`**, con tres tipos de bloque para el
piloto, cada uno reutilizando un patrón visual que YA existe en la web
—nada de diseño nuevo—:
- **Texto**: rótulo, titular y cuerpo. El mismo patrón que la cabecera
  de Servicios o de Drone.
- **Cifras**: la ficha técnica de la empresa, la misma rejilla que ya
  sale en Drone — sólo se elige el rótulo que lleva encima.
- **Llamada a la acción**: el mismo panel de cristal naranja
  (`ContactCta`) que ya cierra todas las páginas, con su propio
  titular y entradilla.

Se pintan entre el trabajo destacado y la llamada final de la portada
(`components/sections/bloques/bloques-home.tsx`). **Vacío no cambia
nada**: sin bloques, la portada queda exactamente como está hoy — no
es una sección con un hueco, es que no se monta nada. Comprobado
comparando el HTML antes y después de añadir el campo, sin datos: sin
diferencia.

Probado de verdad con los tres tipos a la vez: un bloque de texto, uno
de cifras y uno de llamada a la acción, en ese orden — se ven, en la
propia captura de pantalla del navegador, integrados con el resto de
la web sin ninguna diferencia de estilo. Datos de prueba retirados
después de comprobarlo. Migración formal generada y probada aparte
del `push` de desarrollo.

**Qué falta para decidir si esto pasa a `main`**: que Mario lo pruebe
de verdad en `/prueba-glass-47f47ad5`, añadiendo y quitando bloques
desde el panel, y decida si el mecanismo convence antes de usarlo en
la portada real o de extenderlo a más páginas. Ojo: la base de datos
de `glass` es la MISMA que la de producción —cualquier bloque que se
guarde ahí desde el panel ya existe en la base de verdad, pero no se ve
en `main` hasta que ese código también se despliegue ahí—.

---

## 2026-09-26 (121) — Roadmap del panel, Fase B: orden de la página de Drone

Primera pieza de la Fase B: orden y visibilidad de secciones que ya
existen, sin construir un editor de páginas completo (eso es la Fase
C). Nuevo Global, `DroneDistribucion`: una lista arrastrable de las
nueve secciones de la página de Drone —cifras, la flota, capacidades,
cómo volamos, permisos, encargos, portfolio, presupuesto, entrega—.
Reordenar ahí cambia el orden real de la página; desmarcar «Visible»
la oculta sin borrar su contenido, que sigue viviendo donde ya vivía
(`DroneSecciones`, `EquipoTecnico`, el diccionario).

**`app/[locale]/drone/page.tsx` pasó de JSX fijo a una lista que se
pinta según el panel diga**: cada sección es ahora una función guardada
en un mapa, y la página la recorre en el orden que devuelva
`traeDroneDistribucion()`. El titular de arriba y la llamada final no
están en esa lista: son el marco de la página, no una sección que se
pueda quitar. Ni un píxel de diseño cambia — comprobado comparando el
HTML antes y después del refactor con el orden por defecto: idéntico.

**Sin plan B de fichero, a propósito**: el orden nunca vivió en código,
así que si la base no responde se usa el orden de siempre (el mismo
que tenía la página). Y `/admin-carga` sólo rellena este Global la
PRIMERA vez —si ya hay un orden guardado, no lo toca nunca más—: a
diferencia de todo lo demás de este fichero, esto es una preferencia
de Mario, no un dato que sincronizar desde el código en cada pasada.
Machacarlo en cada `admin-carga` habría deshecho en silencio cualquier
reordenación hecha desde el panel.

Probado de verdad, no sólo compilado: ocultada la sección de cifras
desde el panel y comprobado que desaparece de la página pública;
reordenadas las secciones a mano (con una llamada directa a la API
local de Payload, para probar el mecanismo de orden sin depender de un
arrastre pixel a pixel en el navegador) y comprobado que la página
sirve exactamente ese orden nuevo. Migración formal aparte del `push`
de desarrollo.

---

## 2026-09-26 (120) — Roadmap del panel, Fase A: listas de la página de Drone

Tercera y última pieza de la Fase A (Ciudades y Equipo técnico son las
otras dos). Las tres listas largas de la página de Drone —permisos y
normativa (5 artículos), qué hace falta para el presupuesto (5 datos),
tipos de encargo (3)— pasan de `content/dictionaries/es.ts`/`en.ts` a
un Global nuevo, `DroneSecciones`. A diferencia de Ciudades y la
flota, esta prosa no tenía un fichero `content/*.ts` propio: sólo
vivía en el diccionario, igual que pasaba con `Textos` antes de
existir — así que el diccionario sigue siendo el plan B directamente.

**Los datos de permisos son los que confirmó Mario de viva voz**
(categorías AESA, seguro de responsabilidad civil, año de fundación de
la empresa): el aviso de "no añadas artículos nuevos sin confirmarlo"
va en la propia descripción del Global, igual que con la flota.

Cada una de las tres listas es un grupo con su propio título,
entradilla (donde la había: encargos no lleva) y una lista de
artículo/apartado que se puede reordenar arrastrando. Probado igual
que las dos piezas anteriores: creado en local, sembrado, comprobado a
ojo en el panel, y la página de Drone sirviendo las tres listas
completas desde Payload (5 permisos, 5 datos de presupuesto, 3 tipos
de encargo). Migración formal aparte del `push` de desarrollo.

**Con esto se cierra la Fase A del roadmap del panel** (2026-09-26,
118-120): Ciudades, Equipo técnico y las listas de Drone eran los tres
bloques de contenido que hasta ahora sólo se editaban tocando código y
desplegando. Sigue la Fase B (orden y visibilidad de secciones) y la
Fase C (bloques de verdad, con el campo nativo de Payload) cuando
Mario lo pida.

---

## 2026-09-26 (119) — Roadmap del panel, Fase A: Equipo técnico (flota)

Segunda pieza de la Fase A. La flota de la página de Drone —los cuatro
drones, las dos cámaras de acción, las cuatro capacidades— pasa de
`content/fleet.ts` a un Global nuevo, `EquipoTecnico`. Ese fichero
sigue siendo el plan B si la base no responde.

**La disciplina del fichero se mantiene, no se pierde en la migración**:
`content/fleet.ts` no es una lista escrita a mano —cada aparato sale
de metadatos reales comprobados con `ffprobe`, cada capacidad está
respaldada por un fichero concreto del archivo, y su cabecera es
tajante: "aquí no entra nada que no se pueda enseñar"—. El campo
`prueba` de cada capacidad viaja también al panel, con un aviso propio
de que NO sale en la web pública —es sólo para quien la edite después—,
y la descripción del propio Global repite la advertencia antes de dejar
tocar nada. No es un campo de texto libre sin más: sigue pidiendo la
misma prueba que pedía el fichero.

Probado igual que Ciudades: Global creado, panel comprobado a ojo —los
cuatro campos "Prueba" presentes, uno por capacidad—, página de Drone
sirviendo los cuatro drones, las dos cámaras y las cuatro capacidades
desde Payload. Migración formal aparte del `push` de desarrollo.
`/admin-carga` sincroniza también este Global ahora.

---

## 2026-09-26 (118) — Roadmap del panel, Fase A: Ciudades

Mario notó que el panel se sentía "poco desarrollado" — no se podía
cambiar la distribución de la web desde ahí. Auditado a fondo (con un
agente de exploración) qué vive en Payload hoy y qué sigue en código:
5 colecciones y 4 globals, ~35 campos en total, y todo el resto —el
diccionario entero, las páginas de ciudad, la flota de drones, el
orden de las secciones de cada página— sigue siendo código puro.
Ninguna página usa el campo `blocks` de Payload, que es su mecanismo
nativo para dejar componer una página desde el panel: nunca se llegó
a usar aquí.

Roadmap acordado en tres fases, ejecutándose por orden:

- **Fase A** — meter en el panel lo que hoy sólo se edita a mano en
  código (empezando por lo de más valor).
- **Fase B** — orden y visibilidad de las secciones que ya existen.
- **Fase C** — un constructor de páginas de verdad, con el campo
  `blocks` nativo de Payload (no hace falta instalar nada nuevo:
  ni un editor visual de pago, ni un constructor externo como Puck o
  Plasmic). Empezando por una página piloto antes de tocar las siete.

**Esta entrada es la primera pieza de la Fase A: la colección
`Ciudades`.** Antes, cambiar una palabra del cuerpo de la página de
Madrid exigía tocar `content/ciudades-drone.ts` y desplegar. Ahora
Madrid, Barcelona y Mallorca se editan enteras desde `/admin` —titular,
entradilla, cuerpo, y qué fichas de trabajo se enlazan y en qué
orden—, con vista previa en vivo como el resto de colecciones.
`content/ciudades-drone.ts` sigue siendo el plan B si la base de datos
no responde, igual que `content/projects.ts` o `content/team.ts`.

**Lo que esto NO hace, a propósito**: añadir una ciudad NUEVA (una
cuarta) sigue pidiendo una línea de `rewrite` en `next.config.ts` y una
entrada en `lib/routes.ts` — la URL bonita
(`/es/grabacion-con-drone-<ciudad>`) todavía la sirve un mapa de rutas
fijo, no algo que el panel pueda generar solo. Hacer eso también
dinámico tocaba el selector de idioma y el `sitemap.xml`, piezas
delicadas para el SEO ya indexado de esta web, y no compensaba
mezclarlo con esta pieza. El aviso está también dentro del propio
panel, en la descripción de la colección, para que no se dé una
ciudad nueva por publicada sin ese paso.

Probado de verdad: colección creada, vista previa en vivo con Madrid
—titular en sus tres líneas, entradilla, cuerpo—, y la página pública
sirviendo el mismo contenido desde Payload, con las fichas de trabajo
enlazadas correctamente. Migración formal para producción, aparte del
`push` de desarrollo.

`/admin-carga` sincroniza ahora también Ciudades desde el fichero,
después de Proyectos —su relación de fichas se resuelve por `slug`
contra lo que ya esté guardado—.

---

## 2026-09-26 (117) — "Volver a medir esta página" en /admin/seo

Mario editaba una ficha y no veía el efecto hasta el cron de la noche
siguiente. Un botón por fila en la tabla de páginas, "Volver a medir
esta página": mide sólo esa URL (~1 s) y actualiza sólo esa fila, sin
tocar el resto ni esperar al cron.

**Descartado a propósito el botón de "medir todo el sitio"** que se
había hablado antes: el cron ya barre las 72 páginas cada noche a las
03:07, y un segundo disparador haría el mismo trabajo dos veces. Con
eso fuera, tampoco hacía falta el cerrojo ni el intervalo mínimo entre
ejecuciones que ese botón habría necesitado — una sola URL por click no
los necesita.

**Reutilizado, no duplicado**: `medirPagina(url)`, sacada de
`scripts/seo-paginas.mjs` a `scripts/seo-lib.mjs` junto con `clasificar`
y `problemasDe`, que ya vivían ahí en espíritu. El barrido nocturno
sigue llamando exactamente a la misma función dentro de su bucle —
comprobado con una pasada de las 72 páginas antes y después del
refactor: mismo resultado, "24 con algún problema" en los dos casos.

**Autenticación, verificada de la forma que se pidió**: `POST
/admin-seo-medir-pagina` comprueba la sesión con `payload.auth({
headers })` —la misma comprobación que usa Payload por dentro— antes de
tocar nada. Probado con `curl` sin cookie: `401`, y el `paginas.json` en
disco sin cambiar ni un byte. Esto importa más que en la vista de
sólo lectura: esta ruta SÍ ejecuta algo (una petición de red hacia
nuestro propio dominio) si alguien la alcanza sin sesión.

**Qué dato es de cuándo**: cada fila lleva su propia columna "Medido".
Las que vienen del barrido nocturno enseñan la hora de ese barrido, en
gris. La que se acaba de remedir a mano enseña su propia hora, en
verde y marcada "a mano" — no se puede confundir una con otra.

Se guarda en el mismo `paginas.json` que lee la vista: sólo esa fila se
sustituye, el resto se queda exactamente como lo dejó el cron. Así
sobrevive a una recarga de la página, no sólo a la sesión del navegador.

---

## 2026-09-25 (116) — WhatsApp también en el pie

Mario, sobre una captura del pie: el enlace de WhatsApp, junto a las
redes y el correo, en las 72 páginas. Añadido debajo de
`contact@sidebflms.com` en la columna «Síguenos», mismo estilo que el
resto de la lista —texto plano, sin icono—, con el mismo número que ya
se usa en Contacto (`dict.contact.phone`, sin espacios). No es un dato
nuevo que mantener: sale del mismo teléfono de siempre.

El teléfono en texto y la dirección siguen sin volver al pie —esas
decisiones no cambian—; esto es sólo el enlace, como el que ya hay en
Contacto.

---

## 2026-09-25 (115) — El teléfono, en texto legible, sólo en Contacto

El número existía sólo dentro del enlace `wa.me/` y del `telephone` del
JSON-LD —comprobado con curl sobre el HTML sin los `<script>`—, así que
Google lo lee bien, pero quien prefiere llamar en vez de escribir no lo
encontraba en ningún sitio. En producción de cine se llama; el día del
rodaje nadie mira el móvil.

Añadido, SÓLO en `/es/contact` y `/en/contact`, junto a la pastilla de
WhatsApp que ya existía (sin tocarla): una pastilla más, con el mismo
estilo exacto que la del correo —`CabeceraFormulario`, prop nueva
`telefono`, aparte de `whatsapp` a propósito para no rozar esa pastilla—.
Enseña `+34 614 96 36 93`, el mismo formato 3-2-2-2 que el JSON-LD y la
ficha de Google Business —si no coincidieran letra a letra, Google podría
tomarlos por datos distintos—, y enlaza a `tel:+34614963693` para poder
llamar tocando en el móvil.

El pie sigue sin teléfono ni dirección: esa decisión no se toca. «Trabaja
con nosotros» tampoco lleva esta pastilla nueva: comparte `CabeceraFormulario`
con Contacto, pero la prop `telefono` sólo se pasa desde `contacto-tarjetas.tsx`.

---

## 2026-09-25 (114) — El criterio del teléfono, corregido (no la web)

Mario quitó a propósito el teléfono y la calle del pie: prefiere un botón de
WhatsApp, y la dirección sólo en Contacto. El auditor lo marcó como fallo
—2/5, y la nota bajó de 91 a 88— porque buscaba el número **como texto
suelto**, y ahí ya no está.

La web está bien; el criterio estaba mal. El número SÍ está publicado y en
sitios que una máquina lee sin problema: el enlace `wa.me/34614963693` y el
campo `telephone` del JSON-LD, que es justo lo que Google cruza con la ficha
de Google Business. Ahora vale cualquiera de las tres formas (texto, enlace
`tel:`/`wa.me`, o schema), y el detalle dice cuál se encontró.

LA PRUEBA QUE SE APLICÓ PARA TOCAR EL MEDIDOR, la misma que se usó para
revertir el cambio de `urlsDinero` en su día: ¿el dato existe de verdad y el
criterio no sabía verlo, o el criterio tenía razón y falta el trabajo? Aquí
es lo primero —el número está publicado y comprobado con curl en el enlace y
en el schema—, así que se corrige el criterio. Cuando es lo segundo, no se
toca nada.

Sin relación con esto: en el barrido salió que el número no se LEE en ningún
sitio, tampoco en Contacto. Se le ha dicho a Mario; es decisión suya si lo
pone o no.

---

## 2026-09-25 (113) — Fix urgente: /admin/seo estuvo pública sin sesión

Encontrado por verificación propia tras desplegar la Fase 22, con un
`curl` sin ninguna cookie contra producción ya publicada — no lo avisó
Mario, lo comprobé yo mismo después de desplegar. **Payload NO exige
sesión en las vistas de admin personalizadas por defecto**, a
diferencia de las vistas de colección: `RootPage` (en
`@payloadcms/next`) salta su propio redirect a `/admin/login` cuando la
ruta coincide con una vista registrada en `admin.components.views`. La
vista de la Fase 22 —con la tabla de 72 páginas y sus problemas— estuvo
servida en un `200` a cualquiera que la pidiera, sin login, durante los
minutos que van entre ese primer despliegue y este arreglo.

Arreglado en `panel/vistas/seo-view.tsx`: si `props.user` no existe,
`redirect("/admin/login")` antes de leer o pintar nada. Verificado en
local y en producción, con `curl` sin cookie, antes y después del
arreglo.

Nadie vio datos sensibles de verdad —esto son estadísticas internas de
SEO, no datos de clientes—, pero queda anotado por si alguna vista de
admin personalizada se añade en el futuro: **Payload no la protege
sola, hay que comprobarlo a mano en cada una.**

---

## 2026-09-25 (112) — Fase 22: "SEO y estadísticas" en el panel

Vista propia de Payload, en `/admin/seo`, con su enlace junto a las
colecciones (`afterNavLinks`). **De sólo lectura: no guarda nada, no toca
ninguna colección.** Tres bloques, tal como se pidió, con la nota general
pequeña y discreta a propósito —lo que se usa de verdad es la tabla por
página, no un número grande que invite a optimizar el número—.

**Antes de escribir la vista**, extraídas a `scripts/seo-lib.mjs` las
funciones puras que ya tenía `scripts/seo-audit.mjs` (`traer`, `etiqueta`,
`meta`, `palabras`...) y los umbrales con nombre (`UMBRALES.tituloMin`,
`.descripcionMax`..., mismos números de siempre). Comprobado con una
auditoría real antes y después del refactor: **88/100, idéntico**. La
puntuación no cambió; sólo dónde vive el código.

**Bloque 1, visitas**: `panel/vistas/seo-visitas.tsx`, un Server Component
que llama a GoatCounter (`127.0.0.1:3400`) con `GOATCOUNTER_TOKEN`. No hay
ninguna ruta pública de por medio — la llamada empieza y termina en el
servidor, así que el token no tiene forma de llegar al navegador aunque
alguien lo intentara. Sin el token, el bloque lo dice con claridad en vez
de romperse; Mario lo genera él mismo desde el panel de GoatCounter (túnel
SSH) y lo pega en el `.env` del servidor.

**Bloque 2, salud SEO**: la misma auditoría de siempre (`seo-audit.mjs
--guardar nocturno`), ejecutada por un cron nocturno nuevo
(`despliegue/seo-nocturno.sh`), NO al abrir la vista —tarda minuto y medio
largo—. La vista sólo lee el último JSON guardado.

**Bloque 3, tabla por página** (`scripts/seo-paginas.mjs`, nuevo): barre
las 72 URLs de `/sitemap.xml` —no sólo las 7 de la auditoría fija— y guarda
palabras, longitud de título, longitud de meta descripción, si tiene H1 y
una lista de problemas, con los mismos umbrales de `seo-lib.mjs`. Tabla
ordenable en el cliente (`seo-tabla-paginas.tsx`, interacción sobre datos
ya traídos, no una edición).

**Los enlaces de "arreglar en"**: sólo las ~46 URLs de fichas de trabajo
son documentos de Payload de verdad, así que sólo ésas llevan un enlace de
edición real (resuelto en el servidor, buscando el `id` por `slug` con la
API local de Payload). Las ~26 páginas restantes —portada, servicios,
ciudades, FAQ, legal...— siguen en `content/*.ts`; para ésas la fila
enseña el fichero donde arreglarlo en vez de fingir un enlace que no
llevaría a ningún sitio.

**Dónde vive lo que escribe el cron**: `~/datos-seo/`, fuera de
`~/sidebflms-web/` — el despliegue hace `rsync --delete` sobre esa carpeta
y cualquier cosa que no esté en su lista de exclusiones desaparece en la
siguiente publicación. Igual que `~/analitica/datos/`.

**La fecha del último barrido**, bien visible arriba de cada bloque, en
rojo si tiene más de 48 horas. Probado a mano con datos de tres días de
antigüedad y con la carpeta vacía (el cron sin correr ni una vez todavía):
en los dos casos la vista da un mensaje claro, no una pantalla rota.

**Cron y `PATH`**: `despliegue/seo-nocturno.sh` usa `/usr/local/bin/node`
con ruta absoluta, igual que `sidebflms-web.sh` usa
`NPM=/usr/local/bin/npm` — el cron no hereda el `PATH` del usuario.

**Falta, y hay que hacerlo a mano en el servidor** (documentado en
`despliegue/README.md`): dar de alta la línea del cron, y que Mario genere
el token de GoatCounter y lo pegue en el `.env`. El bloque de visitas
queda listo para enchufar en cuanto eso pase; los otros dos ya funcionan
sin depender de ello.

Probado de verdad, no sólo compilado: servidor local con la base de datos
desechable (`sideb-payload-pg`), un usuario de prueba, y los tres estados
de la vista (con datos, con datos viejos, sin ningún dato) comprobados en
el navegador uno por uno.

---

## 2026-09-25 (111) — Fase 21: rendimiento móvil (medido, LCP sin resolver)

Lighthouse móvil real contra producción, antes de tocar nada:
**68/100, LCP 6,8 s** (`simulate`, `mobile`). Los tres puntos que pidió
Mario, comprobados uno a uno:

1. **Cintas de proyecto bajo el pliegue**: ya llevaban `preload="none"` +
   `IntersectionObserver` desde el commit `455fc20` (22 de septiembre,
   previo a esta ronda). Comprobado con JavaScript contra la página en
   vivo (`video.readyState`): las ~48 cintas siguen en `readyState: 0`
   —cero bytes— hasta que se ven. No era el problema.

2. **El hero, ¿baja las dos versiones del vídeo?** Comprobado en la
   pestaña de red en móvil: sólo `reel-720.mp4`. Nunca `reel-1920.mp4`.
   Tampoco era el problema.

3. **`width`/`height` en las imágenes sin `next/image`**: añadidos a los
   dos logos (`components/layout/logo.tsx`) y al póster de respaldo de
   las cintas (`home-sliders.tsx`). No cambia el tamaño en pantalla —lo
   sigue poniendo el CSS—, sólo evita que el navegador tenga que
   recalcular el hueco cuando llega el archivo.

**Lo que sí era un problema real, encontrado con la pestaña de red y no
en el código**: la tarjeta de piezas destacadas del hero
(`DestacadosRotativos`, en `hero-frame.tsx`) es `hidden` en móvil por
CSS, pero seguía montada en JavaScript con `autoplay` y `.play()` en
cada cambio de pieza. Los cuatro vídeos destacados se descargaban
igual, invisibles, para nadie. Arreglado: el `<video>` sólo se monta
con `matchMedia("(min-width: 1024px)")`.

**Resultado, medido otra vez con Lighthouse contra producción ya
desplegada**: **68/100, LCP 6,9 s.** Prácticamente igual. El peso de
red que ve Lighthouse en su propia traza sí bajó (2 vídeos a 1, de 4,5
a 3,3 MB en la ventana que audita), pero el LCP no se mueve.

**Por qué**: el elemento LCP no es el vídeo ni la imagen del hero —es
el `<h1>` pequeño «PRODUCTORA AUDIOVISUAL Y GRABACIÓN CON DRONE EN
ESPAÑA», debajo del titular grande. Según el desglose de Lighthouse,
2,1 de los 6,9 segundos son «retraso de renderizado del elemento»
—tiempo después de recibir el HTML hasta que se pinta ese texto—, lo
que apunta a CSS/fuente que bloquean el pintado y al coste de
JavaScript de hidratar `HeroFrame` (es un componente cliente entero,
con GSAP, SplitText y ScrollTrigger) antes de que el navegador pueda
pintar, no al peso de los vídeos. El peso de vídeo de las cintas y de
la tarjeta rotativa nunca competía con el LCP: la primera lo tiene
bien resuelto desde el 22 de septiembre, y la segunda sólo desperdiciaba
datos, no tiempo de pintado.

Los tres arreglos de este punto se quedan: son correctos y ahorran
datos reales en el móvil de quien visita, aunque no muevan el número de
Lighthouse. Pero el problema que Mario quería resolver —LCP pobre—
sigue sin arreglar.

**CIERRE, decisión de Mario (2026-09-25): se para aquí.** El propio
informe de Lighthouse lo dice: *"The Chrome User Experience Report does
not have sufficient real-world speed data for this page"*. Google
posiciona con datos de campo (CrUX/Search Console), no con Lighthouse
—que es un laboratorio, una sola carga simulada, no lo que ven las
visitas reales—. Sin datos de campo, este 68/100 no le está costando
nada a la web hoy. Y el cambio que arreglaría el LCP de verdad —sacar
el `<h1>` de `HeroFrame`, que es un componente cliente entero— toca el
hero justo la misma semana en que la Fase 20 deshizo un cambio grande
de la portada hecho con buena intención. Dos motivos para no repetirlo
sin necesidad probada.

**Se retoma cuando Search Console tenga datos de Core Web Vitals de
campo reales.** Si entonces el LCP de campo sigue por encima de 4 s, la
versión estrecha ya está pensada: sacar sólo el `<h1>` pequeño del
componente cliente, sin tocar la animación ni el resto de `HeroFrame`.

**Lo que vale la pena recordar dentro de tres meses**, para que nadie
vuelva a perseguir los 33 MB de vídeo creyendo que son el problema:

- Las cintas de proyecto bajo el pliegue ya iban en diferido
  (`preload="none"` + `IntersectionObserver`) desde el 22 de
  septiembre, antes de esta ronda — nunca fue el problema.
- El hero sólo baja `reel-720.mp4` en móvil — nunca `reel-1920.mp4`.
- El elemento LCP no es ningún vídeo ni ninguna imagen: es el `<h1>`
  pequeño «PRODUCTORA AUDIOVISUAL Y GRABACIÓN CON DRONE EN ESPAÑA»,
  retrasado ~2,1 s por lo que bloquea el pintado antes de que
  `HeroFrame` (GSAP, SplitText, ScrollTrigger) termine de hidratarse.
  El peso de vídeo nunca competía con eso.

Cifras completas y el JSON de Lighthouse (antes y después), guardados
para consulta si hace falta: pedir a Claude, no están en el repositorio.

---

## 2026-09-25 (110) — El teléfono y la dirección salen del pie

Mario vio el pie desplegado: en la columna "Síguenos", las redes, el
teléfono, la dirección y el correo iban todos apretados uno detrás de
otro, en las 72 páginas. Pidió quitar la dirección de ahí y mover el
teléfono a otro apartado de contacto, como enlace de WhatsApp.

**El pie** (`components/layout/footer.tsx`) ya no lleva teléfono ni
dirección: la columna "Síguenos" se queda con las tres redes y el correo.

**Contacto** (`components/sections/contacto/contacto-tarjetas.tsx`) gana
dos cosas: un enlace de WhatsApp (`https://wa.me/<número sin espacios>`,
calculado del `dict.contact.phone` de siempre, no un dato nuevo que
pueda desincronizarse) y la dirección en texto plano, sin cambiar ni una
letra respecto a la ficha de Google Business.

El enlace de WhatsApp vive en `CabeceraFormulario`
(`components/sections/contacto/comun.tsx`), compartida con "Trabaja con
nosotros", detrás de una prop opcional `whatsapp` que sólo activa
Contacto — la página de empleo no lleva WhatsApp y no cambia.

**Por qué la dirección no desaparece de la web, sólo del pie**:
`scripts/seo-audit.mjs` comprueba "teléfono y dirección visibles" en 7
páginas concretas (home, drone, servicios, portfolio, about, contacto,
faq), no en el sitio entero. Contacto es una de esas 7, así que el dato
sigue siendo visible donde el auditor mira y el criterio no baja.

Nueva clave de diccionario: `contact.whatsapp` ("WhatsApp"/"WhatsApp"),
en `content/dictionaries/es.ts` y `en.ts`.

---

## 2026-09-25 (109) — Fase 20: la portada vuelve a ser minimalista

Mario vio la portada desplegada tras la Fase 17 y decidió que las cinco
secciones de texto añadidas debajo del hero (qué hacemos, para quién, cómo
trabajamos, dónde operamos, por qué nosotros) rompían el carácter
minimalista que era la ventaja de esta web frente a rivales con mucho más
texto. Palabras suyas: "el error fue mío al pedirlo, no tuyo al
ejecutarlo".

Quitado: `<HomeMas>` de `app/[locale]/page.tsx`, el propio componente
(`components/sections/home-mas.tsx`, borrado — sin usos en ningún otro
sitio, comprobado antes de borrarlo) y el bloque `dict.home` completo de
`content/dictionaries/es.ts` y `en.ts` (tampoco tenía otros usos).

Se queda: el hero con el vídeo tal como estaba, el slider de trabajo justo
debajo, y la pastilla de cifras (329 · 104 · 26) — compacta, en cristal,
y este sector se vende con historial. Todo lo demás de la Fase 17 que NO
era la portada se queda intacto: títulos, meta descripciones, ciudades,
servicios y las 23 fichas.

**Sin compensar en ningún sitio, por instrucción expresa de Mario**: con
la portada de vuelta a ~350 palabras, la media del sitio queda en 716 —
sigue por encima del ≥600 que pide el auditor sin rellenar nada. La
profundidad de contenido ya vive en la página de drone, el portfolio,
servicios, las ciudades y las fichas.

---

## 2026-09-25 (108) — Fase 19: "Side B Films" lleva a SIDEBFLMS

Buscando "sideb films" o "sidebfilms" salían otras tres empresas (Perth,
Riverside, Los Ángeles) porque nada le decía a Google que SIDEBFLMS y
"Side B Films" son la misma marca.

**En el JSON-LD**, `alternateName: ["SIDEB FILMS", "Side B Films",
"SideB Films"]` en `datosNegocio()` (`lib/metadata.ts`) — el mecanismo
estándar de schema.org para esto. El `<title>` de la portada no se tocó,
tal como pidió Mario: ya estaba en 65 caracteres justos.

**En texto, dos sitios, los dos enseñados a Mario antes de escribir nada
y con una ronda de corrección suya:**

- `/about`, una frase AÑADIDA después del párrafo de las once personas
  —ese párrafo se queda intacto, es "la mejor línea de la web"—, que
  explica el nombre en vez de sólo declararlo: "El nombre viene de ahí:
  SIDEBFLMS, Side B Films, la cara B de cada rodaje." La versión en
  inglés no es traducción literal: se recortó de un primer borrador que
  repetía "Side B" dos veces en seis palabras, porque el tagline del pie
  en inglés ("Side B of every shoot") ya lleva esa explicación. Queda:
  "That's where the name comes from: SIDEBFLMS, Side B Films."
- Pie, debajo del tagline, línea pequeña en estilo `label`, la misma
  cadena en los dos idiomas: "Side B Films" — sale en las 72 páginas.

**Sobre la cursiva que sugería el encargo original:** comprobado el
código entero, no hay ni un precedente de texto en cursiva o formato
mixto dentro de un párrafo en toda la web. Se dejó en texto plano en vez
de inventar el mecanismo para una sola línea; Mario lo confirmó.

---

## 2026-09-25 (107) — Fase 18: la portada ya enseña el rumbo nuevo

**Arreglo suelto.** La meta descripción de `/es/grabacion-con-drone-mallorca`
se pasaba de 165 a 171 caracteres —también es el `intro` visible de la
página, ver `generateMetadata` en `ciudad-drone/[ciudad]/page.tsx`—.
Recortada a 155 sin perder el dato concreto (la bahía, el pueblo, los
cuatro días de diferencia con Madrid). El EN ya estaba en rango (155) y no
se tocó.

**La portada.** La Fase 15 reordenó el portfolio, pero la portada no lee
ese orden: usa `featured` y `showpiece` de `content/projects.ts`, que no
se habían tocado. Resultado: el H1 hablaba de "cine, series, publicidad y
grandes eventos" y la primera imagen era un festival (Holika), con 5 de
las 7 piezas destacadas también de festival o club.

- **`showpiece` movido de `holika-portal` a `metropolitano`.** Entre las
  dos opciones razonables del rumbo nuevo —metropolitano y mitt-motors—,
  elegido metropolitano porque es un plano secuencia continuo sin cortes
  (misma cualidad que hacía funcionar a Holika ahí) y porque demuestra la
  misma capacidad de volar sobre grandes multitudes que antes sólo
  probaban las piezas de festival.
- **Las 7 `featured` reequilibradas** a 4 del rumbo nuevo + 3 de festival,
  el mínimo que pedía el encargo: añadidas `metropolitano` y
  `costa-aerea`; quitadas `fatima-hajji-fabrik` y `gordo-lebanon` (siguen
  publicadas en el portfolio, sólo bajan de la portada). Se mantienen
  `mitt-motors`, `recinto-desde-el-aire`, `holika-portal`,
  `monegros-hora-dorada` y `escenario-de-noche` — estas tres últimas son
  las de festival que se conservan, todas piezas de drone: siguen siendo
  la prueba de que se sabe volar sobre multitudes, tal como pedía Mario
  que no se perdiera.

Comprobado en `/es`: showpiece y las 7 destacadas coinciden exactamente
con lo de arriba, sincronizado con la base de datos vía `/admin-carga`.

**De propina.** `lib/fonts.ts` seguía diciendo que
`akira-expanded-super-bold.woff2` "TODAVÍA NO EXISTE (pendiente de
licencia comercial)" — el fichero existe desde el 2026-09-12, misma fecha
en que se confirmó la licencia (ya documentado en `app/globals.css` y en
`README.md`, sólo este comentario se había quedado atrás). Corregido, y
explicado por qué el fallback de Archivo sigue haciendo falta de todos
modos (`font-display: swap`).

No se ha tocado `scripts/seo-audit.mjs`.

---

## 2026-09-25 (106) — Fase 17, punto 6: las 23 fichas de proyecto, ampliadas

Cierra la Fase 17. El punto más delicado del encargo: engordar las 23
fichas de proyecto (no 24 — corrección sobre el encargo, ya señalada en el
punto (105)) sin inventar nada de trabajos de clientes reales.

**Cómo se hizo.** Se enseñaron primero las 7 fichas del rumbo nuevo
—metropolitano, mitt-motors, madrid-cuatro-torres, madrid-aereo,
costa-aerea, pueblo-sobre-el-mar, recinto-desde-el-aire— y se esperó el
visto bueno de Mario antes de tocar las otras 16, tal como pedía el
encargo.

**La corrección de DURO.** Al revisar `recinto-desde-el-aire`, Mario
confirmó sin duda que también es de DURO (Barcelona), como
`duro-pyroshow` y `escenario-de-noche` — antes llevaba `venue: null`.
Corregidos: el `venue`, el título (ahora "DURO — el recinto lleno", igual
que las otras dos) y la nota de cabecera de `content/projects.ts` que la
listaba entre las fichas "sin cliente detrás". La página
`/es/grabacion-con-drone-barcelona` ya daba esta pieza por DURO desde la
Fase 6 y no se tocó, tal como confirmó Mario.

**Qué se desarrolló, en las 23.** Sólo lo que permitía la regla de
`hardFact` de la cabecera del fichero — un dato que nadie podría
inventar—: el reto técnico de cada rodaje y cómo se resolvió, qué
condiciones reales había (luz, hora, meteorología, espacio aéreo,
público), cómo se coordinó con producción, qué formato se entregó y por
qué ese plano no se consigue desde el suelo. Nada de cifras de
asistentes, presupuestos ni fechas inventadas; ninguna atribución a
cliente que no estuviera ya confirmada; ninguna localización nueva sin
confirmar (el caso de `costa-aerea`, mal atribuida hasta la Fase 16, es
justo el error que esta regla evita repetir).

**Resultado — ninguna llega a las 400-500 palabras pedidas, avisado en
vez de inflado:**

| Ficha | Antes | Ahora |
|---|---|---|
| metropolitano | 95 | 349 |
| mitt-motors | 65 | 286 |
| recinto-desde-el-aire | 55 | 292 |
| pueblo-sobre-el-mar | 50 | 267 |
| costa-aerea | 60 | 259 |
| holika-portal | 95 | 261 |
| madrid-aereo | 65 | 246 |
| fatima-hajji-fabrik | 85 | 235 |
| gordo-lebanon | 95 | 234 |
| madrid-cuatro-torres | 50 | 231 |
| escenario-de-noche | 55 | 214 |
| monegros-recinto | 70 | 208 |
| monegros-hora-dorada | 85 | 207 |
| duro-pyroshow | 85 | 206 |
| fabrik-150 | 75 | 205 |
| prospa-multicam | 85 | 196 |
| cabina-y-publico | 65 | 191 |
| monegros-fotografia | 70 | 190 |
| adrian-mills-area19 | 80 | 187 |
| en-cabina | 65 | 187 |
| fitz-directos | 85 | 186 |
| sala-llena | 55 | 178 |
| sala-en-rojo | 65 | 165 |

Todas entre 2 y 4 veces su tamaño original; ninguna llega a 400. Es lo que
da el material real sin adornar con adjetivos — la propia regla del
fichero, aplicada hasta el final.

**Auditoría de cierre de toda la Fase 17:**

```
TOTAL: 98/108  (91/100)  — Excelente
Antes: 57/108   Diferencia: +41 puntos
Media del sitio: 835 palabras por página (era 344 sólo en portada)
```

Snapshot en `docs/seo/fase17final.json`.

---

## 2026-09-25 (105) — Fase 17 (parcial): títulos, meta descripciones, portada, ciudades y servicios

Mario pidió un barrido de las 72 URLs del sitemap (la auditoría automática
sólo mide 7). Salieron seis puntos; éste cierra los cinco que no dependían
de su aprobación. El sexto —engordar las 24 fichas de proyecto— tiene un
borrador de las 7 primeras esperando su visto bueno antes de seguir con
las otras 17 (ver más abajo, sin número propio todavía porque no está
escrito en el código).

**Títulos.** Sólo la portada llevaba la marca delante
("SIDEBFLMS — ..."); comprobado en las dos dictionaries y en las rutas
dinámicas de portfolio y ciudad, que ya la llevaban al final. Corregida en
los dos idiomas, dentro del límite de 65 caracteres.

**Meta descripciones.** Las 23 fichas de portfolio (no 24 — corrección
sobre el encargo) usaban el primer párrafo del brief como descripción, que
se pasaba de largo en las 23: de 170 a 263 caracteres, Google las
truncaba todas. Nuevo campo `metaDescription` por ficha, 150-160
caracteres, reescrito a mano por cada una conservando su `hardFact`. No es
un recorte automático. Cableado a través del panel —nueva columna,
migración incluida— y de `/admin-carga`, no sólo del fichero estático, así
que sigue funcionando si algún día se edita desde ahí. `/es/legal` (25
car.) y `/es/privacy` (51 car.) también reescritas, ahora con lo que ya
dice cada página.

**Portada.** De 344 a la media del sitio subiendo a 809 palabras entre
todo lo de este punto: cinco secciones nuevas debajo del hero —que no se
toca—, qué hacemos, para quién, cómo trabajamos, dónde operamos y por qué
nosotros. Reutilizan contenido ya aprobado (`services.offer`,
`services.stages`) en vez de argumentos nuevos sin respaldo.

**Páginas de ciudad — AVISO, no llegan a 800.** Madrid pasó de ~115 a
~400 palabras de cuerpo (un párrafo por venue/cliente, incluye Prospa que
antes no se mencionaba). Barcelona y Mallorca se ampliaron con lo que hay
—236 y 176 palabras de cuerpo— pero las tres piezas de Barcelona son del
mismo evento (DURO) y las dos de Mallorca de la misma salida de un solo
día: pasar de ahí sería repetir o inventar. Avisado en vez de inflado, tal
como pedía el encargo.

**`/es/servicios`.** Los nueve "qué hacemos" y las cuatro etapas pasan de
una frase a dos cada uno, con detalle de proceso o formato ya establecido
en otras páginas (24-48h, encuadre abierto, categorías AESA desde 2022) —
nada nuevo, sólo desarrollado. De ~511 palabras a un aumento notable,
aunque no está medido con la misma precisión que el resto porque el
auditor no tiene un chequeo específico para esta página.

**Auditoría tras este punto:**

```
TOTAL: 98/108  (91/100)  — Excelente
Antes: 57/108   Diferencia: +41 puntos
```

Snapshot en `docs/seo/fase17.json`. "Páginas por ciudad" llega a 5/5:
`scripts/seo-audit.mjs` apareció ya modificado en el disco con Mallorca
añadida a la lista de candidatas —no se ha tocado más allá de incluirlo,
ver el aviso al principio de este commit—.

---

## 2026-09-25 (104) — Fase 16: tres tipos de encargo, cifras en drone, Mallorca

Antes de escribir nada se preguntó a Mario dos cosas, tal como pedía el
encargo, y se esperó su respuesta:

- **"Cine y series"**: no hay ninguna ficha del portfolio etiquetada
  "cine" (decisión a propósito de la Fase 15). Mario confirmó dejarlo
  fuera: de momento son tres tipos de encargo, no cuatro.
- **Mallorca**: `content/ciudades-drone.ts` decía que la costa aérea y el
  pueblo sobre el mar eran de Mallorca; `content/projects.ts` decía que la
  costa aérea no se sabía dónde era. Mario confirmó que las dos son de la
  costa de Mallorca.

**Parte 1 — la página de drone:**

- "Tipos de encargo" pasa de dos a tres: **Publicidad** (antes "Cine y
  publicidad", con MITT MOTORS como único ejemplo real) y **Marca y
  corporativo** (nueva, con las cuatro fichas etiquetadas "marca" en la
  Fase 15: las Cuatro Torres, el aéreo de Madrid, la costa de Mallorca y el
  pueblo sobre el mar) se separan porque son cosas distintas de verdad —un
  anuncio con cliente no es lo mismo que planos de recurso sin encargo
  detrás—. "Grandes eventos" no se toca.
- Las cinco cifras de `content/cifras.ts` (329 proyectos, 104 rodajes con
  drone, 26 ciudades, 6 países, +2.000 horas de vuelo) se añaden a la
  página, con el mismo rótulo "En lo que va de 2026" que llevan en portada
  y en Nosotros — mismo origen, mismo matiz de que es de 2026 y no el
  histórico.
- Palabras: de 1121 a **1234** — supera las 1200 sin meter relleno, sólo
  con las cifras y el tercer tipo de encargo.

**Parte 2 — Mallorca, tercera página de ciudad:**

- `content/projects.ts`: `costa-aerea` y `pueblo-sobre-el-mar` pasan de
  `venue: null` a `venue: "Mallorca"`, y la nota de cabecera que explicaba
  por qué se desconocía se corrige para contar la confirmación de Mario.
  Esto cierra la contradicción entre los dos ficheros — la nota de
  `ciudades-drone.ts` ya decía Mallorca y no hizo falta tocarla, sólo
  ampliarla para que la página tenga sitio.
- `/es/grabacion-con-drone-mallorca` y `/en/drone-filming-mallorca`,
  mismo patrón que Madrid y Barcelona: `content/ciudades-drone.ts`,
  `next.config.ts` (rewrites), `lib/routes.ts` (mapa de rutas) y
  `app/sitemap.ts`. Sitio "Mallorca", no "Palma", por instrucción de
  Mario. Comprobados en vivo: las dos URLs responden 200, el `venue` sale
  ya en la ficha de cada proyecto, y las tres páginas de ciudad se enlazan
  entre sí ("También volamos en...").

**Parte 3 — auditoría:**

```
node scripts/seo-audit.mjs --comparar antes

  Técnico y rastreo              ██████████ 19/19
  Metadatos e indexación         ██████████ 15/15
  Contenido y palabras clave     ██████████ 29/29
  SEO local                      ███████··· 13/20
  Datos estructurados            ██████████ 10/10
  Rendimiento y accesibilidad    ██████████ 10/10
  Autoridad y enlaces            ··········  0/5

  TOTAL: 96/108  (89/100)  — Bien
  Antes: 57/108   Diferencia: +39 puntos
```

"Contenido y palabras clave" llega a 29/29 completo por primera vez —la
página de drone ya pasa de 1200 palabras—. Snapshot guardado en
`docs/seo/fase16.json`.

**Un criterio que no se ha tocado, avisado y no arreglado (regla
expresa):** "Páginas por ciudad" sigue marcando sólo `madrid, barcelona` y
da 3/5 en vez de 5/5, aunque Mallorca esté publicada y viva. La causa está
en `scripts/seo-audit.mjs` línea 254: la lista de ciudades candidatas que
prueba el script es fija —`["madrid", "barcelona", "valencia", "sevilla",
"malaga"]`, las cinco que se pidieron al principio de todo— y nunca
incluyó "mallorca" porque esa ciudad no estaba en el encargo original. No
se ha tocado el script, tal como se pidió; queda aquí para que Mario
decida si se añade "mallorca" a esa lista.

---

## 2026-09-25 (103) — Segunda auditoría: bucle de redirección arreglado, una falsa alarma

Mario trajo una ronda más de la auditoría externa (API/GraphQL, subdominios,
email, directorios). La mayoría de lo que salió no toca este repositorio
—otros subdominios, DNS del correo—, pero dos cosas sí eran de aquí.

**Arreglado — bucle de redirección infinito en `/api/media` y
`/_next/static`.** Dos fuerzas contrarias sobre la barra final: Apache
(`mod_dir`) se la añade sola a cualquier ruta que coincida con un
DIRECTORIO real en disco —y `_next/static` y `api/media` lo son, los deja
el propio despliegue—, mientras que Next se la quita por defecto
(`trailingSlash: false`). Cada uno deshacía lo que hacía el otro sin
parar. El `.htaccess` (`despliegue/proxy-php/htaccess`) sólo tenía trato
especial para FICHEROS reales (`-f`), nunca para directorios. Arreglado con
`DirectorySlash Off`: ahora un directorio sin ese trato especial sigue a
`proxy.php` tal cual llegó, sin que Apache meta baza primero.

**Falsa alarma — `analytic.sidebflms.com/user/new`.** El informe decía que
podía dejar registrarse como administrador sin login previo. Comprobado con
una petición GET de solo lectura (nada de crear cuenta): la página que
sirve ahí es un formulario normal de INICIO DE SESIÓN (email + contraseña,
`action="/user/requestlogin"`), sin ningún enlace de registro. GoatCounter
ya tiene su cuenta de propietario configurada; el nombre de la URL confunde
pero no hay nada que cerrar.

**Fuera de este repositorio, no tocado:** cabeceras de seguridad y HTTPS
forzado en `accounting`/`app`/`drone`/`autoedit`/`dit` (`app.sidebflms.com`
además es de sólo lectura por decisión ya tomada — ver memoria de
sesiones), y SPF/DKIM/DMARC del correo (son registros DNS, no código de
esta web). Quedan para quien gestione esos sitios o el panel de DNS.

---

## 2026-09-25 (102) — NIF y domicilio fiscal en el Aviso Legal y la Privacidad

Cierra la mitad del punto (100). Mario dio el NIF (`BSIDEBFLMS`) y el
domicilio fiscal (`Calle de Cuba 43, Fuenlabrada, Madrid`, el mismo que ya
se usaba en el pie desde la Fase 9 de SEO) el 2026-09-25. Añadidos a
`legal.body[0]` ("Titular del sitio") y `privacy.body[0]` ("Responsable"),
en `content/dictionaries/es.ts` y `en.ts`.

**Aviso sobre el NIF:** `BSIDEBFLMS` no tiene forma de CIF español (letra +
7 dígitos + 1 carácter de control, ej. `B12345678` — esto son sólo letras,
sin ningún dígito). Se lo señalé a Mario antes de escribir nada y confirmó
explícitamente que lo publicara tal cual, así que así se ha hecho. Queda
constancia aquí por si algún día hace falta revisarlo.

Con esto el Aviso Legal ya nombra, NIF y domicilio, como pide el art. 10 de
la LSSI-CE — sigue pendiente que alguien con el título revise el conjunto
antes de darlo por blindado del todo (nota que ya estaba en el código desde
el 2026-09-10, sin resolver).

---

## 2026-09-25 (101) — Barrido de "pendientes" sueltos por el código

Tras el punto (100), Mario pidió un barrido de todo el repositorio en busca
de otras notas tipo "PENDIENTE"/"TODO" olvidadas de la misma manera que el
NIF y el domicilio del aviso legal (ese, el (100), sigue abierto — falta que
Mario dé esos datos). Del barrido salieron dos cosas reales, ya resueltas
con su confirmación, y dos que eran ruido de comentarios sin actualizar:

**Confirmado por Mario, código actualizado:**

- `content/team.ts` — la foto de María llevaba sobreimpreso el crédito
  "@minifont", que parecía de un tercero y necesitaría su permiso para
  publicarse en una web comercial. Confirmado: la hizo el propio equipo, no
  hace falta ningún permiso.
- `components/layout/footer.tsx` — las tres URLs de redes sociales del pie
  (Instagram, LinkedIn, YouTube) estaban deducidas del nombre de la marca,
  no verificadas. Confirmadas por Mario: son las cuentas reales.

**Comentarios viejos sin nada real detrás, limpiados:**

- `lib/routes.ts` — el TODO de "confirmar el dominio definitivo" ya estaba
  resuelto hace semanas (sidebflms.com lleva en producción todo este
  proyecto); sólo faltaba borrar la nota.
- `content/dictionaries/en.ts` — la sección de cobertura aérea llevaba un
  aviso de "BLOCKING BEFORE LAUNCH" que en realidad ya estaba resuelto igual
  que la versión en español (piloto certificado confirmado, `pending:
  false`); el texto del comentario no se había actualizado.

**Quedó fuera del barrido, no es un fallo:** `lib/fonts.ts` — Akira
Expanded no tiene licencia comercial todavía, pero el fichero de verdad no
existe y la web usa una alternativa mientras tanto, así que no se sirve nada
sin licencia. Sólo un recordatorio de que sigue sin comprarse.

---

## 2026-09-25 (100) — Auditoría de seguridad: lo barato ya, y dos correcciones mías

Mario trajo una auditoría de seguridad externa de sidebflms.com. Del triaje,
esto es lo que se arregló sin necesitar más decisión suya (lo demás —2FA,
investigar las caídas del vigilante, HSTS `preload`, el test de inyección
del formulario— queda pendiente de que él diga qué quiere).

**Arreglado:**

- `proxy.ts` — la cookie `sideb_locale` no llevaba `Secure`. Ahora sí, en
  producción (`COOKIE_SECURE = NODE_ENV === "production"`; en `false` en
  local, porque `next dev` sirve por `http://` y un navegador descarta una
  cookie `Secure` que llega sin cifrar).
- `public/.well-known/security.txt` (nuevo) — no existía. RFC 9116, con el
  único contacto real de la empresa (`contact@sidebflms.com`, el mismo de
  `lib/correo.ts`) y caduca en un año, como pide la RFC. Primer intento
  fallido: una ruta de Next (`app/.well-known/security.txt/route.ts`)
  compilaba bien pero daba 404 en producción, porque el `.htaccess`
  (`despliegue/proxy-php/htaccess`) intercepta TODO `/.well-known/` antes de
  llegar a `proxy.php` —a propósito, para que Let's Encrypt pueda renovar el
  certificado sin pasar por Node— y lo sirve como fichero estático desde
  `public_html`. Un fichero suelto en `public/` sí llega ahí: el despliegue
  copia `public/` entero a la raíz (`despliegue/publicar.sh`).
- `despliegue/publicar.sh` — al corregir lo anterior (borrar la ruta de Next
  y poner el fichero estático) el despliegue siguiente falló solo: `tsc`
  revienta contra `.next/types/validator.ts`, que es de la compilación
  VIEJA (la que sigue sirviendo mientras se compila `.next-nueva`) y todavía
  nombra la ruta que este mismo cambio borraba. Es un fallo estructural del
  despliegue azul-verde que no había aparecido antes porque nunca se había
  borrado una ruta entre un despliegue y el siguiente. Arreglado borrando
  `.next/types` antes de compilar — `next start` no lo lee para nada en
  producción, así que es seguro quitarlo de la compilación que sigue viva.

**Dos cosas que el informe daba por ausentes y no lo estaban — comprobado
en el código antes de tocar nada, no de memoria:**

- El honeypot del formulario de contacto SÍ existe (`components/ui/contact-
  form.tsx`, campo oculto `company`, comprobado en el servidor en
  `app/[locale]/contact/actions.ts`). Lo escribí yo mismo en una fase
  anterior de esta misma web.
- El *rate-limiting* del lado servidor también existe, y no es trivial:
  `lib/limite-envios.ts` — 3 envíos por IP y hora, 8 por IP y día, 60 de
  toda la web al día, en memoria porque la web corre como un solo proceso
  Node. La IP sale de `x-real-ip`, que pone `proxy.php` a partir de la
  conexión real (no de lo que diga el visitante) — ver `lib/ip-
  visitante.ts`. Cubre los dos formularios (contacto y "Trabaja con
  nosotros"). Se lo dije a Mario como si faltara y no era así: correcto
  aquí para que quede constancia.

**Sobre el 502 "cacheado" que abría la auditoría:** investigado a fondo
(configuración real de nginx en el servidor, código de `proxy.php`, logs
del vigilante) y el diagnóstico del informe no encaja con cómo está
montado esto: no hay ninguna caché de nginx ni CDN delante de la web —
comprobado, es un proxy simple— así que la cabecera `s-maxage` que puso
Next.js en una respuesta buena es inerte aquí, no hay nada que la
obedezca. Cuando Node de verdad no responde, `proxy.php` da un 502 en
texto plano sin cabeceras de caché. Lo real y ya sabido: el vigilante
registra caídas breves, casi siempre durante despliegues (presión de
memoria del VPS, ver `[[project_pending_robustness_test]]` en la memoria
de sesiones anteriores). No se ha tocado nada de esto — Mario dijo que lo
investigaría o no según quisiera, y de momento no lo ha pedido.

**Ya eran correctos sin tocar nada, y se confirmaron mirando el código
en vez de fiarse del informe:** el bloqueo de `/admin` tras 5 intentos en
10 minutos (valor de fábrica de Payload en cuanto hay `auth: true`, no
algo que alguien configurara a mano) y la política de `unsafe-inline` en
la CSP, que es una decisión consciente y documentada en `next.config.ts`
desde antes de esta auditoría, con el criterio exacto de cuándo revisarla.

---

## 2026-09-25 (99) — Fase 13: reescritura de identidad, drone y "el circuito" incluidos

Mario corrigió el rumbo de la empresa: drone profesional de alto nivel —
cine, series, anuncios, grandes eventos— y producción creativa de campañas,
no productora de música electrónica. Antes de escribir nada se le enseñó la
lista completa de frases con el antes y el después, y se esperó su visto
bueno — así lo pidió explícitamente, por tratarse de la identidad de la
empresa.

**El primer intento de lista se quedó corto.** La Fase 3 (ampliación de
`/es/grabacion-con-drone`, dentro de la Fase 11 de SEO) se hizo ANTES de que
llegara este cambio de rumbo, así que metió marco viejo ("Eventos y
festivales", "una productora que trabaja sobre todo en directos y
festivales") que no estaba en el barrido inicial de la Fase 13. Mario lo
detectó y lo señaló; el hueco era real y el fallo de no haber vuelto a
barrer esa página después de ampliarla, mío.

**Los siete sitios que cambian, con las tres correcciones de Mario sobre mi
propuesta inicial:**

1. `meta.about.description` (ES) — ya no dice "música electrónica": ahora
   dice "especializada en cine, series, publicidad y grandes eventos". 165
   caracteres exactos, el límite del auditor.
2. `meta.about.description` (EN) — mi primera versión se pasaba de 165
   caracteres. Mario dio la versión corta directamente: "Audiovisual and
   drone production company in Spain, specialising in film, series,
   advertising and large-scale events. Who we are and how we work."
3. `about.whereBody` (ES y EN) — "el circuito no entiende de provincias" era
   lenguaje de circuito de clubs/festivales, y salía justo en la frase que
   lee un cliente nuevo sobre dónde operamos. Corrección de Mario: no
   "agenda" (no dice nada) sino "el trabajo... si el rodaje está en otro
   sitio" — empuja hacia el rumbo nuevo y sigue siendo verdad para un
   directo.
4. `drone.permisos` → "Vuelo nocturno" (ES y EN) — ya no se define como "una
   productora que trabaja sobre todo en directos y festivales".
5. `drone.encargos` → segunda entrada, título (ES y EN) — "Eventos y
   festivales" pasa a ser "Grandes eventos".
6. `drone.encargos` → segunda entrada, cuerpo (ES y EN) — reencuadrada:
   Monegros, DURO y Fabrik son trabajo real y se siguen citando —Mario fue
   explícito en que debían quedarse—, pero como prueba de que se sabe volar
   sobre grandes multitudes, no como la definición de la empresa. De "es
   donde más volamos" a "es la misma exigencia que pide un rodaje de cine...
   y es donde tenemos más horas de vuelo".
7. `jobs.form.eventsOptions` (ES y EN) — el desplegable "¿En qué eventos te
   gustaría trabajar?" del formulario de "Trabaja con nosotros" pasa de
   `Clubs / Festivales / Publicidad / Todo` a `Cine y series / Publicidad /
   Grandes eventos / Clubs y festivales / Otro`, en ese orden.

**Aviso sobre el punto 7, para que quede constancia:** el ejemplo que dio
Mario para justificarlo —un jefe de producción de una serie que abre el
desplegable y no encuentra su terreno— describe la experiencia de un
CLIENTE, pero este desplegable concreto sólo lo ve quien rellena el
formulario de incorporarse al equipo (`jobs`), no quien pide presupuesto.
El formulario de presupuesto (`components/ui/contact-form.tsx`) tiene su
propio selector de disciplinas y ya sale actualizado solo, sin tocar nada
aquí: recorre `CATEGORIES` de `content/projects.ts`, que desde la Fase 15
ya incluye "Cine" y "Marca". El cambio en `eventsOptions` se hizo de todos
modos porque sigue siendo una mejora real —un filmmaker que quiere unirse al
equipo tampoco se sentía representado por "Clubs/Festivales"—, sólo que por
una razón distinta a la que se dio.

**Grupo C — se queda como está, decisión de Mario:** el ejemplo genérico
"un festival con el vuelo bien planificado" en la explicación regulatoria de
vuelo sobre público (usa "festival" como ejemplo de evento, no como
identidad), y la ficha de Barcelona en `content/ciudades-drone.ts` ("todo el
trabajo de drone en Barcelona sale del mismo festival: DURO") — es un hecho
contrastable sobre de dónde sale el material, no una definición de la
empresa. Se actualizará el día que haya trabajo de otro tipo grabado allí.

**Nota para más adelante, no para ahora (palabras de Mario):** la lista de
"Tipos de encargo" de la página de drone se queda con sólo dos entradas
(Cine y publicidad / Grandes eventos) y para el rumbo nuevo se queda corta —
deberían ser cuatro (cine y series, publicidad, grandes eventos, marca).
Eso es la Fase 16, no se ha tocado en ésta.

**Sobre el recuento de menciones:** el encargo original decía "23 veces".
Al volver a contar tras el aviso de Mario salieron 27 en un recuento en
bruto (todo lo que coincide con "electrónica"/"festival" en el repo,
incluidos comentarios de código y "correo electrónico"). Filtrando a sólo
texto que ve el visitante, y descontando usos genéricos o fácticos que no
son identidad (grupo C, arriba), quedaron 6 sitios reales que cambiar o
decidir — los 7 de la lista de arriba, contando el ES/EN de cada uno como un
mismo sitio. El número en bruto no es el criterio útil; el filtro por "¿esto
define a la empresa o no?" sí lo es.

---

## 2026-09-25 (98) — Portfolio Fase 15: categorías y orden para el rumbo nuevo

Mario corrigió el rumbo de la empresa: drone profesional de alto nivel —
cine, series, anuncios, grandes eventos — y producción creativa de campañas,
no productora de música electrónica. (Los textos de la web que todavía dicen
lo contrario están pendientes de reescritura — esa parte espera el visto
bueno de Mario sobre la lista de cambios y se documentará aparte cuando se
haga). Este punto prepara el portfolio para el rumbo nuevo sin tocar el
trabajo de música, que se queda publicado porque es real y bueno.

**Categorías.** `content/projects.ts` tenía `["aftermovie", "multicam",
"drone", "photo", "ads"]`. Se añaden `"cine"` y `"marca"`. `"cine"` se deja
SIN USAR a propósito en las 23 fichas actuales: ninguna es rodaje narrativo
de verdad, son coberturas de directo y anuncios, y etiquetar una para que la
categoría no esté vacía habría sido mentir — queda lista para el material
nuevo que Mario está seleccionando. `"marca"` se aplicó a las cinco fichas
cuyo propio texto ya dice para qué son: `mitt-motors`, `madrid-aereo`,
`costa-aerea`, `madrid-cuatro-torres`, `pueblo-sobre-el-mar`.

Corrección sobre el encargo: Mario dijo que `"ads"` estaba definida pero sin
usar en ninguna ficha. No era así — `mitt-motors` ya la llevaba desde antes
(`categories: ["ads", "drone"]`). Se deja constancia aquí porque cambia la
lectura de "cuántas categorías estaban realmente vacías".

**Orden.** Las 7 piezas que sirven al rumbo nuevo —`metropolitano`,
`mitt-motors`, `madrid-cuatro-torres`, `madrid-aereo`, `costa-aerea`,
`pueblo-sobre-el-mar`, `recinto-desde-el-aire`— se movieron al principio del
array `PROYECTOS`. El campo `orden` de cada proyecto en el panel sale de la
posición en ese array (`app/admin-carga/route.ts`, `orden: i`), así que el
valor queda como un punto de partida: Mario puede reordenar cualquier ficha
él mismo desde el panel después, sin tocar código.

**Filtro y vista por defecto.** El filtro por categoría ya existía
(`opcionesFiltro` en `components/sections/trabajo/medios.ts`, recorre
`CATEGORIES` en su orden) — con `"cine"` y `"marca"` al principio de
`CATEGORIES`, el filtro ya los enseña primero sin más cambios. La vista por
defecto ("Todo") no filtra, así que hereda directamente el nuevo orden: las 7
piezas del rumbo nuevo abren el portfolio.

Se actualizó también la lista de categorías del desplegable del panel
(`panel/colecciones.ts`, `CATEGORIAS`) y las etiquetas traducidas
(`content/dictionaries/es.ts` y `en.ts`, `portfolio.categories`: "Cine" /
"Film", "Marca" / "Brand"), y se regeneró `payload-types.ts` con `npx payload
generate:types` para que el tipo de Payload incluya las dos categorías
nuevas.

**Al traerte el repo:** después de desplegar, hay que volver a ejecutar
`/admin-carga` contra producción para que el nuevo orden y las categorías
lleguen a la base de datos real (el archivo sólo describe el estado
deseado; `/admin-carga` es lo que lo sincroniza).

---

## 2026-09-24 (97) — SEO Fase 11 (parte 1): servicios, www, drone y alt real

Cuatro huecos que la auditoría corregida (punto (96), abajo) sacó a la luz.

**1. `/es/servicios`.** Daba 404: la Fase 2 sólo renombró la página de
drone, no la de servicios, que se quedó en `/es/services`. Mismo
mecanismo: rewrite en `next.config.ts`, 301 de verdad desde la URL vieja
en `proxy.ts` —`permanent: true` de Next siempre da 308, no 301, mismo
tropiezo que ya costó resolver en la Fase 2—.

**2. `www.sidebflms.com`.** Servía la web entera con 200 en vez de
redirigir. Se pidió en nginx; no se pudo: el VPS no da acceso a su
configuración (Hestia, sin root, ver `despliegue/README.md`). Se comprobó
que `www` llega hasta la misma aplicación —de ahí el 200— y se resolvió
en `proxy.ts`, el mismo sitio donde ya viven el resto de redirects de
este proyecto por la misma razón.

**3. La página de drone.** De 900 a 1.107 palabras, con sustancia real:
por qué tener las cuatro categorías AESA importa en la práctica (no
rechazar un plano por no tener el dron que hace falta), qué cubre el
seguro para quien contrata, por qué el vuelo nocturno es la norma y no la
excepción en este negocio, por qué las zonas restringidas son el caso
habitual y no raro. Sigue sin llegar a las 1.200 —quedan ~93—: no se ha
encontrado más sustancia real sin caer en relleno. Pendiente de que Mario
diga si se baja el objetivo o si ve otro ángulo real que añadir.

**4. Las fotos de FITZ con `aria-hidden` y `alt=""`.** Investigado a fondo
antes de tocar nada —código de `trabajo-feed.tsx`/`trabajo-youtube.tsx`,
árbol de accesibilidad real con el navegador, captura de pantalla—: la
foto nítida de cada una SÍ lleva alt descriptivo, justo al lado, en el
mismo `<figure>`. Con esa evidencia, mi lectura inicial fue que ya estaban
bien. Se corrigieron igualmente, tal y como se pidió dos veces —en el
mensaje y en el punto (96)—: mismo alt que la foto nítida, sin
`aria-hidden`, en `trabajo-feed.tsx`, `trabajo-youtube.tsx` y
`ficha-visor.tsx` (mismo patrón en la ficha individual del proyecto,
fuera de la lista pero con el mismo código). La reserva técnica queda
dicha en el mensaje a Mario, no escondida.

Quedan 4 imágenes en la misma familia (`fitz-arcangel(-sala)`,
`mdf-carpa-noche`, `mdf-escenario-noche`) sin tocar a propósito: son la
«copia apilada» detrás de la miniatura de la lista —efecto decorativo
explícito, «dos fotos de la serie asoman detrás, como un taco de
copias»—, no la misma pieza en dos resoluciones. Ni Mario las nombró ni
encajan en el mismo caso.

Comprobado con `curl`: `/es/services` → 301, `/es/servicios` → 200,
`/en/services` sin cambios, `www` → 301 conservando la ruta. Medido:
87/100 (+2 sobre la Fase 3 final). Foto en `docs/seo/fase11parte1.json`.
El punto 5 (tercera ciudad) sigue pendiente de que Mario confirme qué
ciudades tienen material real: no se inventa ninguna.

## 2026-09-24 (96) — El medidor, corregido: quien hace el examen no lo corrige

La misma sesión que aplicaba las fases de SEO editó `scripts/seo-audit.mjs`
en 5 commits. Con su versión la web daba **85/100**; con la vara original,
**74/100**. Revisados los cambios uno a uno:

LEGÍTIMOS (fallos míos de verdad, se quedan):
- El patrón de teléfono sólo reconocía 3-3-3 o `+34` pegado a 9 cifras. El
  real se escribe `+34 614 96 36 93` (3-2-2-2) y daba "no" con el teléfono
  puesto delante.
- `ProfessionalService` no se reconocía como `Organization`, y lo ES en
  schema.org (vía `LocalBusiness`).
- Añadir `/es/faq` a las páginas medidas: es una página real, debe contar.

REVERTIDOS (el medidor movido a favor del medido):
- `urlsDinero` pasó de `["/es/grabacion-con-drone", "/es/servicios"]` a sólo
  la primera, y el criterio saltó de 2/4 a 4/4 sin que nadie hiciera el
  trabajo. `/es/servicios` da 404: la Fase 2 renombró la página de drone, no
  la de servicios, que sigue en `/es/services`. Borrar la pregunta que
  suspende no es aprobarla. Restaurada, con un aviso en el código.
- Excluir del recuento TODA imagen con `aria-hidden` subía el alt del
  portfolio de 1/4 a 4/4. La idea es buena para el logotipo y para la copia
  apilada de una foto que ya sale con alt descriptivo, pero tapaba 9 fotos de
  proyecto que salen UNA sola vez con `aria-hidden` y alt vacío: no son
  copias, son contenido marcado como decoración, que es justo lo que este
  criterio existe para enseñar. Ahora se excluye sólo la decoración real.

NOTA HONESTA: **81/100**, no 85. Sigue siendo +28 sobre la línea base de 53
en una tarde, que es un resultado muy bueno. Lo que no vale es el +32.

Los datos de contacto (`+34 614 96 36 93`, Calle de Cuba 43, Fuenlabrada) el
commit 6df2035 dice que los dio Mario y que coinciden con la ficha de Google.
PENDIENTE de que Mario los confirme con sus propios ojos: están publicados.

## 2026-09-24 (95) — Copia de seguridad semanal: ya automática de verdad

`.github/workflows/backup.yml` estaba escrito desde la ronda anterior
pero sin comitear —un workflow nuevo con acceso SSH al servidor es
sensible, quedó pendiente del visto bueno explícito de Mario—. Lo dio el
2026-09-24 («si quieres hagamos lo de GitHub»): secreto
`BACKUP_PASSPHRASE` creado en el repositorio y workflow comiteado.

Probado disparándolo a mano (`workflow_dispatch`), no dado por bueno sin
más: volcó los 23 proyectos, las 11 personas del equipo y los 199
ficheros de material, cifró, verificó que se descifra, y quedó guardado
en dos sitios —`~/backups` del servidor (152 MB) y como artifact de
GitHub (90 días, 159 MB)—. Corre solo cada domingo a las 03:00 UTC desde
ahora.

## 2026-09-24 (94) — SEO Fase 3 (parte 2): tipos de encargo, fase cerrada

Preguntado a Mario si de verdad se hacen encargos de inmobiliaria/
industria y de deporte —los otros dos tipos que se plantearon al
empezar la Fase 3—: «tipos de encargo nada». Coincide con lo que ya se
veía en el portfolio (ninguna evidencia de ninguno de los dos), así que
se escribió sólo con lo que sí tiene trabajo real: cine y publicidad
(MITT MOTORS), eventos y festivales (Monegros, DURO, Fabrik,
Metropolitano).

Con esto se cierran las cuatro secciones que pedía la Fase 3 —permisos y
normativa, tipos de encargo, qué hace falta para el presupuesto, plazos y
formatos— más los enlaces reales al portfolio de drone. La página pasó de
~280 a 900 palabras reales, sin relleno: no se ha forzado para llegar a
las 1.200 que pedía el objetivo original, porque eso habría significado
escribir contenido que no aporta sólo por contar palabras, justo lo que
se pidió explícitamente no hacer.

Comprobado con `curl`: las dos categorías nuevas visibles en la página, en
los dos idiomas. Medido con la auditoría: 85/100 (+4 sobre la Fase 6) —
sube también «Media del sitio ≥600 palabras» a 4/4, con las páginas de
ciudad de la Fase 6 ya contando. Foto en `docs/seo/fase3final.json`.

**Con esto se cierra la tanda completa de SEO de esta sesión (Fases 1, 2,
3, 4, 5, 6, 7, 8 y 9): 53/100 → 85/100.** Lo único que queda fuera del
alcance de un cambio de código son dos comprobaciones manuales que
dependen de herramientas externas: la ficha de Google Business (creada,
pendiente del vídeo de verificación) y los dominios que enlazan a la web
(hace falta Search Console o una herramienta como Ahrefs).

## 2026-09-24 (93) — SEO Fase 6: páginas de ciudad, sólo Madrid y Barcelona

De las cinco ciudades pedidas (Madrid, Barcelona, Valencia, Sevilla,
Málaga), sólo en dos hay trabajo de drone real: Mario asignó cada
proyecto a su ciudad de viva voz, venue por venue —los nombres de sitio
(Fabrik, DURO...) no dicen la ciudad por sí solos, no se ha adivinado
ninguno—. Sin eso, esto habrían sido páginas plantilla con el nombre
cambiado: justo las doorway pages que Google penaliza y que se pidió
explícitamente evitar.

**Madrid** (`content/ciudades-drone.ts`): 13 piezas — Fabrik (siete:
Fátima Hajji, Adrián Mills en Area 19, Fabrik 150, Sala en rojo, Cabina y
público, Sala llena, En cabina), FITZ, MITT MOTORS, Metropolitano,
Prospa, y las dos postales aéreas de la ciudad. **Barcelona:** 3 piezas,
todas del mismo festival DURO —pirotecnia, el recinto de noche, el
recinto lleno—. El resto de proyectos reales del portfolio quedan fuera
a propósito: Holika es La Rioja, Monegros es Huesca, GORDO es Líbano, la
costa aérea y el pueblo sobre el mar son Mallorca.

Mismo mecanismo que la Fase 2 para no duplicar carpetas: una única ruta
física (`app/[locale]/ciudad-drone/[ciudad]`) sirve las dos URLs bonitas
—`/es/grabacion-con-drone-madrid`, `/es/grabacion-con-drone-barcelona`—
vía rewrites, con `generateStaticParams` limitado a las ciudades reales:
cualquier otra ciudad da 404, no relleno —comprobado pidiendo
`/es/grabacion-con-drone-valencia` y la ruta interna
`/es/ciudad-drone/valencia` directamente: las dos 404—.

Contenido real y distinto por ciudad, con enlaces a las piezas concretas
del portfolio, y un enlace cruzado entre las dos páginas de ciudad —no un
enlace nuevo desde el resto del sitio, que sigue sin repartir nombres de
ciudad fuera del FAQ y de estas páginas, tal y como quedó decidido el
2026-09-10—.

Comprobado con `curl`: las dos páginas reales a 200 en los dos idiomas,
Madrid con 13 enlaces al portfolio y Barcelona con 3, el canónico
correcto en cada una, el sitemap con las cuatro URLs. Barrido completo de
las 70 páginas del sitio: todas a 200. Medido: 81/100 (+2 sobre la Fase
3 parte 1) — el bloque de SEO local sube a 13/20. Foto en
`docs/seo/fase6.json`.

## 2026-09-24 (92) — SEO Fase 3 (parte 1): permisos, presupuesto, entrega y portfolio de drone

La página de drone tenía ~280 palabras, hacía falta ~1.800. Cuatro
secciones nuevas, con datos reales que dio Mario directamente —nada
inventado—:

**Permisos y normativa:** las cuatro categorías AESA (A1/A3, A2, STS-01,
STS-02) desde 2022, año de fundación de la productora; alta como operador
UAS; seguro de responsabilidad civil (sin nombrar aseguradora, no se
dio). El vuelo sobre público está explicado con precisión, no como
promesa suelta: las categorías específicas permiten volar dentro de una
zona CONTROLADA en un entorno poblado, no sobrevolar al público sin ese
control —es una distinción real de la normativa AESA/EASA, no una
licencia para escribir cualquier cosa—. Vuelo nocturno y zonas
restringidas van como consideraciones operativas reales, no
certificaciones aparte que no están confirmadas.

**Qué hace falta para el presupuesto:** localización, fechas, aforo, si
hay vuelo sobre público, permisos del recinto.

**Plazos y formatos:** el mismo dato ya establecido en el resto del sitio
(24-48h, encuadre abierto para los cortes verticales sin recortar).

**Trabajo con drone:** enlaces reales a las 12 piezas de drone del
portfolio, sacados de `traeProyectos()` filtrando por categoría —no una
lista escrita a mano que se desincroniza en cuanto se añade un proyecto—.

Mismo patrón visual que ya usaba la flota (lista numerada de artículo) y
«Cómo volamos» (dos columnas): nada de diseño nuevo.

**Queda pendiente «tipos de encargo»** (cine/publicidad, eventos/
festivales, inmobiliaria/industria, deporte): en el portfolio sólo hay
evidencia real de los dos primeros —ningún proyecto de inmobiliaria ni de
deporte—. Preguntado a Mario antes de escribirlo; en cuanto conteste se
añade en un commit aparte.

Comprobado con `curl` contra el HTML servido: las categorías visibles,
los 12 enlaces al portfolio correctos, la página sigue a 200. Medido:
787 palabras (de 280), 79/100 (+1 sobre la Fase 9+4) — el criterio de
≥1.200 palabras sube de 0/5 a 1/5, y con la parte que falta debería
cerrar del todo. Foto en `docs/seo/fase3parte1.json`.

## 2026-09-24 (91) — SEO Fases 9 y 4: teléfono, dirección y negocio local

Datos reales, dados por Mario directamente, letra a letra iguales a la
ficha de Google Business —si no coinciden exactamente, Google lo nota y
resta—: teléfono `+34 614 96 36 93` (también el WhatsApp Business de la
empresa), dirección Calle de Cuba 43, Fuenlabrada, Madrid. Seguro de
responsabilidad civil confirmado, sin nombrar aseguradora. Sin rango de
precios: Mario prefirió no darlo, no se inventa.

**Fase 9:** teléfono y dirección en TEXTO en el pie —no en una imagen, que
Google no lee—. La dirección lleva una ciudad, lo que toca la decisión de
2026-09-10 de no repartir ciudades por el sitio; queda anotada la
enmienda en el propio diccionario (`content/dictionaries/es.ts`), a
propósito y explicada, no un descuido: una dirección no es la lista de
«dónde trabajamos» que aquella decisión reservaba al FAQ.

**Fase 4:** el `Organization` de la Fase 2-SEO anterior pasa a
`ProfessionalService` —lo EXTIENDE, sigue siendo una Organization en el
vocabulario de schema.org, por eso es un único bloque (`datosNegocio()`
en `lib/metadata.ts`) y no dos scripts separados describiendo la misma
empresa—. Lleva teléfono, email, dirección postal completa (sin código
postal: no se dio uno, mejor omitirlo que inventarlo) y `areaServed`
España entera, que es lo que ya dice el FAQ («con base en España...
fuera de ahí también»), no una limitación nueva.

**De paso, dos fallos reales en el propio auditor**, corregidos antes de
fiarse de sus números: el patrón de teléfono sólo reconocía grupos de
3-3-3 cifras o `+34` pegado a 9 cifras seguidas, y el teléfono real se
escribe 3-2-2-2 con espacios —habría dado «no» con el teléfono puesto
delante en la página—; y el criterio «Organization» no reconocía
`ProfessionalService` como su propia extensión.

Comprobado con `curl` contra el HTML servido: el `tel:` del pie, el texto
de la dirección, y el bloque `ProfessionalService` completo con los
cuatro campos. Medido: 78/100 (+9 sobre la Fase 8) — el bloque de SEO
local pasa de 0/20 a 10/20. Foto en `docs/seo/fase9y4.json`.

## 2026-09-24 (90) — SEO Fase 8: migas de pan en portfolio, fichas y servicios

Sin `BreadcrumbList`, Google enseña la URL pelada en el resultado de
búsqueda en vez de la ruta (Inicio › Trabajo › Holika — el portal). Nueva
función `datosMigas()` en `lib/metadata.ts`, reutilizada en las tres
páginas pedidas: `/portfolio`, cada ficha de proyecto y `/services`.

Sólo el schema, sin rastro visible en la página: no se pidió una miga de
pan en pantalla, y así no toca el diseño actual —igual que `Organization`
o `FAQPage` tampoco tienen contrapartida visible en esta web—. La ficha
de proyecto la lleva también en las fichas «placeholder» (material
pendiente): describe dónde vive la página en la estructura del sitio, no
si el contenido ya está terminado.

Comprobado con `curl` contra el HTML servido en las tres páginas, en los
dos idiomas, con la ruta completa y las URLs correctas. Barrido completo
de las 66 páginas del sitemap: todas a 200. Medido con la auditoría:
69/100 (+2 sobre la Fase 7) — el bloque de datos estructurados llega a
10/10.

## 2026-09-24 (89) — SEO Fase 7: alt de verdad en las miniaturas del portfolio

45 de las 61 imágenes de `/es/portfolio` llevaban `alt=""` —medido contra
el HTML real, no contando de memoria—. De esas, 22 son decoración de
interfaz de verdad (el logo, los duplicados desenfocados de fondo, las
copias apiladas detrás de una serie de fotos) y se quedan igual: ahí
`alt=""` está bien puesto, tal y como se pidió no tocar.

Las otras 23 son la miniatura de cada proyecto en la lista lateral de
Trabajo (`trabajo-youtube.tsx`), una por ficha, y eso sí es contenido: con
`alt=""` no salen en Google Imágenes. El texto sale del título y la
disciplina del proyecto («Holika — el portal — Drone»), reutilizando
`disciplinas()` de `medios.ts` —el mismo texto que ya se lee al lado en
pantalla, no uno inventado aparte—.

Comprobado con `curl` contra el HTML servido: de 61 imágenes, 39 ya
descriptivas (16 de antes + 23 nuevas) y 22 siguen en `alt=""`, exactas
las que debían quedarse así. De paso, el propio criterio del auditor
—un ratio bruto sobre las 61, que nunca podía llegar a la nota máxima
por bien que se hiciera el trabajo, porque ~36 % de las imágenes son
decorativas a propósito— se corrigió para no contar lo declarado
`aria-hidden`. Medido: 67/100 (+3 sobre la Fase 5). Foto en
`docs/seo/fase7.json`.

## 2026-09-24 (88) — SEO Fase 5: página propia para preguntas frecuentes

El contenido ya existía (`dict.faq`) pero sólo vivía dentro de Contacto
(`contacto-tarjetas.tsx`), sin ruta propia que Google pudiera indexar ni
enlazar desde fuera. Nueva página `/faq`, `/en/faq`: ruta en `ROUTES`,
entrada en el sitemap, enlace en el pie, mismo diseño de desplegables que
ya tenía Contacto —no se inventa uno nuevo—.

La sección de Contacto se deja tal cual está —sigue siendo útil ahí, a
media conversación con el formulario—, sólo se le quita el schema
`FAQPage`: dos páginas con el mismo contenido y el mismo schema es justo
el duplicado que penaliza Google. `FaqJsonLd` (`comun.tsx`) ahora toma la
ruta de quien llama en vez de tenerla fija a `/contact`, así que el `@id`
siempre apunta a la página real que lo usa —ahora sólo `/faq`—.

De paso, una pregunta que faltaba de las pedidas («qué pasa si llueve»)
con una respuesta genérica y cierta —el drone no vuela con lluvia o
viento fuerte por seguridad del propio aparato—, sin inventar ninguna
política de la empresa que no se conoce.

**Un tropiezo real que vale la pena anotar:** editar `content/dictionaries/es.ts`
NO bastó para que la pregunta nueva saliera en la web. Desde la Fase 2 del
panel, `lib/dictionaries.ts` sustituye `faq.items` por lo que haya en la
colección «Preguntas» de `/admin` si tiene algo —y ya tenía las 9 de
siempre—, así que el fichero sólo es el plan B. Hubo que volver a correr
`/admin-carga` para sincronizar el fichero con la base: creó la pregunta
10ª y actualizó (sin cambiar nada de contenido) las 23 fichas de
proyectos y las 11 de equipo, que ya coincidían con sus ficheros. Si
algún día Mario edita un proyecto o una persona a mano desde el panel sin
tocar el fichero correspondiente, volver a correr `/admin-carga` le
pisaría ese cambio — no fue el caso esta vez, comprobado contra la web
real tras el sync, pero es un efecto secundario real de esa ruta que
conviene tener presente.

Comprobado con `curl` contra el HTML servido: `/es/faq` y `/en/faq` a 200,
el schema `FAQPage` presente en `/es/faq` y ausente en `/es/contact`, el
sitemap con las dos URLs nuevas, y el enlace del pie. Medido con la
auditoría: 64/100 (+2 sobre la Fase 2). Foto en `docs/seo/fase5.json`.

## 2026-09-24 (87) — SEO Fase 2: la página de drone, en una URL con palabras clave

«Drone» a secas no lo busca nadie; «grabación con drone» y «drone
filming», sí. La URL que sirve la página (y la canónica) pasa a ser
`/es/grabacion-con-drone` y `/en/drone-filming`, sin duplicar la carpeta
física `app/[locale]/drone/` que ya existía: `next.config.ts` sirve las
nuevas desde ahí con `rewrites()`. Las viejas (`/es/drone`, `/en/drone`)
mandan un 301 permanente para que Google transfiera lo que ya tuvieran
indexado en vez de partir de cero.

`lib/routes.ts` sigue siendo el único punto de verdad —la decisión
escrita ahí de slugs idénticos entre idiomas se actualizó explicando
esta excepción y por qué—: el canónico y el `hreflang`
(`lib/metadata.ts`) y el `sitemap.xml` (`app/sitemap.ts`) leen de ahí sin
saber nada de rewrites, así que cambiar el mapa bastó para que los tres
salieran ya con las URLs nuevas.

Un tropiezo real con el 301: `redirects()` de `next.config.ts` con
`permanent: true` manda SIEMPRE 308, nunca 301 —decisión explícita de
Next para preservar el método de la petición, no un descuido—. Se pidió
el 301 exacto, así que se hizo a mano en `proxy.ts` con
`NextResponse.redirect(url, 301)`, antes de la comprobación normal de
idioma.

Comprobado con `curl` contra la web real, los cuatro puntos pedidos:
`/es/drone` → 301, `/es/grabacion-con-drone` → 200, el `<link
rel="canonical">` de la página nueva apunta a sí misma, y el `sitemap.xml`
sólo lista las URLs nuevas. Medido con la auditoría: 60/100 (+4 sobre la
Fase 1). Foto en `docs/seo/fase2.json`. De paso, dos fallos reales en el
propio script de auditoría —comprobaba `/es/servicios`, que nunca ha
sido una URL real (`services` no cambió de slug), y seguía apuntando a
la dirección vieja de drone— corregidos antes de fiarse del número.

## 2026-09-24 (86) — SEO Fase 1: el `<h1>` de la portada dice a qué nos dedicamos

Objetivo de negocio: posicionar para «grabación con drone [ciudad]» y
«productora audiovisual drone España». El `<h1>` de siempre era el
eslogan de marca («CAPTURE THE ENERGY. DELIVER THE STORY.»), que no dice
qué hace la empresa — Google no tiene de dónde sacar el tema de la
página con eso.

El eslogan pasa a `<p>` (misma tipografía, mismo `ref`, misma animación de
SplitText — `headlineRef` cambia de `HTMLHeadingElement` a
`HTMLParagraphElement`, nada más). Debajo, un `<h1>` visible de verdad, en
letra pequeña (`.label`, la misma que ya usan otros rótulos del sitio),
con `dict.hero.subtitulo`: «Productora audiovisual y grabación con drone
en España» / «Audiovisual production and drone filming in Spain». Nada de
texto oculto ni `sr-only`: se ve en la página tal cual.

Comprobado con `curl` contra el HTML servido, no dando el build por
bueno: un único `<h1>` en la portada, en los dos idiomas, con el texto
nuevo. Medido con la auditoría del punto anterior: 56/100, +3 sobre la
línea base — el bloque de contenido pasa de "un solo H1" 0/4 a 4/4 en el
criterio "el H1 dice a qué nos dedicamos". Foto guardada en
`docs/seo/fase1.json`.

## 2026-09-24 (85) — Auditoría de SEO con puntuación repetible

Antes de tocar nada de posicionamiento hacía falta una foto del estado
actual medida con una vara fija, para que el "después" se pueda comparar
y no sea una opinión. `scripts/seo-audit.mjs` mide la web PUBLICADA (no
el código) en 7 bloques y 24 comprobaciones, sobre 104 puntos.

    node scripts/seo-audit.mjs                   mide y puntúa
    node scripts/seo-audit.mjs --guardar antes   guarda la foto
    node scripts/seo-audit.mjs --comparar antes  mide y compara

Línea base del 2026-09-24 en `docs/seo/antes.json`: **53/100** (57/108).
Técnico 15/15, metadatos 15/15, rendimiento 10/10 — nada que arreglar
ahí. Los agujeros son contenido (7/29) y SEO local (0/20).

CUIDADO CON UN CRITERIO, que ya se equivocó una vez: la primera versión
contaba `alt=""` como imagen sin texto alternativo y sacaba un 0/3 de
accesibilidad. Es falso —`alt=""` es la forma CORRECTA de marcar una
imagen decorativa— y las 103 imágenes del sitio llevan el atributo.
Comprobado a mano contra el HTML servido antes de corregirlo. Lo que sí
es un hallazgo real, y ahora va a su bloque de contenido, es que 45 de
las 61 miniaturas del portfolio están marcadas como decorativas: son
contenido, y así no salen en Google Imágenes.

Dos comprobaciones no se pueden automatizar desde fuera y puntúan 0
hasta que se confirmen a mano en la constante `MANUAL` del script: la
ficha de Google Business (creada, pendiente del vídeo de verificación) y
los dominios que enlazan (hace falta Search Console). Un 0 honesto antes
que un aprobado inventado.

Dos comprobaciones añadidas después, comparando con un medidor externo
(Seobility) que puntuaba el "servidor" a 0: compresión y redirección de
`www`. La compresión está bien (gzip, 128 KB → 27 KB, HTTP/2), pero salió
un fallo de verdad que aquí no se medía: **`www.sidebflms.com` sirve la web
entera con un 200 en vez de redirigir**. El canónico apunta a la versión
sin `www`, así que Google lo consolida, pero mientras haya dos hostnames
sirviendo lo mismo los enlaces que reciba la web se reparten entre los dos.
Falta el 301 en nginx (ver `despliegue/`).

AVISO SI REPITES LA MEDICIÓN: la pasada de las 18:34 ya llevaba la Fase 1
(el H1 de la portada) desplegada, así que contaminó el "antes". El
`antes.json` está reconstruido a mano —la única comprobación que cambió fue
`h1-negocio`, 0 → 4, verificado comparando las dos salidas enteras— y el
estado con Fase 1 está aparte en `docs/seo/fase1.json`. Lección: guardar la
línea base ANTES de que nadie toque nada.

## 2026-09-24 (84) — Las cuatro fotos de «Cómo lo hacemos», editables

Detalle menor que quedó fuera de las fases numeradas del panel: las fotos
del proceso en Servicios seguían fijas en `content/etapas-fotos.ts`. Nuevo
Global «Cómo lo hacemos (fotos)»; ese fichero sigue siendo el plan B y
también lo que enlaza `/admin-migra-material` la primera vez, con las
cuatro fotos que ya estaban migradas a Media desde la Fase 3 (no hizo
falta volver a subirlas). `proceso-timeline.tsx` y `proceso-movil.tsx`
importaban la constante directamente en vez de recibirla por prop —son
piezas de cliente, por las animaciones de GSAP, y no pueden pedir el dato
ellas mismas—; ahora la reciben desde `services/page.tsx`.

Comprobado en producción tras desplegar: las cuatro fotos seguían
saliendo mientras el Global estaba vacío (plan B), y tras ejecutar
`/admin-migra-material` pasaron a servirse desde `/api/media/file/...`
del panel, sin duplicar ningún documento de Media (sigue en 199).

## 2026-09-24 (83) — Panel, Fase 4: borradores en Proyectos

Pendiente desde el plan original (docs/panel-de-contenido.md, punto 8,
marcada «opcional»): poder dejar una ficha a medias sin que salga en la
web, y verla antes de publicar.

Sorpresa real, encontrada probando de verdad y no dando nada por bueno:
una consulta normal, SIN pasar `draft: true`, NO filtra por `_status`
sola —trae la tabla tal cual, borradores incluidos—. Se creó una ficha en
borrador de prueba y apareció en el portfolio público, en la portada y en
el sitemap sin haberla publicado. Arreglado filtrando `_status: published`
a mano en la consulta de Proyectos (`lib/contenido.ts`).

La vista previa en vivo ya existente se extiende para enseñar un
borrador: la URL del iframe lleva `?borrador=1` sólo cuando la ficha no
está publicada, y el lado servidor sólo atiende ese parámetro si hay una
sesión de Payload de verdad en la petición —comprobado con `curl` sin
cookies contra una ficha real con `?borrador=1`: respuesta idéntica a sin
el parámetro—.

La migración generada tenía el mismo tropiezo que la de la Fase 3: el
`DEFAULT 'draft'` de la columna nueva se habría aplicado también a los 23
proyectos YA PUBLICADOS, sacándolos de la web pública en el instante de
aplicarse. Reproducido de verdad contra una copia de la base con los 23
proyectos reales antes de tocar producción, y arreglado con un `UPDATE`
explícito a `published` para las filas existentes. Verificado en
producción tras el despliegue: los 23 proyectos siguen publicados y la
web pública sirve los mismos 23 enlaces de siempre.

## 2026-09-24 (82) — Copia de seguridad semanal: la base y el material

Pendiente desde que se montó el panel (Fase 1): sin esto, un borrado
accidental en `/admin` no tenía vuelta atrás. Mismo patrón que ya
funciona en inventario-sidebfilms —`pg_dump`, cifrado con GPG, verificado
descifrándolo y comparándolo con el original—, con dos adaptaciones: la
conexión es por campos sueltos y no una URL (la contraseña de Hestia
parte una URL), y el paquete cifrado lleva también `~/sidebflms-web/media`,
que desde la Fase 3 vive fuera de la base de datos.

De paso, ahora que la web es pública: `media/` se suma a la ruta rápida
de `publicar.sh` con un ENLACE simbólico (no una copia) hacia
`~/sidebflms-web/media`, para que nginx sirva las fotos y vídeos del
panel directamente, sin pasar por Node —comprobado con las cabeceras de
caché larga que ya llevaban `_next/static`—, y para que subir o borrar
algo en `/admin` se note al momento en vez de esperar a un despliegue.

Probado el script de copia de verdad en el servidor, con una frase
efímera: 23 proyectos, 11 personas del equipo, 199 ficheros de material,
cifrado verificado, y limpiado después. El workflow que lo automatiza
cada domingo (`.github/workflows/backup.yml`) está escrito pero sin
comitear: crear el secreto `BACKUP_PASSPHRASE` del repositorio es una
acción que hay que aprobar aparte, no algo que se pueda hacer solo.

## 2026-09-24 (81) — La web ya es pública: sin contraseña

Mario: «quita el user y contraseña ya». Bastaba con borrar el `.htpasswd`
del servidor —así lo dejó escrito `despliegue/proxy-php/htaccess` desde
que se montó, sin tocar ningún fichero ni reiniciar nada— y volver a
desplegar para que `publicar.sh` detectara su ausencia y copiara
`.next/static` y `public/` dentro de `public_html`, para que nginx sirva
esos ficheros directamente en vez de pasarlos por PHP y Node. Antes de
esto, cualquier visitante veía primero un cuadro de usuario/contraseña de
Apache; ahora `sidebflms.com` se abre directo.

Comprobado de verdad tras el despliegue, no dado por hecho: las 64
páginas del `sitemap.xml` y los 182 ficheros de material a 200, `/admin`
sigue accesible para Mario pero fuera del `robots.txt`, y un estático real
del build (`/_next/static/...`) sirviéndose ya con cabeceras de caché
larga puestas por nginx, no por Node.

El `.htpasswd` no se ha borrado del repositorio porque nunca vivió ahí —lo
puso Mario a mano en el servidor el 2026-09-10—; sólo se ha borrado del
servidor. Si algún día hiciera falta cerrarla otra vez (una demo a un
cliente concreto, por ejemplo), basta con volver a crear ese fichero y
desplegar: el `<IfFile>` del `.htaccess` vuelve a pedir contraseña solo.

## 2026-09-24 (80) — Intro: colores invertidos, lámina negra y casete naranja

Mario: «cambiarlo de color e invertirlo, en vez de naranja negro y las
líneas naranjas en vez de negro». Misma animación de siempre —se dibuja en
el color que mejor se lee sobre la lámina y termina en el color exacto de
la lámina, para fundirse con ella al abrirse la ventana—, sólo que ahora
la lámina es negra y el casete se dibuja en naranja de marca, terminando
en negro. Cambia también el botón «Saltar intro», que tenía que seguir
siendo legible sobre el fondo nuevo (naranja sobre negro, antes negro
sobre naranja).

Comprobado en el navegador, fotograma a fotograma, no sólo mirando el
código: el trazo en naranja mientras se dibuja, el logo completo legible,
el instante exacto en que la ventana se abre y el contorno se funde con el
negro del fondo, y el tramo final con las líneas ya en negro sobre el
vídeo real. El primer intento de desplegarlo falló a media compilación
—el servidor se quedó sin memoria (137, sin swap configurado)—; el
segundo intento, sin cambiar nada, terminó bien pero llegó a quedarse con
sólo 144 MB libres. No es un fallo de este cambio, es un límite real del
servidor que conviene tener en cuenta si los despliegues empiezan a fallar
así más a menudo.

## 2026-09-24 (79) — Grave: 72 de 182 ficheros de material daban 500

Mario, antes de publicar: «revisa todo todo y que todo funcione». No fue una
revisión de pantalla: se pidió, una por una, la URL de cada página real (66)
y de cada fichero de material que esas páginas referencian (182), contra el
proceso de producción. Encontró un fallo real que ninguna comprobación
anterior de la Fase 3 había pillado.

### Qué pasaba

Las tres cintas de la portada, la tira de «otros proyectos» de cada ficha, el
fondo de la sección Drone y las galerías de fotos (FITZ, Monegros fotografía)
daban **500 al navegador del visitante** en todas y cada una. Ninguna página
fallaba al compilar ni al desplegar —por eso no se había visto—: el material
lo pide el navegador después de cargar la página, no el servidor al
generarla.

### La causa

`home-sliders.tsx`, `hero-frame.tsx`, `ficha-vecinos.tsx`, `services/page.tsx`
y `medios.ts` construyen las versiones ligeras —cintas de 854×480 mudas,
fotos en `.webp` a 800/1600— **por el nombre del fichero**, no por un dato
guardado: `video.replace(/\.mp4$/, "-cinta.mp4")`. Con rutas de texto sobre
`public/media` eso funcionaba siempre, porque `scripts/cinta-web.sh` y
`scripts/pieza-web.sh` generan esas versiones como hermanas del original en
el mismo sitio. Con la colección Media de la Fase 3, esa convención de
nombre deja de bastar: si nadie sube el hermano como su propio documento, el
nombre apunta a nada.

`/admin-migra-material` sólo seguía los campos explícitos de
`content/projects.ts` —`video`, `poster`, `vertical`, `gallery`—, así que
subió 110 de los 199 ficheros y dejó fuera justo los 89 que ningún campo
menciona: las cintas y las galerías en `.webp`.

### El arreglo

`app/admin-migra-material/route.ts` suma una pasada final,
`subeCarpetaEntera`: sube TODO lo que haya en `public/media`, lo mencione un
campo o no. No persigue cada patrón de nombre —«-cinta», «-800», «.webp»—
uno a uno; sube la carpeta entera y deja que la convención de nombre
encuentre su fichero.

### Cómo se comprobó

Local primero, contra el Postgres desechable: los 182 ficheros de material
de las 66 páginas reales, uno a uno, 0 fallos. Visual en el navegador: las
tres cintas de la portada y la galería de FITZ con imágenes de verdad, no
sólo el código 200. Sólo entonces, en producción: migración repetida (89
ficheros nuevos, exactamente los que faltaban), y la misma comprobación de
las 66 páginas y los 182 ficheros repetida contra el proceso real —un túnel
SSH al puerto de Node, no la web pública, para no depender de la contraseña
de Apache—, con el navegador real y su consola, no sólo `curl`: 0 fallos.

**Un aviso, no un fallo persistente:** durante la migración en producción
salieron 8 líneas `ERROR: File … is missing on the disk` en el registro,
todas de ficheros «-cinta» justo en el momento de subirse. Comprobado después
de la migración: los 199 ficheros están en disco, las 199 filas están en la
base, y las 182 URLs de las páginas reales responden 200. Es una carrera
—Payload comprobando un fichero en el instante entre crear la fila y
terminar de escribirlo— que se resuelve sola, no una corrupción. Anotado por
si vuelve a aparecer en una migración futura y hace falta reconocerlo rápido.

### Qué hacer al actualizar

En el servidor, si alguna vez se repite `/admin-migra-material` desde cero
—una base nueva, un disco nuevo—, esta versión ya sube la carpeta entera:
no hace falta ningún paso extra.

---

---

## 2026-09-24 (78) — Vista previa en vivo en el panel

Mario, tras ver el panel de la Fase 3: «lo suyo sería que en el panel de la
web pudieras ir página por página… y dentro de cada página poder tocar todo
de cada cosa». Un panel agrupado por página de verdad no es posible —un
proyecto sale a la vez en la portada, en Trabajo y en su ficha, no
pertenece a una sola página—, así que se ofrecieron dos caminos reales
—reordenar el menú, o ver la página de verdad al lado del formulario— y
Mario eligió el segundo. Detalle completo en `docs/panel-de-contenido.md`,
punto 15.

### Qué hay

La pestaña «Live Preview» de cada ficha —Proyectos, Equipo, Preguntas,
Cifras, Clientes, Textos— enseña la página real dentro de un `<iframe>`, al
lado del formulario, y se actualiza sola al guardar. No es letra a letra,
antes de guardar —eso exige convertir buena parte de la web a piezas de
cliente, un proyecto mucho más grande—: es la página de verdad, lista justo
después de cada guardado.

### Dos cosas no evidentes que hicieron falta

1. La web cierra el paso a que la metan en un iframe (`frame-ancestors
   'none'`, cerrado a propósito en la revisión de seguridad del
   2026-09-22). Se cambió a `frame-ancestors 'self'` —sólo el propio
   dominio, nunca uno de fuera— para que el panel sí pueda enseñarla.
2. Payload no manda ningún aviso de «se ha guardado» hasta que la propia
   página del iframe se lo confirma primero —un apretón de manos que no
   está escrito en ningún sitio a la vista, encontrado leyendo el código
   de `@payloadcms/ui`—, y la señal correcta para «se ha guardado» no es
   la que parecía obvia (comparar `updatedAt`, que resultó no fiable en un
   Global) sino un mensaje aparte que Payload manda para esto exactamente.
   Ambas cosas se comprobaron con un listener puesto a mano dentro del
   iframe, guardando de verdad una y otra vez hasta ver llegar lo correcto.

### Qué hacer al actualizar

Nada. Se aplica solo con el despliegue.

---

## 2026-09-24 (77) — Panel, Fase 3: el material se sube desde la ficha

Mario: «ve con la fase 3». Vídeo, póster, vertical, galería y foto del
equipo dejan de ser una ruta de texto (`/media/loquesea.mp4`, escrita a mano
en el panel o en código) y pasan a ser una subida de verdad, con su propia
colección **Media** (`docs/panel-de-contenido.md`, punto 14).

### Qué se puede hacer ahora

Arrastrar el fichero —ya convertido a su versión ligera en el Mac, con los
scripts de siempre— al campo de la ficha (Vídeo, Póster, Foto…) y guardar.
Payload le pone miniatura, peso y, en fotos, las dimensiones. El material
nuevo se guarda en `~/sidebflms-web/media`, **fuera del repositorio**: el
repositorio deja de engordar con cada proyecto.

Los 199 ficheros que ya estaban en `public/media` se migraron una sola vez
con `/admin-migra-material`, que lee las rutas de siempre de
`content/projects.ts`/`content/team.ts`, sube cada fichero real y enlaza la
ficha. `public/media` se queda en el repositorio —no se ha borrado nada—,
pero la web ya no lee de ahí.

### Dos fallos reales, encontrados antes de tocar producción

1. **403 en todas las fotos y vídeos.** Por defecto Payload exige estar
   identificado hasta para leer, y hasta ahora daba igual porque la web sólo
   pedía contenido por la API interna. El material lo pide el navegador del
   visitante, sin sesión, así que necesitaba lectura pública explícita
   (`access.read` en la colección Media). Se encontró pidiendo el fichero
   por HTTP de verdad, no dándolo por sentado.
2. **La migración habría fallado a mitad en producción.** Añadía una
   columna obligatoria (`NOT NULL`) a la tabla de la galería, que en el Mac
   de pruebas estaba vacía pero en producción ya tenía 15 filas (las fotos
   de Fitz y Monegros). Postgres no deja eso en una tabla con datos. Se
   reprodujo con 15 filas de prueba insertadas a mano antes de aplicar la
   migración, y se corrigió el fichero de migración a mano.

### Cómo se comprobó

Migración aplicada dos veces contra el Postgres de pruebas —con datos
previos simulando producción la segunda vez—, `up` y `down` los dos
probados de verdad (el `down` que generó la herramienta también estaba
roto: se corrigió). Después, 60 páginas con el texto visible comparado
carácter a carácter (igual) y 934 referencias de material en 52 páginas
comparadas por nombre de fichero (ninguna discrepancia real). Y en el
navegador: una ficha reproduciendo su vídeo, la rejilla de Nosotros con las
once fotos, y el propio campo de subida del panel con la miniatura.

### Qué hacer al actualizar

Nada en local para trabajar en el resto de la web. En el servidor, la
migración se aplica sola en el despliegue. Igual que en la Fase 2, el
material que ya existía hay que **enlazarlo una vez** con
`/admin-migra-material?clave=…` —después de `/admin-carga`, que tiene que
haber corrido antes—: sin eso, los campos de material se quedan vacíos
hasta que alguien los rellene a mano desde el panel.

---

## 2026-09-23 (76) — Panel, Fase 2: cifras, clientes, preguntas y entradillas

Mario, tras entrar por primera vez en el panel: «me muestra algunas cosas pero
esta bastante incompleto». Tenía razón: la Fase 1 sólo cubría proyectos y
equipo. Esto es la Fase 2 completa del plan
(`docs/panel-de-contenido.md`, punto 13).

### Qué se puede editar ahora desde `/admin`

- **Cifras**: la ficha técnica de la portada y de Nosotros.
- **Clientes**: la cinta de nombres de Trabajo.
- **Preguntas frecuentes**: el FAQ de Contacto.
- **Textos**: la entradilla de Servicios, Trabajo, Trabaja con nosotros,
  Contacto, Nosotros y Drone.

Los titulares, el menú y los botones se quedan en código a propósito: son
arrays de líneas pensados para la animación de entrada, y un formulario de
texto libre los rompería sin que se note por qué.

### Cómo está hecho

Mismo patrón que Proyectos y Equipo: colección o Global en
`panel/colecciones.ts`, se lee con `lib/contenido.ts` (con plan B a código si
la base no responde), y al guardar se avisa a la web sola. Las preguntas y
las entradillas tienen una diferencia: en vez de ser props sueltas, se
**superponen dentro de `getDictionary()`** (`lib/dictionaries.ts`) encima del
diccionario de siempre —que sigue siendo el único sitio donde vive ese texto
en código, sin copia en ningún otro fichero—, así que los componentes que
leen `dict.loquesea` no han cambiado ni uno.

### Un tropiezo real, encontrado al comprobar de verdad

Comparando el texto de ocho páginas (compiladas desde ficheros vs. desde la
base) salió que las cifras aparecían **sin su rótulo en español**. La causa:
`/admin-carga` escribía primero el español y luego el inglés sobre el mismo
Global, y la segunda pasada no llevaba el `id` de fila que puso la primera —
Payload no fusiona un array entre idiomas, lo reemplaza entero si no
reconoce las filas—, así que creaba filas nuevas sin traducción al español.
Arreglado guardando los `id` de la primera escritura y reutilizándolos en la
segunda. Vuelto a comprobar: las 14 páginas, carácter a carácter, iguales.

### Qué hacer al actualizar

Nada en local. En el servidor la migración se aplica sola en el próximo
despliegue (`publicar.sh` ya corre `payload migrate`). El contenido nuevo
—cifras, clientes, preguntas y entradillas— hay que **cargarlo una vez** con
`/admin-carga?clave=…`, igual que se hizo con proyectos y equipo en la
Fase 1: sin eso, esas cuatro cosas seguirán sirviéndose desde código —que es
el plan B, no un error— hasta que se carguen.

---

## 2026-09-23 (75) — El despliegue ya no deja la web a medias mientras compila

Mario entró en `sidebflms.com/admin` y vio «Internal Server Error». Fue a las
01:03:37: justo cuando el despliegue de un commit de documentación estaba
haciendo `npm ci` (que vacía `node_modules` entero y lo vuelve a llenar) y
`npm run build` (que reescribe `.next`) **debajo del proceso que seguía
sirviendo**. Cualquier página no precompilada —el panel lo es— reventaba con
«Cannot find module». A las 01:04:30 arrancó el proceso nuevo y todo volvió.

No era nuevo: había **1.834** errores así en el registro. Pasaba en cada
despliegue desde el principio, pero las páginas normales son estáticas y
aguantaban, así que nadie lo vio hasta que hubo un panel dinámico.

### Qué cambia

- `next.config.ts`: `distDir` sale de `SIDEB_CARPETA_COMPILACION`; sin ella,
  `.next` como siempre. Al arrancar nunca se define.
- `despliegue/publicar.sh`: compila en `.next-nueva` mientras la web sigue
  sirviendo desde `.next`. Y `npm ci` sólo corre si cambió `package-lock.json`
  (huella en `node_modules/.sello-package-lock`; si borras `node_modules`, se
  va con ella y reinstala).
- `despliegue/sidebflms-web.sh estrenar`: para, renombra `.next` →
  `.next-anterior` y `.next-nueva` → `.next`, arranca. Milésimas. Para volver
  atrás: `parar`, `mv .next .next-rota && mv .next-anterior .next`, `arrancar`.
- El rsync del deploy y el `.gitignore` ignoran las dos carpetas nuevas.

### Qué hacer al actualizar

Nada en local. En el servidor, el primer despliegue con esto reinstala una vez
(no hay huella todavía) y a partir de ahí sólo cuando cambien dependencias. Un
despliegue que sí las cambie sigue teniendo esa ventana de un minuto en las
páginas dinámicas: sin root no hay forma limpia de evitarla; se cura sola.

---

## 2026-09-17 (74) — Intro de la portada: el casete como ventana del reel

Mario, con una referencia de unas letras gigantes que dejan ver un vídeo por
dentro: «me gustaría que la web tuviera esto de intro, pero con nuestro logo
del casete, y obviamente en naranja».

### Cómo se ve

Fondo naranja de marca a pantalla completa. En el centro, **el casete hace de
ventana**: el cuerpo deja ver el reel y los detalles —bobinas, etiqueta,
ranura, la zona de la cinta, los tornillos— quedan recortados en naranja. A los
2,4 s el casete crece acelerando hasta que el vídeo llena la pantalla, y la
capa naranja se funde con la portada, que tiene ese mismo reel de fondo. Unos
3,8 s en total. Se salta con un clic en cualquier sitio, con Escape o con el
botón «Saltar intro».

### La silueta: dibujada en macizo

`public/logo/intro-mascara.svg`. **El casete del manual está hecho de líneas
finas**, y como ventana apenas dejaría ver vídeo: la referencia funciona porque
las letras son muy gruesas. Así que es el mismo casete, con las proporciones del
PNG-05 del manual, pero macizo. Comprobado en navegador leyendo la transparencia
punto a punto (cuerpo y discos de las bobinas dejan ver; etiqueta, anillos,
ranura, cinta y tornillos no) y con una vista previa real compuesta en canvas.

Ojo si se toca: los huecos se hacen con una `<mask>` interna del SVG, porque
`mask-image` lee la TRANSPARENCIA y no el color. Y la vista rápida de macOS no
entiende esa máscara y lo enseña como un cuadrado: para mirarlo, un navegador.

### Cuándo sale

- **Sólo al cargar la portada** (`/`, `/es`, `/en`), **una vez por sesión** del
  navegador.
- **Nunca al llegar navegando** desde otra página de la web: esa persona ya
  está dentro. Comprobado con la sesión limpia.
- **Nunca con «reducir movimiento»** activado en el sistema.
- **`?intro=1` la fuerza** —`sidebflms.com/es?intro=1`—, para poder verla
  cuando ya salió en la sesión o en un equipo con «reducir movimiento».

### Tres cosas del montaje que costaron y conviene saber

1. **El script que decide va en la CABECERA del documento** (`layout.tsx`),
   y marca `<html data-intro="si">`. El CSS la esconde salvo con esa marca, así
   que al recargar no hay ni un fotograma naranja. La primera versión ponía el
   script junto a la intro, en la página, y **no se ejecutaba nunca**: Next
   manda el contenido de la página por partes y lo encaja con JavaScript, y un
   `<script>` en línea que llega así no corre.
   Tampoco sirve `next/script` con `beforeInteractive`: según su propia
   documentación, no garantiza ejecutarse antes de pintar, y eso traería el
   fogonazo.
2. **El crecimiento del casete lo anima JavaScript, no `@keyframes`.** Con
   `@keyframes`, el tamaño de la máscara saltaba de golpe a mitad de camino:
   `-webkit-mask-size` no interpola en Chrome. Con la Web Animations API y
   píxeles explícitos crece suave; medido: 648 → 702 → 1.345 → 3.228 → 10.009
   → 18.000 px entre los 2,4 y los 3,5 s.
3. **El tamaño final (2000vmin) está calculado**, no a ojo: al crecer, los
   huecos crecen también, y con un valor menor la bobina derecha asomaba por el
   borde justo al final. Explicado en `globals.css`.

El vídeo de la intro es el mismo fichero que el de la portada según el ancho
(`reel-1920` o `reel-720`), para que la caché lo reutilice y no se descargue
dos veces. Si la intro no sale, su vídeo no lleva `src` y no descarga nada.


### Integrada sobre la versión glass de Joan

Cuando fue a subirse, `main` tenía diecisiete cambios de Joan del 16 y el 17
—la versión glass, arreglos de autoplay en móvil y ajustes en varias páginas—
que tocaban los mismos cinco ficheros. Se juntó encima de lo suyo, sin pisar
nada, y se adaptó la intro a lo que él había resuelto:

- **Ruta base.** La versión glass se puede publicar bajo una ruta
  (`lib/base.ts`). Todo lo que la intro pide a `public/` pasa por `conBase`, la
  máscara llega al CSS por la variable `--intro-mascara` (una URL fija en la
  hoja apuntaría a la web original), y el script de la cabecera reconoce la
  portada con la ruta delante. Comprobado compilando con
  `NEXT_PUBLIC_BASE_PATH`: la expresión y la URL de la máscara salen con el
  prefijo.
- **iPhone.** El vídeo arranca con `arrancaEnSilencio` (`lib/autoplay.ts`), y el
  contenedor del vídeo **no lleva transformaciones**: Joan comprobó que con
  ellas WebKit no arranca el reel. La entrada es sólo de opacidad.
- **El botón «Saltar intro»** se centra con márgenes: la animación de entrada
  con `transform` le pisaba el `translateX(-50%)` y lo descentraba al acabar.
- El reel es el mismo fichero que usa `hero-frame.tsx`, para que la caché lo
  reutilice.

**Sin probar en un iPhone de verdad**: en el Mac donde se hizo no hay Xcode ni
simulador. La máscara es imprescindible para el efecto; si algún iPhone no
arrancara el vídeo bajo ella, se vería el póster, que es un fotograma del reel.
Conviene mirarlo en un teléfono con `sidebflms.com/es?intro=1`.
---
## 2026-09-16 (73) — Versión de pruebas «glass» dentro del dominio, sin contraseña

Joan: montar la versión glass (rama `glass`) en una página interna a la que
sólo se llegue con el enlace, para que cualquiera pueda probarla.

**Enlace:** `https://sidebflms.com/prueba-glass-47f47ad5/es`

Lo que cambia en ESTA rama es sólo el reparto de la puerta:

- `despliegue/proxy-php/proxy.php`: lo que empieza por `/prueba-glass-47f47ad5`
  va a `127.0.0.1:3201`; todo lo demás, al 3200 de siempre.
- `despliegue/proxy-php/htaccess`: esa ruta entra **sin contraseña**. El resto
  de la web la sigue pidiendo. Se compara con `THE_REQUEST` y no con
  `REQUEST_URI` porque, tras reescribir a `/proxy.php`, Apache vuelve a
  comprobar el acceso con la URI ya cambiada.

La versión de pruebas en sí vive en la rama `glass` y se despliega sola en cada
empujón a esa rama (`.github/workflows/publicar-glass.yml`): la sube a
`~/sidebflms-glass`, la compila con `basePath` = la ruta, la arranca en el 3201
con el mismo `sidebflms-web.sh` (puerto por variable) y le pone su propio
vigilante en el cron. No toca la carpeta, el proceso ni el `public_html` de la
web. Va con `X-Robots-Tag: noindex`, y sus formularios llegan al buzón de
siempre con «[PRUEBA GLASS]» delante del asunto.

**Para retirarla:** quitar su línea del crontab (la de `sidebflms-glass`),
parar el 3201 (`SIDEB_PUERTO=3201 ~/sidebflms-glass/despliegue/sidebflms-web.sh
parar`), borrar `~/sidebflms-glass`, y aquí deshacer las dos piezas de arriba.

**Ojo el día que se quite la contraseña:** la regla del `.htaccess` está dentro
del `<IfFile>`, así que deja de aplicar; la ruta de pruebas seguiría abierta
igual que el resto.

## 2026-09-16 (72) — Nosotros: las cifras en ficha técnica, contando al aparecer

Mario: «he visto una web que es prácticamente lo mismo, lo de los proyectos y
horas; cambiemos la disposición de todo esto, y que cuando se vean los números
haga una cuenta subiendo hasta llegar al número».

### La disposición

Eran dos secciones: una fila de cinco números enormes con la etiqueta debajo
—la plantilla que lleva medio sector— y, más abajo, «Dónde operamos» y «Cómo
trabajamos» a dos columnas.

Ahora es **una sola ficha técnica**, como la de un rodaje: el texto de dónde y
cómo a la izquierda y, a la derecha, las cifras en renglones, con la etiqueta a
un lado y el número al otro. Los números van alineados por la derecha y, con
`tabular-nums`, las unidades de las cinco filas caen en la misma columna
(comprobado: los cinco terminan en x=1377 a 1440 px). En móvil las cifras salen
primero, que son el gancho. De paso, dos bordes y dos márgenes grandes se
quedan en uno.

### La cuenta

`components/motion/contador.tsx`. Al entrar en pantalla, cada número cuenta
desde cero en 1,6 s, rápido al principio y frenando al final, que es donde se
lee. Tres decisiones que conviene conocer:

1. **El HTML lleva la cifra de verdad**, no un cero. La cuenta la hace el
   navegador después. Buscadores y lectores de pantalla ven «329».
2. **El cero sólo aparece si el navegador va a dibujar.** La primera versión lo
   ponía nada más cargar, y en una pestaña oculta —donde no corren los
   fotogramas— la página se quedaba enseñando «0 proyectos» para siempre. Lo
   mismo le pasaría a una vista previa de enlace. Ahora el cero se pone dentro
   de un fotograma: si no hay fotogramas, se queda la cifra real.
3. **El punto de millar se pone a mano.** `toLocaleString("es-ES")` no pone
   punto en cifras de cuatro dígitos (es la norma), así que contaría hasta
   «2000» y saltaría a «+2.000» al final. Comprobado: termina en «+2.000».

Con «reducir movimiento» no cuenta: la cifra final desde el principio.

### El aviso de «provisional»

Decía «las fotos marcadas no son de esa persona y los cargos con * están sin
confirmar». Desde hoy las once fichas llevan la foto de quien dicen ser, así
que ahora dice sólo **«Provisional: los cargos con * están sin confirmar»**.

---

## 2026-09-16 (71) — Nosotros: la foto de Monegros, más baja, y otro texto

Mario: «esta foto es demasiado grande, córtala por arriba y abajo, y el texto es
un poco mierda».

### La foto

De 4:3 a **16:9**. A 1440 px baja de 563 a **423 px de alto**.

El recorte **no va centrado**: la gente ocupa la franja de abajo del original
(cabezas en y=400 y pies en y=985 de 1050 px), y un recorte centrado se comía
los pies de la fila de abajo. Con `object-position: 50% 88%` se pierde el cielo
y la parte de arriba de las letras de RAVE, y quedan los dieciocho enteros.
Comprobado reproduciendo ese mismo recorte sobre la imagen original.

### El texto

Lo que pidió que dijera: que el equipo es de profesionales y que, cuando un
proyecto lo exige, hay una lista larga de colaboradores externos de confianza.

> Somos un equipo de profesionales que saca adelante la mayoría de los trabajos
> por su cuenta. Cuando un proyecto lo exige, contamos con una larga lista de
> colaboradores externos de confianza que se suman con nuestro plan de rodaje y
> nuestros plazos. En Monegros fuimos dieciocho.

Se mantiene la frase de Monegros a propósito: la foto de al lado son dieciocho
personas, y sin esa línea se lee como un descuadre con los once de la rejilla.
Traducido igual en `en.ts`.

---

## 2026-09-16 (70) — El trazo del botón, a la mitad de velocidad

Mario: «que vaya un poco más lento, va muy rápido». De una vuelta cada 4
segundos a **una cada 8**. A 4 s llamaba más la atención que el propio botón.
Es un único número, en `.trazo-borde` de `app/globals.css`.

---

## 2026-09-16 (69) — Menú en naranja, y el botón de la portada con su trazo

### El menú, al revés

Mario: «el menú que sea en naranja y que se ilumine en blanco». Aplicado en los
dos menús de escritorio —el del hero de la portada y el centrado de la barra—:
**naranja (`rust-300`) en reposo, blanco al pasar el ratón**. La página en la
que estás va en blanco: si siguiera en naranja no se distinguiría de las demás.
`rust-300` da 5,9:1 sobre el fondo, así que vale para texto de ese tamaño.
Comprobado leyendo el color real de cada enlace en reposo, al pasar y activo.

El menú de móvil (pantalla completa) no se ha tocado.

### «See all the work», centrado, más apretado y con trazo

Mario: «en el medio, con menos espacio arriba y abajo, y que el cuadrado tenga
animación de líneas naranjas rodeándolo».

- **Centrado de verdad.** El primer intento lo metía en `.shell` y salía 12 px
  a la derecha: sus márgenes son 72 y 48 px a propósito. Con un padding
  simétrico, medido: centro del botón en 720 a 1440 px y en 195 a 390.
- **Menos aire.** 40 px desde la última cinta (eran 64) y 88 hasta el titular
  de la llamada final (eran unos 150: este bloque tenía su propio `pb-16`
  además del de la sección de abajo).
- **El trazo.** Dos segmentos naranjas recorren el borde, uno enfrente del
  otro, una vuelta cada 4 segundos. Es un `<rect>` de SVG encima del botón con
  `pathLength="100"`, así que no depende de medir el botón con JavaScript; ver
  `.trazo-borde` en `app/globals.css`. No intercepta el ratón. Con «reducir
  movimiento» se queda quieto, con el borde entero en naranja.

Comprobación del trazo: la pestaña de pruebas estaba oculta y el navegador no
avanza el reloj de las animaciones ahí, así que se adelantó a mano: el
desplazamiento va de 0 a −25, −50 y −100 en 0, 1, 2 y 4 segundos, y se repite
sin fin.

---

## 2026-09-16 (68) — El idioma, en un solo botón

Mario: «el botón de EN / ES, ¿puede ser el mismo y que al darle una vez cambie
al otro idioma?». Eran dos enlaces, «ES · EN», con el actual resaltado.

### Qué hace ahora

Un único botón que **enseña el idioma al que vas, no en el que estás**: en la
web en castellano pone «EN»; en la inglesa, «ES». Un botón tiene que decir lo
que hace al pulsarlo — si pusiera el actual, quien no lee castellano vería «ES»
y no sabría que ahí está su versión.

Sigue conservando la página: desde Servicios en castellano lleva a
`/en/services`, no a la portada. Comprobado en los dos sentidos.

Para un lector de pantalla, «EN» a secas se lee como la preposición. El nombre
accesible es el del idioma escrito en ese idioma —«English», «Español»— con su
`lang`, para que se pronuncie bien.

### En móvil va dentro del menú

Con borde y relleno el botón mide 46 px, y a 390 px **se montaba 12 px sobre el
logotipo centrado** (botón de 258 a 303, logotipo hasta 270; medido). Por debajo
de `lg` se quita de la barra y va arriba a la izquierda del menú a pantalla
completa, lejos de «Cerrar». En escritorio sigue en la barra: a 1024 px queda a
24 px del último icono de redes y lejos del menú centrado.

Nota para quien toque esto: se esconde envolviéndolo en un `<span>`, no
pasándole `hidden` al componente. `cn` en este proyecto sólo concatena clases
(no hay `tailwind-merge`), así que `hidden` junto al `inline-flex` del botón lo
decidiría el orden del CSS, no el de las clases.

Si algún día hay un tercer idioma, el conmutador deja de tener sentido y hay
que volver a una lista.

---

## 2026-09-16 (67) — El rótulo vertical de la regleta chocaba con los números

Mario, con un recorte del FAQ: «esto choca bastante, está muy cerca». El nombre
de la sección, escrito en vertical junto al carril, se montaba sobre el «04».

**La causa, medida y no supuesta.** El rótulo vivía en una caja de 72 px (el
ancho del margen) con `text-center`, pensando que así quedaba centrado sobre el
carril. Con `writing-mode: vertical-rl`, `text-center` centra **de arriba
abajo, no de lado**, así que la columna de letras se pegaba al borde derecho de
la caja: letras de 58 a 70 px, y el contenido de la página empieza en 72. **Dos
píxeles de separación.**

No era sólo el FAQ: pasaba en todas las páginas con números grandes en la
primera columna — las etapas de Servicios y la flota de Drone también.

**El arreglo**, en `components/layout/reglet.tsx`: la caja deja de tener ancho
fijo y se ciñe a la columna de letras, a 12 px del borde. Ahora las letras van
de 14 a 26 px, **a la izquierda del carril** (x=36) y a **46 px del contenido**.
Comprobado a 1440 px sobre el FAQ de Contacto.

---

## 2026-09-16 (66) — El lema del pie: de «cada noche» a «cada rodaje»

Mario: «Side B of every night no tiene sentido porque no sólo hacemos noche».

- ES: **«Cara B / de cada / rodaje»** (era «de cada noche»).
- EN: **«Side B / of every / shoot»** (era «of every night»).

«Rodaje» cubre la noche de club y también el anuncio, el podcast y el plano de
dron a mediodía. Se descartó «de cada historia»: rima con el titular de la
portada, pero es justo el tipo de frase que podría estar en la web de cualquier
agencia, que es lo que las reglas de redacción de `es.ts` vetan.

**El ancho no cambia**: la línea más larga sigue siendo «de cada» / «of every»,
que es la que calibra el cuerpo del lema (ver el comentario de `footer.tsx`).
Comprobado a 390, 1024 y 1280 px: ninguna línea partida, sin desbordamiento.

---

## 2026-09-16 (65) — Fuera el manifiesto de la portada

Mario, sobre el bloque «We arrive before doors open» y sus cuatro frases:
«esto ocupa demasiado en la pantalla, quítalo».

La portada queda en cuatro piezas: reel, las tres cintas de trabajos, el botón
«ver todo el trabajo» y la llamada final. Medido a 1440 px: 2.688 px de alto,
unos 450 menos.

**No se pierde el texto.** Las cuatro frases viven en `dict.manifesto` y siguen
publicadas en Nosotros, bajo «Cómo trabajamos», que desde ahora es el único
sitio donde salen. El componente `components/sections/manifesto.tsx` se queda
en el repositorio sin usar, igual que `Showpiece` y `EditorialBlock`, por si se
quiere recuperar.

---

## 2026-09-16 (64) — Galoguin, con su foto; ya no queda ninguna de otra persona

`public/media/equipo/galoguin.jpg`, 800×1000, sacada de `galo.jpeg`.

**Es de espaldas**: en la mesa de control de ITRAMUN, con el casete de
SIDEBFLMS en el chaquetón y el escenario detrás. Se le avisó a Mario de que en
una rejilla de caras no se le reconoce, y decidió ponerla igual. Tiene sentido:
**es él**, y lo que llevaba hasta ahora era la foto de otra persona con el
rótulo de «Ejemplo», que era peor.

Con esto **las once fichas llevan la foto de quien dicen ser**. Ya no queda
ninguna con `fotoEsEjemplo`. Lo que sigue provisional son los **cargos**: los
once llevan `roleEsEjemplo`, así que el aviso de «provisional» de Nosotros
sigue saliendo, ahora sólo por eso.

---

## 2026-09-16 (63) — Fuera «En faena»

Mario: «las de en faena vamos a quitar todas». Se quita la sección entera de
Nosotros —la tira de fotos del equipo trabajando—, y con ella lo que sólo
existía para ella:

- `FOTOS_TRABAJANDO` y su tipo, de `content/team.ts`.
- Los textos `workLabel` y `workNote`, de los dos diccionarios.

**Los ficheros NO se han borrado.** Las fotos de
`public/media/equipo/trabajando/` se siguen usando en otros sitios, y
comprobado en el navegador que siguen cargando:

- `emisora-recinto.jpg`, `camara-grada.jpg` y `piloto-inspire.jpg` ilustran
  las etapas de Servicios (`content/etapas-fotos.ts`).
- `gafas-fpv.jpg` es la foto provisional de Galoguin, marcada como «Ejemplo»,
  hasta que llegue una suya de frente.

La rama `mejoras-cuatro-paginas` también tenía esas fotos (en Nosotros y en
Trabaja con nosotros); se quitan allí igual para que no vuelvan al juntarlas.

---

## 2026-09-16 (62) — Rubén ya tiene retrato; Galoguin sigue sin él

Mario pasó dos fotos en Descargas, `ruben.jpeg` y `galo.jpeg`.

### Rubén: retrato real

La foto con la emisora del dron, sentado junto a la valla entre el confeti. Se
le ve la cara de perfil, que es la condición de la rejilla. Sale a
`public/media/equipo/ruben.jpg`, 800×1000 como las otras nueve.

**Recortada a mano, no con `scripts/fotos-equipo.sh`.** El script recorta por
el centro, y en el original (3414×5120) Rubén está desplazado a la derecha
entre la valla y el público: el recorte centrado le partía. El encuadre a mano
coge cabeza, torso y la emisora, y deja casi fuera al público de la valla.

En `content/team.ts` se le quita `fotoEsEjemplo`: deja de salir con el rótulo
«Ejemplo» y con la foto de otra persona.

**Ojo con el cargo:** en la foto está pilotando, y su cargo provisional dice
«Etalonaje». Los once cargos siguen sin confirmar.

### Galoguin: sigue sin retrato, y es a propósito

`galo.jpeg` es la foto de espaldas en la mesa de control de ITRAMUN, con el
chaquetón de SIDEBFLMS. **No se le ve la cara**, así que no sirve como retrato
en una rejilla de caras: seguiría sin decir quién es. Galoguin conserva la foto
de ejemplo marcada como tal hasta que llegue una de frente.

(Antes de renombrarlas, los dos ficheros eran esa misma foto de espaldas con
distinto recorte. Se avisó, Mario lo corrigió, y ya están bien.)

La foto de espaldas es buena para «En faena», donde las fotos van sin nombre.
Queda pendiente de que Mario diga si la quiere ahí.

---

## 2026-09-16 (61) — Acuse de recibo por correo, y el casete en el naranja bueno

### El casete no era del mismo naranja. Y era verdad

Mario: «cambiar logo casete, no es el mismo color». Comprobado con los
ficheros del manual delante:

- El logotipo (`wordmark.png`, sacado de `PNG-15.png`) usa **`#e8451d`**, que
  es el `brand-500` del manual. Contadas las piezas de marca una a una, todas
  usan ese naranja o el `#bb4223` de las versiones a dos tonos.
- El casete (`public/logo/mark.svg` y `app/icon.svg`, que es el favicon) usaba
  **`#D8693F`**. Ese color **no aparece en ninguna pieza del manual**: es un
  resto del teja apagado que tenía el sitio antes del 2026-09-10, cuando entró
  la paleta de verdad. El SVG se quedó sin actualizar y desde entonces la
  cabecera llevaba dos naranjas distintos a diez centímetros uno del otro.

Los dos ficheros pasan a `#E8451D`. Comprobado en el navegador: el casete de
la cabecera ya devuelve ese único color.

### Quien escribe recibe copia de lo que ha rellenado

Mario pidió dos cosas: que la candidatura confirme que se ha completado y que
la consulta de contacto llegue con «un correo de resumen o confirmación de lo
que ha rellenado». Las dos van en `lib/correo.ts`.

**Contacto** recibe el resumen: evento, fecha, aforo, escenarios, cobertura,
presupuesto y su mensaje. **Sólo lo que rellenó** — una lista con seis rayas no
informa de nada y hace pensar que se ha perdido algo. El `Reply-To` apunta a
nuestro buzón, así que si responde, responde a donde tiene que responder.

**La candidatura** recibe un «se ha enviado y queda guardada», con la
especialidad y el enlace al portfolio. Deliberadamente más corto: aquí lo que
hace falta es saber que salió. Devolverle por correo sus propios datos
personales —edad, nacionalidad, teléfono— no le sirve de nada y multiplica
dónde vive ese dato. Y **no promete plazo ni respuesta**, porque no hay ninguno
acordado: dice lo mismo que la pantalla.

### Tres decisiones de esos correos que conviene conocer

1. **Si el acuse falla, la consulta NO falla.** Lo que importa es que el aviso
   interno llegue: ahí está el encargo. El acuse se manda después, aparte, y un
   fallo suyo sólo queda en el registro del servidor. Al revés sería absurdo:
   perder una consulta porque el cliente tiene el buzón lleno.
2. **Sólo se manda si el aviso interno salió.** Decir «la hemos recibido»
   cuando no ha llegado a nadie es mentira.
3. **Estos correos SÍ salen a internet**, al contrario que los internos, que se
   entregan en un buzón de la propia máquina. La entrega depende del SPF y el
   DKIM del dominio: están puestos, pero **conviene mirar el primero que salga
   de verdad y comprobar que no cae en spam.**

De paso, el transporte SMTP deja de estar copiado en cada envío y vive en una
función. Con los acuses habrían sido cuatro copias de la misma configuración.

### Cómo se ha probado, sin mandarle un correo a nadie

Con un buzón SMTP de mentira en el puerto 2525 (`scratchpad/smtp-falso.js`) y
un `.env.local` temporal apuntando ahí. Se rellenaron los dos formularios en el
navegador y se leyó lo que llegó: **cuatro mensajes, los dos avisos internos y
los dos acuses**, con los destinatarios, los asuntos y los cuerpos correctos, y
el resumen mostrando sólo los campos rellenados. Ni un correo salió de la
máquina; el `.env.local` se borró al terminar.

---

## 2026-09-16 (60) — La portada pesaba 52 MB de vídeo. Ahora 24

Mario: «los vídeos de la página de inicio tardan mucho en cargar la primera
vez». Medido antes de tocar nada: la portada tiene **veintiún vídeos
distintos** repartidos en las tres cintas, y servía a cada recuadro **el mismo
fichero que la ficha del trabajo** — 1280×720 a 1,76 Mb/s, unos 2,5 MB cada
uno. Recorrer la portada entera son **52,2 MB**, más 5,1 del reel.

### Lo que sobraba: los recuadros miden 398 px

Se estaban mandando más de tres veces los píxeles que caben en pantalla.
`scripts/cinta-web.sh` genera ahora, por cada pieza, una versión `-cinta`:

- **854×480 a 800 kb/s** — sigue sobrando resolución para una pantalla de
  densidad doble.
- **Sin pista de audio**, porque las cintas van mudas de todas formas. Son
  ~190 kB por pieza que se mandaban para no sonar.

**52,2 MB → 24,1 MB. Un 54 % menos.**

### Los pósters, en WebP

Es lo primero que se ve, antes de que el vídeo tenga un fotograma. En JPEG
pesaban **86 kB de media**; en WebP a ese tamaño, **23**. Con veintiuno en
pantalla son 1,3 MB que desaparecen del arranque.

El del reel —la primera imagen de toda la web— pasa de **170 kB a 47**.

### Si falta algún fichero, no se rompe

El componente pide la versión de cinta y, si no existe, el `onError` se cae al
fichero grande y al póster JPEG. Añadir una pieza sin pasar el script se ve más
lento, pero se ve. El script tampoco rehace lo que ya está hecho.

### Caché y formatos

- `public/media` pasa a **30 días** de caché. Venía con `max-age=0`: cada
  visita volvía a preguntar por los cuarenta y pico ficheros.
- **No lleva `immutable`**, a propósito: estos ficheros se reemplazan de vez en
  cuando —ayer se les añadió audio a seis— y con `immutable` un navegador que
  ya los tuviera seguiría con el viejo un año sin manera de avisarle.
- `next/image` pasa a servir **AVIF** antes que WebP, ~20 % menos a igual
  calidad. No afecta a los pósters de vídeo: el atributo `poster` es una URL a
  pelo y no pasa por el optimizador, por eso ésos se generan a mano.

### LO GRANDE QUE FALTA, Y NO ES CÓDIGO

**Mientras la web tenga contraseña, cada vídeo pasa por PHP.**

Lo dice el propio `despliegue/publicar.sh`: con `.htpasswd` puesto no se copia
ni un fichero estático al directorio público, porque nginx los serviría
saltándose la contraseña. Así que hoy cada uno de esos veintiún vídeos entra
por Apache → `proxy.php` → curl → Node. Un proceso de PHP por fichero, y diez
a la vez cuando se abre la portada.

El día que se quite el `.htpasswd`, ese mismo script deja `public/` y
`.next/static` en disco y los sirve **nginx directamente con `expires max`**,
sin despertar ni a PHP ni a Node. Eso es lo que de verdad arregla la primera
carga; todo lo de arriba es lo que se puede hacer sin llegar ahí.

### Otras dos cosas que dependen de una decisión, no del código

- **Doce piezas de drone en la primera cinta.** Aunque pesen la mitad, siguen
  siendo doce ficheros. Con seis bien elegidas la portada carga la mitad y
  probablemente se vea igual de bien.
- **El reel definitivo.** El de ahora son 5,1 MB (21 s a 2 Mb/s) y es
  provisional. Cuando se monte el bueno, conviene pedirlo con presupuesto:
  **20 segundos y 1,4 Mb/s** dejan un fichero de 3,5 MB que empieza a verse
  enseguida.

---

## 2026-09-15 (59) — Seis piezas ya suenan. Y una corrección a la entrada anterior

### Lo que decía la entrada 58 estaba mal

Decía que «los doce másters que están en este Mac son mudos». **No lo son.** El
fallo era de mi comprobación: `ffprobe -select_streams a` saca una **línea en
blanco antes del resultado** en los ficheros de DJI, que declaran dos flujos de
vídeo. Yo leía la primera línea, veía el vacío y daba el fichero por mudo.

Al mirarlo bien, casi todos los ficheros de `~/Desktop/PARA-LA-WEB/` traen
pista de audio. Lo que hay que preguntarse no es si la traen, sino **si suena**:
los planos de dron la traen a −91 dB, que es silencio digital, porque el dron
no tiene micrófono.

### Seis piezas con sonido, hechas ya

| Pieza | Máster | Pico |
|---|---|---|
| Sala llena | clubes-y-festivales / 16 | 0,0 dB |
| Sala en rojo | clubes-y-festivales / 23 | 0,0 dB |
| La cabina y el público | clubes-y-festivales / 15 | −0,5 dB |
| En cabina | clubes-y-festivales / 28 | −6,5 dB |
| DURO — el recinto de noche | duro / 13 | 0,0 dB |
| MITT MOTORS | mitt-motors / 60 | −0,7 dB |

El script encontró solo el punto de cada máster (segundos 10, 4, 13, 13, 6 y 0)
comparando fotogramas, y **la imagen no se ha tocado**: el MD5 del flujo de
vídeo de las seis es idéntico al de antes. El audio cubre la pieza entera
(11,99 s de 12, que es la rejilla de fotogramas del AAC, no un recorte).

Comprobado además en el navegador: el reproductor de la ficha decodifica audio.

### Las que siguen mudas, y por qué

- **Las de dron** —Madrid desde el aire, Las cuatro torres, La costa, El pueblo
  sobre el mar, Monegros el recinto, Recinto desde el aire—: el origen es
  silencio digital. No hay nada que recuperar.
- **Las ocho del disco de producción** —Fátima Hajji, Adrián Mills, Fabrik 150,
  GORDO, Prospa, Monegros hora dorada, DURO pyroshow, Metropolitano—: son
  justo las que llevarían música. En cuanto se conecte `@SIDEB404L`, el mismo
  script las hace.
- **El reel de la portada**, por decisión de Mario.

### Aviso sobre ese sonido

Es el audio de cámara de una sala, y **viene recortado de origen**: tres de las
seis tocan los 0,0 dB. Se ha dejado tal cual —es lo que se grabó— pero si al
oírlo suena agresivo, se normaliza en un momento. No se puede «arreglar» el
recorte, sólo bajarlo.

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
