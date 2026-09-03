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

## 2026-09-02 — Ingreso con contraseña y tema elegible

**Resumen**: La pantalla de ingreso pide email y contraseña, y ofrece link por email
y mail de recuperación para una cuenta sin contraseña puesta. Ya en sesión,
**Contraseña** en el encabezado la cambia sin pasar por el panel de Supabase. El encabezado suma un botón
que alterna tema claro y oscuro, guardado por dispositivo y pintado antes del primer
cuadro por un script en `index.html`.

**Archivos**: `src/pages/AuthPage.tsx`, `src/hooks/usePassword.ts`,
`src/components/PasswordPanel.tsx`, `src/lib/theme.ts`, `src/hooks/useTheme.ts`,
`src/components/ThemeToggle.tsx`, `src/pages/ListsPage.tsx`, `src/styles.css`,
`index.html`, `README.md`, `TASKS.md`.

**Fundamento**: El link por email obliga a esperar el correo cada vez que un
dispositivo abre la app sin sesión, y la sesión que crea queda en el navegador que
abrió el link, no en la app instalada. La contraseña entra en el acto y la puede
guardar el navegador. Que cada uno defina la suya evita que las credenciales pasen
por un tercero al crear la cuenta. El envío de link pasa a `shouldCreateUser: false`, acorde con
el alta de usuarios cerrada.

## 2026-09-02 — Copias de recurrencia generadas por el servidor

**Resumen**: `pg_cron` corre `materialize_due_items()` cada 15 minutos, que inserta la
copia de cada ocurrencia recurrente vencida sin copia previa, sin autor y al final de
la zona de abiertos de su lista. La app sigue materializando al abrir la lista.
`scripts/query.mjs` consulta la base del proyecto linkeado.

**Archivos**: `supabase/migrations/0006_recurrence_cron.sql`, `scripts/query.mjs`,
`package.json`, `README.md`, `TASKS.md`.

**Fundamento**: Una lista que nadie abre dejaba de generar copias, y las
notificaciones necesitan que el ítem exista antes de que alguien mire. Las dos vías
conviven porque el índice único sobre `source_item_id` acota a una copia por
ocurrencia. La función es `security definer` para escribir sobre todas las listas, y
se le revoca el `execute` a `authenticated` para que sólo la llame el cron.

## 2026-09-02 — Notificaciones push de tareas vencidas

**Resumen**: `push_subscriptions` guarda un dispositivo por endpoint, con RLS y
privilegios propios, y cada usuario ve y borra sólo los suyos. `items.notified_at`
marca lo ya avisado. La edge function `notify-due` manda un aviso por lista con las
copias generadas sin avisar y estampa la marca; `pg_cron` la llama por `pg_net` a los
5, 20, 35 y 50 de cada hora, con la URL y la anon key leídas del vault.

**Archivos**: `supabase/migrations/0007_push.sql`, `0008_service_role_grants.sql`,
`supabase/functions/notify-due/index.ts`, `public/sw.js`, `src/lib/push.ts`,
`src/hooks/usePush.ts`, `src/pages/ListsPage.tsx`, `scripts/db.mjs`,
`scripts/setup_push.mjs`, `scripts/query.mjs`, `scripts/push_migrations.mjs`.

**Fundamento**: El aviso se agrupa por lista para que una lista con varias tareas
vencidas no dispare una ristra de notificaciones. `notified_at` hace idempotente el
envío ante llamadas repetidas de cron. Un endpoint que contesta 404 o 410 es un
dispositivo que desinstaló o revocó el permiso, y la función lo borra. `service_role`
necesita privilegios explícitos: RLS no interviene, pero sin `GRANT` Postgres rechaza
la consulta igual.

## 2026-09-02 — Los mails de auth vuelven al dominio actual

**Resumen**: El Site URL del proyecto de Supabase pasa a `https://z-list.vercel.app`,
que además entra en la lista de redirecciones permitidas junto con el dominio viejo y
`localhost:5173`. Al volver de un mail de recuperación, la app abre sola el panel de
contraseña.

**Archivos**: `src/hooks/useSession.ts`, `src/App.tsx`, `src/pages/ListsPage.tsx`.

