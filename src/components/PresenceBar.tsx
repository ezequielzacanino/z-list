// Initials of the members looking at the list right now.
export function PresenceBar({
  userIds,
  names,
}: {
  userIds: string[]
  names: Record<string, string>
}) {
  const shown = userIds.map((id) => names[id] ?? 'Alguien')
  return (
    <p className="presence">
      {shown.map((name, index) => (
        <span key={userIds[index]} className="avatar" aria-hidden="true">
          {name.slice(0, 1).toUpperCase()}
        </span>
      ))}
      <span>
        {shown.join(', ')} {shown.length === 1 ? 'está' : 'están'} acá
      </span>
    </p>
  )
}
