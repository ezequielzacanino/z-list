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

## Búsqueda en el marketplace

Buscar el producto desde la app y guardarlo como opción, sin capa de afiliados: los
términos del programa no pagan comisión por compra propia ni permiten compartir links
en apps privadas.

- [x] Verificar términos vigentes del programa de afiliados de Mercado Libre: 2-4% en
      electrónica y electrodomésticos, hasta 8% en el resto, 0% en alimentos; ventana
      de atribución de 30 días sobre cualquier compra; la autocompra no paga comisión
      y no se pueden compartir links en grupos privados ni sitios no declarados.
      Fuentes secundarias: la página oficial de términos responde 403.
- [x] Verificar el acceso actual a la API de búsqueda de Mercado Libre: exige
      aplicación registrada y token, `/sites/MLA/search` anónimo devuelve 403. Desde
      el 30/08/2026 las aplicaciones de Mercado Libre y Mercado Pago van separadas.
- [ ] Edge Function de búsqueda en el marketplace, con las credenciales del lado del
      servidor.
- [ ] Buscador dentro del detalle del ítem: resultados en la app, guardar el elegido
      como opción con el permalink limpio.

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
