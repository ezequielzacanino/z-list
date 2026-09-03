// Adds an email to the list a live invitation token opens, creating the account if needed.
import { createClient } from 'npm:@supabase/supabase-js@2.58.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function reply(body: Record<string, unknown>, status = 200) {
  return Response.json(body, { status, headers: cors })
}

// The token is the only credential: it names the list and proves someone granted access.
async function addToList(token: string, email: string) {
  const { data, error } = await supabase.rpc('add_member_by_invite', {
    invite_token: token,
    target_email: email,
  })
  if (error) throw new Error(error.message)
  return data as boolean
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: cors })

  const { token, email, redirect_to } = await request.json()
  if (!token || !email) return reply({ error: 'Falta el token o el email.' }, 400)

  try {
    if (await addToList(token, email)) return reply({ created: false })

    const { error } = await supabase.auth.admin.createUser({ email, email_confirm: true })
    if (error) return reply({ error: error.message }, 400)

    await addToList(token, email)

    // The mail to set the first password is the same one the app sends to recover it.
    const { error: mailError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirect_to,
    })
    if (mailError) return reply({ error: mailError.message }, 400)

    return reply({ created: true })
  } catch (error) {
    return reply({ error: (error as Error).message }, 400)
  }
})
