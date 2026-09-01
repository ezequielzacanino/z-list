import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ItemOption } from '../lib/types'

export function useItemOptions(itemId: string) {
  const [options, setOptions] = useState<ItemOption[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('item_options')
      .select('*')
      .eq('item_id', itemId)
      .order('position')
    if (error) setError(error.message)
    else setOptions(data as ItemOption[])
  }, [itemId])

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
      const position = options.length ? Math.max(...options.map((o) => o.position)) + 1024 : 1024
      const { error } = await supabase
        .from('item_options')
        .insert({ item_id: itemId, label, url: url || null, position })
      if (error) setError(error.message)
    },
    [itemId, options],
  )

  const deleteOption = useCallback(async (id: string) => {
    const { error } = await supabase.from('item_options').delete().eq('id', id)
    if (error) setError(error.message)
  }, [])

  return { options, error, addOption, deleteOption }
}
