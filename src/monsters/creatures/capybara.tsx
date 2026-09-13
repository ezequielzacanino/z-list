import { creature } from '../creature'
import {
  Blush,
  ClosedEye,
  Eye,
  Glow,
  GOLD,
  INK,
  Leaf,
  LEAF,
  line,
  paint,
  Sparkle,
  spread,
  WATER,
  WHITE,
} from '../kit'

type Step =
  | 'cheeks'
  | 'yuzu'
  | 'water'
  | 'size'
  | 'steam'
  | 'towel'
  | 'bird'
  | 'petals'
  | 'moss'
  | 'lotus'
  | 'eyes'
  | 'fireflies'
  | 'halo'
  | 'leaf'

const YUZU = { fill: '#ffb347', shade: '#b86b12', light: '#ffe0b0' }
const PETAL = { fill: '#ffc4d0', shade: '#c2708a', light: WHITE }
const petals = [
  [12, 18],
  [54, 36],
  [7, 30],
  [57, 14],
  [48, 8],
  [16, 8],
]

// A capybara soaking in a hot spring with yuzu on its head, or meditating into a zen spirit.
export const capybara = creature<Step>(
  [
    [
      'cheeks',
      'yuzu',
      'water',
      'size',
      'steam',
      'yuzu',
      'towel',
      'water',
      'size',
      'steam',
      'bird',
      'yuzu',
      'petals',
      'water',
      'towel',
      'size',
      'steam',
      'petals',
      'petals',
    ],
    [
      'leaf',
      'moss',
      'size',
      'lotus',
      'eyes',
      'fireflies',
      'moss',
      'size',
      'lotus',
      'halo',
      'leaf',
      'fireflies',
      'moss',
      'halo',
      'size',
      'lotus',
      'eyes',
      'fireflies',
      'halo',
    ],
  ],
  (level, { body, accent }, zen) => {
    const grow = 0.86 + level('size') * 0.045
    const water = level('water')
    const towel = level('towel')
    const halo = level('halo')
    const lotus = level('lotus')
    const waterY = [0, 54, 50.5, 47][water]
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {halo > 1 && <Glow x={28} y={36} r={26} color={GOLD.light} />}
        {lotus > 0 &&
          spread(5, -70, 70).map((angle) => (
            <Leaf
              key={angle}
              x={32}
              y={58}
              size={4 + lotus * 1.6}
              angle={angle}
              color={PETAL}
              vein={false}
            />
          ))}
        {[22, 44].map((x) => (
          <rect key={x} x={x - 2} y={52} width={4} height={6} rx={1.6} fill={body.shade} />
        ))}
        <path
          d="M16 49C16 38 24 33 35 33C47 33 53 40 53 48C53 55 47 57.5 35 57.5H24C19 57.5 16 55 16 49z"
          {...paint(body)}
        />
        {[
          [38, 34.2],
          [45.5, 36.5],
          [31, 34],
        ]
          .slice(0, level('moss'))
          .map(([x, y]) => (
            <ellipse key={x} cx={x} cy={y} rx={3.4} ry={2} fill={LEAF.fill} />
          ))}
        <path
          d="M10 44C10 35 16 30 24 30C31 30 34 35 34 42C34 49 30 52 22 52C15 52 10 50 10 44z"
          {...paint(body)}
        />
        <ellipse cx={28.5} cy={30.8} rx={2.2} ry={1.5} fill={body.shade} />
        <ellipse cx={12.5} cy={42.5} rx={2.8} ry={3.6} fill={body.shade} opacity={0.45} />
        <path d="M11.4 41.4v2M13.4 41.4v2" {...line(INK, 0.9)} />
        {zen ? <ClosedEye x={22} y={38.6} w={1.6} /> : <Eye x={22} y={38.6} r={1.4} />}
        {zen && level('eyes') > 1 && (
          <circle
            cx={19.5}
            cy={34}
            r={1.1}
            fill={accent.fill}
            stroke={accent.shade}
            strokeWidth={0.5}
          />
        )}
        <Blush x={18.5} y={45.5} r={1.6 + level('cheeks') * 0.4} />
        <path d="M13 47.5Q15 48.6 17 47.5" {...line(INK, 0.9)} />
        {level('leaf') > 0 && <Leaf x={24} y={30.5} size={2.6 + level('leaf')} angle={25} />}
        {halo > 0 && (
          <ellipse cx={22} cy={23 - halo} rx={6 + halo} ry={1.8} {...line(GOLD.fill, 1.6)} />
        )}
        {towel > 0 && (
          <g>
            <rect
              x={17}
              y={26.5}
              width={10}
              height={3.4}
              rx={1}
              fill={WHITE}
              stroke="#b9c2cc"
              strokeWidth={0.7}
            />
            {towel > 1 && <path d="M19.5 26.5v3.4M24.5 26.5v3.4" {...line('#ff9fb3', 1)} />}
          </g>
        )}
        {[
          [22, 27.5],
          [23.5, 22.5],
          [21.5, 17.5],
        ]
          .slice(0, level('yuzu'))
          .map(([x, y]) => (
            <g key={y}>
              <circle cx={x} cy={y - (towel ? 2.8 : 0)} r={2.6} {...paint(YUZU, 0.8)} />
              <path d={`M${x} ${y - 2.6 - (towel ? 2.8 : 0)}l1 -1`} {...line(LEAF.shade, 0.8)} />
            </g>
          ))}
        {water > 0 && (
          <g>
            <rect
              x={3}
              y={waterY}
              width={58}
              height={60 - waterY}
              fill={WATER.fill}
              opacity={0.55}
            />
            <path
              d={`M3 ${waterY}q3.5-2 7 0t7 0t7 0t7 0t7 0t7 0t7 0t7 0`}
              {...line(WATER.shade, 1)}
              opacity={0.6}
            />
          </g>
        )}
        {[
          [40, 26],
          [47, 22],
          [53, 27],
        ]
          .slice(0, level('steam'))
          .map(([x, y]) => (
            <path key={x} d={`M${x} ${y}q-2-2 0-4q2-2 0-4`} {...line('#c9d6e2', 1.5)} />
          ))}
        {level('bird') > 0 && (
          <g>
            <circle cx={44} cy={31} r={2.6} fill="#ffe066" stroke="#b8942b" strokeWidth={0.7} />
            <path d="M41.4 31.2l-1.6 .4l1.6 .6z" fill="#f5a142" />
            <circle cx={43} cy={30.3} r={0.5} fill={INK} />
          </g>
        )}
        {petals.slice(0, level('petals') * 2).map(([x, y]) => (
          <ellipse
            key={`${x}${y}`}
            cx={x}
            cy={y}
            rx={1.6}
            ry={1}
            transform={`rotate(30 ${x} ${y})`}
            fill={PETAL.fill}
          />
        ))}
        {[
          [9, 22],
          [55, 30],
          [48, 12],
        ]
          .slice(0, level('fireflies'))
          .map(([x, y]) => (
            <g key={x}>
              <circle cx={x} cy={y} r={2.8} fill="#e6ff9a" opacity={0.4} />
              <circle cx={x} cy={y} r={1} fill="#f4ffb0" />
            </g>
          ))}
        {halo > 2 && <Sparkle x={34} y={16} size={2} />}
      </g>
    )
  },
)
