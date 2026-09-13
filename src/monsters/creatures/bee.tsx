import { creature } from '../creature'
import {
  Blush,
  Crown,
  Eye,
  Flower,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  polar,
  Smile,
  Sparkle,
  spread,
  Star,
  WHITE,
} from '../kit'

type Step =
  | 'stripes'
  | 'antennae'
  | 'wings'
  | 'honey'
  | 'size'
  | 'crown'
  | 'wand'
  | 'rays'
  | 'flowers'
  | 'halo'

const STRIPE = '#4a3b2f'
const HONEY = { fill: '#f0a830', shade: '#8f5a12', light: '#ffd98a' }
const WING = { fill: '#e6f4ff', shade: '#7fa3bd', light: WHITE }
const flowers = [
  [10, 54],
  [54, 55],
  [9, 20],
]

// A bumblebee crowned queen of the hive, or a sun bee that shines with rays.
export const bee = creature<Step>(
  [
    [
      'stripes',
      'antennae',
      'wings',
      'honey',
      'stripes',
      'size',
      'wings',
      'crown',
      'antennae',
      'honey',
      'size',
      'wand',
      'crown',
      'stripes',
      'wings',
      'honey',
      'size',
      'crown',
      'wand',
    ],
    [
      'stripes',
      'antennae',
      'wings',
      'flowers',
      'stripes',
      'size',
      'rays',
      'wings',
      'antennae',
      'flowers',
      'rays',
      'size',
      'stripes',
      'wings',
      'rays',
      'flowers',
      'size',
      'halo',
      'rays',
    ],
  ],
  (level, { body, accent }) => {
    const grow = 0.86 + level('size') * 0.045
    const wings = level('wings')
    const rays = level('rays')
    const antennae = level('antennae')
    const honey = level('honey')
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {rays > 2 && <Glow x={32} y={32} r={22} color={GOLD.fill} />}
        {rays > 0 &&
          spread(6 + rays * 2, 0, 360 - 360 / (6 + rays * 2)).map((angle) => {
            const [x1, y1] = polar(32, 30, angle, 11)
            const [x2, y2] = polar(32, 30, angle, 13 + rays * 1.5)
            return <path key={angle} d={`M${x1} ${y1}L${x2} ${y2}`} {...line(GOLD.fill, 1.6)} />
          })}
        {level('halo') > 0 && <ellipse cx={32} cy={19} rx={7} ry={1.8} {...line(GOLD.fill, 1.8)} />}
        {wings > 0 &&
          [-1, 1].map((side) => (
            <g key={side}>
              <ellipse
                cx={32 + side * 9}
                cy={35}
                rx={3.5 + wings * 1.4}
                ry={5.5 + wings * 1.6}
                transform={`rotate(${side * 28} ${32 + side * 9} 35)`}
                {...paint(WING, 0.8)}
                opacity={0.9}
              />
              {wings > 2 && (
                <ellipse
                  cx={32 + side * 12}
                  cy={42}
                  rx={3}
                  ry={4.5}
                  transform={`rotate(${side * 60} ${32 + side * 12} 42)`}
                  {...paint(WING, 0.8)}
                  opacity={0.9}
                />
              )}
            </g>
          ))}
        <path d="M30.5 54.5L32 58.5L33.5 54.5z" fill={INK} />
        <ellipse cx={32} cy={45} rx={11} ry={10} {...paint(body)} />
        {Array.from({ length: level('stripes') }, (_, index) => {
          const y = 42 + index * 4.5
          const half = 11 * Math.sqrt(1 - ((y - 45) / 10) ** 2) - 1.2
          return (
            <path
              key={y}
              d={`M${32 - half} ${y}Q32 ${y + 2} ${32 + half} ${y}`}
              {...line(STRIPE, 2.6)}
            />
          )
        })}
        {[-1, 1].map((side) => (
          <ellipse key={side} cx={32 + side * 10.5} cy={45} rx={2} ry={2.8} {...paint(body)} />
        ))}
        {honey > 0 && <path d="M38 50q1.5 2.5 0 4q-1.5-1.5 0-4z" {...paint(HONEY, 0.6)} />}
        {honey > 1 && (
          <g>
            <path d="M43 47H51L50 55Q47 57 44 55z" {...paint(HONEY, 0.8)} />
            <rect x={42.5} y={45.5} width={9} height={2.2} rx={1} fill={HONEY.shade} />
          </g>
        )}
        {honey > 2 && <path d="M45 47.5q-.8 3 .6 4" {...line(HONEY.fill, 1.4)} />}
        {level('wand') > 0 && (
          <g>
            <path d="M21 52L15 40" {...line(GOLD.shade, 1.8)} />
            <Star x={14.5} y={38.5} size={2 + level('wand') * 0.6} />
          </g>
        )}
        {antennae > 0 &&
          [-1, 1].map((side) => (
            <g key={side}>
              <path
                d={`M${32 + side * 2.5} 23.5q${side * 1} -3 ${side * (2.5 + antennae)} ${-2.5 - antennae * 1.5}`}
                {...line(STRIPE, 1.1)}
              />
              <circle
                cx={32 + side * (5 + antennae)}
                cy={21 - antennae * 1.5}
                r={1 + antennae * 0.3}
                fill={accent.fill}
                stroke={STRIPE}
                strokeWidth={0.5}
              />
            </g>
          ))}
        <circle cx={32} cy={30} r={8} {...paint(body)} />
        <Eye x={28.8} y={30} r={1.7} />
        <Eye x={35.2} y={30} r={1.7} />
        <Blush x={26.3} y={33} r={1.4} />
        <Blush x={37.7} y={33} r={1.4} />
        <Smile x={32} y={33.5} w={1.4} />
        {level('crown') > 0 && (
          <Crown
            x={32}
            y={23}
            width={4 + level('crown') * 1.6}
            gem={level('crown') > 2 ? accent.fill : undefined}
          />
        )}
        {flowers.slice(0, level('flowers')).map(([x, y]) => (
          <Flower key={x} x={x} y={y} size={1.8} color={accent} />
        ))}
        {(level('crown') > 2 || rays > 3) && <Sparkle x={52} y={16} size={2.2} />}
      </g>
    )
  },
)
