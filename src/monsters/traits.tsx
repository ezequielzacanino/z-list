import type { ReactNode } from 'react'
import { BOTTOM, CENTER, type Body } from './bodies'
import { eyeOffsets, type EyeStyle } from './faces'
import { CHEEK, GOLD, GOLD_SHADE, INK, type Palette } from './palette'

export type Trait =
  | 'blush'
  | 'belly'
  | 'spots'
  | 'stripes'
  | 'ears'
  | 'horns'
  | 'antenna'
  | 'sprout'
  | 'arms'
  | 'feet'
  | 'tail'
  | 'wings'
  | 'cape'
  | 'teeth'
  | 'brows'
  | 'crown'
  | 'scarf'
  | 'aura'

// How many small steps each trait takes before it is complete.
export const maxLevel: Record<Trait, number> = {
  blush: 1,
  belly: 2,
  spots: 3,
  stripes: 2,
  ears: 3,
  horns: 3,
  antenna: 3,
  sprout: 3,
  arms: 3,
  feet: 2,
  tail: 3,
  wings: 3,
  cape: 2,
  teeth: 1,
  brows: 1,
  crown: 3,
  scarf: 2,
  aura: 3,
}

type Look = { body: Body; colors: Palette; eyes: EyeStyle }
type Draw = (level: number, look: Look) => ReactNode

const sides = [-1, 1]
const LEAF = 'hsl(110 45% 62%)'
const LEAF_SHADE = 'hsl(110 35% 33%)'

function outlined(colors: Palette) {
  return {
    fill: colors.body,
    stroke: colors.shade,
    strokeWidth: 1.5,
    strokeLinejoin: 'round' as const,
  }
}

// Four-point sparkle centered on x, y.
function sparkle(x: number, y: number, size: number) {
  return `M${x} ${y - size}Q${x} ${y} ${x + size} ${y}Q${x} ${y} ${x} ${y + size}Q${x} ${y} ${x - size} ${y}Q${x} ${y} ${x} ${y - size}z`
}

// A limb drawn as an outlined tube along a path.
function tube(d: string, colors: Palette, width = 3.4) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={colors.shade}
        strokeWidth={width + 2.6}
        strokeLinecap="round"
      />
      <path d={d} fill="none" stroke={colors.body} strokeWidth={width} strokeLinecap="round" />
    </>
  )
}

