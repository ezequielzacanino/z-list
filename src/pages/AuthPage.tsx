import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function signIn(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  // Fallback for an account that still has no password.
  async function sendLink() {
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    if (error) setError(error.message)
    else setNotice(`Te mandamos un link a ${email} para entrar.`)
  }

  // Recovery mail for whoever forgot the password or never set one.
  async function resetPassword() {
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin,
    })
    if (error) setError(error.message)
    else setNotice(`Te mandamos un link a ${email}. Al entrar, poné una contraseña nueva en Contraseña.`)
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
      <button type="submit">Entrar</button>
      <button type="button" className="ghost" disabled={!email} onClick={sendLink}>
        Entrar con un link por email
      </button>
      <button type="button" className="ghost" disabled={!email} onClick={resetPassword}>
        Olvidé mi contraseña
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
