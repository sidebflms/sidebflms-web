# Un panel para editar la web sin tocar código

**Estado: Fase 3 EN PRODUCCIÓN** (2026-09-24). Proyectos, equipo, cifras,
clientes, preguntas frecuentes, las entradillas de página y ahora también el
material (fotos y vídeos) se editan en `sidebflms.com/admin`. Lo hecho y lo
aprendido, al final (puntos 11 a 14).

---

## 1. Qué se quiere

Hoy, cambiar el texto de una ficha, el cargo de alguien del equipo o una cifra
significa **editar ficheros de código y volver a publicar**. Funciona, pero
obliga a pasar por un programador para cosas que no lo son.

Lo que se busca: **un panel con usuario y contraseña donde Mario entre y cambie
esas cosas él**, y que la web se actualice sola.

Lo que **no** se busca: rehacer la web. El diseño, la intro del casete, las
cintas de la portada y el reproductor de Trabajo se quedan exactamente como
están.

---

## 2. Por qué no WordPress

Se valoró y se descarta, por cuatro razones concretas de ESTE proyecto:

1. **Habría que tirar la web y rehacerla.** Todo lo de esta web —el cristal, la
   intro, las cintas, el visor de proyectos— está escrito a medida. En
   WordPress no existe: son semanas de trabajo para acabar con algo que se
   parece menos.
2. **El servidor no tiene root** (ver `despliegue/README.md`). WordPress ahí,
   detrás del apaño de `proxy.php`, iría más lento que ahora: hoy las páginas
   están pregeneradas y WordPress las monta en cada visita.
3. **Seguridad.** Es el software más atacado de internet y cada plugin es una
   puerta más. Sin root no se puede proteger como toca. Acabamos de cerrar el
   agujero del formulario de contacto (ver `lib/limite-envios.ts`); no tiene
   sentido abrir veinte.
4. **No resuelve lo que más trabajo da**, que no es escribir textos: es
   preparar los vídeos (ver el punto 5).

---

## 3. La propuesta

**Payload CMS, funcionando DENTRO de esta misma web**, con su base de datos en
el VPS.

Es un gestor de contenido que se monta como parte de la aplicación Next que ya
existe: añade un panel en `/admin` y una base de datos, y no toca las páginas
públicas. Ni el diseño ni el rendimiento cambian.

**Lo comprobado el 2026-09-22, para que no sea una promesa al aire:**

| Qué | Cómo está |
|---|---|
| Payload con Next 16 | ✅ `@payloadcms/next@3.90.1` declara `next: >=16.3.3 <17`; la web va por **16.3.6** |
| Base de datos | ✅ El VPS ya tiene **PostgreSQL 15.19** escuchando en `127.0.0.1:5432` |
| Memoria libre | ✅ ~3 GB disponibles; la web entera consume hoy 120 MB |
| Disco | ✅ 111 GB libres de 148 |

**Lo que NO está comprobado y hay que comprobar antes de nada:** que arranque de
verdad con esta versión (un `peerDependency` dice que debería, no que lo haga).
De ahí la Fase 0.

### Alternativas que se descartan, y por qué

- **Directus / Strapi (panel aparte):** funcionan, pero son **otro proceso más**
  en un servidor que ya lleva cuatro, y hablan con la web por API. Más piezas
  que mantener para el mismo resultado.
- **Panel escrito entero por nosotros:** es lo que Mario proponía, y la idea es
  buena en otros proyectos vuestros (el inventario, flightops). Aquí no: habría
  que construir usuarios, permisos, formularios, borradores, dos idiomas y
  biblioteca de medios. Eso está resuelto desde hace años y es la parte
  aburrida. **Lo que sí es vuestro y sí vamos a escribir a medida es el paso de
  los vídeos** (punto 5), que ningún gestor trae.
- **Un gestor de pago en la nube** (Sanity, Contentful): rápido de montar, pero
  el contenido vive fuera de vuestra máquina y se paga por uso.

