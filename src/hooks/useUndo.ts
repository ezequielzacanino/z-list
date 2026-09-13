import { useCallback, useEffect, useRef, useState } from 'react'

const DELAY_MS = 5000

export type UndoOffer = { label: string; revert: () => void; commit?: () => void }

// One undoable action at a time: a new one, the timeout or leaving the page commits it.
export function useUndo() {
  const [offer, setOffer] = useState<UndoOffer | null>(null)
  const current = useRef<UndoOffer | null>(null)
  const timer = useRef(0)

  const settle = useCallback(() => {
    window.clearTimeout(timer.current)
    current.current?.commit?.()
    current.current = null
    setOffer(null)
  }, [])

  const propose = useCallback(
    (next: UndoOffer) => {
      settle()
      current.current = next
      setOffer(next)
      timer.current = window.setTimeout(settle, DELAY_MS)
    },
    [settle],
  )

  const undo = useCallback(() => {
    window.clearTimeout(timer.current)
    current.current?.revert()
    current.current = null
    setOffer(null)
  }, [])

  useEffect(() => settle, [settle])

  return { offer, propose, undo }
}
