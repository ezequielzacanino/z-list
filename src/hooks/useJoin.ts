import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'
import { inviteToList } from '../lib/invites'

// Redeeming an invitation token, with or without an account behind it.
export function useJoin(token: string) {
  const [error, setError] = useState<string | null>(null)

  const join = useCallback(async () => {
    const { data, error } = await supabase.rpc('join_with_invite', { invite_token: token })
    if (error) {
      setError(error.message)
      return null
    }
    return data as string
  }, [token])

  const requestAccount = useCallback(
    async (email: string) => {
      try {
        return await inviteToList(token, email)
      } catch (error) {
        setError((error as Error).message)
        return null
      }
    },
    [token],
  )

  return { error, join, requestAccount }
}
