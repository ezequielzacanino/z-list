import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { flush, snapshot, subscribe } from '../lib/outbox'

// The writes waiting on this device, replayed whenever the network comes back.
export function useOutbox(reload: () => Promise<void>) {
  const pending = useSyncExternalStore(subscribe, snapshot)
  const [online, setOnline] = useState(navigator.onLine)
  const [error, setError] = useState<string | null>(null)

  const drain = useCallback(async () => {
    if (!navigator.onLine || !snapshot().length) return
    const { sent, rejected } = await flush()
    if (rejected) setError(rejected)
    if (sent) await reload()
  }, [reload])

  // Mobile browsers report the network late, so a visible tab is another chance to try.
  useEffect(() => {
    const goOnline = () => {
      setOnline(true)
      drain()
    }
    const goOffline = () => setOnline(false)
    const onVisible = () => document.visibilityState === 'visible' && drain()

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    document.addEventListener('visibilitychange', onVisible)
    drain()
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [drain])

  return { pending, online, error }
}
