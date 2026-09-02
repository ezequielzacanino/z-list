// Applies the pending migrations in supabase/migrations to the linked project.
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { readEnvFile } from './db.mjs'

const REQUIRED = ['SUPABASE_ACCESS_TOKEN', 'SUPABASE_DB_PASSWORD']

const env = { ...process.env, ...readEnvFile('.env.local') }
const missing = REQUIRED.filter((key) => !env[key])

if (missing.length) {
  console.error(`Faltan en .env.local: ${missing.join(', ')}`)
  process.exit(1)
}

// Absolute and quoted: on Windows the binary is a .cmd wrapper the shell must resolve.
const binary = resolve('node_modules/.bin', process.platform === 'win32' ? 'supabase.cmd' : 'supabase')
execSync(`"${binary}" db push`, { stdio: 'inherit', env })
