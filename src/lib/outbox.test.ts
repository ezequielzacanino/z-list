import { beforeEach, describe, expect, it, vi } from 'vitest'

const insert = vi.fn()
vi.mock('./supabase', () => ({
  supabase: { from: () => ({ insert }) },
}))

const row = { id: 'a', list_id: 'l1', name: 'a', position: 1024 }

// The module reads the browser globals at import time; tests run in node.
const store = new Map<string, string>()
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  clear: () => store.clear(),
})
vi.stubGlobal('navigator', { onLine: true })

describe('flush', () => {
  beforeEach(async () => {
    localStorage.clear()
    insert.mockReset()
    insert.mockResolvedValue({ error: null })
    vi.resetModules()
  })

  it('sends each queued write once when two callers flush at the same time', async () => {
    const outbox = await import('./outbox')
    outbox.enqueue({ op: 'insert', table: 'items', row: row as never })
    await Promise.all([outbox.flush(), outbox.flush()])
    expect(insert).toHaveBeenCalledTimes(1)
    expect(outbox.snapshot()).toHaveLength(0)
  })

  it('keeps the write when the network refuses it', async () => {
    insert.mockResolvedValue({ error: { message: 'Failed to fetch' } })
    const outbox = await import('./outbox')
    outbox.enqueue({ op: 'insert', table: 'items', row: row as never })
    const { sent, rejected } = await outbox.flush()
    expect(sent).toBe(0)
    expect(rejected).toBeNull()
    expect(outbox.snapshot()).toHaveLength(1)
  })

  it('drops a write the server rejects and reports its error', async () => {
    insert.mockResolvedValue({ error: { message: 'duplicate key' } })
    const outbox = await import('./outbox')
    outbox.enqueue({ op: 'insert', table: 'items', row: row as never })
    const { rejected } = await outbox.flush()
    expect(rejected).toBe('duplicate key')
    expect(outbox.snapshot()).toHaveLength(0)
  })
})
