import { creature } from '../creature'
import { Blush, Eye, Flower, Glow, LEAF, line, paint, Smile, Sparkle, tone, WHITE } from '../kit'

type Step =
  | 'moss'
  | 'arms'
  | 'size'
  | 'crystals'
  | 'flowers'
  | 'runes'
  | 'mushroom'
  | 'cracks'
  | 'embers'
  | 'crown'
  | 'smoke'

const OBSIDIAN = tone(260, 15, 22)
const EMBER = { fill: '#ffb36b', shade: '#a4481c', light: '#ffe0b8' }
const crystals = [
  [25, 31, -20],
  [39, 31, 20],
  [32, 29, 0],
  [45, 33, 40],
]
const cracks = ['M22 42l3 3l-2 3l3 3', 'M41 38l-3 4l2 2l-2 4', 'M30 50l2-3l3 1', 'M34 34l-2 3l2 2']
const mosses = [
  [26, 31.5, 4],
  [38, 31.5, 4],
  [19, 38, 3],
  [45, 38, 3],
]

// A pebble that stacks into a mossy crystal golem, or a lava golem crowned in obsidian.
export const golem = creature<Step>(
  [
    [
      'moss',
      'arms',
      'size',
      'crystals',
      'moss',
      'size',
      'flowers',
      'crystals',
      'arms',
      'runes',
      'size',
      'crystals',
      'moss',
      'flowers',
      'mushroom',
      'size',
      'runes',
      'crystals',
      'flowers',
    ],
    [
      'cracks',
      'arms',
      'size',
      'cracks',
      'embers',
      'size',
      'smoke',
      'cracks',
      'arms',
      'crown',
      'size',
      'embers',
      'cracks',
      'crown',
      'smoke',
      'size',
      'embers',
      'crown',
      'smoke',
    ],
  ],
  (level, { body, accent }, lava) => {
    const stone = lava ? tone(15, 12, 34) : body
    const size = level('size')
    const grow = 0.8 + size * 0.06
    const arms = level('arms')
    const cracksLevel = level('cracks')
    const runes = level('runes')
    const glow = lava
      ? cracksLevel > 1
        ? EMBER.fill
        : undefined
      : runes > 1
        ? accent.fill
        : undefined
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {(runes > 1 || cracksLevel > 3) && (
          <Glow x={32} y={40} r={27} color={lava ? EMBER.fill : accent.light} />
        )}
        {[
          [44, 20, 2.2],
          [48, 14, 2.8],
          [43, 8, 3.2],
        ]
          .slice(0, level('smoke'))
          .map(([x, y, r]) => (
            <circle key={y} cx={x} cy={y} r={r} fill="#aeb5bd" opacity={0.7} />
          ))}
        {size > 2 && <circle cx={32} cy={24} r={5} {...paint(stone, 1.5)} />}
        {arms > 0 &&
          [-1, 1].map((side) => (
            <rect
              key={side}
              x={32 + side * 16 - (arms > 1 ? 4.2 : 3.5)}
              y={38}
              width={arms > 1 ? 8.4 : 7}
              height={arms > 1 ? 15 : 11}
              rx={3}
              transform={`rotate(${side * -12} ${32 + side * 16} 40)`}
              {...paint(stone, 1.5)}
            />
          ))}
        {[24, 40].map((x) => (
          <ellipse key={x} cx={x} cy={56.5} rx={5} ry={2.8} {...paint(stone, 1.5)} />
        ))}
        {size > 1 &&
          [-1, 1].map((side) => (
            <circle
              key={side}
              cx={32 + side * 14}
              cy={35}
              r={size > 3 ? 5.5 : 4.5}
              {...paint(stone, 1.5)}
            />
          ))}
        <path d="M19 56L16 44L21 33L32 29.5L43 33L48 44L45 56z" {...paint(stone, 1.6)} />
        <path d="M21 33L28 40L43 33M28 40L26 56" {...line(stone.shade, 0.8)} opacity={0.35} />
        {!lava &&
          mosses
            .slice(0, level('moss') + (level('moss') > 2 ? 1 : 0))
            .map(([x, y, r]) => (
              <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.55} fill={LEAF.fill} />
            ))}
        {!lava &&
          mosses
            .slice(0, level('flowers'))
            .map(([x, y]) => (
              <Flower
                key={x}
                x={x}
                y={y - 1}
                size={1.1}
                color={{ fill: '#ffb3c1', shade: '#b0566a', light: WHITE }}
              />
            ))}
        {!lava && level('mushroom') > 0 && (
          <g>
            <rect x={44.4} y={27} width={1.4} height={3} fill="#f3ead8" />
            <path
              d="M42.5 27.5Q45 23.5 47.7 27.5z"
              fill="#e85d5d"
              stroke="#8c2f25"
              strokeWidth={0.5}
            />
          </g>
        )}
        {crystals.slice(0, level('crystals')).map(([x, y, angle]) => (
          <path
            key={x}
            d={`M${x - 1.8} ${y + 1}L${x} ${y - 5}L${x + 1.8} ${y + 1}z`}
            transform={`rotate(${angle} ${x} ${y})`}
            {...paint(accent, 0.8)}
          />
        ))}
        {runes > 0 && <path d="M30 47l2-2.5l2 2.5M29 51h6" {...line(accent.fill, 1.3)} />}
        {cracks.slice(0, cracksLevel).map((d) => (
          <g key={d}>
            <path d={d} {...line('#ff7a3d', 1.6)} />
            <path d={d} {...line('#ffd166', 0.6)} />
          </g>
        ))}
        {lava &&
          [
            [32, 30],
            [24, 32.5],
            [40, 32.5],
            [18, 36],
            [46, 36],
          ]
            .slice(0, level('crown') * 2 - 1)
            .map(([x, y]) => (
              <path
                key={x}
                d={`M${x - 1.8} ${y + 1}L${x} ${y - 4 - level('crown')}L${x + 1.8} ${y + 1}z`}
                {...paint(OBSIDIAN, 0.8)}
              />
            ))}
        <Eye x={27.5} y={41} r={1.7} glow={glow} />
        <Eye x={36.5} y={41} r={1.7} glow={glow} />
        <Smile x={32} y={45} w={1.6} />
        <Blush x={24.5} y={44.5} r={1.5} />
        <Blush x={39.5} y={44.5} r={1.5} />
        {level('embers') > 0 && <Sparkle x={10} y={26} size={1.8} color={EMBER} />}
        {level('embers') > 1 && <Sparkle x={55} y={44} size={1.6} color={EMBER} />}
        {level('embers') > 2 && <Sparkle x={14} y={12} size={2.2} color={EMBER} />}
        {level('flowers') > 2 && <Sparkle x={54} y={22} size={2} />}
      </g>
    )
  },
)
