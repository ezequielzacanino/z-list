import { supabase } from './supabase'

// The address that redeems an invitation token.
export function inviteUrl(token: string) {
  return `${location.origin}/unirse/${token}`
}

// Puts an email on the token's list, creating the account and mailing it when it is new.
export async function inviteToList(token: string, email: string) {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { token, email, redirect_to: location.origin },
  })
  if (error) throw new Error(error.message)
  if (data.error) throw new Error(data.error)
  return data.created as boolean
}
