import { currentStage } from '../monsters/growth'
import { species } from '../monsters/species'
import type { List } from '../lib/types'
import { Monster } from './Monster'

// The list's monster with its level; while still a baby, tapping swaps it for another.
export function MonsterBadge({ list, onReroll }: { list: List; onReroll: () => void }) {
  const stage = currentStage(list.growth, list.growth_at, new Date())
  const name = species[list.monster % species.length].name

  if (stage === 0) {
    return (
      <button
        className="monster-badge"
        onClick={onReroll}
        aria-label={`${name}: cambiar de monstruo`}
      >
        <Monster index={list.monster} stage={stage} />
        <span className="level">↻</span>
      </button>
    )
  }

  return (
    <span className="monster-badge" role="img" aria-label={`${name}, nivel ${stage + 1}`}>
      <Monster index={list.monster} stage={stage} />
      <span className="level">{stage + 1}</span>
    </span>
  )
}