const behind: Partial<Record<Trait, Draw>> = {
  aura: (level, { colors }) =>
    level > 2 && <circle cx={CENTER} cy={38} r={25} fill={colors.accent} opacity={0.18} />,

  cape: (level, { body, colors }) => {
    const flare = level > 1 ? 7 : 4
    const left = CENTER - body.side
    const right = CENTER + body.side
    return (
      <path
        d={`M${left + 3} ${body.armY - 7}Q${left - flare} ${BOTTOM - 2} ${left - 2} ${BOTTOM + 1}H${right + 2}Q${right + flare} ${BOTTOM - 2} ${right - 3} ${body.armY - 7}z`}
        fill={colors.accent}
        stroke={colors.accentShade}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    )
  },

  wings: (level, { body, colors }) => {
    const size = [5, 8.5, 12][level - 1]
    return sides.map((side) => {
      const x = CENTER + side * (body.side - 4)
      const y = body.armY - 7
      const s = side * size
      return (
        <g key={side}>
          <path
            d={`M${x} ${y}Q${x + s * 0.9} ${y - size * 1.2} ${x + s * 1.4} ${y - size * 0.3}Q${x + s * 1.1} ${y + size * 0.15} ${x + s * 0.75} ${y + size * 0.45}Q${x + s * 0.45} ${y + size * 0.2} ${x} ${y + size * 0.5}z`}
            fill={colors.belly}
            stroke={colors.shade}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
          {level > 2 && (
            <path
              d={`M${x + side * 2} ${y}L${x + s * 1.1} ${y - size * 0.25}M${x + side * 2} ${y + 2}L${x + s * 0.75} ${y + size * 0.3}`}
              stroke={colors.shade}
              strokeWidth={1}
              strokeLinecap="round"
              opacity={0.6}
            />
          )}
        </g>
      )
    })
  },

  tail: (level, { body, colors }) => {
    const x = CENTER + body.side - 3
    const y = BOTTOM - 5
    if (level === 1) return <circle cx={x + 3} cy={y} r={3.2} {...outlined(colors)} />
    return (
      <>
        {tube(
          `M${x} ${y}C${x + 9} ${y} ${x + 10} ${y - 11} ${x + 5} ${y - 11}`,
          colors,
          level > 2 ? 4 : 3,
        )}
        {level > 2 && (
          <path
            d={`M${x + 5} ${y - 16}L${x + 8} ${y - 11}L${x + 5} ${y - 7}L${x + 2} ${y - 11}z`}
            fill={colors.accent}
            stroke={colors.accentShade}
            strokeWidth={1}
            strokeLinejoin="round"
          />
        )}
      </>
    )
  },

  ears: (level, { body, colors }) =>
    sides.map((side) => {
      const x = CENTER + side * body.earSpread
      const y = body.earY
      if (level === 1) return <circle key={side} cx={x} cy={y} r={3.2} {...outlined(colors)} />
      const height = level > 2 ? 12 : 8
      return (
        <g key={side}>
          <path
            d={`M${x - 4} ${y + 3}Q${x - 1 + side} ${y - height * 0.4} ${x + side * 3} ${y - height}Q${x + 1 + side * 2} ${y - height * 0.3} ${x + 4} ${y + 3}z`}
            {...outlined(colors)}
          />
          {level > 2 && (
            <path
              d={`M${x - 1.8} ${y + 2}Q${x + side} ${y - height * 0.35} ${x + side * 2.4} ${y - height * 0.72}Q${x + side * 1.6} ${y - height * 0.2} ${x + 2} ${y + 2}z`}
              fill={CHEEK}
              opacity={0.6}
            />
          )}
        </g>
      )
    }),

  horns: (level, { body, colors }) =>
    sides.map((side) => {
      const x = CENTER + side * body.hornSpread
      const y = body.hornY
      const height = [4, 7.5, 11][level - 1]
      return (
        <g key={side}>
          <path
            d={`M${x - 2.6} ${y + 2}Q${x - 1.5 + side} ${y - height * 0.6} ${x + side * height * 0.35} ${y - height}Q${x + 1.8 + side * 1.5} ${y - height * 0.45} ${x + 2.6} ${y + 2}z`}
            fill={colors.accent}
            stroke={colors.accentShade}
            strokeWidth={1.3}
            strokeLinejoin="round"
          />
          {level > 2 && (
            <path
              d={`M${x - 1.8 + side * 0.8} ${y - height * 0.3}L${x + 2 + side * 1.2} ${y - height * 0.38}`}
              stroke={colors.accentShade}
              strokeWidth={1}
              strokeLinecap="round"
            />
          )}
        </g>
      )
    }),

  antenna: (level, { body, colors }) =>
    (level > 1 ? sides : [1]).map((side) => {
      const spread = level > 1 ? 3 : 0
      const tipX = CENTER + side * (level > 1 ? 7.5 : 3)
      const tipY = body.top - (level > 1 ? 8 : 7)
      return (
        <g key={side}>
          <path
            d={`M${CENTER + side * spread} ${body.top + 4}Q${CENTER + side * (spread + 1)} ${body.top - 4} ${tipX} ${tipY}`}
            fill="none"
            stroke={colors.shade}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {level > 2 && <circle cx={tipX} cy={tipY} r={4.5} fill={GOLD} opacity={0.35} />}
          <circle
            cx={tipX}
            cy={tipY}
            r={level > 2 ? 2.6 : 2}
            fill={level > 2 ? GOLD : colors.accent}
            stroke={level > 2 ? GOLD_SHADE : colors.accentShade}
            strokeWidth={1}
          />
        </g>
      )
    }),

  sprout: (level, { body, colors }) => {
    const top = body.top
    const stemTop = top - (level > 2 ? 7 : 5)
    const leaf = (side: number) => (
      <path
        key={side}
        d={`M${CENTER} ${top - 2}Q${CENTER + side * 5} ${top - 8} ${CENTER + side * 8} ${top - 5}Q${CENTER + side * 4} ${top - 1} ${CENTER} ${top - 2}z`}
        fill={LEAF}
        stroke={LEAF_SHADE}
        strokeWidth={1}
        strokeLinejoin="round"
      />
    )
    return (
      <>
        <path
          d={`M${CENTER} ${top + 3}V${stemTop}`}
          stroke={LEAF_SHADE}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {leaf(1)}
        {level > 1 && leaf(-1)}
        {level > 2 && (
          <g>
            {[0, 72, 144, 216, 288].map((angle) => (
              <circle
                key={angle}
                cx={CENTER + 2.6 * Math.sin((angle * Math.PI) / 180)}
                cy={stemTop - 2.6 * Math.cos((angle * Math.PI) / 180)}
                r={2.2}
                fill={colors.accent}
                stroke={colors.accentShade}
                strokeWidth={0.8}
              />
            ))}
            <circle cx={CENTER} cy={stemTop} r={1.6} fill={GOLD} />
          </g>
        )}
      </>
    )
  },

  feet: (level, { colors }) =>
    sides.map((side) => {
      const x = CENTER + side * 8
      return (
        <g key={side}>
          <ellipse
            cx={x}
            cy={BOTTOM}
            rx={level > 1 ? 5.5 : 4}
            ry={level > 1 ? 3.2 : 2.6}
            {...outlined(colors)}
          />
          {level > 1 && (
            <path
              d={`M${x - 1.5} ${BOTTOM + 1}v1.8M${x + 1.5} ${BOTTOM + 1}v1.8`}
              stroke={colors.shade}
              strokeWidth={1}
              strokeLinecap="round"
            />
          )}
        </g>
      )
    }),
}

