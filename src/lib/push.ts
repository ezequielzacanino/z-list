// The VAPID key travels as base64url and the push manager wants its raw bytes.
export function applicationServerKey(key: string): Uint8Array<ArrayBuffer> {
  const binary = atob(key.replace(/-/g, '+').replace(/_/g, '/'))
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}
