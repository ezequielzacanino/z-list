// Deploys the edge functions in supabase/functions to the linked project.
import { execSync } from 'node:child_process'
import { resolve } from 'node:path'
import { readEnvFile } from './db.mjs'

const env = { ...process.env, ...readEnvFile('.env.local') }

if (!env.SUPABASE_ACCESS_TOKEN) {
  console.error('Falta SUPABASE_ACCESS_TOKEN en .env.local')
  process.exit(1)
}

// Absolute and quoted: on Windows the binary is a .cmd wrapper the shell must resolve.
const binary = resolve('node_modules/.bin', process.platform === 'win32' ? 'supabase.cmd' : 'supabase')
execSync(`"${binary}" functions deploy`, { stdio: 'inherit', env })
