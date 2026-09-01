import { useState } from 'react'
import { useItemOptions } from '../hooks/useItemOptions'
import { RecurrenceSelect } from './RecurrenceSelect'
import type { Item } from '../lib/types'

// Exposes every attribute, regardless of the list's quick-add fields.
export function ItemDetail({
  item,
  onUpdate,
  onDelete,
  onClose,
}: {
  item: Item
  onUpdate: (patch: Partial<Item>) => void
  onDelete: () => void
  onClose: () => void
}) {
  const { options, error, addOption, deleteOption } = useItemOptions(item.id)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')

  async function submitOption(event: React.FormEvent) {
    event.preventDefault()
    await addOption(label, url)
    setLabel('')
    setUrl('')
  }

  return (
    <div className="sheet">
      <header className="row">
        <input value={item.name} onChange={(event) => onUpdate({ name: event.target.value })} />
        <button className="ghost" onClick={onClose}>
          Cerrar
        </button>
      </header>

      <label>
        Cantidad
        <input
          value={item.quantity ?? ''}
          onChange={(event) => onUpdate({ quantity: event.target.value || null })}
        />
      </label>

      <label>
        Prioridad
        <select
          value={item.priority ?? ''}
          onChange={(event) => onUpdate({ priority: Number(event.target.value) || null })}
        >
          <option value="">Sin prioridad</option>
          <option value="1">Alta</option>
          <option value="2">Media</option>
          <option value="3">Baja</option>
        </select>
      </label>

      <label>
        Repetición
        <RecurrenceSelect
          value={item.recurrence_days}
          onChange={(days) => onUpdate({ recurrence_days: days })}
        />
      </label>

      <label>
        Especificaciones
        <textarea
          value={item.notes ?? ''}
          onChange={(event) => onUpdate({ notes: event.target.value || null })}
        />
      </label>

      <section className="stack">
        <h3>Opciones</h3>
        {error && <p className="error">{error}</p>}
        <ul className="options">
          {options.map((option) => (
            <li key={option.id}>
              {option.url ? (
                <a href={option.url} target="_blank" rel="noreferrer">
                  {option.label}
                </a>
              ) : (
                option.label
              )}
              <button className="ghost" onClick={() => deleteOption(option.id)}>
                ×
              </button>
            </li>
          ))}
        </ul>
        <form className="row" onSubmit={submitOption}>
          <input
            required
            placeholder="Opción"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
          <input placeholder="Link" value={url} onChange={(event) => setUrl(event.target.value)} />
          <button type="submit">+</button>
        </form>
      </section>

      <button className="danger" onClick={onDelete}>
        Borrar ítem
      </button>
    </div>
  )
}
