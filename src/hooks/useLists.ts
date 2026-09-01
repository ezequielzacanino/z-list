import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { presets } from '../lib/presets'
import type { List } from '../lib/types'

export function useLists(userId: string | undefined) {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('lists').select('*').order('created_at')
    if (error) setError(error.message)
    else setLists(data as List[])
    setLoading(false)
  }, [])

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
