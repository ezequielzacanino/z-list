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

// Sum of every item's amount, open and checked alike.
export function listTotal(items: Item[]) {
  return items.reduce((total, item) => total + (item.amount ?? 0), 0)
}
