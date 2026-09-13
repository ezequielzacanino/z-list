import type { ReactNode } from 'react'
import { CENTER, type Body } from './bodies'
import { INK, type Palette } from './palette'

export type EyeStyle = 'dots' | 'shiny' | 'sleepy' | 'cyclops' | 'wide' | 'tri'
export type MouthStyle = 'smile' | 'cat' | 'o' | 'grin' | 'fang' | 'tiny'

// Horizontal offsets of each eye from the center line.
export const eyeOffsets: Record<EyeStyle, number[]> = {
  dots: [-6, 6],
  shiny: [-6.5, 6.5],
  sleepy: [-6, 6],
  cyclops: [0],
  wide: [-8, 8],
  tri: [-6, 0, 6],
}

function highlight(x: number, y: number, radius: number) {
  return <circle cx={x} cy={y} r={radius} fill="#fff" />
}

export function eyes(style: EyeStyle, body: Body, colors: Palette): ReactNode {
  const y = body.eyeY
  return eyeOffsets[style].map((offset) => {
    const x = CENTER + offset
    const key = `eye${offset}`
    switch (style) {
      case 'dots':
        return (
          <g key={key}>
            <circle cx={x} cy={y} r={2.1} fill={INK} />
            {highlight(x + 0.7, y - 0.7, 0.6)}
          </g>
        )
      case 'shiny':
        return (
          <g key={key}>
            <circle cx={x} cy={y} r={3.2} fill={INK} />
            {highlight(x + 1, y - 1.1, 1.2)}
            {highlight(x - 1, y + 1, 0.5)}
          </g>
        )
      case 'sleepy':
        return (
          <path
            key={key}
            d={`M${x - 2.8} ${y}Q${x} ${y + 2.6} ${x + 2.8} ${y}`}
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        )
      case 'cyclops':
        return (
          <g key={key}>
            <circle cx={x} cy={y - 1} r={5.2} fill="#fff" stroke={colors.shade} strokeWidth={1.4} />
            <circle cx={x} cy={y - 0.6} r={2.7} fill={INK} />
            {highlight(x + 1, y - 1.7, 1)}
          </g>
        )
      case 'wide':
        return (
          <g key={key}>
            <ellipse cx={x} cy={y} rx={1.9} ry={2.9} fill={INK} />
            {highlight(x + 0.6, y - 1.1, 0.6)}
          </g>
        )
      case 'tri':
        return <circle key={key} cx={x} cy={offset ? y : y - 3.5} r={1.7} fill={INK} />
    }
  })
}

export function mouth(style: MouthStyle, body: Body): ReactNode {
  const y = body.mouthY
  const line = { fill: 'none', stroke: INK, strokeWidth: 1.5, strokeLinecap: 'round' as const }
  switch (style) {
    case 'smile':
      return (
        <path d={`M${CENTER - 3.5} ${y}Q${CENTER} ${y + 3.5} ${CENTER + 3.5} ${y}`} {...line} />
      )
    case 'cat':
      return (
        <path
          d={`M${CENTER - 4} ${y}Q${CENTER - 2} ${y + 2.5} ${CENTER} ${y}Q${CENTER + 2} ${y + 2.5} ${CENTER + 4} ${y}`}
          {...line}
        />
      )
    case 'o':
      return <ellipse cx={CENTER} cy={y + 0.8} rx={1.6} ry={2} fill={INK} />
    case 'grin':
      return (
        <g>
          <path d={`M${CENTER - 4} ${y}Q${CENTER} ${y + 5.5} ${CENTER + 4} ${y}z`} fill={INK} />
          <ellipse cx={CENTER} cy={y + 2.6} rx={1.8} ry={1} fill="#ff8fa3" />
        </g>
      )
    case 'fang':
      return (
        <g>
          <path d={`M${CENTER - 3.5} ${y}Q${CENTER} ${y + 3.5} ${CENTER + 3.5} ${y}`} {...line} />
          <path
            d={`M${CENTER + 0.9} ${y + 1.6}L${CENTER + 3} ${y + 1.2}L${CENTER + 2.1} ${y + 3.6}z`}
            fill="#fff"
            stroke={INK}
            strokeWidth={0.7}
            strokeLinejoin="round"
          />
        </g>
      )
    case 'tiny':
      return (
        <path
          d={`M${CENTER - 1.6} ${y + 0.5}Q${CENTER} ${y + 1.8} ${CENTER + 1.6} ${y + 0.5}`}
          {...line}
        />
      )
  }
}
