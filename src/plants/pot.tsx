import { hsl, Linear, Radial, url, type Tint } from './paint'
import type { PotShape } from './plant'

type Frame = { rim: number; left: number; right: number; body: string }

const frames: Record<PotShape, Frame> = {
  bowl: { rim: 47, left: 20, right: 44, body: 'M20 47H44Q43.6 55 38.5 58H25.5Q20.4 55 20 47z' },
  tray: { rim: 51, left: 13, right: 51, body: 'M13 51H51L48.5 56.5H15.5z' },
  tall: { rim: 43, left: 23, right: 41, body: 'M23 43H41L39.5 58H24.5z' },
  basin: { rim: 48, left: 10, right: 54, body: 'M10 48H54Q52 57 44 58H20Q12 57 10 48z' },
  plate: { rim: 55, left: 17, right: 47, body: 'M17 55H47Q45 58.5 40 58.5H24Q19 58.5 17 55z' },
}

const SOIL: Tint = { h: 25, s: 30, l: 26 }
const WATER: Tint = { h: 195, s: 45, l: 62 }

// Height where a plant springs from its pot.
export function soilY(shape: PotShape) {
  return frames[shape].rim - 0.4
}

// Ground shadow and the soil or water surface, drawn behind the plant.
export function PotBack({ id, shape }: { id: string; shape: PotShape }) {
  const { rim, left, right } = frames[shape]
  const half = (right - left) / 2
  return (
    <g>
      <defs>
        <Radial id={`${id}-shadow`} colors={['hsl(30 20% 20% / 0.28)', 'hsl(30 20% 20% / 0)']} x={0.5} y={0.5} r={0.5} />
        <Radial id={`${id}-soil`} colors={[hsl(SOIL, 10), hsl(SOIL), hsl(SOIL, -8)]} x={0.45} y={0.35} />
        <Linear id={`${id}-water`} colors={[hsl(WATER, 18), hsl(WATER), hsl(WATER, -10)]} />
      </defs>
      <ellipse cx={32} cy={58.4} rx={half + 3} ry={2} fill={url(id, 'shadow')} />
      {shape !== 'plate' && (
        <ellipse
          cx={32}
          cy={rim - 0.4}
          rx={half - 1.2}
          ry={shape === 'basin' ? 2.4 : 1.7}
          fill={url(id, shape === 'basin' ? 'water' : 'soil')}
        />
      )}
    </g>
  )
}

// Glazed pot body and rim, drawn in front of the plant's base.
export function PotFront({ id, shape, glaze }: { id: string; shape: PotShape; glaze: Tint }) {
  const { rim, left, right, body } = frames[shape]
  return (
    <g>
      <defs>
        <Linear id={`${id}-glaze`} colors={[hsl(glaze, 12), hsl(glaze), hsl(glaze, -14)]} angle={100} />
        <Linear id={`${id}-rim`} colors={[hsl(glaze, 20), hsl(glaze, 6)]} />
      </defs>
      <path d={body} fill={url(id, 'glaze')} />
      {shape === 'tray' &&
        [17, 44].map((x) => <rect key={x} x={x} y={56.2} width={3} height={1.8} rx={0.6} fill={hsl(glaze, -18)} />)}
      {shape !== 'plate' && (
        <rect
          x={left - 0.6}
          y={rim - 1.2}
          width={right - left + 1.2}
          height={shape === 'tray' ? 2.2 : 2.6}
          rx={1.2}
          fill={url(id, 'rim')}
        />
      )}
      <path d={`M${left + 3} ${rim + 3}Q${left + 3.5} ${rim + 6} ${left + 5} ${rim + 7}`} stroke={hsl(glaze, 26, 0.5)} strokeWidth={1.2} strokeLinecap="round" fill="none" />
    </g>
  )
}