---

## 4. Qué se podrá editar desde el panel, y qué no

| Contenido | Hoy | Con el panel |
|---|---|---|
| **Proyectos** (23): nombre, textos, fecha, sitio, categorías, destacado | `content/projects.ts` | **Panel** |
| **Equipo** (11): nombre, cargo, orden, foto | `content/team.ts` | **Panel** |
| **Cifras** de la portada y de Nosotros | `content/cifras.ts` | **Panel** |
| **Preguntas frecuentes** | diccionarios | **Panel** |
| **Textos largos** de cada página (entradillas, descripciones) | diccionarios | **Panel** |
| **Clientes** de la cinta de marcas | `brand-strip.tsx` | **Panel** |
| Menú, botones, rótulos de formulario, mensajes de error | diccionarios | Código |
| Aviso legal y privacidad | diccionarios | Código *(son textos jurídicos: mejor que no se toquen sin querer)* |
| Equipamiento (`fleet.ts`) | código | Código *(cambia una vez al año)* |
| Diseño, animaciones, maqueta | código | Código |

**Criterio:** al panel va lo que cambia a menudo y no rompe nada si se
equivoca. Se queda en código lo que es estructura o tiene consecuencias legales.

---

## 5. El problema de verdad: los vídeos

Añadir un proyecto **no es rellenar un formulario**. Hoy es esto:

1. Sacar el máster del disco.
2. Pasar `scripts/pieza-web.sh` → la versión que se ve en la ficha.
3. Pasar `scripts/cinta-web.sh` → la versión ligera de las cintas (854×480, muda)
   y su póster en WebP.
4. A veces, la versión vertical.
5. Copiar todo a `public/media` y escribir las rutas en `projects.ts`.

**Ningún gestor de contenido hace los pasos 2 a 4.** Y aquí hay un límite
físico: el VPS tiene 8 GB de memoria y ya sostiene cuatro aplicaciones;
ponerle a convertir másters de dos gigas lo ahogaría, y además habría que subir
esos dos gigas por la línea de casa.

**Lo realista, y lo que propongo:**

- **Fotos:** se suben desde el panel directamente. Se redimensionan solas. Sin
  problema.
- **Vídeos:** la conversión **sigue donde está hoy, en el Mac**, con los
  scripts, que ya funcionan. Lo que cambia es que el panel acepta los ficheros
  ya preparados y se encarga de guardarlos y de enlazarlos con la ficha, sin
  tocar código.
- Más adelante, si compensa, se puede automatizar: una carpeta vigilada en el
  Mac que convierta y suba sola. Eso es un proyecto aparte.

**Y un efecto secundario que conviene arreglar de paso:** hoy los 154 MB de
material viven **dentro del repositorio**. Con el panel, lo nuevo se guarda
fuera, en el servidor. El repositorio deja de engordar en cada proyecto.

---

## 6. Cómo llega el cambio a la web

Hoy: se edita el código → se sube a GitHub → se vuelve a compilar todo (unos
dos minutos) → la web cambia.

Con el panel: se guarda en el panel → **sólo se regenera la página afectada**,
en un segundo. Sin compilar, sin desplegar, sin GitHub.

Técnicamente: las páginas pasan de generarse al compilar a generarse la primera
vez que alguien las pide y guardarse; al guardar en el panel se avisa a la web
de que esa página caducó. Se mantiene la velocidad actual.

---

## 7. Qué hace falta en el servidor

- **Una base de datos** PostgreSQL nueva, creada **desde el panel de Hestia**
  (por consola no se puede: el usuario no tiene permisos). Es el mismo camino
  que se siguió para el inventario.
- **Dos variables** en `.env.production`: la conexión a la base de datos y una
  clave secreta del panel.
- **Unos 300 MB más de memoria.** Hay margen (3 GB libres), pero conviene
  mirarlo cuando esté en marcha.
