import { useCallback, useEffect, useState } from 'react'
import { isOffline } from '../lib/outbox'
import { supabase } from '../lib/supabase'

// Whether this member hears by push about what others add to the list.
export function useAdditionNotices(listId: string, userId: string) {
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('list_members')
      .select('notify_additions')
      .eq('list_id', listId)
      .eq('user_id', userId)
      .single()
      .then(({ data, error }) => {
        if (!error) setEnabled((data as { notify_additions: boolean }).notify_additions)
        else if (!isOffline(error)) setError(error.message)
      })
  }, [listId, userId])

  const toggle = useCallback(async () => {
    const next = !enabled
    setEnabled(next)
    const { error } = await supabase
      .from('list_members')
      .update({ notify_additions: next })
      .eq('list_id', listId)
      .eq('user_id', userId)
    if (error) {
      setEnabled(!next)
      setError(error.message)
    }
  }, [enabled, listId, userId])

  return { enabled, error, toggle }
}
