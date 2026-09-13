// Tells the members of each list about generated copies and deadlines coming up.
import { devicesOf, joinNames, must, send, serve, supabase, type Notice } from '../_shared/push.ts'

type PendingItem = { id: string; list_id: string; name: string; lists: { name: string } }

const TIME_ZONE = 'America/Argentina/Buenos_Aires'
const REMINDER_HOUR = 9

// Calendar date in the app's time zone, a number of days from now.
function localDate(daysAhead: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(
    new Date(Date.now() + daysAhead * 86_400_000),
  )
}

function localHour() {
  return Number(
    new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', hourCycle: 'h23' }).format(
      new Date(),
    ),
  )
}

// Sends one notice per list to every member device, and stamps the items as told.
async function notify(pending: PendingItem[], prefix: string, stamp: 'notified_at' | 'reminded_at') {
  if (!pending.length) return 0
  const listIds = [...new Set(pending.map((item) => item.list_id))]
  const members = must(
    await supabase.from('list_members').select('list_id, user_id').in('list_id', listIds),
  )
  const devices = await devicesOf(members.map((member) => member.user_id))

  let notices = 0
  for (const listId of listIds) {
    const items = pending.filter((item) => item.list_id === listId)
    const notice: Notice = {
      title: items[0].lists.name,
      body: prefix + joinNames(items.map((item) => item.name)),
      url: `/lista/${listId}`,
    }
    const readers = new Set(
      members.filter((member) => member.list_id === listId).map((member) => member.user_id),
    )
    const targets = devices.filter((device) => readers.has(device.user_id))
    await Promise.all(targets.map((device) => send(device, notice)))
    notices += targets.length
  }

  must(
    await supabase
      .from('items')
      .update({ [stamp]: new Date().toISOString() })
      .in('id', pending.map((item) => item.id)),
  )
  return notices
}

serve(async () => {
  const copies = must(
    await supabase
      .from('items')
      .select('id, list_id, name, lists(name)')
      .is('created_by', null)
      .is('done_at', null)
      .is('notified_at', null)
      .returns<PendingItem[]>(),
  )

  // Deadlines of today and tomorrow, reminded once from the morning on.
  const deadlines =
    localHour() < REMINDER_HOUR
      ? []
      : must(
          await supabase
            .from('items')
            .select('id, list_id, name, lists(name)')
            .gte('due_on', localDate(0))
            .lte('due_on', localDate(1))
            .is('done_at', null)
            .is('reminded_at', null)
            .returns<PendingItem[]>(),
        )

  const notices =
    (await notify(copies, '', 'notified_at')) + (await notify(deadlines, 'Por vencer: ', 'reminded_at'))
  return Response.json({ notices })
})