- **La copia de seguridad tiene que incluir la base de datos nueva.** Si no,
  una restauración devolvería la web sin su contenido. Ya existe una copia
  semanal para el inventario; se le añade ésta.
- **Una carpeta para el material** fuera del repositorio, servida como los
  demás estáticos.

---

## 8. Por fases

Cada fase deja algo utilizable. Si en alguna se decide parar, lo anterior sigue
funcionando.

### Fase 0 · Comprobar que la idea se sostiene *(medio día)*
Montar Payload en local contra esta web, con una colección de prueba, y ver que
arranca con Next 16.3.6 y con Postgres. **Si no arranca, el plan se replantea
aquí y no se ha perdido nada.**

### Fase 1 · Proyectos y equipo *(lo que más libera)*
Las dos cosas que más se tocan. Incluye:
- Migrar los 27 proyectos y las 13 personas del código a la base de datos, con
  un script que se pueda repetir.
- El panel, con los campos en los dos idiomas.
- Que al guardar se actualice la página sola.
- **Una salida de emergencia:** un comando que vuelque el contenido de la base
  de datos otra vez a ficheros. Si algún día se quiere dejar el panel, el
  contenido no se queda atrapado.

### Fase 2 · Cifras, preguntas y textos de página
Lo mismo para el resto de contenido editable de la tabla del punto 4.

### Fase 3 · Material
Subida de fotos desde el panel y enganche de los vídeos ya preparados. Aquí se
saca el material nuevo del repositorio.

### Fase 4 · Borradores y vista previa *(opcional)*
Poder dejar un proyecto a medias sin publicarlo, y verlo antes de que salga.

---

## 9. Riesgos, dichos claros

| Riesgo | Qué haríamos |
|---|---|
| Payload no funciona con Next 16.3.6 pese a lo que declara | Es la Fase 0. Si falla: Directus como proceso aparte, o quedarse como está. |
| El panel queda expuesto al abrir la web | Payload trae su propia contraseña. Mientras la web siga cerrada, está detrás de la de Apache. Al abrirla hay que revisarlo a conciencia. |
| La memoria del VPS se queda corta | Se mide en la Fase 1. Si aprieta, el panel puede vivir en otro sitio. |
| Alguien borra contenido sin querer | Copia de seguridad diaria de la base de datos + la Fase 4 (borradores). |
| Que esto acabe siendo otro trasto que mantener | Por eso no se escribe un panel desde cero: menos código nuestro, menos que mantener. |

---

## 10. Lo que no voy a prometer

**Plazos.** No he montado Payload sobre esta web todavía, y dar una fecha sin
haber hecho la Fase 0 sería inventármela. Lo que sí digo: la Fase 0 es medio
día y después se puede estimar con fundamento.

**Que no haya que tocar código nunca más.** Añadir una sección nueva a la web,
cambiar cómo se ve algo o meter un tipo de contenido que hoy no existe seguirá
siendo trabajo de programación. El panel es para el contenido del día a día.

---

## 11. Resultado de la Fase 0

Hecha el 2026-09-22 en la rama `prueba-payload`, que **no está mezclada con la
web**. Payload 3.90.1 montado dentro de esta misma aplicación, contra un
PostgreSQL 16 de usar y tirar en Docker.

### Las tres preguntas, respondidas

| Pregunta | Respuesta |
|---|---|
| ¿Arranca con Next 16.3.6? | **Sí.** En desarrollo y compilado. El panel responde en `/admin` y la web pública sigue igual. |
| ¿Habla con PostgreSQL? | **Sí.** Se crea sus nueve tablas solo al arrancar, sin tocar nada a mano. |
| ¿Sabe guardar en dos idiomas? | **Sí.** Creada una pieza en español, añadida su versión inglesa y leídas las dos por separado. Crea una tabla aparte para los idiomas. |

Y una cuarta que era la de verdad importante: **¿puede la web leer lo que hay en
el panel?** Sí. Una página de prueba lee el contenido desde el propio servidor
—sin pasar por HTTP— y lo pinta en los dos idiomas.

