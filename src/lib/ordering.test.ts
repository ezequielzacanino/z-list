import { describe, expect, it } from 'vitest'
import { STEP, nextPosition, positionBetween } from './ordering'
import type { Item } from './types'

const item = (position: number, done = false): Item =>
  ({ position, done_at: done ? '2026-01-01T00:00:00.000Z' : null }) as Item

describe('nextPosition', () => {
  it('starts at one step on an empty list', () => {
    expect(nextPosition([])).toBe(STEP)
  })

  it('appends after the last open item', () => {
    expect(nextPosition([item(STEP), item(STEP * 2)])).toBe(STEP * 3)
  })

  it('ignores the history when appending', () => {
    expect(nextPosition([item(STEP), item(STEP * 9, true)])).toBe(STEP * 2)
  })
})

describe('positionBetween', () => {
  it('splits the gap between two neighbours', () => {
    expect(positionBetween(item(1000), item(2000))).toBe(1500)
  })

  it('goes one step before the first item', () => {
    expect(positionBetween(undefined, item(1000))).toBe(1000 - STEP)
  })

  it('goes one step after the last item', () => {
    expect(positionBetween(item(1000), undefined)).toBe(1000 + STEP)
  })

  it('keeps the order strict between adjacent positions', () => {
    const middle = positionBetween(item(1000), item(1001))
    expect(middle).toBeGreaterThan(1000)
    expect(middle).toBeLessThan(1001)
  })
})
