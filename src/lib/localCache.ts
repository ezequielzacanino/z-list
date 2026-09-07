// Last rows seen for a key, so a device without network still opens what it had.
export function readCache<T>(key: string): T[] | null {
  const raw = localStorage.getItem(`cache:${key}`)
  return raw ? (JSON.parse(raw) as T[]) : null
}

export function writeCache<T>(key: string, rows: T[]) {
  localStorage.setItem(`cache:${key}`, JSON.stringify(rows))
}
