import { useState } from 'react'

// The people on the list, and the email field that adds one more.
export function SharePanel({
  memberIds,
  names,
  currentUserId,
  notice,
  onInvite,
  onRemove,
}: {
  memberIds: string[]
  names: Record<string, string>
  currentUserId: string
  notice: string | null
  onInvite: (email: string) => Promise<boolean>
  onRemove: (userId: string) => void
}) {
  const [email, setEmail] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (await onInvite(email)) setEmail('')
  }

  return (
    <div className="share stack">
      <form className="row" onSubmit={submit}>
        <input
          required
          type="email"
          placeholder="Invitar por email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">Invitar</button>
      </form>
      {notice && <p className="notice">{notice}</p>}
      <ul className="options">
        {memberIds.map((id) => (
          <li key={id}>
            <span className="row">
              {names[id] ?? 'Sin nombre'}
              {id === currentUserId && <span className="tag">vos</span>}
            </span>
            <button className="ghost" onClick={() => onRemove(id)} aria-label="Sacar de la lista">
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
