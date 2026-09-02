import { useState } from 'react'

// Chooses the password used to sign in on this account.
export function PasswordPanel({
  saved,
  error,
  onSave,
}: {
  saved: boolean
  error: string | null
  onSave: (password: string) => void
}) {
  const [password, setPassword] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    onSave(password)
    setPassword('')
  }

  return (
    <div className="share stack">
      <form className="row" onSubmit={submit}>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="contraseña nueva"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Guardar</button>
      </form>
      {saved && <p className="notice">Contraseña guardada.</p>}
      {error && <p className="error">{error}</p>}
    </div>
  )
}
