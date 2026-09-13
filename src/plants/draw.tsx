import { STAGES } from './growth'
import { CommonDefs } from './parts'
import { levelsAt } from './plant'
import { PotBack, PotFront } from './pot'
import { species } from './species'

const GROUND = 58

// One species at one stage, a little larger at every stage; id prefixes its gradients.
export function drawPlant(index: number, stage: number, id: string) {
  const one = species[index % species.length]
  const level = levelsAt(one.plant.steps, stage)
  const scale = 0.8 + (0.2 * stage) / (STAGES - 1)
  return (
    <g transform={`translate(32 ${GROUND}) scale(${scale}) translate(-32 -${GROUND})`}>
      <CommonDefs id={id} leaf={one.leaf} bloom={one.bloom} />
      <PotBack id={id} shape={one.plant.pot} />
      <g className="plant-sway">{one.plant.draw(level, { id, leaf: one.leaf, bloom: one.bloom, stage })}</g>
      <PotFront id={id} shape={one.plant.pot} glaze={one.glaze} />
    </g>
  )
}
