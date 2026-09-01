import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { nextPosition, positionBetween } from '../lib/ordering'
import { copyOf, dueOccurrences } from '../lib/recurrence'
import type { Item, ItemDraft } from '../lib/types'

export function useItems(listId: string, userId: string | undefined) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', listId)
      .order('position')
    if (error) setError(error.message)
    else setItems(data as Item[])
    setLoading(false)
  }, [listId])

  // Materializes recurrence copies that came due while the list was closed.
  const materializeDue = useCallback(
    async (current: Item[]) => {
      const due = dueOccurrences(current, new Date())
      if (!due.length) return
      let position = nextPosition(current)
      const rows = due.map((item) => ({
        ...copyOf(item),
        list_id: listId,
        source_item_id: item.id,
        created_by: null,
        position: (position += 1024),
      }))
      const { error } = await supabase
        .from('items')
        .upsert(rows, { onConflict: 'source_item_id', ignoreDuplicates: true })
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

  const addItem = useCallback(
    async (draft: ItemDraft) => {
      const { error } = await supabase
        .from('items')
        .insert({ ...draft, list_id: listId, created_by: userId, position: nextPosition(items) })
      if (error) setError(error.message)
    },
    [listId, userId, items],
  )

  const updateItem = useCallback(async (id: string, patch: Partial<Item>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
    const { error } = await supabase.from('items').update(patch).eq('id', id)
    if (error) setError(error.message)
  }, [])

  const toggleItem = useCallback(
    (item: Item) => updateItem(item.id, { done_at: item.done_at ? null : new Date().toISOString() }),
    [updateItem],
  )

  const deleteItem = useCallback(async (id: string) => {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  const moveItem = useCallback(
    (id: string, before: Item | undefined, after: Item | undefined) =>
      updateItem(id, { position: positionBetween(before, after) }),
    [updateItem],
  )

  return { items, loading, error, addItem, updateItem, toggleItem, deleteItem, moveItem }
}
