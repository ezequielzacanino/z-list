import { useCallback, useEffect, useState } from 'react'
import { readCache, writeCache } from '../lib/localCache'
import { isOffline } from '../lib/outbox'
import { supabase } from '../lib/supabase'
import { presets } from '../lib/presets'
import type { ListWithCount } from '../lib/types'
import { useVisible } from './useVisible'

export function useLists(userId: string | undefined) {
  const [lists, setLists] = useState<ListWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Each list comes with the count of its open items.
  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('lists')
      .select('*, items(count)')
      .is('items.done_at', null)
      .order('created_at')
    if (!error) {
      setLists(data as ListWithCount[])
      writeCache('lists', data as ListWithCount[])
    } else if (isOffline(error)) {
      setLists(readCache<ListWithCount>('lists') ?? [])
    } else {
      setError(error.message)
    }
    setLoading(false)
  }, [])

  useVisible(load)

  useEffect(() => {
    if (!userId) return
    load()
    const channel = supabase
      .channel('lists')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lists' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'list_members' }, load)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, load])

  const createList = useCallback(
    async (name: string, preset: string) => {
      const { error } = await supabase
        .from('lists')
        .insert({ name, preset, quick_add_fields: presets[preset].fields, created_by: userId })
      if (error) setError(error.message)
    },
    [userId],
  )

  return { lists, loading, error, createList }
}
