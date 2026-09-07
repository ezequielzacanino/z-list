import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { readCache, writeCache } from '../lib/localCache'
import { firstPosition, nextPosition, positionBetween } from '../lib/ordering'
import { isOffline, sendOrQueue } from '../lib/outbox'
import { applyPending } from '../lib/pending'
import { supabase } from '../lib/supabase'
import { copyOf, dueOccurrences } from '../lib/recurrence'
import type { Item, ItemDraft, OptionDraft } from '../lib/types'
import { useOutbox } from './useOutbox'
import { useVisible } from './useVisible'

export function useItems(listId: string, userId: string | undefined) {
  const [rows, setRows] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requests = useRef(0)

  // Only the latest request lands, so a slow answer never overwrites a newer one.
  const load = useCallback(async () => {
    const request = (requests.current += 1)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', listId)
      .order('position')
    if (request !== requests.current) return
    if (!error) {
      setRows(data as Item[])
      writeCache(`items:${listId}`, data as Item[])
    } else if (isOffline(error)) {
      setRows(readCache<Item>(`items:${listId}`) ?? [])
    } else {
      setError(error.message)
    }
    setLoading(false)
  }, [listId])

  const outbox = useOutbox(load)
  useVisible(load)
  const items = useMemo(
    () => applyPending(rows, outbox.pending, 'items', (row) => row.list_id === listId),
    [rows, outbox.pending, listId],
  )

  // Materializes recurrence copies that came due while the list was closed.
  const materializeDue = useCallback(
    async (current: Item[]) => {
      const due = dueOccurrences(current, new Date())
      if (!due.length || !navigator.onLine) return
      let position = nextPosition(current)
      const copies = due.map((item) => ({
        ...copyOf(item),
        list_id: listId,
        source_item_id: item.id,
        created_by: null,
        position: (position += 1024),
      }))
      const { error } = await supabase
        .from('items')
        .upsert(copies, { onConflict: 'source_item_id', ignoreDuplicates: true })
      if (error) setError(error.message)
      else await load()
    },
    [listId, load],
  )

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`items:${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items', filter: `list_id=eq.${listId}` },
        load,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [listId, load])

  useEffect(() => {
    if (!loading) materializeDue(items)
    // Runs on open and after each reload, never on local optimistic state.
  }, [loading]) // eslint-disable-line react-hooks/exhaustive-deps

  // The option, when the quick-add form asks for one, hangs from the item just built.
  const addItem = useCallback(
    async (draft: ItemDraft, option?: OptionDraft) => {
      const row: Item = {
        id: crypto.randomUUID(),
        list_id: listId,
        name: draft.name,
        quantity: draft.quantity ?? null,
        priority: draft.priority ?? null,
        notes: draft.notes ?? null,
        recurrence_days: draft.recurrence_days ?? null,
        position: nextPosition(items),
        done_at: null,
        created_by: userId ?? null,
        source_item_id: null,
        created_at: new Date().toISOString(),
      }
      setError(await sendOrQueue({ op: 'insert', table: 'items', row }))
      if (!option) return
      setError(
        await sendOrQueue({
          op: 'insert',
          table: 'item_options',
          row: {
            id: crypto.randomUUID(),
            item_id: row.id,
            label: option.label,
            url: option.url || null,
            notes: null,
            position: firstPosition(),
            created_at: new Date().toISOString(),
          },
        }),
      )
    },
    [listId, userId, items],
  )

  const updateItem = useCallback(async (id: string, patch: Partial<Item>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
    setError(await sendOrQueue({ op: 'update', table: 'items', id, patch }))
  }, [])

  const toggleItem = useCallback(
    (item: Item) => updateItem(item.id, { done_at: item.done_at ? null : new Date().toISOString() }),
    [updateItem],
  )

  const deleteItem = useCallback(async (id: string) => {
    setError(await sendOrQueue({ op: 'delete', table: 'items', id }))
  }, [])

  const moveItem = useCallback(
    (id: string, before: Item | undefined, after: Item | undefined) =>
      updateItem(id, { position: positionBetween(before, after) }),
    [updateItem],
  )

  return {
    items,
    loading,
    error: error ?? outbox.error,
    online: outbox.online,
    pending: outbox.pending.length,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    moveItem,
  }
}
