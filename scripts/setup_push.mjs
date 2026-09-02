// Loads into the vault the URL and the anon key the cron job uses to call notify-due.
import { connect, readEnvFile } from './db.mjs'

const env = readEnvFile('.env')
const secrets = {
  project_url: env.VITE_SUPABASE_URL,
  anon_key: env.VITE_SUPABASE_ANON_KEY,
}
const missing = Object.entries(secrets).filter(([, value]) => !value)

if (missing.length) {
  console.error(`Faltan en .env: ${missing.map(([name]) => name).join(', ')}`)
  process.exit(1)
}

const client = await connect()

for (const [name, value] of Object.entries(secrets)) {
  const { rows } = await client.query('select id from vault.secrets where name = $1', [name])
  if (rows.length) await client.query('select vault.update_secret($1, $2)', [rows[0].id, value])
  else await client.query('select vault.create_secret($1, $2)', [value, name])
  console.log(`${name} guardado.`)
}

await client.end()
