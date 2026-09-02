// Sends one notice per list for the generated copies nobody was told about yet.
import { createClient } from 'npm:@supabase/supabase-js@2.58.0'
import webpush from 'npm:web-push@3.6.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
)

type PendingItem = { id: string; list_id: string; name: string; lists: { name: string } }
type Device = { endpoint: string; p256dh: string; auth: string; user_id: string }

// Names of the items due in one list, as a single line.
function body(names: string[]) {
  return names.length > 3 ? `${names.slice(0, 3).join(', ')} y ${names.length - 3} más` : names.join(', ')
}

async function send(device: Device, payload: string) {
  const subscription = {
    endpoint: device.endpoint,
    keys: { p256dh: device.p256dh, auth: device.auth },
  }
  try {
    await webpush.sendNotification(subscription, payload)
  } catch (error) {
    // A gone endpoint is a device that uninstalled the app or revoked the permission.
    const status = (error as { statusCode?: number }).statusCode
    if (status === 404 || status === 410) {
      await supabase.from('push_subscriptions').delete().eq('endpoint', device.endpoint)
    } else {
      console.error(device.endpoint, error)
    }
  }
}

Deno.serve(async () => {
  const { data: pending, error } = await supabase
    .from('items')
    .select('id, list_id, name, lists(name)')
    .is('created_by', null)
    .is('done_at', null)
    .is('notified_at', null)
    .returns<PendingItem[]>()
  if (error) return new Response(error.message, { status: 500 })
  if (!pending.length) return Response.json({ notices: 0 })

  const listIds = [...new Set(pending.map((item) => item.list_id))]

  const { data: members, error: membersError } = await supabase
    .from('list_members')
    .select('list_id, user_id')
    .in('list_id', listIds)
  if (membersError) return new Response(membersError.message, { status: 500 })

  const { data: devices, error: devicesError } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, user_id')
    .in('user_id', members.map((member) => member.user_id))
    .returns<Device[]>()
  if (devicesError) return new Response(devicesError.message, { status: 500 })

  let notices = 0
  for (const listId of listIds) {
    const items = pending.filter((item) => item.list_id === listId)
    const payload = JSON.stringify({
      title: items[0].lists.name,
      body: body(items.map((item) => item.name)),
      url: `/lista/${listId}`,
    })
    const readers = new Set(
      members.filter((member) => member.list_id === listId).map((member) => member.user_id),
    )
    const targets = devices.filter((device) => readers.has(device.user_id))
    await Promise.all(targets.map((device) => send(device, payload)))
    notices += targets.length
  }

  const { error: stampError } = await supabase
    .from('items')
    .update({ notified_at: new Date().toISOString() })
    .in('id', pending.map((item) => item.id))
  if (stampError) return new Response(stampError.message, { status: 500 })

  return Response.json({ notices })
})
