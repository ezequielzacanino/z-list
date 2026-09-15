# Z-list

Listas compartidas que se actualizan solas. Una pareja, una familia o un equipo abren
la misma lista en sus teléfonos y cada alta, tildado o reorden aparece en el resto en
el momento.

**[z-list.vercel.app](https://z-list.vercel.app)**

## Cómo es

Una lista es una sola pantalla con dos zonas: arriba lo pendiente, abajo el historial
de lo tildado, de lo más reciente a lo más viejo y con el día en que se tildó cada
cosa. Tildar no borra: mueve al historial, que queda como registro de lo que se hizo
y cuándo.

No hay tipos de lista. Todos los ítems pueden llevar los mismos atributos —cantidad,
monto, fecha límite, repetición, prioridad, especificaciones y opciones con links—; lo
que cambia entre listas es qué pide el formulario de carga rápida, para que agregar
algo sean una o dos pulsaciones. Los **presets** (tareas del hogar, lista de compras,
compras pendientes, presupuesto, simple) son puntos de partida de ese formulario y se
cambian cuando se quiera, sin tocar los ítems ya cargados.

## Qué hace

- **Tiempo real.** Los cambios se propagan por Supabase Realtime, y el encabezado
  muestra qué otros miembros tienen la lista abierta en ese momento.
- **Compartir.** Se invita por email —si la cuenta no existe, se crea y le llega un
  mail para poner su contraseña— o por un link de WhatsApp que vence a los 7 días y se
  anula desde el mismo panel.
- **Repeticiones.** Un ítem con repetición reaparece arriba como copia nueva (marcada
  con `↻`) cuando pasa el intervalo desde que se tildó. La ocurrencia anterior queda
  intacta en el historial, así que el historial contesta "¿lo compramos la vez
  pasada?" para cada ciclo. Genera las copias el cron del servidor o la app al abrir
  la lista, y nunca sale más de una por ocurrencia.
- **Avisos.** Notificaciones push por fechas límite y, si se quiere, por lo que
  agregan los demás, agrupadas por autor y lista.
- **Presupuesto.** Una lista con montos suma lo abierto y lo tildado, compara este mes
  contra el anterior y mide contra un tope opcional.
- **Orden.** Manual arrastrando, por prioridad o agrupado por categoría de góndola; el
  orden es el mismo para todos.
- **Deshacer.** Tildar y borrar se hacen con un gesto y se pueden deshacer por unos
  segundos; el borrado recién llega a la base cuando esa ventana se cierra.
- **Buscar y repetir.** Escribir en el campo de carga rápida filtra las dos zonas y
  ofrece ítems pasados con el mismo nombre, que vuelven con los atributos que tenían.
- **PWA.** Se instala en la pantalla de inicio, funciona con tema claro u oscuro y
  aguanta perder la conexión: lo que se hace sin señal sale cuando vuelve.

## La planta

Cada lista tiene una planta en maceta, de estilo japonés, sorteada entre cincuenta
especies al crearla. Usar la lista la hace crecer —un punto por agregar un ítem, tres
por completarlo la primera vez— a lo largo de veinte etapas; una semana sin usarla la
hace retroceder. Las copias automáticas y los tildados repetidos no suman.

## Stack

React + TypeScript + Vite con una hoja de estilos plana, sin librería de estado ni
framework de UI. Supabase (Postgres, Auth, Realtime, Row Level Security y edge
functions) es el único servidor; el front es un build estático en Vercel.

## Correrlo

Ver [docs/SETUP.md](docs/SETUP.md).

## Licencia

MIT — ver [LICENSE](LICENSE).