### Lo que cuesta, medido

| | Sin panel | Con panel |
|---|---|---|
| Memoria del proceso | 112 MB | **189 MB** (+77) |
| Compilar | 2,3 s | 28 s *(la primera vez; luego con caché)* |
| Páginas pregeneradas | 69 | **69, las mismas** |
| La web pública | — | **No cambia nada** |

Los 77 MB de más caben de sobra en el VPS (había 3 GB libres).

### Un tropiezo, y no es grave

El editor de texto rico de Payload (`richtext-lexical`) **no se deja cargar por
su herramienta de línea de comandos con Node 26**, que es el que corre en el
servidor: falla con «require() cannot be used on an ESM graph with top-level
await». Se quitó de la prueba y todo lo demás funcionó.

No bloquea la Fase 1, porque **los textos de esta web son texto plano**: los
resúmenes de proyecto usan saltos de línea, no negritas ni enlaces. Un campo de
texto normal basta. Si algún día se quiere texto con formato, hay tres salidas:
otro editor, esperar a que lo arreglen, o generar esa parte con una versión
anterior de Node. Conviene saberlo antes de prometer negritas.

### Qué haría falta para la Fase 1

Ahora sí se puede estimar con fundamento. Trabajo, en orden:

1. Describir proyectos y equipo como colecciones, con todos sus campos.
2. Script que pase los 23 proyectos y las 11 personas del código a la base de
   datos, repetible.
3. Cambiar de dónde leen las páginas: hoy de `content/*.ts`, luego de la base
   de datos. Afecta a unos seis componentes.
4. Que al guardar se regenere sola la página tocada.
5. El volcado de vuelta a ficheros (la salida de emergencia).
6. En el servidor: base de datos desde Hestia, dos variables, y añadirla a la
   copia de seguridad.

**Entre tres y cinco días de trabajo**, con el riesgo puesto en el punto 3, que
es el que toca código que hoy funciona.

### Cómo volver a levantar la prueba

```bash
git checkout prueba-payload
docker start sideb-payload-pg          # PostgreSQL de usar y tirar, puerto 5434
npx next dev -p 3005                   # el panel, en /admin
```

Las credenciales de prueba están en `.env.local` (no va a git). El usuario que
se creó es `prueba@ejemplo-falso.test`.

---

## 12. Fase 1, hecha y en producción (2026-09-23)

### Qué hay

- **`sidebflms.com/admin`**: el panel. Proyectos y equipo, en los dos idiomas.
  Al guardar, la web se regenera sola en segundos (comprobado en local editando
  un cargo y viéndolo cambiar sin desplegar; el otro idioma no se tocó).
- **La web sale idéntica.** Compilada leyendo de ficheros y leyendo de la base,
  ocho páginas comparadas carácter a carácter: iguales.
- **Plan B:** si la base no responde, la web tira de `content/*.ts` y avisa en
  el registro. Los ficheros se quedan en el repositorio por eso, y porque llevan
  la memoria del equipo (de dónde salió cada dato).
- **Salida de emergencia:** `/admin-volcado?clave=…` saca todo en JSON.
  `/admin-carga?clave=…` hace la ida (ficheros → base), repetible. La clave es
  `PAYLOAD_SECRET`, del servidor.

### Cómo está montado en el servidor

En `~/sidebflms-web/.env` (que el despliegue NO toca):

    PGHOST=127.0.0.1
    PGPORT=5432
    PGUSER=bote_panelweb
    PGDATABASE=bote_panelweb
    PGPASSWORD_FILE=/home/bote/sidebflms-web/.clave-panel
    PAYLOAD_SECRET=…

La contraseña va **en su propio fichero**, `.clave-panel` (permisos 600), y
puede llevar cualquier carácter. La base se creó desde Hestia (DB → pgsql →
`panelweb`, que Hestia prefija como `bote_panelweb`).

Las **migraciones** están en `migrations/` y `despliegue/publicar.sh` las aplica
antes de compilar. En producción Payload no crea tablas por su cuenta.

