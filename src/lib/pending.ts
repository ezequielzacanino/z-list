import type { PendingWrite } from './types'

// Rows as this device sees them: the server's, plus the writes still waiting here.
export function applyPending<T extends { id: string }>(
  rows: T[],
  writes: PendingWrite[],
  table: PendingWrite['table'],
  owns: (row: T) => boolean,
): T[] {
  let result = rows
  for (const write of writes) {
    if (write.table !== table) continue
    if (write.op === 'insert') {
      const row = write.row as unknown as T
      if (owns(row) && !result.some((current) => current.id === row.id)) result = [...result, row]
    } else if (write.op === 'update') {
      result = result.map((row) => (row.id === write.id ? { ...row, ...write.patch } : row))
    } else {
      result = result.filter((row) => row.id !== write.id)
    }
  }
  return result
}
