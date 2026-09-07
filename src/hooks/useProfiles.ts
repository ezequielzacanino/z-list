import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/types'

// Display names by user id, refreshed whenever the membership changes.
export function useProfiles(memberIds: string[]) {
  const [names, setNames] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const members = memberIds.join(',')

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
  }, [members])

  return { names, error }
}
