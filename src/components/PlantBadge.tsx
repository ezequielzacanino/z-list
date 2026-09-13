import { currentStage } from '../plants/growth'
import { species } from '../plants/species'
import type { List } from '../lib/types'
import { Plant } from './Plant'

// The list's plant with its level; while still a seedling, tapping swaps it for another.
export function PlantBadge({ list, onReroll }: { list: List; onReroll: () => void }) {
  const stage = currentStage(list.growth, list.growth_at, new Date())
  const name = species[list.monster % species.length].name

  if (stage === 0) {
    return (
      <button className="plant-badge" onClick={onReroll} aria-label={`${name}: cambiar de planta`}>
        <Plant index={list.monster} stage={stage} />
        <span className="level">↻</span>
      </button>
    )
  }

  return (
    <span className="plant-badge" role="img" aria-label={`${name}, nivel ${stage + 1}`}>
      <Plant index={list.monster} stage={stage} />
      <span className="level">{stage + 1}</span>
    </span>
  )
}
