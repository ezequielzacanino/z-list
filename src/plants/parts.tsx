import { hsl, Linear, Radial, url, type Tint } from './paint'
import { polar, smooth, spread, type Point } from './shapes'

export const BARK: Tint = { h: 22, s: 28, l: 38 }

// Gradients every plant shares: leaves, blooms, petals, bark and a soft glow.
export function CommonDefs({ id, leaf, bloom }: { id: string; leaf: Tint; bloom: Tint }) {
  return (
    <defs>
      <Linear id={`${id}-leaf`} colors={[hsl(leaf, 14), hsl(leaf), hsl(leaf, -10)]} angle={160} />
      <Radial id={`${id}-foliage`} colors={[hsl(leaf, 16), hsl(leaf, 2), hsl(leaf, -12)]} />
      <Radial id={`${id}-bloom`} colors={[hsl(bloom, 16), hsl(bloom, 4), hsl(bloom, -8)]} />
      <Radial id={`${id}-petal`} colors={['hsl(40 100% 97%)', hsl(bloom, 8), hsl(bloom, -4)]} x={0.5} y={0.5} r={0.6} />
      <Linear id={`${id}-bark`} colors={[hsl(BARK, 14), hsl(BARK), hsl(BARK, -10)]} angle={95} />
      <Radial id={`${id}-glow`} colors={[hsl(bloom, 20, 0.45), hsl(bloom, 20, 0)]} x={0.5} y={0.5} r={0.5} />
    </defs>
  )
}

// Points evenly placed around a circle, for fluffy round clusters.
export function ring(x: number, y: number, r: number, count: number): Point[] {
  return spread(count, 0, 360 - 360 / count).map((angle) => polar(x, y, angle, r))
}

const wobble = [1, 0.9, 1, 0.93, 0.98, 0.88, 1, 0.92]

// Soft organic cloud of foliage or blossoms with a faint highlight on its upper left.
export function Puff({ x, y, r, fill }: { x: number; y: number; r: number; fill: string }) {
  const outline = ring(x, y, r, 8).map(([px, py], index) => {
    const share = wobble[index]
    return [x + (px - x) * share, y + (py - y) * share] as Point
  })
  return (
    <g>
      <path d={smooth(outline, true)} fill={fill} />
      <ellipse cx={x - r * 0.3} cy={y - r * 0.35} rx={r * 0.38} ry={r * 0.26} fill="hsl(60 100% 96% / 0.22)" />
    </g>
  )
}

// Five-petal flower facing the viewer.
export function Blossom({
  id,
  x,
  y,
  r,
  turn = 0,
  fill,
}: {
  id: string
  x: number
  y: number
  r: number
  turn?: number
  fill?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      {spread(5, 0, 288).map((angle) => {
        const [px, py] = polar(0, 0, angle, r * 0.55)
        return (
          <ellipse
            key={angle}
            cx={px}
            cy={py}
            rx={r * 0.42}
            ry={r * 0.55}
            transform={`rotate(${angle} ${px} ${py})`}
            fill={fill ?? url(id, 'petal')}
          />
        )
      })}
      <circle r={r * 0.22} fill="hsl(45 90% 70%)" />
    </g>
  )
}

// Soft glow behind a plant in full bloom.
export function Halo({ id, x, y, r }: { id: string; x: number; y: number; r: number }) {
  return <circle cx={x} cy={y} r={r} fill={url(id, 'glow')} />
}
