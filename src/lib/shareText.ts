import type { Item } from './types'

// The open items as plain lines, for whoever reads the list outside the app.
export function listAsText(name: string, items: Item[]) {
  const lines = items.map((item) => `- ${item.name}${item.quantity ? ` (${item.quantity})` : ''}`)
  return [name, ...lines].join('\n')
}
