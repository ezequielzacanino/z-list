import { creature } from '../creature'
import {
  Blush,
  Crown,
  Eye,
  Flower,
  GOLD,
  INK,
  Leaf,
  LEAF,
  line,
  paint,
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
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {level('lilypad') > 0 && (
          <path
            d={`M${13 - level('lilypad') * 2} 57.5A${19 + level('lilypad') * 2} 3.8 0 1 0 ${51 + level('lilypad') * 2} 57.5L32 56z`}
            {...paint(LEAF, 0.9)}
          />
        )}
        {level('lilypad') > 1 && (
          <Flower
            x={10}
            y={54}
            size={1.8}
            color={{ fill: '#ffb3c1', shade: '#b0566a', light: WHITE }}
          />
        )}
        {cape > 0 && (
          <path d={`M18 42Q${13 - cape} 58 21 58.5H43Q${51 + cape} 58 46 42z`} {...paint(CAPE)} />
        )}
        {cape > 1 && <path d="M21 58.2H43" {...line(GOLD.fill, 1.4)} />}
        {shell > 0 && (
          <ellipse cx={32} cy={46} rx={14 + shell * 1.5} ry={10 + shell} {...paint(SHELL)} />
        )}
        {shell > 2 && <path d="M18 44h3M43 44h3M19 49h3M42 49h3" {...line(SHELL.shade, 1)} />}
        {[-1, 1].map((side) => (
          <ellipse key={side} cx={32 + side * 13} cy={52} rx={5} ry={4} {...paint(body)} />
        ))}
        <path
          d="M16 50C16 38 22 34 32 34C42 34 48 38 48 50C48 56 42 57 32 57C22 57 16 56 16 50z"
          {...paint(body)}
        />
        <ellipse cx={32} cy={50.5} rx={9} ry={5.5} fill={body.light} />
        {spots.slice(0, level('spots') * 2).map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={body.shade} opacity={0.35} />
        ))}
        {[24, 40].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={57} rx={3.8} ry={1.8} {...paint(body)} />
            {level('webs') > 0 && (
              <path
                d={`M${x - 3} 57.5l-1 1.5M${x} 58.2v1.6M${x + 3} 57.5l1 1.5`}
                {...line(body.shade, 0.9)}
              />
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
          <path
            d={`M${28 - beak} 44Q32 ${47 + beak} ${36 + beak} 44Q32 42.5 ${28 - beak} 44z`}
            {...paint(GOLD, 0.9)}
          />
        ) : (
          <path d="M24 44Q32 50 40 44" {...line(INK, 1.3)} />
        )}
        {level('hair') > 0 &&
          [27, 29.5, 34.5, 37].map((x) => (
            <path key={x} d={`M${x} 34l${x < 32 ? -0.8 : 0.8} -2.4`} {...line('#3f6b3a', 1.4)} />
          ))}
        {dish > 0 && (
          <g>
            <ellipse
              cx={32}
              cy={31}
              rx={5}
              ry={1.8}
              fill="#efe7d6"
              stroke="#9b8f78"
              strokeWidth={0.8}
            />
            {dish > 1 && <ellipse cx={32} cy={30.8} rx={3.6} ry={1.1} fill={WATER.fill} />}
            {dish > 2 && <Leaf x={33} y={30.5} size={1.8} angle={50} />}
          </g>
        )}
        {level('crown') > 0 && (
          <Crown
            x={32}
            y={33}
            width={4 + level('crown') * 1.6}
            gem={level('crown') > 3 ? '#ff6b8a' : undefined}
          />
        )}
        {level('scepter') > 0 && (
          <g>
            <path d="M44 55L50 41" {...line(GOLD.shade, 2)} />
            <path d="M44 55L50 41" {...line(GOLD.fill, 1)} />
            <circle
              cx={50.5}
              cy={40}
              r={1.8 + level('scepter') * 0.6}
              fill="#8fd3ff"
              stroke="#2f6f9e"
              strokeWidth={0.7}
            />
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
            <path
              key={`${x}${y}`}
              d={`M${x} ${y - 3}q1.6 2 0 3.2q-1.6-1.2 0-3.2z`}
              {...paint(WATER, 0.6)}
            />
          ))}
        {level('sparkle') > 0 && <Sparkle x={52} y={22} size={2.4} />}
        {level('sparkle') > 1 && <Sparkle x={12} y={26} size={2} />}
        {level('sparkle') > 2 && <Sparkle x={32} y={18} size={1.6} />}
      </g>
    )
  },
)
