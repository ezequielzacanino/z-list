import { useEffect, useState } from 'react'

// Text field that saves when it loses focus, instead of on every keystroke.
export function DraftInput({
  value,
  multiline,
  onCommit,
}: {
  value: string
  multiline?: boolean
  onCommit: (value: string) => void
}) {
  const [draft, setDraft] = useState(value)
  const [editing, setEditing] = useState(false)

  // A change from another device lands only while nobody is typing here.
  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  function commit() {
    setEditing(false)
    if (draft !== value) onCommit(draft)
  }

  if (multiline) {
    return (
      <textarea
        value={draft}
        onFocus={() => setEditing(true)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
      />
    )
  }

  return (
    <input
      value={draft}
      onFocus={() => setEditing(true)}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
    />
  )
}
