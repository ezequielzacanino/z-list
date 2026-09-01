import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { List } from '../lib/types'

// The open list and the settings its members share.
export function useList(listId: string) {
  const [list, setList] = useState<List | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('lists').select('*').eq('id', listId).single()
    if (error) setError(error.message)
    else setList(data as List)
  }, [listId])

  useEffect(() => {
    load()
    const channel = supabase
      .channel(`list:${listId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lists', filter: `id=eq.${listId}` },
        load,
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [listId, load])

  const updateList = useCallback(
    async (patch: Partial<List>) => {
      setList((current) => (current ? { ...current, ...patch } : current))
      const { error } = await supabase.from('lists').update(patch).eq('id', listId)
      if (error) setError(error.message)
    },
    [listId],
  )

  return { list, error, updateList }
}
