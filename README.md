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

## Uso

- Se entra con email y contraseña. La contraseña se le pone a cada usuario desde
  Authentication → Users en el panel de Supabase, donde también se crean las cuentas.
  Queda un link por email como alternativa para una cuenta que todavía no tenga una.
- El botón `☾`/`☀` del encabezado cambia entre tema claro y oscuro; arranca en el del
  sistema y recuerda la elección en el dispositivo.
- **Compartir** abre el panel de la lista: copia el link de invitación y muestra sus
  miembros, a cualquiera de los cuales se puede sacar.
- Los ítems abiertos van arriba, el historial de tildados abajo. El orden es manual y
  se puede alternar a orden por prioridad, elección que queda guardada en la lista.
- Cada fila muestra quién agregó el ítem, sólo cuando lo agregó otra persona.
- Un ítem con repetición reaparece arriba como copia (marcada con `↻`) cuando pasa el
  intervalo desde que se tildó. La ocurrencia anterior queda en el historial. El
  intervalo puede ser semanal, quincenal, mensual o libre en días.
- **Campos** elige qué pide el formulario de carga rápida en esa lista. Cualquier
  atributo se puede poner igual entrando al ítem.