**Fundamento**: El `redirectTo` que manda la app sólo vale si está en la lista
permitida; fuera de ella Supabase cae al Site URL, que apuntaba al dominio anterior y
daba 404. La configuración de auth vive en el proyecto de Supabase, no en el
repositorio, así que el cambio queda registrado acá.


## 2026-09-03 — Invitación por email en lugar de link abierto

**Resumen**: `add_member_by_email(list_id, email)` busca la cuenta en `auth.users` y la
suma a `list_members`; corre como `security definer`, exige que quien llama ya sea
miembro y sólo la ejecuta `authenticated`. La política de alta de miembros deja de
aceptar el auto-alta y pide membresía previa. Desaparecen la pantalla `/unirse/<id>`
y el botón de copiar link; el panel de Compartir pide un email.

**Archivos**: `supabase/migrations/0009_invite_by_email.sql`, `0010_invite_execute.sql`,
`src/components/SharePanel.tsx`, `src/hooks/useMembers.ts`, `src/pages/ListPage.tsx`,
`src/App.tsx`, `src/pages/JoinPage.tsx` (borrado), `README.md`, `TASKS.md`.

**Fundamento**: El link daba acceso a cualquiera que lo tuviera, dentro y fuera de la
conversación donde se compartió; ahora el acceso se otorga por cuenta. El cliente no
puede leer `auth.users`, así que la búsqueda vive en la base y devuelve sólo si el
email tenía cuenta. Sin tabla de invitaciones pendientes: el alta de usuarios está
desactivada y se hace a mano, así que una invitación a una cuenta inexistente no
tendría a quién esperar.

## 2026-09-03 — Invitaciones por token: mail al que no tiene cuenta y compartir por WhatsApp

**Resumen**: `list_invites` guarda un token por invitación, con RLS por membresía, que
vence a los 7 días y se anula desde el panel. `join_with_invite()` lo canjea por
membresía y `add_member_by_invite()`, reservada a `service_role`, suma un email a la
lista del token. La edge function pública `invite-user` crea la cuenta que falta y
manda el mail de contraseña. Compartir ofrece invitar por email o abrir WhatsApp con
el link, y `/unirse/<token>` entra sin sesión pidiendo un email.

**Archivos**: `supabase/migrations/0011_invites.sql`, `0012_invite_execute.sql`,
`supabase/functions/invite-user/index.ts`, `supabase/config.toml`,
`src/lib/invites.ts`, `src/lib/types.ts`, `src/hooks/useInvites.ts`,
`src/hooks/useJoin.ts`, `src/hooks/useMembers.ts`, `src/pages/JoinPage.tsx`,
`src/pages/ListPage.tsx`, `src/App.tsx`, `src/components/SharePanel.tsx`,
`scripts/deploy_functions.mjs`, `package.json`.

**Fundamento**: El token es la credencial, así que la función no necesita sesión y la
ruta de unirse queda fuera del muro de login. Que venza y se pueda anular acota el
reenvío del mensaje de WhatsApp, que es un canal que la app no controla. El alta
pública sigue cerrada: la cuenta la crea `service_role` sólo si un miembro invitó ese
email, y el mail que la estrena es el mismo de recuperación, así que el invitado cae
en el panel de contraseña que ya existía.

## 2026-09-03 — Íconos por categoría derivados del nombre

**Resumen**: Cada ítem muestra un ícono de línea según una de quince categorías más
un genérico. La categoría se calcula del nombre en el cliente: no hay columna, ni
migración, ni política nueva, y cambiar el diccionario reetiqueta todo el historial.
El matcher resuelve frase exacta, bigrama exacto, bigrama difuso, token exacto y
token difuso, con similitud de Dice sobre trigramas para tolerar errores de tipeo.

**Archivos**: `src/lib/categoryTerms.ts`, `src/lib/categorize.ts`,
`src/components/CategoryIcon.tsx`, `src/components/ItemRow.tsx`, `src/lib/types.ts`,
`src/styles.css`.

**Fundamento**: Guardar la categoría obligaría a resolverla al escribir y a arrastrar
valores viejos cuando el diccionario mejore; derivarla la vuelve un detalle de
presentación, sin superficie compartida. El paso difuso corre sobre bigramas antes
que el exacto sobre tokens porque un nombre mal tipeado como "papel higenico" cae en
papelería si gana la palabra suelta.
