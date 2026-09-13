import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Other members who have the list open right now.
export function usePresence(listId: string, userId: string) {
  const [present, setPresent] = useState<string[]>([])

  useEffect(() => {
    const channel = supabase.channel(`presence:${listId}`, {
      config: { presence: { key: userId } },
    })
    channel
      .on('presence', { event: 'sync' }, () =>
        setPresent(Object.keys(channel.presenceState()).filter((id) => id !== userId)),
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') channel.track({ online_at: new Date().toISOString() })
      })
    return () => {
      supabase.removeChannel(channel)
    }
  }, [listId, userId])

  return present
}
