# Puesta en marcha

Z-list no tiene servidor propio: es un build estático contra un proyecto de Supabase.
Para levantar una instancia propia hace falta crear ese proyecto y aplicarle el
esquema de `supabase/migrations/`.

## Instancia mínima

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Crear un `.env` en la raíz con los valores de Project Settings → API:

   ```
   VITE_SUPABASE_URL=https://<proyecto>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon key>
   VITE_VAPID_PUBLIC_KEY=<clave pública VAPID>
   ```

   La clave VAPID sale del paso de notificaciones push, más abajo; sin ella la app
   funciona, pero sin avisos.
3. Aplicar las migraciones de `supabase/migrations/`, en orden, desde el SQL Editor.
   Con el proyecto linkeado a la CLI, `npm run db:push` aplica las pendientes.
4. `npm run functions:deploy` publica las edge functions de `supabase/functions/`.
5. En Authentication → URL Configuration, la URL de la app tiene que estar entre las
   redirecciones permitidas: es a donde vuelve el invitado a poner su contraseña.
6. `npm install && npm run dev`

## Notificaciones push

Una vez por proyecto:

1. Generar un par de claves VAPID; la pública va a `VITE_VAPID_PUBLIC_KEY` en `.env` y
   en las variables de Vercel, la privada queda sólo en Supabase.
2. `supabase secrets set VAPID_PUBLIC_KEY=… VAPID_PRIVATE_KEY=… VAPID_SUBJECT=…`
3. `npm run functions:deploy`
4. `node scripts/setup_push.mjs`, que guarda en el vault la URL y la anon key con las
   que el cron llama a la función.

## Cuentas

Se entra con email y contraseña. Las cuentas se crean a mano en Authentication →
Users, donde el mismo formulario fija la contraseña inicial. A partir de ahí cada
miembro invita a los demás desde la app.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run dev:lan` | Igual, accesible desde otros dispositivos de la red |
| `npm run build` | Chequeo de tipos y build de producción |
| `npm test` | Tests unitarios (vitest) |
| `npm run db:push` | Aplica las migraciones pendientes |
| `npm run functions:deploy` | Publica las edge functions |
| `npm run gallery` | Renderiza la galería de plantas en `dist/` |

`node scripts/query.mjs "<sql>"` consulta la base del proyecto linkeado, con la
contraseña de `.env.local`; sirve para mirar `cron.job_run_details` o el estado de una
tabla sin abrir el panel.
