import type { Item } from './types'

const STEP = 1024

// Position for a new item appended to the open zone.
export function nextPosition(items: Item[]): number {
  const open = items.filter((item) => !item.done_at)
  return open.length ? Math.max(...open.map((item) => item.position)) + STEP : STEP
}

// Position that places an item between its two new neighbours.
export function positionBetween(before: Item | undefined, after: Item | undefined): number {
  if (!before && !after) return STEP
  if (!before) return after!.position - STEP
  if (!after) return before.position + STEP
  return (before.position + after.position) / 2
}
