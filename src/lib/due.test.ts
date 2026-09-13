import { describe, expect, it } from 'vitest'
import { dueLabel } from './due'

describe('dueLabel', () => {
  const today = new Date('2026-09-12T15:00:00')

  it('flags past, today and tomorrow as urgent', () => {
    expect(dueLabel('2026-09-11', today)).toEqual({ text: 'venció', urgent: true })
    expect(dueLabel('2026-09-12', today)).toEqual({ text: 'vence hoy', urgent: true })
    expect(dueLabel('2026-09-13', today)).toEqual({ text: 'vence mañana', urgent: true })
  })

  it('shows the date of a later deadline', () => {
    expect(dueLabel('2026-09-20', today).urgent).toBe(false)
  })
})
