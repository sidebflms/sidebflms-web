# Un panel para editar la web sin tocar código

**Estado: propuesta.** Nada de esto está hecho. Escrito el 2026-09-22 a
petición de Mario, para decidir antes de empezar.

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
| **Proyectos** (27): nombre, textos, fecha, sitio, categorías, destacado | `content/projects.ts` | **Panel** |
| **Equipo** (13): nombre, cargo, orden, foto | `content/team.ts` | **Panel** |
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
