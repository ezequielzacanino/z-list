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
- [x] Publicar en Vercel: https://z-list.vercel.app, con deploy automático en cada
      push a `main`.

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

## Más adelante

Buscar en Mercado Libre desde el detalle del ítem y guardar el permalink limpio como
opción. Postergado: mientras tanto los links se cargan a mano.

- Los términos del programa de afiliados no pagan comisión por compra propia ni
  permiten compartir links en apps privadas, así que no habría capa de afiliados.
- La API exige aplicación registrada y token: `/sites/MLA/search` anónimo da 403.
- No hay `client_credentials`: hace falta un token autorizado por una cuenta real,
  que dura 6 horas y se renueva con un refresh token de un solo uso. Eso obliga a
  persistir credenciales rotativas en una tabla vedada a los clientes, y a una
  autorización manual inicial desde el navegador.

- [ ] Generar las copias vencidas en el servidor con un cron, para que aparezcan aunque
      nadie abra la app. Habilita notificaciones.
- [ ] Notificaciones push de tareas vencidas.
- [ ] Invitación por email a un usuario concreto, en vez de link abierto.

## Decisiones tomadas

- **Compartir por link abierto**: quien tenga la URL `/unirse/<id>` entra a la lista.
  Se mantiene. Con el alta de usuarios desactivada, el link sólo sirve a quien ya
  tiene cuenta, y las cuentas se crean a mano; el universo de riesgo es la gente que
  ya fue dada de alta. Revisar si la app deja de ser de uso privado.
- **Un ítem recurrente vencido no insiste**: sigue habiendo una sola copia abierta,
  sin importar cuántos ciclos pasaron. Se mantiene, para que una lista que nadie abre
  por un tiempo no se llene de duplicados de la misma tarea.