const front: Partial<Record<Trait, Draw>> = {
  belly: (level, { body, colors }) => {
    const y = BOTTOM - 9
    return (
      <>
        <ellipse
          cx={CENTER}
          cy={y}
          rx={body.side * (level > 1 ? 0.64 : 0.55)}
          ry={level > 1 ? 7.5 : 6.5}
          fill={colors.belly}
        />
        {level > 1 && (
          <path
            d={`M${CENTER} ${y + 4}c-2.4-1.6-3.6-2.8-3.6-4a1.8 1.8 0 0 1 3.6-.8a1.8 1.8 0 0 1 3.6.8c0 1.2-1.2 2.4-3.6 4z`}
            fill={colors.accent}
          />
        )}
      </>
    )
  },

  stripes: (level, { body, colors }) =>
    (level > 1 ? [-8, -3, 3, 8] : [-3, 3]).map((offset) => (
      <path
        key={offset}
        d={`M${CENTER + offset} ${body.top + 1.8 + Math.abs(offset) * 0.3}l${offset * 0.1} 3.5`}
        stroke={colors.shade}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.5}
      />
    )),

  spots: (level, { body, colors }) => {
    const spots = [
      [-0.62, body.armY + 3, 2.4],
      [0.6, body.armY + 7, 2],
      [-0.4, body.eyeY - 7, 1.6],
      [0.45, body.eyeY - 6, 1.4],
      [-0.3, BOTTOM - 4, 1.7],
    ]
    return spots
      .slice(0, [1, 3, 5][level - 1])
      .map(([x, y, radius]) => (
        <circle
          key={x}
          cx={CENTER + x * body.side}
          cy={y}
          r={radius}
          fill={colors.shade}
          opacity={0.28}
        />
      ))
  },

  blush: (_level, { body }) =>
    sides.map((side) => (
      <ellipse
        key={side}
        cx={CENTER + side * body.side * 0.58}
        cy={body.eyeY + 4.5}
        rx={2.8}
        ry={1.7}
        fill={CHEEK}
        opacity={0.75}
      />
    )),

  brows: (_level, { body, eyes }) => {
    const y = body.eyeY
    const line = { fill: 'none', stroke: INK, strokeWidth: 1.4, strokeLinecap: 'round' as const }
    if (eyes === 'cyclops') {
      return (
        <path
          d={`M${CENTER - 5} ${y - 8.5}Q${CENTER} ${y - 6} ${CENTER + 5} ${y - 8.5}`}
          {...line}
        />
      )
    }
    return eyeOffsets[eyes]
      .filter((offset) => offset)
      .map((offset) => {
        const x = CENTER + offset
        const out = Math.sign(offset)
        return (
          <path key={offset} d={`M${x + out * 3} ${y - 5.4}L${x - out * 2} ${y - 4}`} {...line} />
        )
      })
  },

  teeth: (_level, { body }) =>
    sides.map((side) => {
      const x = CENTER + side * 2.6
      const y = body.mouthY + 0.8
      return (
        <path
          key={side}
          d={`M${x - 1.2} ${y}L${x + 1.2} ${y}L${x} ${y + 2.2}z`}
          fill="#fff"
          stroke={INK}
          strokeWidth={0.7}
          strokeLinejoin="round"
        />
      )
    }),

  scarf: (level, { body, colors }) => {
    const y = Math.min(body.mouthY + 5.5, BOTTOM - 4)
    const band = `M${CENTER - body.side * 0.9} ${y - 1.5}Q${CENTER} ${y + 3} ${CENTER + body.side * 0.9} ${y - 1.5}`
    const end = `M${CENTER + body.side * 0.45} ${y + 0.5}L${CENTER + body.side * 0.6} ${y + 8}`
    return (
      <>
        {level > 1 && (
          <>
            <path d={end} stroke={colors.accentShade} strokeWidth={5.2} strokeLinecap="round" />
            <path d={end} stroke={colors.accent} strokeWidth={3} strokeLinecap="round" />
          </>
        )}
        <path
          d={band}
          fill="none"
          stroke={colors.accentShade}
          strokeWidth={5.4}
          strokeLinecap="round"
        />
        <path d={band} fill="none" stroke={colors.accent} strokeWidth={3.4} strokeLinecap="round" />
      </>
    )
  },

  arms: (level, { body, colors }) =>
    sides.map((side) => {
      const y = body.armY
      if (level === 1) {
        const x = CENTER + side * (body.side - 0.5)
        return (
          <ellipse
            key={side}
            cx={x}
            cy={y + 1}
            rx={2.6}
            ry={3.4}
            transform={`rotate(${side * -30} ${x} ${y + 1})`}
            {...outlined(colors)}
          />
        )
      }
      const waving = level > 2 && side > 0
      const handX = CENTER + side * (body.side + (waving ? 6 : 5))
      const handY = waving ? y - 9 : y + 6
      return (
        <g key={side}>
          {tube(
            `M${CENTER + side * (body.side - 3)} ${y - 1}Q${CENTER + side * (body.side + 4)} ${waving ? y - 2 : y} ${handX} ${handY}`,
            colors,
          )}
          {level > 2 && <circle cx={handX} cy={handY} r={2.3} {...outlined(colors)} />}
        </g>
      )
    }),

  cape: (level, { body }) =>
    level > 1 && (
      <circle
        cx={CENTER}
        cy={Math.min(body.mouthY + 6, BOTTOM - 4)}
        r={2}
        fill={GOLD}
        stroke={GOLD_SHADE}
        strokeWidth={1}
      />
    ),

  crown: (level, { body, colors }) => {
    if (level === 1) {
      return (
        <path
          d={`M${CENTER - 8} ${body.top + 4.5}Q${CENTER} ${body.top + 0.5} ${CENTER + 8} ${body.top + 4.5}`}
          fill="none"
          stroke={colors.accent}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      )
    }
    const y = body.top + 2
    const half = level > 2 ? 7 : 5
    const height = level > 2 ? 8.5 : 6
    return (
      <>
        <path
          d={`M${CENTER - half} ${y}V${y - height * 0.8}L${CENTER - half / 2} ${y - height * 0.4}L${CENTER} ${y - height}L${CENTER + half / 2} ${y - height * 0.4}L${CENTER + half} ${y - height * 0.8}V${y}z`}
          fill={GOLD}
          stroke={GOLD_SHADE}
          strokeWidth={1}
          strokeLinejoin="round"
        />
        {level > 2 && <circle cx={CENTER} cy={y - 2.6} r={1.5} fill={colors.accent} />}
      </>
    )
  },

  aura: (level) =>
    [
      [53, 16, 3],
      [11, 22, 2.4],
      [54, 44, 1.8],
    ]
      .slice(0, level > 1 ? 3 : 1)
      .map(([x, y, size]) => (
        <path key={x} d={sparkle(x, y, size)} fill={GOLD} stroke={GOLD_SHADE} strokeWidth={0.6} />
      )),
}

// Draw order behind the body, over it under the face, and over the face.
const backOrder: Trait[] = [
  'aura',
  'cape',
  'wings',
  'tail',
  'ears',
  'horns',
  'antenna',
  'sprout',
  'feet',
]
const overOrder: Trait[] = ['belly', 'stripes', 'spots', 'blush']
const topOrder: Trait[] = ['brows', 'teeth', 'scarf', 'arms', 'cape', 'crown', 'aura']

function layer(
  order: Trait[],
  draws: Partial<Record<Trait, Draw>>,
  levels: Partial<Record<Trait, number>>,
  look: Look,
) {
  return order.map((trait) => {
    const level = levels[trait]
    const draw = draws[trait]
    return level && draw ? <g key={trait}>{draw(level, look)}</g> : null
  })
}

export function traitLayers(levels: Partial<Record<Trait, number>>, look: Look) {
  return {
    back: layer(backOrder, behind, levels, look),
    over: layer(overOrder, front, levels, look),
    top: layer(topOrder, front, levels, look),
  }
}
