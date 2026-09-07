import { supabase } from './supabase'
import type { PendingWrite } from './types'

const KEY = 'outbox'

function stored(): PendingWrite[] {
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as PendingWrite[]) : []
}

let queue = stored()
const listeners = new Set<() => void>()

function commit(next: PendingWrite[]) {
  queue = next
  localStorage.setItem(KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function snapshot() {
  return queue
}

export function enqueue(write: PendingWrite) {
  commit([...queue, write])
}

// An answer that never reached the server waits its turn; anything else is a rejection.
export function isOffline(error: { message: string }) {
  return !navigator.onLine || /fetch|network|load failed/i.test(error.message)
}

async function send(write: PendingWrite) {
  if (write.op === 'insert') {
    return write.table === 'items'
      ? await supabase.from('items').insert(write.row)
      : await supabase.from('item_options').insert(write.row)
  }
  if (write.op === 'update') {
    return await supabase.from(write.table).update(write.patch).eq('id', write.id)
  }
  return await supabase.from(write.table).delete().eq('id', write.id)
}

// Sends the write, or keeps it for later when the device turns out to be offline.
export async function sendOrQueue(write: PendingWrite) {
  if (!navigator.onLine) {
    enqueue(write)
    return null
  }
  const { error } = await send(write)
  if (!error) return null
  if (!isOffline(error)) return error.message
  enqueue(write)
  return null
}

let inFlight: Promise<{ sent: number; rejected: string | null }> | null = null

// Replays in order, stopping at the first write the network still refuses.
// Callers arriving while a replay runs share it, so no write is sent twice.
export function flush() {
  if (!inFlight) inFlight = replay().finally(() => (inFlight = null))
  return inFlight
}

async function replay() {
  let rejected: string | null = null
  let sent = 0
  for (const write of queue) {
    const { error } = await send(write)
    if (error && isOffline(error)) break
    // A write the server rejects would block the queue forever, so it leaves with its error.
    if (error) rejected = error.message
    sent += 1
  }
  if (sent) commit(queue.slice(sent))
  return { sent, rejected }
}

