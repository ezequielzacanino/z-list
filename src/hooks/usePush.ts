import { useCallback, useEffect, useState } from 'react'
import { applicationServerKey } from '../lib/push'
import { supabase } from '../lib/supabase'

// Notices on this device, one subscription per browser and per install.
export function usePush(userId: string) {
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The service worker that receives the notices runs only in the built app.
  const supported = import.meta.env.PROD && 'serviceWorker' in navigator && 'PushManager' in window

  useEffect(() => {
    if (!supported) return
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setEnabled(Boolean(subscription)))
  }, [supported])

  const enable = useCallback(async () => {
    setError(null)
    if ((await Notification.requestPermission()) !== 'granted') {
      setError('El navegador bloqueó los avisos.')
      return
    }
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey(import.meta.env.VITE_VAPID_PUBLIC_KEY),
    })
    const { endpoint, keys } = subscription.toJSON() as {
      endpoint: string
      keys: { p256dh: string; auth: string }
    }
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({ endpoint, user_id: userId, p256dh: keys.p256dh, auth: keys.auth })
    if (error) setError(error.message)
    else setEnabled(true)
  }, [userId])

  const disable = useCallback(async () => {
    setError(null)
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return
    await subscription.unsubscribe()
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', subscription.endpoint)
    if (error) setError(error.message)
    else setEnabled(false)
  }, [])

  return { supported, enabled, error, enable, disable }
}
