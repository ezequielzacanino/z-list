import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { inviteToList } from '../lib/invites'
import type { ListInvite } from '../lib/types'

// Live invitation tokens of the open list, and the ways to hand one out.
export function useInvites(listId: string, userId: string) {
  const [invites, setInvites] = useState<ListInvite[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('list_invites')
      .select('*')
      .eq('list_id', listId)
      .is('revoked_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at')
    if (error) setError(error.message)
    else setInvites(data as ListInvite[])
  }, [listId])

  useEffect(() => {
    load()
  }, [load])

  const createInvite = useCallback(async () => {
    const { data, error } = await supabase
      .from('list_invites')
      .insert({ list_id: listId, created_by: userId })
      .select()
      .single()
    if (error) {
      setError(error.message)
      return null
    }
    await load()
    return (data as ListInvite).token
  }, [listId, userId, load])

  // Mails an invitation to an email that has no account yet.
  const inviteByEmail = useCallback(
    async (email: string) => {
      const token = await createInvite()
      if (!token) return false
      try {
        await inviteToList(token, email)
        return true
      } catch (error) {
        setError((error as Error).message)
        return false
      }
    },
    [createInvite],
  )

  const revokeInvite = useCallback(
    async (token: string) => {
      const { error } = await supabase
        .from('list_invites')
        .update({ revoked_at: new Date().toISOString() })
        .eq('token', token)
      if (error) setError(error.message)
      else await load()
    },
    [load],
  )

  return { invites, error, createInvite, inviteByEmail, revokeInvite }
}
