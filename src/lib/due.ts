const DAY_MS = 86_400_000

function midnight(day: string) {
  return new Date(`${day}T00:00:00`).getTime()
}

// Local calendar day as YYYY-MM-DD.
export function localDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// How close a deadline is, and whether it deserves attention already.
export function dueLabel(dueOn: string, today: Date) {
  const days = Math.round((midnight(dueOn) - midnight(localDay(today))) / DAY_MS)
  if (days < 0) return { text: 'venció', urgent: true }
  if (days === 0) return { text: 'vence hoy', urgent: true }
  if (days === 1) return { text: 'vence mañana', urgent: true }
  const date = new Date(midnight(dueOn)).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
  })
  return { text: `vence ${date}`, urgent: false }
}
