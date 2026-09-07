import { useCallback, useEffect, useMemo, useState } from 'react'
import { readCache, writeCache } from '../lib/localCache'
import { STEP } from '../lib/ordering'
import { isOffline, sendOrQueue } from '../lib/outbox'
import { applyPending } from '../lib/pending'
import { supabase } from '../lib/supabase'
import type { ItemOption } from '../lib/types'
import { useOutbox } from './useOutbox'

export function useItemOptions(itemId: string) {
  const [rows, setRows] = useState<ItemOption[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('item_options')
      .select('*')
      .eq('item_id', itemId)
      .order('position')
    if (!error) {
      setRows(data as ItemOption[])
      writeCache(`item_options:${itemId}`, data as ItemOption[])
    } else if (isOffline(error)) {
      setRows(readCache<ItemOption>(`item_options:${itemId}`) ?? [])
    } else {
      setError(error.message)
    }
  }, [itemId])

  const outbox = useOutbox(load)
  const options = useMemo(
    () => applyPending(rows, outbox.pending, 'item_options', (row) => row.item_id === itemId),
    [rows, outbox.pending, itemId],
  )

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`item_options:${itemId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'item_options', filter: `item_id=eq.${itemId}` },
        load,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [itemId, load])

  const addOption = useCallback(
    async (label: string, url: string) => {
      const position = options.length
        ? Math.max(...options.map((option) => option.position)) + STEP
        : STEP
      setError(
        await sendOrQueue({
          op: 'insert',
          table: 'item_options',
          row: {
            id: crypto.randomUUID(),
            item_id: itemId,
            label,
            url: url || null,
            notes: null,
            position,
            created_at: new Date().toISOString(),
          },
        }),
      )
    },
    [itemId, options],
  )

  const deleteOption = useCallback(async (id: string) => {
    setError(await sendOrQueue({ op: 'delete', table: 'item_options', id }))
  }, [])

  return { options, error: error ?? outbox.error, addOption, deleteOption }
}
