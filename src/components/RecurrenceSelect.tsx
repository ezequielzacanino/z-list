import { useState } from 'react'
import { recurrencePresets } from '../lib/recurrence'

// Preset intervals plus a free interval in days.
export function RecurrenceSelect({
  value,
  onChange,
}: {
  value: number | null
  onChange: (days: number | null) => void
}) {
  const [custom, setCustom] = useState(
    value !== null && !recurrencePresets.some((preset) => preset.days === value),
  )

  function pick(choice: string) {
    setCustom(choice === 'custom')
    onChange(choice === 'custom' ? null : Number(choice) || null)
  }

  return (
    <>
      <select value={custom ? 'custom' : (value ?? '')} onChange={(event) => pick(event.target.value)}>
        <option value="">Sin repetir</option>
        {recurrencePresets.map((preset) => (
          <option key={preset.days} value={preset.days}>
            {preset.label}
          </option>
        ))}
        <option value="custom">Otro…</option>
      </select>
      {custom && (
        <input
          className="narrow"
          type="number"
          min="1"
          placeholder="días"
          value={value ?? ''}
          onChange={(event) => onChange(Number(event.target.value) || null)}
        />
      )}
    </>
  )
}
