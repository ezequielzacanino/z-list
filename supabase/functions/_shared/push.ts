// Service client and web push sending shared by the notifiers.
import { createClient } from 'npm:@supabase/supabase-js@2.58.0'
import webpush from 'npm:web-push@3.6.7'

export const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
)

export type Device = { endpoint: string; p256dh: string; auth: string; user_id: string }
export type Notice = { title: string; body: string; url: string }

// Returns the data of a query, throwing its error so the handler answers 500.
export function must<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(error.message)
  return data as T
}

// Names of several items as a single line.
export function joinNames(names: string[]) {
  return names.length > 3
    ? `${names.slice(0, 3).join(', ')} y ${names.length - 3} más`
    : names.join(', ')
}

export async function devicesOf(userIds: string[]) {
  return must(
    await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth, user_id')
      .in('user_id', [...new Set(userIds)])
      .returns<Device[]>(),
  )
}

export async function send(device: Device, notice: Notice) {
  const subscription = {
    endpoint: device.endpoint,
    keys: { p256dh: device.p256dh, auth: device.auth },
  }
  try {
    await webpush.sendNotification(subscription, JSON.stringify(notice))
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

// Answers 500 with the message of whatever the handler threw.
export function serve(handler: () => Promise<Response>) {
  Deno.serve(async () => {
    try {
      return await handler()
    } catch (error) {
      return new Response((error as Error).message, { status: 500 })
    }
  })
}
