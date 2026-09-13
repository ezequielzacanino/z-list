import { describe, expect, it } from 'vitest'
import { currentStage, stageOf, STAGES, threshold } from './growth'
import { ladder, levelsAt } from './ladder'
import { species } from './species'

describe('stageOf', () => {
  it('starts at zero and tops out at the last stage', () => {
    expect(stageOf(0)).toBe(0)
    expect(stageOf(threshold(1))).toBe(1)
    expect(stageOf(threshold(1) - 1)).toBe(0)
    expect(stageOf(1_000_000)).toBe(STAGES - 1)
  })
})

describe('currentStage', () => {
  const points = threshold(10)
  const since = '2026-01-01T00:00:00Z'

  it('keeps the stage through the first idle week', () => {
    expect(currentStage(points, since, new Date('2026-01-08T00:00:00Z'))).toBe(10)
  })

  it('drops one stage per idle week after that', () => {
    expect(currentStage(points, since, new Date('2026-01-15T00:00:00Z'))).toBe(9)
    expect(currentStage(points, since, new Date('2026-03-01T00:00:00Z'))).toBe(3)
  })
})

describe('species', () => {
  it('has fifty distinct monsters', () => {
    expect(species).toHaveLength(50)
    const looks = species.map((one) => [one.body, one.eyes, one.mouth, ...one.traits].join())
    expect(new Set(looks).size).toBe(50)
    expect(new Set(species.map((one) => one.name)).size).toBe(50)
  })

  it('gives every monster a new feature at each of its stages', () => {
    for (const one of species) {
      expect(ladder(one.traits).length, one.name).toBeGreaterThanOrEqual(STAGES - 1)
      const shown = Array.from({ length: STAGES }, (_, stage) =>
        JSON.stringify(levelsAt(one.traits, stage)),
      )
      expect(new Set(shown).size, one.name).toBe(STAGES)
    }
  })
})
