import { describe, expect, it } from 'vitest'
import { dueOccurrences } from './recurrence'
import type { Item } from './types'

const base: Item = {
  id: 'a',
  list_id: 'l',
  name: 'Comprar café',
  quantity: null,
  priority: null,
  notes: null,
  recurrence_days: 7,
  position: 1024,
  done_at: '2026-01-01T00:00:00.000Z',
  created_by: null,
  source_item_id: null,
  created_at: '2026-01-01T00:00:00.000Z',
}

const item = (patch: Partial<Item>): Item => ({ ...base, ...patch })

describe('dueOccurrences', () => {
  it('takes a completed occurrence once its interval elapsed', () => {
    expect(dueOccurrences([base], new Date('2026-01-08T00:00:00.000Z'))).toEqual([base])
  })

  it('leaves it alone before the interval elapses', () => {
    expect(dueOccurrences([base], new Date('2026-01-07T23:59:00.000Z'))).toEqual([])
  })

  it('skips an occurrence that already spawned its copy', () => {
    const copy = item({ id: 'b', source_item_id: 'a', done_at: null })
    expect(dueOccurrences([base, copy], new Date('2026-02-01T00:00:00.000Z'))).toEqual([])
  })

  it('ignores items that are open or do not repeat', () => {
    const open = item({ id: 'c', done_at: null })
    const once = item({ id: 'd', recurrence_days: null })
    expect(dueOccurrences([open, once], new Date('2026-02-01T00:00:00.000Z'))).toEqual([])
  })

  it('does not chain past an uncompleted copy', () => {
    const copy = item({ id: 'b', source_item_id: 'a', done_at: null })
    expect(dueOccurrences([base, copy], new Date('2026-03-01T00:00:00.000Z'))).toEqual([])
  })
})
