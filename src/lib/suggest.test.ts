import { describe, expect, it } from 'vitest'
import { suggestions } from './suggest'
import type { Item } from './types'

const item = (id: string, name: string, done_at: string | null) => ({ id, name, done_at }) as Item

describe('suggestions', () => {
  const items = [
    item('a', 'Leche', '2026-09-01T10:00:00Z'),
    item('b', 'leche', '2026-09-05T10:00:00Z'),
    item('c', 'Lechuga', '2026-09-02T10:00:00Z'),
    item('d', 'Lechuga', null),
    item('e', 'Pan', '2026-09-03T10:00:00Z'),
  ]

  it('offers the newest past item per name that is not open already', () => {
    expect(suggestions(items, 'lech').map((one) => one.id)).toEqual(['b'])
  })

  it('offers nothing until something is typed', () => {
    expect(suggestions(items, '  ')).toEqual([])
  })
})
