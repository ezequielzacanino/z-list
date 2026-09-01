import { useState } from 'react'
import { RecurrenceSelect } from './RecurrenceSelect'
import type { ItemDraft, QuickAddField } from '../lib/types'

const emptyDraft: ItemDraft = { name: '' }

export function QuickAdd({
  fields,
  onAdd,
}: {
  fields: QuickAddField[]
  onAdd: (draft: ItemDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState<ItemDraft>(emptyDraft)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    await onAdd(draft)
    setDraft(emptyDraft)
  }

  return (
    <form className="row quick-add" onSubmit={submit}>
      <input
        required
        placeholder="Agregar"
        value={draft.name}
        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
      />
      {fields.includes('quantity') && (
        <input
          className="narrow"
          placeholder="Cant."
          value={draft.quantity ?? ''}
          onChange={(event) => setDraft({ ...draft, quantity: event.target.value })}
        />
      )}
      {fields.includes('priority') && (
        <select
          value={draft.priority ?? ''}
          onChange={(event) => setDraft({ ...draft, priority: Number(event.target.value) })}
        >
          <option value="">Prioridad</option>
          <option value="1">Alta</option>
          <option value="2">Media</option>
          <option value="3">Baja</option>
        </select>
      )}
      {fields.includes('recurrence') && (
        <RecurrenceSelect
          value={draft.recurrence_days ?? null}
          onChange={(days) => setDraft({ ...draft, recurrence_days: days })}
        />
      )}
      {fields.includes('notes') && (
        <input
          placeholder="Especificaciones"
          value={draft.notes ?? ''}
          onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
        />
      )}
      <button type="submit">+</button>
    </form>
  )
}
