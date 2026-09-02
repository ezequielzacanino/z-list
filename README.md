# Z-list

App de listas compartidas con actualización en tiempo real:
[z-list.vercel.app](https://z-list.vercel.app)

## Puesta en marcha

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Copiar `.env.example` a `.env` y completar `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
3. Aplicar las migraciones de `supabase/migrations/`, en orden, desde el SQL Editor.
   Con el proyecto linkeado a la CLI, `npm run db:push` aplica las pendientes.
4. `npm install && npm run dev`

Para las notificaciones push, una vez por proyecto:

1. Generar un par de claves VAPID; la pública va a `VITE_VAPID_PUBLIC_KEY` en `.env` y
   en las variables de Vercel, la privada queda sólo en Supabase.
2. `supabase secrets set VAPID_PUBLIC_KEY=… VAPID_PRIVATE_KEY=… VAPID_SUBJECT=…`
3. `supabase functions deploy notify-due`
4. `node scripts/setup_push.mjs`, que guarda en el vault la URL y la anon key con las
   que el cron llama a la función.

`node scripts/query.mjs "<sql>"` consulta la base del proyecto linkeado, con la
contraseña de `.env.local`; sirve para mirar `cron.job_run_details` o el estado de una
tabla sin abrir el panel.

## Uso

- Se entra con email y contraseña. Las cuentas se crean a mano en Authentication →
  Users, donde el mismo formulario fija la contraseña inicial. Quien no la tenga o la
  olvide usa **Olvidé mi contraseña**, o entra con un link por email; ya adentro,
  **Contraseña** en el encabezado la define.
- El botón `☾`/`☀` del encabezado cambia entre tema claro y oscuro; arranca en el del
  sistema y recuerda la elección en el dispositivo.
- **Compartir** abre el panel de la lista: copia el link de invitación y muestra sus
  miembros, a cualquiera de los cuales se puede sacar.
- Los ítems abiertos van arriba, el historial de tildados abajo. El orden es manual y
  se puede alternar a orden por prioridad, elección que queda guardada en la lista.
- Cada fila muestra quién agregó el ítem, sólo cuando lo agregó otra persona.
- Un ítem con repetición reaparece arriba como copia (marcada con `↻`) cuando pasa el
  intervalo desde que se tildó, la genere el cron del servidor o la app al abrir la
  lista. La ocurrencia anterior queda en el historial. El
  intervalo puede ser semanal, quincenal, mensual o libre en días.
- **Avisos** suscribe ese dispositivo a las notificaciones de tareas vencidas: llega
  un aviso por lista con las copias que generó el servidor. Hay que apretarlo en cada
  dispositivo, y en iPhone con la app ya instalada en la pantalla de inicio.
- **Campos** elige qué pide el formulario de carga rápida en esa lista. Cualquier
  atributo se puede poner igual entrando al ítem.
