import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLists } from '../hooks/useLists'
import { presets } from '../lib/presets'
import { supabase } from '../lib/supabase'

export function ListsPage({ userId }: { userId: string }) {
  const { lists, loading, error, createList } = useLists(userId)
  const [name, setName] = useState('')
  const [preset, setPreset] = useState('plain')

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await createList(name, preset)
    setName('')
  }

  if (loading) return <p className="notice">Cargando…</p>

  return (
    <div className="stack">
      <header className="row">
        <h1>Mis listas</h1>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>
          Salir
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <ul className="cards">
        {lists.map((list) => (
          <li key={list.id}>
            <Link to={`/lista/${list.id}`}>
              <strong>{list.name}</strong>
              <span className="muted">{presets[list.preset]?.label ?? list.preset}</span>
            </Link>
          </li>
        ))}
      </ul>

      <form className="row" onSubmit={submit}>
        <input
          required
          placeholder="Nueva lista"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <select value={preset} onChange={(event) => setPreset(event.target.value)}>
          {Object.entries(presets).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
        <button type="submit">Crear</button>
      </form>
    </div>
  )
}
