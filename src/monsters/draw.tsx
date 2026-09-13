import { levelsAt } from './creature'
import { STAGES } from './growth'
import { tone } from './kit'
import { species } from './species'

const GROUND = 58

// One species at one stage, slightly larger and with one more feature per stage.
export function drawMonster(index: number, stage: number) {
  const one = species[index % species.length]
  const look = {
    body: tone(one.hue, one.saturation, one.lightness),
    accent: tone(one.accentHue, 70, 68),
    hue: one.hue,
    accentHue: one.accentHue,
    stage,
  }
  const level = levelsAt(one.creature.scripts[Number(one.variant)], stage)
  const scale = 0.8 + (0.2 * stage) / (STAGES - 1)
  return (
    <g transform={`translate(32 ${GROUND}) scale(${scale}) translate(-32 -${GROUND})`}>
      <g className="monster-breath">{one.creature.draw(level, look, one.variant)}</g>
    </g>
  )
}
