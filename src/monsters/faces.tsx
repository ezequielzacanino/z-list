import { Dot, INK, line } from './kit'

// Dot eyes with a glint and a thin curved smile, shared by every creature.

// Two eyes a gap apart and a mouth below, on a head seen from the front.
export function FaceFront({ x, y, gap, size = 1 }: { x: number; y: number; gap: number; size?: number }) {
  const s = size
  return (
    <g>
      <Dot x={x - gap} y={y} r={1.4 * s} />
      <Dot x={x + gap} y={y} r={1.4 * s} />
      <path d={`M${x - 2.2 * s} ${y + 4 * s}Q${x} ${y + 6 * s} ${x + 2.2 * s} ${y + 4 * s}`} {...line(INK, 0.9)} />
    </g>
  )
}

// One eye and a mouth line running toward the snout, on a head in profile whose snout points to +x.
export function FaceSide({ x, y, snout, size = 1 }: { x: number; y: number; snout: number; size?: number }) {
  const s = size
  const mouthY = y + 3.4 * s
  return (
    <g>
      <Dot x={x} y={y} r={1.5 * s} />
      <path
        d={`M${x + snout} ${mouthY - 0.4 * s}Q${x + snout * 0.5} ${mouthY + 1.4 * s} ${x - 2 * s} ${mouthY + 0.8 * s}`}
        {...line(INK, 0.8)}
      />
    </g>
  )
}
