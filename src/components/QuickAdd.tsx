import { useRef, useState } from 'react'
import { RecurrenceSelect } from './RecurrenceSelect'
import type { ItemDraft, OptionDraft, QuickAddField } from '../lib/types'

const emptyDraft: ItemDraft = { name: '' }
const emptyOption: OptionDraft = { label: '', url: '' }

export function QuickAdd({
  fields,
  onAdd,
}: {
  fields: QuickAddField[]
  onAdd: (draft: ItemDraft, option?: OptionDraft) => Promise<void>
}) {
  const [draft, setDraft] = useState<ItemDraft>(emptyDraft)
  const [option, setOption] = useState<OptionDraft>(emptyOption)
  const [busy, setBusy] = useState(false)
  const nameInput = useRef<HTMLInputElement>(null)

  // One item per submit, and the cursor stays on the name to add the next one.
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    await onAdd(draft, option.label ? option : undefined)
    setBusy(false)
    setDraft(emptyDraft)
    setOption(emptyOption)
    nameInput.current?.focus()
  }

  return (
    <form className="row quick-add" onSubmit={submit}>
      <input
        ref={nameInput}
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
          onChange={(event) => setDraft({ ...draft, priority: Number(event.target.value) || null })}
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
      {fields.includes('options') && (
        <>
          <input
            placeholder="Opción"
            value={option.label}
            onChange={(event) => setOption({ ...option, label: event.target.value })}
          />
          <input
            type="url"
            placeholder="Link"
            value={option.url}
            onChange={(event) => setOption({ ...option, url: event.target.value })}
          />
        </>
      )}
      <button type="submit" disabled={busy}>
        +
      </button>
    </form>
  )
}
