// Runs a SQL statement against the linked project: node scripts/query.mjs "select 1".
import { connect } from './db.mjs'

const sql = process.argv[2]

if (!sql) {
  console.error('Uso: node scripts/query.mjs "<sql>"')
  process.exit(1)
}

const client = await connect()
const { rows } = await client.query(sql)
await client.end()
console.log(JSON.stringify(rows, null, 2))
