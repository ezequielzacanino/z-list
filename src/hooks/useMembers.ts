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

  // Adds the account holding that email; false when no account has it.
  const addMemberByEmail = useCallback(
    async (email: string) => {
      const { data, error } = await supabase.rpc('add_member_by_email', {
        target_list_id: listId,
        target_email: email,
      })
      if (error) {
        setError(error.message)
        return false
      }
      await load()
      return data as boolean
    },
    [listId, load],
  )

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

  return { memberIds, error, addMemberByEmail, removeMember }
}
