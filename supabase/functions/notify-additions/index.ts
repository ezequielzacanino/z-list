// Tells the members who opted in about the items somebody else added to their lists.
import { devicesOf, joinNames, must, send, serve, supabase, type Notice } from '../_shared/push.ts'

type NewItem = {
  id: string
  list_id: string
  name: string
  created_by: string
  lists: { name: string }
}

// Additions younger than this wait a round, so a burst arrives as one notice.
const SETTLE_MS = 3 * 60_000

serve(async () => {
  const fresh = must(
    await supabase
      .from('items')
      .select('id, list_id, name, created_by, lists(name)')
      .not('created_by', 'is', null)
      .is('announced_at', null)
      .lt('created_at', new Date(Date.now() - SETTLE_MS).toISOString())
      .returns<NewItem[]>(),
  )
  if (!fresh.length) return Response.json({ notices: 0 })

  const listIds = [...new Set(fresh.map((item) => item.list_id))]
  const listeners = must(
    await supabase
      .from('list_members')
      .select('list_id, user_id')
      .in('list_id', listIds)
      .eq('notify_additions', true),
  )
  const profiles = must(
    await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', [...new Set(fresh.map((item) => item.created_by))]),
  )
  const names = Object.fromEntries(profiles.map((profile) => [profile.id, profile.display_name]))
  const devices = await devicesOf(listeners.map((listener) => listener.user_id))

  let notices = 0
  for (const listId of listIds) {
    const inList = fresh.filter((item) => item.list_id === listId)
    const readers = new Set(
      listeners.filter((listener) => listener.list_id === listId).map((listener) => listener.user_id),
    )
    for (const author of new Set(inList.map((item) => item.created_by))) {
      const items = inList.filter((item) => item.created_by === author)
      const notice: Notice = {
        title: items[0].lists.name,
        body: `${names[author] ?? 'Alguien'} agregó ${joinNames(items.map((item) => item.name))}`,
        url: `/lista/${listId}`,
      }
      const targets = devices.filter(
        (device) => readers.has(device.user_id) && device.user_id !== author,
      )
      await Promise.all(targets.map((device) => send(device, notice)))
      notices += targets.length
    }
  }

  must(
    await supabase
      .from('items')
      .update({ announced_at: new Date().toISOString() })
      .in('id', fresh.map((item) => item.id)),
  )
  return Response.json({ notices })
})
