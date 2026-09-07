import { describe, expect, it } from 'vitest'
import { applyPending } from './pending'
import type { Item, PendingWrite } from './types'

const item = (id: string, patch: Partial<Item> = {}): Item =>
  ({ id, list_id: 'l1', name: id, done_at: null, position: 1024, ...patch }) as Item

const owns = (row: Item) => row.list_id === 'l1'

describe('applyPending', () => {
  it('appends an insert that has not left the device', () => {
    const writes: PendingWrite[] = [{ op: 'insert', table: 'items', row: item('b') }]
    expect(applyPending([item('a')], writes, 'items', owns).map((row) => row.id)).toEqual(['a', 'b'])
  })

  it('does not duplicate an insert the server already returned', () => {
    const writes: PendingWrite[] = [{ op: 'insert', table: 'items', row: item('a') }]
    expect(applyPending([item('a')], writes, 'items', owns)).toHaveLength(1)
  })

  it('leaves out an insert that belongs to another list', () => {
    const other = item('b', { list_id: 'l2' })
    const writes: PendingWrite[] = [{ op: 'insert', table: 'items', row: other }]
    expect(applyPending([item('a')], writes, 'items', owns)).toHaveLength(1)
  })

  it('merges an update over the server row', () => {
    const writes: PendingWrite[] = [
      { op: 'update', table: 'items', id: 'a', patch: { done_at: '2026-01-01T00:00:00.000Z' } },
    ]
    expect(applyPending([item('a')], writes, 'items', owns)[0].done_at).toBe(
      '2026-01-01T00:00:00.000Z',
    )
  })

  it('drops a deleted row', () => {
    const writes: PendingWrite[] = [{ op: 'delete', table: 'items', id: 'a' }]
    expect(applyPending([item('a')], writes, 'items', owns)).toEqual([])
  })

  it('applies the writes in order', () => {
    const writes: PendingWrite[] = [
      { op: 'insert', table: 'items', row: item('b') },
      { op: 'update', table: 'items', id: 'b', patch: { name: 'editado' } },
      { op: 'delete', table: 'items', id: 'a' },
    ]
    expect(applyPending([item('a')], writes, 'items', owns)).toEqual([
      expect.objectContaining({ id: 'b', name: 'editado' }),
    ])
  })

  it('ignores writes aimed at another table', () => {
    const writes: PendingWrite[] = [{ op: 'delete', table: 'item_options', id: 'a' }]
    expect(applyPending([item('a')], writes, 'items', owns)).toHaveLength(1)
  })
})
