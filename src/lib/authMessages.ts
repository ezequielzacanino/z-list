// Supabase answers in English; these are the cases the app can actually hit.
const messages: [string, string][] = [
  ['Invalid login credentials', 'El email o la contraseña no coinciden.'],
  ['Email not confirmed', 'Falta confirmar el email desde el mail que te llegó.'],
  ['User not found', 'No hay ninguna cuenta con ese email.'],
  ['Signups not allowed', 'No hay ninguna cuenta con ese email.'],
  ['Password should be at least', 'La contraseña es muy corta.'],
  ['New password should be different', 'La contraseña nueva tiene que ser distinta de la anterior.'],
  ['For security purposes', 'Esperá unos segundos antes de volver a pedirlo.'],
  ['rate limit', 'Se llegó al límite de mails por hora. Probá de nuevo más tarde.'],
  ['otp_expired', 'El link del mail ya venció o se usó. Pedí uno nuevo con «Olvidé mi contraseña».'],
  ['access_denied', 'El link del mail ya venció o se usó. Pedí uno nuevo con «Olvidé mi contraseña».'],
]

export function authMessage(original: string) {
  const match = messages.find(([english]) => original.includes(english))
  return match ? match[1] : original
}

// A dead link comes back as an error in the fragment, read before the client clears it.
const fragment = new URLSearchParams(location.hash.slice(1))
const linkFailure = fragment.get('error_code') ?? fragment.get('error')

export const linkError = linkFailure ? authMessage(linkFailure) : null
