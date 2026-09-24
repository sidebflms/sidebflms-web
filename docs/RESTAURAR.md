# Restaurar una copia de seguridad

Las copias están en dos sitios que no se caen a la vez:

- **En el servidor**, `~/backups/sidebflms-web-FECHA.tar.gz.gpg` — las 12 últimas
- **En GitHub**, como artifact de la acción «Copia de seguridad semanal» — 90 días

Ambas están cifradas con GPG y la misma frase (secreto `BACKUP_PASSPHRASE` de
este repositorio). **Sin la frase, la copia no sirve para nada**, así que
tiene que estar donde puedas encontrarla dentro de un año y en un sitio que no
dependa de esta máquina — un gestor de contraseñas, no un fichero suelto.

Es la misma frase de la que habla `despliegue/copia-seguridad.sh`; **no** es
la misma que la de `inventario-sidebfilms` — cada sitio lleva la suya, para
que revocar una no se lleve por delante la otra.

## Abrir una copia

```bash
gpg --decrypt sidebflms-web-2026-09-24.tar.gz.gpg | tar xz
```

Salen cuatro cosas:

| Qué | Para qué |
|---|---|
| `completo.sql` | **El que se usa para restaurar la base.** Esquema y datos. |
| `datos.sql` | Sólo los datos, para repoblar un esquema que ya existe. |
| `esquema.sql` | Sólo la estructura, para comparar con las migraciones. |
| `media/` | Las fotos y vídeos subidos desde el panel. El `pg_dump` no los trae: la base sólo guarda de dónde salió cada fichero, no el fichero en sí. |

## Restaurar la base, en una base vacía

```bash
psql "postgres://usuario@127.0.0.1/bote_panelweb" -v ON_ERROR_STOP=1 -f completo.sql
```

Después hace falta volver a aplicar las migraciones de Payload
(`migrations/`) si la base restaurada es más vieja que el código que va a
correr contra ella — `publicar.sh` ya lo hace solo en cada despliegue.

## Restaurar el material

```bash
rsync -a --delete media/ ~/sidebflms-web/media/
```

Sin el `--delete` si sólo quieres rellenar lo que falte, no volver exactamente
al estado de la copia.

## La advertencia sobre `datos.sql`

Igual que en inventario-sidebfilms: si alguna tabla de aquí llegara a
referenciarse a sí misma (hoy ninguna lo hace), un volcado de sólo datos no
garantiza el orden de inserción. `completo.sql` no tiene ese problema porque
crea las restricciones después de meter los datos. **Si hay que restaurar, se
restaura `completo.sql`.**

## Comprobar que una copia sirve, sin restaurarla

Merece la pena hacerlo alguna vez, y no el día de la urgencia:

```bash
gpg --decrypt sidebflms-web-FECHA.tar.gz.gpg | tar xz -O completo.sql | grep -c "^COPY public.proyectos"
tar xzOf <(gpg --decrypt sidebflms-web-FECHA.tar.gz.gpg) media | tar t | wc -l
```

El propio script ya comprueba tres cosas en cada copia: que la base trae más
de 20 proyectos y más de 150 ficheros de material, que la carpeta `media/`
en disco trae más de 150 ficheros, y que el paquete cifrado **se puede
descifrar** y coincide con el original. Una copia vacía que termina en verde
es peor que una que falla: da la sensación de estar cubierto sin estarlo.
