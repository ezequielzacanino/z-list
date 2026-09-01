import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Members of the open list, in the order they joined.
export function useMembers(listId: string) {
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('list_members')
      .select('user_id')
      .eq('list_id', listId)
      .order('created_at')
    if (error) setError(error.message)
    else setMemberIds((data as { user_id: string }[]).map((row) => row.user_id))
  }, [listId])

  useEffect(() => {
    load()
  }, [load])

  const removeMember = useCallback(
    async (userId: string) => {
      const { error } = await supabase
        .from('list_members')
        .delete()
        .eq('list_id', listId)
        .eq('user_id', userId)
      if (error) setError(error.message)
      else await load()
    },
    [listId, load],
  )

  return { memberIds, error, removeMember }
}
