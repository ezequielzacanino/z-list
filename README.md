# Listas

App de listas compartidas con actualización en tiempo real.

## Puesta en marcha

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Correr en orden los archivos de `supabase/migrations/` desde el SQL Editor.
3. Copiar `.env.example` a `.env` y completar `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
4. `npm install && npm run dev`

## Uso

- Se entra con un link enviado por email, sin contraseña.
- **Compartir** copia un link de invitación: quien lo abre queda como miembro de la lista.
- Los ítems abiertos van arriba, el historial de tildados abajo.
- Un ítem con repetición reaparece arriba como copia (marcada con `↻`) cuando pasa el
  intervalo desde que se tildó. La ocurrencia anterior queda en el historial.
- **Campos** elige qué pide el formulario de carga rápida en esa lista. Cualquier
  atributo se puede poner igual entrando al ítem.
