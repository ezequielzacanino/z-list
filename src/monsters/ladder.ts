import { maxLevel, type Trait } from './traits'

// Order in which a monster's traits grow: every trait appears, then each one deepens.
export function ladder(traits: Trait[]): Trait[] {
  const steps: Trait[] = []
  for (let level = 1; level <= 3; level += 1) {
    for (const trait of traits) if (maxLevel[trait] >= level) steps.push(trait)
  }
  return steps
}

// Level of each trait once the monster reached a stage.
export function levelsAt(traits: Trait[], stage: number): Partial<Record<Trait, number>> {
  const levels: Partial<Record<Trait, number>> = {}
  for (const trait of ladder(traits).slice(0, stage)) levels[trait] = (levels[trait] ?? 0) + 1
  return levels
}
