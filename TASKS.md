# TASKS

Estado del proyecto. Lo terminado se mueve a **Hecho**; lo que se descarta se borra
con una línea en `PROJECT_LOG.md` si cambió una decisión.

## Hecho

- [x] Esquema, RLS por membresía y realtime en Supabase.
- [x] Login por link de email.
- [x] Listas con preset, campos de carga rápida editables por lista.
- [x] Ítems con todos los atributos en el detalle; zona de abiertos e historial.
- [x] Reordenar ítems abiertos a mano.
- [x] Recurrencia por copia, materializada al abrir la lista.
- [x] Opciones con links por ítem.
- [x] Compartir lista por link de invitación.
- [x] Privilegios de tabla para `authenticated` y errores de Supabase visibles en la UI.
- [x] PWA instalable: manifest, service worker e íconos generados por script.

## Antes de usarla en serio

- [x] Crear el proyecto de Supabase, correr las migraciones, cargar `.env`.
- [x] Probar en runtime con dos dispositivos: que el realtime propague alta, tildado,
      borrado y reorden.
- [x] Verificar que las copias por recurrencia aparezcan una sola vez cuando los dos
      abren la lista al mismo tiempo: garantizado por `items_source_item_id_key`, el
      índice único sobre `source_item_id`, confirmado en la base desplegada.
- [x] Publicar en Vercel: https://listas-ebon-kappa.vercel.app (`npm run deploy`).

## Próximo

- [x] Desactivar el alta de usuarios en el panel de Supabase. Las cuentas se crean a
      mano desde Authentication → Users.


- [x] Ver quién agregó cada ítem: la fila muestra el nombre sólo cuando lo agregó
      otra persona.
- [x] Lista de miembros por lista y poder sacar a alguien, dentro del panel de
      Compartir.
- [x] Repetición con intervalo libre en días: el select suma "Otro…" y despliega un
      campo numérico.
- [x] Ordenar la lista por prioridad además del orden manual, con un toggle en el
      encabezado. El orden elegido se guarda en la lista.

## Infraestructura de afiliados

Objetivo secundario: no se busca monetizar, pero la arquitectura queda lista por si
la app escala. Regla vigente en `CLAUDE.md`: URLs guardadas limpias, tag aplicado al
hacer clic.

- [ ] Verificar términos vigentes del programa de afiliados de Mercado Libre:
      comisión por categoría, duración de la ventana de atribución, reglas sobre
      compra propia.
- [ ] Verificar el acceso actual a la API de búsqueda de Mercado Libre: registro de
      aplicación, autenticación, límites de uso.
- [ ] Edge Function de búsqueda en el marketplace, con las credenciales del lado del
      servidor.
- [ ] Buscador dentro del detalle del ítem: resultados en la app, guardar el elegido
      como opción con el permalink limpio.
- [ ] Generar el link afiliado en el momento del clic.
- [ ] Divulgación visible de que los links son afiliados.

## Más adelante

- [ ] Generar las copias vencidas en el servidor con un cron, para que aparezcan aunque
      nadie abra la app. Habilita notificaciones.
- [ ] Notificaciones push de tareas vencidas.
- [ ] Invitación por email a un usuario concreto, en vez de link abierto.

## Decisiones abiertas

- Compartir por link significa que cualquiera con la URL entra. Sirve mientras sean
  ustedes dos; revisar si la app sale de ese uso.
- Un ítem recurrente sin completar no genera copias nuevas. Si una tarea vencida
  debería insistir, hay que decidir con qué frecuencia.
