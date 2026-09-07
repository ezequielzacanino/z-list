import { useState } from 'react'
import type { ListInvite } from '../lib/types'

// Who is on the list, the two ways of adding somebody, and the list as plain text.
export function SharePanel({
  memberIds,
  names,
  currentUserId,
  ownerId,
  invites,
  notice,
  onInvite,
  onShareOnWhatsApp,
  onShareAsText,
  onRevoke,
  onRemove,
}: {
  memberIds: string[]
  names: Record<string, string>
  currentUserId: string
  ownerId: string
  invites: ListInvite[]
  notice: string | null
  onInvite: (email: string) => Promise<boolean>
  onShareOnWhatsApp: () => void
  onShareAsText: () => void
  onRevoke: (token: string) => void
  onRemove: (userId: string) => void
}) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  // Inviting may create an account and send a mail, so it runs once per tap.
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    if (await onInvite(email)) setEmail('')
    setBusy(false)
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
        <button type="submit" disabled={busy}>
          {busy ? 'Invitando…' : 'Invitar'}
        </button>
      </form>
      <div className="row">
        <button className="ghost" onClick={onShareOnWhatsApp}>
          Compartir por WhatsApp
        </button>
        <button className="ghost" onClick={onShareAsText}>
          Mandar como texto
        </button>
      </div>
      {notice && <p className="notice">{notice}</p>}
      <ul className="options">
        {memberIds.map((id) => (
          <li key={id}>
            <span className="row">
              {names[id] ?? 'Sin nombre'}
              {id === currentUserId && <span className="tag">vos</span>}
            </span>
            {id === currentUserId
              ? // The creator keeps the list and deletes it from its own button.
                id !== ownerId && (
                  <button className="ghost" onClick={() => onRemove(id)}>
                    Salir de la lista
                  </button>
                )
              : currentUserId === ownerId && (
                  <button
                    className="ghost"
                    onClick={() => onRemove(id)}
                    aria-label="Sacar de la lista"
                  >
                    ×
                  </button>
                )}
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