### Lo que costó, para no repetirlo

1. **La contraseña en una dirección de conexión.** `postgres://u:clave@host/db`
   se parte por la arroba, el interrogante y la barra que traiga la contraseña.
   Se cambió a campos sueltos; ver el comentario de `payload.config.ts`.
2. **La almohadilla en `.env`** empieza un comentario. Por eso el fichero
   aparte para la contraseña.
3. **El `rsync --delete` del despliegue borraba** todo lo que no está en el
   repositorio: `.env.production`, `.clave-panel`. Excluidos los dos.
4. **Un comentario entre las líneas de un comando** con `\` al final no es un
   comentario: es un argumento. Un despliegue fallido por eso.
5. **Las migraciones que genera Payload** importan los tipos como valores y el
   Node del servidor no los descarta. Cada migración nueva hay que retocarla:
   `import type` para `MigrateUpArgs`/`MigrateDownArgs`.
6. **`next/cache` no existe fuera de la web.** El aviso de regeneración lo carga
   sólo cuando hace falta; si no, la línea de comandos de Payload revienta.

### Lo que queda

- **Copia de seguridad de `bote_panelweb`.** No existe todavía. Hay que hacerla
  como la del inventario: `pg_dump`, cifrada, semanal, con ensayo de
  restauración. Sin esto, un borrado en el panel no tiene vuelta. Con la
  Fase 3, además, hay que copiar `~/sidebflms-web/media` —el pg_dump ya no basta,
  los ficheros en sí viven fuera de la base—.

---

## 13. Fase 2, hecha y en producción (2026-09-23)

### Qué hay

Cuatro cosas más editables desde `/admin`, todas con el mismo patrón que
Proyectos y Equipo: se guardan en la base, avisan a la web al momento, y si la
base no responde, la web tira de código y lo dice en el registro.

- **Cifras** (Global): la ficha técnica de la portada y de Nosotros. Un
  número puede dejarse vacío — esa cifra deja de pintarse.
- **Clientes** (Global): la cinta de nombres de Trabajo.
- **Preguntas frecuentes** (colección, como Proyectos): el FAQ de Contacto.
- **Textos** (Global): la entradilla —el párrafo bajo el titular— de
  Servicios, Trabajo, Trabaja con nosotros, Contacto, Nosotros (más «dónde
  operamos») y Drone.

**Lo que NO entró, a propósito:** los titulares (`headline`) de cada sección,
el menú, los botones y los mensajes de formulario. Son arrays de líneas
pensados para el salto de línea y la animación de entrada; un cambio desde un
formulario de texto libre los rompería sin que se note por qué. Se quedan en
`content/dictionaries/{es,en}.ts`, junto con el aviso legal y la privacidad
—ver el criterio del punto 4—.

### Cómo llega el cambio a la web

Las cifras y los clientes son props que se pasan a los componentes
(`traeCifras`, `traeClientes` en `lib/contenido.ts`). Las preguntas y las
entradillas van por otro camino, y es importante saber por cuál: **se
superponen encima del diccionario de siempre dentro de `getDictionary()`**
(`lib/dictionaries.ts`). Ni `content/dictionaries/es.ts` ni `en.ts` se han
tocado —siguen siendo el plan B, uno solo, sin copia en ningún otro
fichero—; lo que hace `getDictionary` es cargar ese diccionario y, si hay
algo guardado en el panel para esa entradilla o esas preguntas, sustituirlo
antes de devolverlo. El resto del código —los 71 componentes que leen
`dict.loquesea`— no sabe que esto pasa.

### Lo que costó, para no repetirlo

**El array de «items» no se fusiona entre idiomas: se reemplaza entero.**
Costó una comprobación completa (ocho páginas, texto extraído y comparado
carácter a carácter entre una compilación desde ficheros y otra desde la
base) darse cuenta de que las cifras salían sin su rótulo en español. La
causa: `/admin-carga` escribe primero el español y luego el inglés sobre el
Global «Cifras»; la pasada del inglés no llevaba el `id` que Payload le puso
a cada fila en la primera pasada, así que Payload no la actualizó: creó
**filas nuevas**, que nunca recibieron traducción al español, y dejó las
viejas huérfanas. La solución está en `app/admin-carga/route.ts`: se guardan
los `id` que devuelve la primera escritura y se reutilizan en la segunda. La
lección para cualquier array con campos `localized` dentro: escribir un
idioma primero, guardar los `id`, y pasarlos en la segunda escritura. Los
campos normales (fuera de un array) sí se fusionan solos, como ya hacían
Proyectos y Equipo.

### Cómo se comprobó

Contra el mismo Postgres de usar y tirar de la Fase 0
(`sideb-payload-pg`, ver el punto 11): migración aplicada, `/admin-carga`
para pasar el contenido de los ficheros a la base, `next build` de nuevo
leyendo ya de la base, y el texto visible de las 14 páginas que tocan estos
cuatro contenidos comparado carácter a carácter contra la compilación de
ficheros: **igual**. Y una edición de verdad desde el navegador —cambiar un
rótulo en Cifras y guardar— apareciendo en la portada sin recompilar.

---

## 14. Fase 3, hecha y en producción (2026-09-24)

### Qué hay

El vídeo, el póster, el vertical, la galería de fotografía y la foto de cada
persona ya no son una ruta de texto (`/media/loquesea.mp4`) que había que
escribir a mano: son una subida de verdad, con su propia colección **Media**
en el panel (grupo «Contenido», ficha «Archivo»). Se sube desde la propia
ficha del proyecto o de la persona —arrastrando el fichero al campo
correspondiente—, y Payload le pone miniatura, tamaño y —en fotos—
dimensiones. Un archivo con el mismo nombre no se duplica: se reutiliza.

**Lo que NO cambia, a propósito** (ver el punto 5): el máster se sigue
convirtiendo en el Mac con `scripts/pieza-web.sh` y `scripts/cinta-web.sh`.
El panel no comprime ni redimensiona nada — sube tal cual lo que se le da, y
`next/image`, que ya usa la web, hace el resto al servirlo.

### Dónde vive el material, y por qué ahí

En `~/sidebflms-web/media`, junto al repositorio pero **fuera de Git**
(`.gitignore`) y fuera del `rsync --delete` del despliegue —igual que
`.env`—. Antes de la Fase 3, 154 MB de fotos y vídeos vivían dentro del
repositorio (`public/media`), y crecían con cada proyecto nuevo. Ahora el
repositorio deja de engordar: lo nuevo se sube directamente al servidor, no
pasa por GitHub. Se sirve por la propia API de Payload
(`/api/media/file/…`), que ya existía desde la Fase 0.

Los 199 ficheros que ya estaban en `public/media` se migraron una sola vez
con `/admin-migra-material` (ver ese fichero: lee las rutas de
`content/projects.ts`/`content/team.ts`, sube el fichero real y enlaza cada
ficha). `public/media` se queda en el repositorio como estaba —no se ha
borrado nada—, pero desde la migración **la web ya no lee de ahí**: es
historia, no la fuente.

### Un permiso que faltaba, y que no se ve hasta que alguien mira de verdad

Por defecto, Payload exige estar identificado hasta para **leer** cualquier
colección. No había hecho falta tocarlo hasta ahora porque la web sólo pide
proyectos y equipo por la API *local* (`lib/contenido.ts`), que no pasa por
ahí. El material es distinto: el `<img>`/`<video>` que pinta la página lo
pide el **navegador del visitante**, sin sesión ninguna. Sin `access.read`
abierto en la colección Media, cada foto y cada vídeo de la web habría dado
403 — comprobado de verdad pidiendo el fichero por HTTP antes de dar esto por
cerrado, que es como se encontró. Arreglado en `panel/colecciones.ts`: sólo
la lectura de Media es pública; crear, editar y borrar siguen pidiendo
usuario del panel, igual que todo lo demás.

### Otro tropiezo real: una columna `NOT NULL` sobre una tabla con filas

La migración generada añadía la columna nueva de la galería
(`proyectos_gallery.ruta_id`) como `NOT NULL`. En el Mac de pruebas no se
notó —la tabla estaba vacía—, pero en producción esa tabla **ya tenía 15
filas** (las fotos de Fitz y Monegros, cargadas en la Fase 1), y Postgres no
deja añadir una columna obligatoria sin valor por defecto a una tabla que no
está vacía: el despliegue habría fallado a mitad de migración, con la base a
medio cambiar. Se reprodujo aposta —15 filas de prueba insertadas a mano
antes de aplicar la migración— antes de tocar producción, y se corrigió
quitando el `NOT NULL` en `migrations/20260924_003706_fase3_material.ts`
(arriba y en la reversión). El campo sigue siendo obligatorio para quien
edite desde el panel —eso lo exige Payload al guardar—, sólo no a nivel de
base de datos mientras una fila vieja no se haya enlazado todavía.

### La herramienta de migraciones y el diálogo que no se puede automatizar

`payload migrate:create` pregunta, de forma interactiva, si una columna que
cambia de tipo es «un renombrado» cuando sólo hay un candidato claro en la
tabla — y esa pregunta **no se puede responder desde un script sin terminal
de verdad** (`expect` sí lo consigue, dándole un terminal real; un simple
`echo`/pipe no). Pasó con la galería (`ruta` texto → `ruta_id` subida): la
respuesta correcta siempre es «crear columna», nunca «renombrar», porque el
contenido se vuelve a derivar entero desde `content/projects.ts` con
`/admin-migra-material`, no se conserva el valor viejo. Y **el nombre del
campo en el propio Payload importa para esto**: si se le hubiera puesto
`archivo` en vez de dejarlo como `ruta`, la pregunta habría sido inevitable
—Mario no lo ve, sólo ve la `label`, «Archivo»—.

### Cómo se comprobó

Contra el mismo Postgres de usar y tirar de siempre: las tres migraciones
aplicadas en orden (con las 15 filas de prueba insertadas antes de la
tercera, para reproducir producción tal cual), `up` y `down` probados los
dos —el `down` que generó la herramienta también venía mal: intentaba borrar
restricciones que un `DROP TABLE … CASCADE` anterior ya se había llevado por
delante; corregido quitando esas líneas repetidas—. Después, `/admin-carga`
+ `/admin-migra-material`, otra compilación completa, y dos comprobaciones:
**60 páginas** con el texto visible comparado carácter a carácter (igual) y
**934 referencias de material** en 52 páginas comparadas por nombre de
fichero entre la versión de ficheros y la de la base (ni una discrepancia
real; las pocas que salieron a la primera pasada eran el reel de la portada,
la foto de grupo de Monegros y la imagen de compartir en redes — assets fijos
del diseño que nunca estuvieron en `content/projects.ts` y se quedan en
código, fuera de esto a propósito). Y, de verdad, en el navegador: una ficha
de Trabajo con su vídeo reproduciéndose, la rejilla de Nosotros con las once
fotos, y el campo de subida del panel enseñando la miniatura, el peso y las
dimensiones de la foto.

### Lo que queda

- **Copia de seguridad de `media/`**, además de la de la base (ver el punto
  «lo que queda» de la Fase 1/2, arriba). Son dos copias distintas ahora: el
  `pg_dump` no incluye los ficheros.
- **Fase 4 (opcional):** borradores y vista previa, para dejar un proyecto a
  medias sin publicarlo.
- Cuando la web se abra al público (hoy sigue con contraseña), sumar
  `media/` a la ruta rápida de `publicar.sh` —la que sirve `public/` y
  `.next/static` directamente por nginx, sin pasar por Node—. Mientras haya
  contraseña, todo pasa por Apache igual que el resto y no hace falta.

---

## 15. Vista previa en vivo (2026-09-24)

Mario, al ver el panel de la Fase 3: «lo suyo sería que en el panel de la
web pudieras ir página por página… y dentro de cada página poder tocar todo
de cada cosa». Un panel agrupado por página de verdad no es posible sin
inventarse un editor propio —un proyecto sale a la vez en la portada, en
Trabajo y en su ficha; no pertenece a una sola página—, así que se le
ofrecieron dos caminos reales y eligió éste: ver la página de verdad al
lado del formulario, actualizada sola al guardar.

### Qué hay

La pestaña «Live Preview» de cada ficha —Proyectos, Equipo, Preguntas,
Cifras, Clientes, Textos— enseña la página real de la web, dentro de un
`<iframe>`, al lado del formulario. Se guarda y la vista previa se
actualiza sola: no hace falta salir del panel ni recargar a mano.

**Lo que no es**: una vista previa *reactiva*, que enseñe una letra según se
escribe, ANTES de guardar. Eso exige que los componentes que pintan cada
sección sepan recibir esos datos sin guardar en vez de los que trajo el
servidor —convertir buena parte de la web a piezas de cliente—, y es un
proyecto mucho más grande que no se ha hecho. Esto enseña la página de
verdad, actualizada justo después de cada guardado.

**Una ficha no siempre tiene una única página**: un proyecto sí
(`/portfolio/slug`), pero Cifras sale en la portada Y en Nosotros, y Textos
reparte sus ocho entradillas entre seis páginas. Payload sólo deja apuntar
a una URL por documento; se eligió la más representativa de cada cosa.

### Dos cosas que hubo que resolver, ninguna obvia

1. **La cabecera de seguridad lo impedía a propósito.** Desde la revisión
   del 2026-09-22, la web manda `frame-ancestors 'none'`: nadie puede
   meterla en un iframe, para cerrar el clickjacking. Se cambió a
   `frame-ancestors 'self'` —y `X-Frame-Options: SAMEORIGIN`—: sigue
   cerrado a cualquier sitio de fuera, sólo se abre el propio dominio
   consigo mismo. Ver `next.config.ts`.

2. **Payload no avisa de nada hasta que se lo pide.** El aviso de «se ha
   guardado» viaja por `window.postMessage`, pero Payload no manda NI UNO
   hasta que la propia página del iframe le confirma que está lista —un
   apretón de manos que no está escrito en ningún sitio a la vista; se
   encontró leyendo el código de `@payloadcms/ui` tras comprobar, con un
   listener puesto a mano dentro del iframe, que no llegaba nada—.
   `components/layout/vista-previa-panel.tsx` manda ese saludo y escucha la
   respuesta. Un primer intento usaba el campo `updatedAt` del mensaje para
   saber si algo se había guardado de verdad; no fue fiable —en un Global se
   quedó con el mismo valor en varios guardados seguidos, comprobado
   mensaje a mensaje—, así que se cambió a la señal que el propio Payload
   manda para esto exactamente: `payload-document-event`.

### Cómo se comprobó

Nada de esto se dio por bueno leyendo el código: se puso un listener a mano
dentro del iframe (`f.contentWindow.addEventListener('message', …)`) y se
guardó de verdad, una y otra vez, hasta ver los mensajes correctos llegar
—primero cero mensajes (sin el saludo), luego mensajes con un `updatedAt`
que no cambiaba (Global), y por fin el mensaje correcto en las dos
colecciones probadas—. La vista previa, con el navegador delante: un
proyecto reproduciendo su vídeo y una cifra de la portada, las dos
actualizándose solas al guardar sin tocar el iframe.

### Lo que queda

Vista previa reactiva de verdad (letra a letra, antes de guardar) si algún
día compensa el esfuerzo de convertir los componentes de contenido a piezas
de cliente. No es poco trabajo, y esto ya resuelve lo que se pedía.
