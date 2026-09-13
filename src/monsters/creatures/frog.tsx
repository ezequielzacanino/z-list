import { creature } from '../creature'
import {
  Blush,
  capsule,
  Crown,
  drop,
  Eye,
  fan,
  Flower,
  GOLD,
  INK,
  Leaf,
  LEAF,
  line,
  paint,
  poly,
  Sparkle,
  tone,
  WATER,
  WHITE,
} from '../kit'

type Step =
  | 'spots'
  | 'lilypad'
  | 'size'
  | 'crown'
  | 'cape'
  | 'scepter'
  | 'sparkle'
  | 'dish'
  | 'beak'
  | 'shell'
  | 'hair'
  | 'webs'
  | 'cucumber'
  | 'splash'

const CAPE = tone(355, 60, 58)
const SHELL = tone(80, 30, 45)
const spots = [
  [22, 45, 1.3],
  [43, 46, 1.1],
  [37, 52.5, 1],
  [26, 51.5, 0.9],
]

// A froglet crowned into a frog prince, or a kappa balancing the water dish on its head.
export const frog = creature<Step>(
  [
    [
      'spots',
      'lilypad',
      'size',
      'crown',
      'spots',
      'cape',
      'crown',
      'size',
      'scepter',
      'lilypad',
      'cape',
      'crown',
      'sparkle',
      'size',
      'scepter',
      'cape',
      'crown',
      'sparkle',
      'sparkle',
    ],
    [
      'dish',
      'beak',
      'shell',
      'hair',
      'size',
      'dish',
      'webs',
      'shell',
      'cucumber',
      'size',
      'splash',
      'dish',
      'beak',
      'shell',
      'cucumber',
      'splash',
      'size',
      'webs',
      'splash',
    ],
  ],
  (level, { body }, kappa) => {
    const grow = 0.88 + level('size') * 0.04
    const cape = level('cape')
    const shell = level('shell')
    const dish = level('dish')
    const beak = level('beak')
    const lilypad = level('lilypad')
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {lilypad > 0 && <path d={capsule(13 - lilypad * 2, 57, 51 + lilypad * 2, 57, 3.6)} {...paint(LEAF, 0.9)} />}
        {lilypad > 1 && <Flower x={10} y={54} size={1.8} color={{ fill: '#ffb3c1', shade: '#b0566a', light: WHITE }} />}
        {cape > 0 && <path d={poly([[18, 42], [13 - cape, 58.5], [51 + cape, 58.5], [46, 42]])} {...paint(CAPE)} />}
        {cape > 1 && <path d="M15 58.2H49" {...line(GOLD.fill, 1.4)} />}
        {shell > 0 && <path d={fan(32, 55, 15 + shell * 1.5, -90, 90)} {...paint(SHELL)} />}
        {shell > 2 && <path d="M17 50h3M44 50h3M19 45h3M42 45h3" {...line(SHELL.shade, 1)} />}
        {[-1, 1].map((side) => (
          <circle key={side} cx={32 + side * 13} cy={52.5} r={4.5} {...paint(body)} />
        ))}
        <path d="M16 57V50A16 16 0 0 1 48 50V57z" {...paint(body)} />
        <path d={capsule(26, 51.5, 38, 51.5, 9)} fill={body.light} />
        {spots.slice(0, level('spots') * 2).map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={body.shade} opacity={0.35} />
        ))}
        {[24, 40].map((x) => (
          <g key={x}>
            <path d={fan(x, 58, 3.8, -90, 90)} {...paint(body)} />
            {level('webs') > 0 && (
              <path d={`M${x - 3} 57.5l-1 1.5M${x} 58.2v1.6M${x + 3} 57.5l1 1.5`} {...line(body.shade, 0.9)} />
            )}
          </g>
        ))}
        {[24, 40].map((x) => (
          <circle key={x} cx={x} cy={34} r={5.5} {...paint(body)} />
        ))}
        <Eye x={24} y={34.5} r={2.3} />
        <Eye x={40} y={34.5} r={2.3} />
        <Blush x={19.5} y={43} />
        <Blush x={44.5} y={43} />
        {kappa && beak > 0 ? (
          <path d={poly([[28 - beak, 44], [32, 42.5], [36 + beak, 44], [32, 47 + beak]])} {...paint(GOLD, 0.9)} />
        ) : (
          <path d="M24 44A11 11 0 0 0 40 44" {...line(INK, 1.3)} />
        )}
        {level('hair') > 0 &&
          [27, 29.5, 34.5, 37].map((x) => (
            <path key={x} d={`M${x} 34l${x < 32 ? -0.8 : 0.8} -2.4`} {...line('#3f6b3a', 1.4)} />
          ))}
        {dish > 0 && (
          <g>
            <path d={capsule(27, 31, 37, 31, 3.4)} fill="#efe7d6" stroke="#9b8f78" strokeWidth={0.8} />
            {dish > 1 && <path d={capsule(28.8, 30.8, 35.2, 30.8, 1.8)} fill={WATER.fill} />}
            {dish > 2 && <Leaf x={33} y={30.5} size={1.8} angle={50} />}
          </g>
        )}
        {level('crown') > 0 && (
          <Crown x={32} y={33} width={4 + level('crown') * 1.6} gem={level('crown') > 3 ? '#ff6b8a' : undefined} />
        )}
        {level('scepter') > 0 && (
          <g>
            <path d={capsule(44, 55, 50, 41, 1.8)} {...paint(GOLD, 0.7)} />
            <circle cx={50.5} cy={40} r={1.8 + level('scepter') * 0.6} fill="#8fd3ff" stroke="#2f6f9e" strokeWidth={0.7} />
          </g>
        )}
        {level('cucumber') > 0 && (
          <g transform="rotate(-20 47 50)">
            <rect
              x={45}
              y={44 - level('cucumber') * 3}
              width={4.2}
              height={9 + level('cucumber') * 3}
              rx={2.1}
              fill="hsl(110 45% 45%)"
              stroke="hsl(110 40% 25%)"
              strokeWidth={0.8}
            />
            <circle cx={47} cy={46} r={0.5} fill="hsl(110 50% 75%)" />
          </g>
        )}
        {[
          [10, 46],
          [54, 42],
          [14, 36],
          [51, 32],
          [8, 54],
          [57, 52],
        ]
          .slice(0, level('splash') * 2)
          .map(([x, y]) => (
            <path key={`${x}${y}`} d={drop(x, y - 3.2, 3.2, 1.2, 180)} {...paint(WATER, 0.6)} />
          ))}
        {level('sparkle') > 0 && <Sparkle x={52} y={22} size={2.4} />}
        {level('sparkle') > 1 && <Sparkle x={12} y={26} size={2} />}
        {level('sparkle') > 2 && <Sparkle x={32} y={18} size={1.6} />}
      </g>
    )
  },
)
