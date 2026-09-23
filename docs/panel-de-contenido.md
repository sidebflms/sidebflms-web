# Un panel para editar la web sin tocar código

**Estado: Fase 2 EN PRODUCCIÓN** (2026-09-23). Proyectos, equipo, cifras,
clientes, preguntas frecuentes y las entradillas de página se editan en
`sidebflms.com/admin`. Lo hecho y lo aprendido, al final (puntos 11 a 13).

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
  restauración. Sin esto, un borrado en el panel no tiene vuelta.
- Fase 3 (material: fotos y vídeos desde el panel).

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
