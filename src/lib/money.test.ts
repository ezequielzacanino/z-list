import { describe, expect, it } from 'vitest'
import { budgetSummary, parseAmount } from './money'
import type { Item } from './types'

const item = (amount: number | null, done_at: string | null) => ({ amount, done_at }) as Item

describe('parseAmount', () => {
  it('reads a comma as the decimal separator and rejects the rest', () => {
    expect(parseAmount('1250,50')).toBe(1250.5)
    expect(parseAmount('')).toBeNull()
    expect(parseAmount('abc')).toBeNull()
  })
})

describe('budgetSummary', () => {
  it('splits spent from pending and checked amounts by month', () => {
    const summary = budgetSummary(
      [
        item(100, null),
        item(200, '2026-09-03T12:00:00'),
        item(50, '2026-08-20T12:00:00'),
        item(30, '2026-06-01T12:00:00'),
        item(null, '2026-09-04T12:00:00'),
      ],
      new Date('2026-09-12T12:00:00'),
    )
    expect(summary).toEqual({ total: 380, spent: 280, pending: 100, thisMonth: 200, lastMonth: 50 })
  })
})
