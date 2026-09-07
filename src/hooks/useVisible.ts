import { useEffect } from 'react'

// Runs the callback each time the tab comes back to the foreground.
// A backgrounded phone drops the realtime socket, so a fresh read catches up.
export function useVisible(onVisible: () => void) {
  useEffect(() => {
    const handle = () => document.visibilityState === 'visible' && onVisible()
    document.addEventListener('visibilitychange', handle)
    return () => document.removeEventListener('visibilitychange', handle)
  }, [onVisible])
}
