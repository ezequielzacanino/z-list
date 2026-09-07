import { useState } from 'react'
import { authMessage, linkError } from '../lib/authMessages'
import { supabase } from '../lib/supabase'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(linkError)
  const [busy, setBusy] = useState(false)

  // Each request runs alone, so a second tap cannot fire it twice.
  async function run(request: () => Promise<void>) {
    if (busy) return
    setBusy(true)
    setError(null)
    await request()
    setBusy(false)
  }

  function signIn(event: React.FormEvent) {
    event.preventDefault()
    run(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(authMessage(error.message))
    })
  }

  // Fallback for an account that still has no password.
  function sendLink() {
    run(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      })
      if (error) setError(authMessage(error.message))
      else setNotice(`Te mandamos un link a ${email} para entrar.`)
    })
  }

  // Recovery mail for whoever forgot the password or never set one.
  function resetPassword() {
    run(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: location.origin,
      })
      if (error) setError(authMessage(error.message))
      else
        setNotice(
          `Te mandamos un link a ${email}. Abrilo y poné tu contraseña nueva en Contraseña; después entrás con ese email y esa contraseña.`,
        )
    })
  }

  if (notice) return <p className="notice">{notice}</p>

  return (
    <form className="stack" onSubmit={signIn}>
      <h1>Z-list</h1>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        placeholder="contraseña"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit" disabled={busy}>
        {busy ? 'Entrando…' : 'Entrar'}
      </button>
      <button type="button" className="ghost" disabled={!email || busy} onClick={sendLink}>
        Entrar con un link por email
      </button>
      <button type="button" className="ghost" disabled={!email || busy} onClick={resetPassword}>
        Olvidé mi contraseña
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
