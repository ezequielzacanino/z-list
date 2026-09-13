import type { Item } from './types'

// Amount typed by hand, accepting a comma as the decimal separator.
export function parseAmount(text: string) {
  const value = Number(text.trim().replace(',', '.'))
  return text.trim() && Number.isFinite(value) ? value : null
}

export function formatMoney(amount: number) {
  const decimals = Number.isInteger(amount) ? 0 : 2
  return `$ ${amount.toLocaleString('es-AR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

function monthIndex(date: Date) {
  return date.getFullYear() * 12 + date.getMonth()
}

// Sums of the list's amounts: all of them, checked against open, and checked per month.
export function budgetSummary(items: Item[], now: Date) {
  const current = monthIndex(now)
  const summary = { total: 0, spent: 0, pending: 0, thisMonth: 0, lastMonth: 0 }
  for (const item of items) {
    if (item.amount === null) continue
    summary.total += item.amount
    if (!item.done_at) {
      summary.pending += item.amount
      continue
    }
    summary.spent += item.amount
    const month = monthIndex(new Date(item.done_at))
    if (month === current) summary.thisMonth += item.amount
    if (month === current - 1) summary.lastMonth += item.amount
  }
  return summary
}
