import { useState } from 'react'
import type { ListInvite } from '../lib/types'

// Who is on the list, plus the two ways of adding somebody: by email or by WhatsApp.
export function SharePanel({
  memberIds,
  names,
  currentUserId,
  invites,
  notice,
  onInvite,
  onShareOnWhatsApp,
  onRevoke,
  onRemove,
}: {
  memberIds: string[]
  names: Record<string, string>
  currentUserId: string
  invites: ListInvite[]
  notice: string | null
  onInvite: (email: string) => Promise<boolean>
  onShareOnWhatsApp: () => void
  onRevoke: (token: string) => void
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
      <button className="ghost" onClick={onShareOnWhatsApp}>
        Compartir por WhatsApp
      </button>
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
        {invites.map((invite) => (
          <li key={invite.token}>
            <span className="row muted">
              Link abierto, vence el {new Date(invite.expires_at).toLocaleDateString()}
            </span>
            <button
              className="ghost"
              onClick={() => onRevoke(invite.token)}
              aria-label="Anular el link"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
