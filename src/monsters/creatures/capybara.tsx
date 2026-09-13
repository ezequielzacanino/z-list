import { creature } from '../creature'
import {
  Blush,
  capsule,
  ClosedEye,
  drop,
  Eye,
  fan,
  Glow,
  GOLD,
  INK,
  Leaf,
  LEAF,
  line,
  paint,
  Sparkle,
  spread,
  tri,
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
            <Leaf key={angle} x={32} y={58} size={4 + lotus * 1.6} angle={angle} color={PETAL} vein={false} />
          ))}
        {[22, 44].map((x) => (
          <rect key={x} x={x - 2} y={52} width={4} height={6} rx={1.6} fill={body.shade} />
        ))}
        <path d={capsule(28, 45.5, 41, 45.5, 24.5)} {...paint(body)} />
        {[
          [38, 35.5],
          [45.5, 38],
          [31, 35],
        ]
          .slice(0, level('moss'))
          .map(([x, y]) => (
            <path key={x} d={fan(x, y, 3.4, -90, 90)} fill={LEAF.fill} />
          ))}
        <path d={capsule(21.5, 41, 22.5, 41, 22)} {...paint(body)} />
        <circle cx={28.5} cy={31} r={2} fill={body.shade} />
        <circle cx={13.8} cy={42.5} r={2.8} fill={body.shade} opacity={0.45} />
        <path d="M12.8 41.4v2M14.8 41.4v2" {...line(INK, 0.9)} />
        {zen ? <ClosedEye x={22} y={38.6} w={1.6} /> : <Eye x={22} y={38.6} r={1.4} />}
        {zen && level('eyes') > 1 && (
          <circle cx={19.5} cy={34} r={1.1} fill={accent.fill} stroke={accent.shade} strokeWidth={0.5} />
        )}
        <Blush x={18.5} y={45.5} r={1.6 + level('cheeks') * 0.4} />
        <path d="M13.5 47.4A1.6 1.6 0 0 0 16.5 47.4" {...line(INK, 0.9)} />
        {level('leaf') > 0 && <Leaf x={24} y={30.5} size={2.6 + level('leaf')} angle={25} />}
        {halo > 0 && (
          <path d={capsule(16 - halo, 23 - halo, 28 + halo, 23 - halo, 3.6)} {...line(GOLD.fill, 1.6)} />
        )}
        {towel > 0 && (
          <g>
            <rect x={17} y={26.5} width={10} height={3.4} rx={1} fill={WHITE} stroke="#b9c2cc" strokeWidth={0.7} />
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
            <rect x={3} y={waterY} width={58} height={60 - waterY} fill={WATER.fill} opacity={0.55} />
            <path d={`M3 ${waterY}${'a3.5 3.5 0 0 1 7 0'.repeat(8)}`} {...line(WATER.shade, 1)} opacity={0.6} />
          </g>
        )}
        {[
          [40, 26],
          [47, 22],
          [53, 27],
        ]
          .slice(0, level('steam'))
          .map(([x, y]) => (
            <path key={x} d={`M${x} ${y}a2 2 0 0 1 0-4a2 2 0 0 0 0-4`} {...line('#c9d6e2', 1.5)} />
          ))}
        {level('bird') > 0 && (
          <g>
            <circle cx={44} cy={31} r={2.6} fill="#ffe066" stroke="#b8942b" strokeWidth={0.7} />
            <path d={tri(41.5, 31.3, 1, 1.6, -90)} fill="#f5a142" />
            <circle cx={43} cy={30.3} r={0.5} fill={INK} />
          </g>
        )}
        {petals.slice(0, level('petals') * 2).map(([x, y]) => (
          <path key={`${x}${y}`} d={drop(x - 1.2, y + 1, 3.2, 1, 30)} fill={PETAL.fill} />
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
