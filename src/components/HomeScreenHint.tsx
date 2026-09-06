import { isIos } from '../lib/homescreen'

// Browsers without an install prompt add the icon from their own menu.
export function HomeScreenHint() {
  return (
    <p className="share notice">
      {isIos
        ? 'Tocá Compartir ↑ abajo y elegí «Agregar a inicio» para dejar esta lista en la pantalla del teléfono.'
        : 'Abrí el menú ⋮ del navegador y elegí «Agregar a la pantalla principal» para dejar esta lista en la pantalla del teléfono.'}
    </p>
  )
}
