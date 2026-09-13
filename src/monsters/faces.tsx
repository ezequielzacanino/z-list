import { Dot, Fang, Grin, INK, line, Maw, Peeper, WHITE } from './kit'

// Face designs: 1 dots and a smile, 2 wide eyes and a toothy grin, 3 sly eyes and a fanged smirk,
// 4 dots and an open mouth with a tongue, 5 wide eyes and gritted teeth.
export type FaceStyle = 1 | 2 | 3 | 4 | 5

export let faceStyle: FaceStyle = 2

export function setFaceStyle(style: FaceStyle) {
  faceStyle = style
}

// Two eyes a gap apart and a mouth below, on a head seen from the front.
export function FaceFront({ x, y, gap, size = 1 }: { x: number; y: number; gap: number; size?: number }) {
  const s = size
  switch (faceStyle) {
    case 1:
      return (
        <g>
          <Dot x={x - gap} y={y} r={1.4 * s} />
          <Dot x={x + gap} y={y} r={1.4 * s} />
          <path d={`M${x - 2.2 * s} ${y + 4 * s}Q${x} ${y + 6 * s} ${x + 2.2 * s} ${y + 4 * s}`} {...line(INK, 1.2)} />
        </g>
      )
    case 2:
      return (
        <g>
          <Peeper x={x - gap} y={y} r={2.6 * s} />
          <Peeper x={x + gap} y={y} r={2.6 * s} />
          <Grin x={x} y={y + 4.5 * s} w={4.2 * s} />
        </g>
      )
    case 3:
      return (
        <g>
          <Peeper x={x - gap} y={y} r={2.3 * s} look={1} />
          <Peeper x={x + gap} y={y} r={2.3 * s} look={1} />
          <path d={`M${x - 3 * s} ${y + 4.2 * s}Q${x + 1 * s} ${y + 6.4 * s} ${x + 3.4 * s} ${y + 3.6 * s}`} {...line(INK, 1.2)} />
          <Fang x={x + 1.8 * s} y={y + 5.1 * s} size={1.7 * s} />
        </g>
      )
    case 4:
      return (
        <g>
          <Dot x={x - gap} y={y} r={1.5 * s} />
          <Dot x={x + gap} y={y} r={1.5 * s} />
          <Maw x={x} y={y + 3.6 * s} w={3.2 * s} h={2.4 * s} />
        </g>
      )
    case 5:
      return (
        <g>
          <Peeper x={x - gap} y={y} r={2.4 * s} />
          <Peeper x={x + gap} y={y} r={2.4 * s} />
          <rect x={x - 4 * s} y={y + 3.4 * s} width={8 * s} height={3.2 * s} rx={1.4 * s} fill={INK} />
          <rect x={x - 3.1 * s} y={y + 4.3 * s} width={6.2 * s} height={1.5 * s} fill={WHITE} />
          <path d={`M${x - 1.5 * s} ${y + 4.3 * s}v${1.5 * s}M${x} ${y + 4.3 * s}v${1.5 * s}M${x + 1.5 * s} ${y + 4.3 * s}v${1.5 * s}`} {...line(INK, 0.5)} />
        </g>
      )
  }
}

// One eye and a mouth line running toward the snout, on a head in profile whose snout points to +x.
export function FaceSide({ x, y, snout, size = 1 }: { x: number; y: number; snout: number; size?: number }) {
  const s = size
  const mouthY = y + 3.4 * s
  const mouth = `M${x + snout} ${mouthY - 0.4 * s}Q${x + snout * 0.5} ${mouthY + 1.4 * s} ${x - 2 * s} ${mouthY + 0.8 * s}`
  switch (faceStyle) {
    case 1:
      return (
        <g>
          <Dot x={x} y={y} r={1.5 * s} />
          <path d={mouth} {...line(INK, 1.1)} />
        </g>
      )
    case 2:
      return (
        <g>
          <Peeper x={x} y={y} r={2.3 * s} look={0.5} />
          <path d={mouth} {...line(INK, 1.1)} />
          {[0.25, 0.55].map((share) => (
            <Fang key={share} x={x + snout * share} y={mouthY + 0.5 * s} size={1.4 * s} />
          ))}
        </g>
      )
    case 3:
      return (
        <g>
          <Peeper x={x} y={y} r={2.1 * s} look={1} />
          <path d={`M${x + snout} ${mouthY - 0.6 * s}Q${x + snout * 0.4} ${mouthY + 2 * s} ${x - 2 * s} ${mouthY + 0.4 * s}`} {...line(INK, 1.1)} />
          <Fang x={x + snout * 0.35} y={mouthY + 0.8 * s} size={1.7 * s} />
        </g>
      )
    case 4:
      return (
        <g>
          <Dot x={x} y={y} r={1.6 * s} />
          <path d={`M${x + snout} ${mouthY - 1.2 * s}L${x + snout * 0.2} ${mouthY - 0.2 * s}L${x + snout} ${mouthY + 2.2 * s}z`} fill={INK} />
          <path d={`M${x + snout * 0.9} ${mouthY + 1.4 * s}L${x + snout * 0.55} ${mouthY + 0.5 * s}L${x + snout * 0.9} ${mouthY - 0.2 * s}z`} fill="#ff5c7a" />
        </g>
      )
    case 5:
      return (
        <g>
          <Peeper x={x} y={y} r={2.2 * s} look={0.4} />
          <path d={`M${x + snout} ${mouthY - 0.6 * s}Q${x + snout * 0.5} ${mouthY + 2.2 * s} ${x - 1.5 * s} ${mouthY + 0.6 * s}`} fill={INK} />
          <path d={`M${x + snout * 0.85} ${mouthY + 0.1 * s}Q${x + snout * 0.5} ${mouthY + 1.1 * s} ${x + 0.5 * s} ${mouthY + 0.7 * s}`} {...line(WHITE, 0.9)} />
        </g>
      )
  }
}
