// Invitation link and the people who already hold it.
export function SharePanel({
  memberIds,
  names,
  currentUserId,
  copied,
  onCopy,
  onRemove,
}: {
  memberIds: string[]
  names: Record<string, string>
  currentUserId: string
  copied: boolean
  onCopy: () => void
  onRemove: (userId: string) => void
}) {
  return (
    <div className="share stack">
      <button onClick={onCopy}>Copiar link de invitación</button>
      {copied && <p className="notice">Link copiado.</p>}
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
