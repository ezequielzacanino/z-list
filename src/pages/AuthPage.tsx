import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signIn(event: React.FormEvent) {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError(error.message)
    else setSent(true)
  }

  if (sent) return <p className="notice">Te mandamos un link a {email}.</p>

  return (
    <form className="stack" onSubmit={signIn}>
      <h1>Z-list</h1>
      <input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit">Entrar</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
