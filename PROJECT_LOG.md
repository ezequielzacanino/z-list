# PROJECT_LOG

## 2026-09-01 — Estructura inicial y modelo de datos

**Resumen**: Scaffolding React + TypeScript + Vite sobre Supabase, con esquema,
políticas RLS por membresía, realtime, y la funcionalidad básica: listas
compartidas, ítems con atributos opcionales, presets de carga rápida editables por
lista, zona de abiertos con historial, y recurrencia por copia.

**Archivos**: `supabase/migrations/0001_init.sql`, `0002_rls.sql`, `0003_realtime.sql`,
`src/lib/*`, `src/hooks/*`, `src/components/*`, `src/pages/*`, `CLAUDE.md`, `README.md`.

**Fundamento**: Un solo modelo de ítem con todos los atributos opcionales evita
duplicar lógica por tipo de lista; el preset es solo el conjunto de campos del
formulario rápido, guardado en la lista para poder personalizarlo sin cambiar de
preset. La recurrencia crea una copia nueva en lugar de destildar la ocurrencia
anterior, para que el historial conserve cada ciclo. Las copias se materializan al
abrir la lista, con índice único sobre `source_item_id` como garantía de
idempotencia ante aperturas simultáneas.

## 2026-09-01 — Privilegios de tabla y errores visibles

**Resumen**: Se agregan los `GRANT` sobre `public` para el rol `authenticated`, sin
los cuales Postgres rechaza toda consulta antes de evaluar RLS. Los hooks pasan a
guardar el error de Supabase en estado y las pantallas lo muestran, en lugar de
lanzarlo dentro de una promesa donde quedaba invisible.

**Archivos**: `supabase/migrations/0004_grants.sql`, `src/hooks/useLists.ts`,
`src/hooks/useItems.ts`, `src/hooks/useItemOptions.ts`, `src/pages/ListsPage.tsx`,
`src/pages/ListPage.tsx`, `src/components/ItemDetail.tsx`, `CLAUDE.md`.

**Fundamento**: Las políticas deciden qué filas alcanza un usuario, los privilegios
deciden si el rol puede tocar la tabla; hacen falta los dos. Un error que no llega a
la pantalla deja la app colgada en un estado de carga sin diagnóstico.

## 2026-09-01 — Publicación en Vercel

**Resumen**: La app se publica en https://listas-ebon-kappa.vercel.app. Vercel
compila desde el repositorio con `vercel.json`, que además reescribe todas las rutas
a `index.html` para que las URLs de lista e invitación funcionen al entrar directo.
Las claves de Supabase viven como variables del proyecto en Vercel, no en el build.

**Archivos**: `vercel.json`, `package.json`.

**Fundamento**: Una URL pública elimina la dependencia del servidor local y de la red
de casa, y es requisito para instalar la app como PWA en el celular.

## 2026-09-01 — PWA instalable

**Resumen**: La app se instala desde el navegador. Se agregan `manifest.webmanifest`,
un service worker que sirve los assets con hash desde caché y va siempre a la red por
los datos, y los íconos, generados por `scripts/generate_icons.mjs`.

**Archivos**: `public/manifest.webmanifest`, `public/sw.js`, `public/icon-*.png`,
`scripts/generate_icons.mjs`, `index.html`, `src/main.tsx`.

**Fundamento**: Instalar desde el navegador evita las tiendas, su comisión y sus
revisiones. Los íconos se generan por script en vez de versionar binarios opacos.

## 2026-09-01 — Registro cerrado y miembros administrables

**Resumen**: El alta de usuarios queda desactivada en Supabase Auth: las cuentas se
crean a mano desde el panel, y el magic link sigue sirviendo para entrar. El botón
Compartir pasa de copiar el link a abrir un panel que muestra los miembros de la
lista y permite sacar a cualquiera, incluido uno mismo, en cuyo caso la app vuelve al
listado porque se pierde el acceso.

**Archivos**: `src/hooks/useMembers.ts`, `src/components/SharePanel.tsx`,
`src/pages/ListPage.tsx`, `src/styles.css`, `TASKS.md`.

**Fundamento**: Con el registro abierto, cualquiera que conociera la URL entraba a la
app. Las políticas ya permitían que cualquier miembro sacara a otro; el panel expone
esa capacidad en la UI, acorde a un uso de grupo chico donde todos confían entre sí.

## 2026-09-01 — Orden de la lista persistido

**Resumen**: `lists` suma la columna `sort_by_priority`, así que el orden elegido
sobrevive a cerrar la lista y lo ven todos sus miembros. La lectura y las
modificaciones de la lista abierta pasan al hook `useList`, que además se suscribe a
los cambios de esa fila; `ListPage` ya no toca el cliente de Supabase.

**Archivos**: `supabase/migrations/0005_list_sort.sql`, `src/hooks/useList.ts`,
`src/pages/ListPage.tsx`, `src/lib/types.ts`.

**Fundamento**: El orden es una propiedad de la lista, no de quien la mira: en un
grupo chico conviene que los dos vean lo mismo. La política `lists_update` ya
habilitaba a cualquier miembro a cambiarla, y sin la suscripción el cambio del otro
quedaba invisible hasta recargar.

## 2026-09-01 — Migraciones por CLI e íconos al día

**Resumen**: El proyecto queda linkeado a la CLI de Supabase, con el historial de
migraciones reparado: las 0001 a 0004, aplicadas a mano en su momento, se marcan como
aplicadas y la 0005 se pushea. `npm run db:push` corre `scripts/push_migrations.mjs`,
que lee las credenciales de `.env.local` y aplica lo pendiente. Los íconos de la PWA
se regeneran con el durazno del acento nuevo, en lugar del verde original.

**Archivos**: `scripts/push_migrations.mjs`, `scripts/generate_icons.mjs`,
`public/icon-192.png`, `public/icon-512.png`, `package.json`, `.gitignore`.

**Fundamento**: Pegar SQL a mano en el panel no deja rastro de qué se aplicó y a
dónde; el historial de la CLI sí. Las credenciales viven en `.env.local`, ignorado por
git, y no viajan en la línea de comandos.

## 2026-09-01 — Se descarta la capa de afiliados

**Resumen**: Se elimina del alcance la afiliación: generar el link con tag al hacer
clic y su divulgación en la UI. La regla de enlaces salientes en `CLAUDE.md` conserva
las URLs limpias y la búsqueda dentro de una Edge Function, y pierde las cláusulas
sobre tags de afiliado.

**Archivos**: `CLAUDE.md`, `TASKS.md`.

**Fundamento**: Los términos del programa de Mercado Libre no pagan comisión por
compra propia y prohíben compartir links en apps privadas o sitios no declarados, que
es exactamente el uso de esta app. Mantener el andamiaje sería código a sostener para
un escenario que los propios términos bloquean.

## 2026-09-01 — Publicación en z-list.vercel.app

**Resumen**: La app se publica en https://z-list.vercel.app, desde un proyecto de
Vercel nuevo conectado al repositorio: cada push a `main` despliega. El proyecto
anterior quedaba en manos de otra cuenta del mismo equipo, y el plan Hobby rechaza
todo deploy que no dispare su dueño, así que ningún build llegaba a arrancar.

**Archivos**: `.vercel/project.json`, `TASKS.md`.

**Fundamento**: Una sola identidad para git, GitHub y Vercel elimina el cruce de
cuentas de raíz. Las claves de Supabase viven como variables del proyecto; la anon
key se declara pública de forma explícita, que es lo que ya era al viajar en el
bundle.

