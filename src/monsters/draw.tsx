import { bodies } from './bodies'
import { eyes, mouth } from './faces'
import { STAGES } from './growth'
import { levelsAt } from './ladder'
import { palette } from './palette'
import { species } from './species'
import { traitLayers } from './traits'

const GROUND = 58

// One species at one stage, a little larger and with one more feature per stage.
export function drawMonster(index: number, stage: number) {
  const one = species[index % species.length]
  const body = bodies[one.body]
  const colors = palette(one.hue)
  const layers = traitLayers(levelsAt(one.traits, stage), { body, colors, eyes: one.eyes })
  const scale = 0.72 + (0.28 * stage) / (STAGES - 1)
  return (
    <g transform={`translate(32 ${GROUND}) scale(${scale}) translate(-32 -${GROUND})`}>
      <g className="monster-breath">
        {layers.back}
        <path
          d={body.path}
          fill={colors.body}
          stroke={colors.shade}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        {layers.over}
        {eyes(one.eyes, body, colors)}
        {mouth(one.mouth, body)}
        {layers.top}
      </g>
    </g>
  )
}
