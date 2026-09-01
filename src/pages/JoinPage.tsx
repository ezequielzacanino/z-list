import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Joining is by invitation link: holding the list id grants membership.
export function JoinPage({ userId }: { userId: string }) {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('list_members')
      .upsert({ list_id: listId, user_id: userId })
      .then(({ error }) => (error ? setError(error.message) : navigate(`/lista/${listId}`)))
  }, [listId, userId, navigate])

  return <p className={error ? 'error' : 'notice'}>{error ?? 'Entrando a la lista…'}</p>
}
