import { useState } from 'react'
import { readMuted, storeMuted } from '../lib/feedback'

export function useMuted() {
  const [muted, setMuted] = useState(readMuted)

  function toggleMuted() {
    storeMuted(!muted)
    setMuted(!muted)
  }

  return { muted, toggleMuted }
}
