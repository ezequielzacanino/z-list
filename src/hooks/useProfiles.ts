import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

// Display names by user id, to attribute items to whoever added them.
export function useProfiles() {
  const [names, setNames] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .then(({ data, error }) =>
        error
          ? setError(error.message)
          : setNames(
              Object.fromEntries(
                (data as Profile[]).map((profile) => [profile.id, profile.display_name]),
              ),
            ),
      )
  }, [])

  return { names, error }
}
