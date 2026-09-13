import { describe, expect, it } from 'vitest'
import { currentStage, stageOf, STAGES, threshold } from './growth'
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
  it('has fifty distinct creatures', () => {
    expect(species).toHaveLength(50)
    expect(new Set(species.map((one) => one.name)).size).toBe(50)
    expect(new Set(species.map((one) => one.creature.scripts[Number(one.variant)])).size).toBe(50)
  })

  it('grows exactly one step at every stage', () => {
    for (const one of species) {
      expect(one.creature.scripts[Number(one.variant)], one.name).toHaveLength(STAGES - 1)
    }
  })
})
