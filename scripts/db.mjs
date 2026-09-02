// Connection to the linked project's database, shared by the scripts.
import { readFileSync } from 'node:fs'
import pg from 'pg'

// Reads the file as plain text, so shell characters in a value stay literal.
export function readEnvFile(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim().replace(/^"|"$/g, '')]),
  )
}

export async function connect() {
  const password = readEnvFile('.env.local').SUPABASE_DB_PASSWORD
  if (!password) {
    console.error('Falta SUPABASE_DB_PASSWORD en .env.local')
    process.exit(1)
  }
  const url = new URL(readFileSync('supabase/.temp/pooler-url', 'utf8').trim())
  url.password = encodeURIComponent(password)
  const client = new pg.Client({ connectionString: url.href })
  await client.connect()
  return client
}
