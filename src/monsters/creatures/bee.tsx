import { creature } from '../creature'
import {
  Blush,
  capsule,
  Crown,
  drop,
  Eye,
  Flower,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  polar,
  poly,
  Smile,
  Sparkle,
  spread,
  Star,
  tri,
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
          spread(6 + rays * 2, 0, 360 - 360 / (6 + rays * 2)).map((angle) => (
            <path key={angle} d={tri(...polar(32, 30, angle, 11), 2.6, 2 + rays * 1.5, angle)} fill={GOLD.fill} />
          ))}
        {level('halo') > 0 && <path d={capsule(25, 19, 39, 19, 3.6)} {...line(GOLD.fill, 1.8)} />}
        {wings > 0 &&
          [-1, 1].map((side) => (
            <g key={side} opacity={0.9}>
              <path d={drop(32 + side * 5, 39, 9 + wings * 3, 3 + wings * 1.3, side * 40)} {...paint(WING, 0.8)} />
              {wings > 2 && <path d={drop(32 + side * 8, 44, 8, 2.8, side * 100)} {...paint(WING, 0.8)} />}
            </g>
          ))}
        <path d={tri(32, 54.5, 3, 4, 180)} fill={INK} />
        <circle cx={32} cy={45} r={10.5} {...paint(body)} />
        {Array.from({ length: level('stripes') }, (_, index) => {
          const y = 42 + index * 4.5
          const half = Math.sqrt(10.5 ** 2 - (y - 45) ** 2) - 1.6
          return <path key={y} d={capsule(32 - half + 1.3, y, 32 + half - 1.3, y, 2.6)} fill={STRIPE} />
        })}
        {[-1, 1].map((side) => (
          <circle key={side} cx={32 + side * 10.5} cy={45} r={2.4} {...paint(body)} />
        ))}
        {honey > 0 && <path d={drop(38, 50, 4.2, 1.4, 180)} {...paint(HONEY, 0.6)} />}
        {honey > 1 && (
          <g>
            <path d={poly([[43, 47], [51, 47], [50, 55], [44, 55]])} {...paint(HONEY, 0.8)} />
            <path d={capsule(43.3, 46.6, 50.7, 46.6, 2.2)} fill={HONEY.shade} />
          </g>
        )}
        {honey > 2 && <path d="M45 47.5v4" {...line(HONEY.fill, 1.4)} />}
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
                d={`M${32 + side * 2.5} 23.5L${32 + side * (5 + antennae)} ${21 - antennae * 1.5}`}
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
        <Smile x={32} y={33.3} w={1.4} />
        {level('crown') > 0 && (
          <Crown x={32} y={23} width={4 + level('crown') * 1.6} gem={level('crown') > 2 ? accent.fill : undefined} />
        )}
        {flowers.slice(0, level('flowers')).map(([x, y]) => (
          <Flower key={x} x={x} y={y} size={1.8} color={accent} />
        ))}
        {(level('crown') > 2 || rays > 3) && <Sparkle x={52} y={16} size={2.2} />}
      </g>
    )
  },
)
