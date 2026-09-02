// Runs a SQL statement against the linked project: node scripts/query.mjs "select 1".
import { readFileSync } from 'node:fs'
import pg from 'pg'

// Reads the file as plain text, so shell characters in a value stay literal.
function readEnvFile(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim().replace(/^"|"$/g, '')]),
  )
}

const sql = process.argv[2]
const password = readEnvFile('.env.local').SUPABASE_DB_PASSWORD

if (!sql || !password) {
  console.error('Uso: node scripts/query.mjs "<sql>", con SUPABASE_DB_PASSWORD en .env.local')
  process.exit(1)
}

const url = new URL(readFileSync('supabase/.temp/pooler-url', 'utf8').trim())
url.password = encodeURIComponent(password)

const client = new pg.Client({ connectionString: url.href })
await client.connect()
const { rows } = await client.query(sql)
await client.end()
console.log(JSON.stringify(rows, null, 2))
