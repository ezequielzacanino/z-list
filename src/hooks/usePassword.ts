import { useCallback, useState } from 'react'
import { supabase } from '../lib/supabase'

// Sets the password of the account in session.
export function usePassword() {
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const updatePassword = useCallback(async (password: string) => {
    setError(null)
    setSaved(false)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setSaved(true)
  }, [])

  return { error, saved, updatePassword }
}
