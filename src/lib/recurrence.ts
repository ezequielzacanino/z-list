import type { Item, ItemDraft } from './types'

const DAY_MS = 86_400_000

// Completed recurring occurrences whose interval elapsed and that spawned no copy yet.
export function dueOccurrences(items: Item[], now: Date): Item[] {
  const copied = new Set(items.map((item) => item.source_item_id).filter(Boolean))
  return items.filter(
    (item) =>
      item.done_at &&
      item.recurrence_days &&
      !copied.has(item.id) &&
      new Date(item.done_at).getTime() + item.recurrence_days * DAY_MS <= now.getTime(),
  )
}

// Attributes carried from a completed occurrence into its next copy.
export function copyOf(item: Item): ItemDraft {
  return {
    name: item.name,
    quantity: item.quantity,
    priority: item.priority,
    notes: item.notes,
    recurrence_days: item.recurrence_days,
  }
}

// Intervals offered in the pickers before falling back to a free number of days.
export const recurrencePresets = [
  { days: 7, label: 'Cada semana' },
  { days: 15, label: 'Cada 15 días' },
  { days: 30, label: 'Cada mes' },
]
