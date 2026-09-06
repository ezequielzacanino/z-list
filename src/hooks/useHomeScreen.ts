import { useCallback, useEffect, useState } from 'react'
import { listManifestUrl } from '../lib/homescreen'

type InstallPrompt = Event & { prompt: () => Promise<void> }

// Aims the page manifest at the open list, so its icon opens that list alone.
export function useHomeScreen(listId: string, name: string) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null)

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
    if (!link) return
    const url = listManifestUrl(listId, name)
    link.href = url
    return () => {
      link.href = '/manifest.webmanifest'
      URL.revokeObjectURL(url)
      setPrompt(null)
    }
  }, [listId, name])

  // The browser offers the prompt once it reads the manifest, not on demand.
  useEffect(() => {
    const capture = (event: Event) => {
      event.preventDefault()
      setPrompt(event as InstallPrompt)
    }
    const clear = () => setPrompt(null)
    window.addEventListener('beforeinstallprompt', capture)
    window.addEventListener('appinstalled', clear)
    return () => {
      window.removeEventListener('beforeinstallprompt', capture)
      window.removeEventListener('appinstalled', clear)
    }
  }, [])

  const install = useCallback(async () => {
    await prompt?.prompt()
    setPrompt(null)
  }, [prompt])

  return { canInstall: Boolean(prompt), install }
}
