import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useJoin } from '../hooks/useJoin'

// Landing of an invitation link: it joins the list, or opens an account for the invited.
export function JoinPage({ userId }: { userId: string | null }) {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { error, join, requestAccount } = useJoin(token!)
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (userId) join().then((listId) => listId && navigate(`/lista/${listId}`))
  }, [userId, join, navigate])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const created = await requestAccount(email)
    if (created === null) return
    setNotice(
      created
        ? `Te mandamos un mail a ${email} para que pongas tu contraseña. Con eso entrás a la lista.`
        : 'Ya tenés cuenta y la lista te espera adentro. Entrá con tu contraseña.',
    )
  }

  if (error) return <p className="error">{error}</p>
  if (notice) return <p className="notice">{notice}</p>
  if (userId) return <p className="notice">Entrando a la lista…</p>

  return (
    <form className="stack" onSubmit={submit}>
      <h1>Te compartieron una lista</h1>
      <p className="muted">Poné tu email y te mandamos con qué entrar.</p>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit">Entrar a la lista</button>
    </form>
  )
}
