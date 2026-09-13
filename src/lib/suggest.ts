import { normalize } from './categorize'
import type { Item } from './types'

// Past items whose name contains what is typed, newest first, skipping names already open.
export function suggestions(items: Item[], typed: string, limit = 4): Item[] {
  const query = normalize(typed)
  if (!query) return []
  const open = new Set(items.filter((item) => !item.done_at).map((item) => normalize(item.name)))
  const seen = new Set<string>()
  return items
    .filter((item) => item.done_at)
    .sort((a, b) => b.done_at!.localeCompare(a.done_at!))
    .filter((item) => {
      const name = normalize(item.name)
      if (!name.includes(query) || open.has(name) || seen.has(name)) return false
      seen.add(name)
      return true
    })
    .slice(0, limit)
}
