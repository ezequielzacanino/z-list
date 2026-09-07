import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { readCache, writeCache } from '../lib/localCache'
import { isOffline, snapshot, subscribe } from '../lib/outbox'
import { applyPending } from '../lib/pending'
import { supabase } from '../lib/supabase'
import type { ItemOption } from '../lib/types'
import { useVisible } from './useVisible'

// Options of every item on the open list, grouped by item, for the rows to show inline.
export function useListOptions(listId: string, itemIds: string[]) {
  const [rows, setRows] = useState<ItemOption[]>([])
  const [error, setError] = useState<string | null>(null)
  const pending = useSyncExternalStore(subscribe, snapshot)
  const ids = itemIds.join(',')

  const load = useCallback(async () => {
    if (!ids) return
    const { data, error } = await supabase
      .from('item_options')
      .select('*')
      .in('item_id', ids.split(','))
      .order('position')
    if (!error) {
      setRows(data as ItemOption[])
      writeCache(`list_options:${listId}`, data as ItemOption[])
    } else if (isOffline(error)) {
      setRows(readCache<ItemOption>(`list_options:${listId}`) ?? [])
    } else {
      setError(error.message)
    }
  }, [listId, ids])

  useVisible(load)

  useEffect(() => {
    load()
    if (!ids) return
    const channel = supabase
      .channel(`list_options:${listId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'item_options', filter: `item_id=in.(${ids})` },
        load,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [listId, ids, load])

  const byItem = useMemo(() => {
    const owned = new Set(ids.split(','))
    const options = applyPending(rows, pending, 'item_options', (row) => owned.has(row.item_id))
    const grouped: Record<string, ItemOption[]> = {}
    for (const option of options) (grouped[option.item_id] ??= []).push(option)
    return grouped
  }, [rows, pending, ids])

  return { byItem, error }
}
