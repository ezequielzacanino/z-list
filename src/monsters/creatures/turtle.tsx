import { creature } from '../creature'
import {
  Blush,
  Cloud,
  Eye,
  Glow,
  GOLD,
  INK,
  LEAF,
  line,
  paint,
  smooth,
  Sparkle,
  spread,
  tone,
  Tube,
  WOOD,
  type Point,
} from '../kit'

type Step =
  | 'shell'
  | 'moss'
  | 'size'
  | 'tree'
  | 'flowers'
  | 'house'
  | 'bird'
  | 'runes'
  | 'snake'
  | 'mist'
  | 'eyes'

// Serpent tail of Genbu, from the back of the shell outwards.
const serpentTail: Point[] = [
  [49, 50],
  [56, 46],
  [58, 38],
  [54, 31],
  [47, 29],
  [42, 31],
]

const runes = ['M28 44l2-3l2 3', 'M36 41h4', 'M32 49v-4', 'M40 47l2.5-2.5', 'M23 47h3']

// A turtle hatchling that grows a whole island on its shell, or becomes Genbu with its serpent.
export const turtle = creature<Step>(
  [
    [
      'shell',
      'moss',
      'size',
      'tree',
      'shell',
      'moss',
      'tree',
      'flowers',
      'size',
      'tree',
      'house',
      'moss',
      'flowers',
      'shell',
      'tree',
      'size',
      'house',
      'flowers',
      'bird',
    ],
    [
      'shell',
      'snake',
      'size',
      'runes',
      'snake',
      'shell',
      'mist',
      'snake',
      'runes',
      'size',
      'snake',
      'eyes',
      'shell',
      'mist',
      'runes',
      'snake',
      'size',
      'eyes',
      'mist',
    ],
  ],
  (level, { body, accent, accentHue }, genbu) => {
    const grow = 0.88 + level('size') * 0.04
    const shellTone = genbu ? tone(accentHue, 35, 42) : accent
    const shell = level('shell')
    const snake = level('snake')
    const tree = level('tree')
    const mist = level('mist')
    const eyes = level('eyes')
    const trunkTop = 31 - (tree > 1 ? 4 + tree * 3 : 0)
    const serpent = tone(150, 40, 60)
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {mist > 2 && <Glow x={32} y={40} r={27} color="#9fe8d8" />}
        {genbu && snake > 0 && (
          <>
            <Tube
              d={smooth(serpentTail.slice(0, Math.min(snake, 4) + 2))}
              color={serpent}
              width={3.8}
            />
            {snake > 4 && (
              <>
                <circle cx={42} cy={31} r={3.4} {...paint(serpent)} />
                <Eye x={41} y={30.4} r={1} glow={eyes > 1 ? '#9fe8ff' : undefined} />
              </>
            )}
          </>
        )}
        {[22, 44].map((x) => (
          <ellipse key={x} cx={x} cy={55} rx={4.2} ry={3} {...paint(body)} />
        ))}
        <Tube d="M21 50Q17 49 14 46" color={body} width={5} />
        <circle cx={12.5} cy={45} r={5.5} {...paint(body)} />
        <Eye x={11.5} y={44.2} r={1.4} glow={genbu && eyes > 0 ? '#9fe8ff' : undefined} />
        <Blush x={14.8} y={47.2} r={1.2} />
        <path d="M9.4 47.6Q10.6 48.6 11.8 47.7" {...line(INK, 1)} />
        <path d="M15 52Q16 31 33 30.5Q50 31 51 52z" {...paint(shellTone)} />
        <path d="M13.5 52.5H52.5" {...line(shellTone.shade, 3)} />
        <path d="M14.5 52.5H51.5" {...line(shellTone.light, 1.3)} />
        {shell > 0 && (
          <path d="M23 51Q24 40 33 38Q42 40 43 51" {...line(shellTone.shade, 1)} opacity={0.55} />
        )}
        {shell > 1 && (
          <path
            d="M33 30.5V38M19 43.5L24.5 42M47 43.5L41.5 42"
            {...line(shellTone.shade, 1)}
            opacity={0.55}
          />
        )}
        {shell > 2 &&
          spread(6, 17, 49).map((x) => (
            <circle key={x} cx={x} cy={52.5} r={0.9} fill={GOLD.fill} />
          ))}
        {genbu &&
          runes
            .slice(0, level('runes') + 1)
            .map((d) => (level('runes') ? <path key={d} d={d} {...line(GOLD.fill, 1.2)} /> : null))}
        {!genbu && (
          <>
            {[
              [27, 33],
              [39, 33],
              [33, 31],
              [21.5, 39],
              [44.5, 39],
              [33, 34],
            ]
              .slice(0, level('moss') * 2)
              .map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r={3} fill={LEAF.fill} />
              ))}
            {tree === 1 && <path d="M33 31V26" {...line(LEAF.shade, 1.3)} />}
            {tree > 1 && <Tube d={`M33 32V${trunkTop}`} color={WOOD} width={2.2} />}
            {tree > 1 && (
              <circle cx={33} cy={trunkTop - 1} r={3 + tree * 1.3} {...paint(LEAF, 1)} />
            )}
            {tree > 3 &&
              [-1, 1].map((side) => (
                <circle
                  key={side}
                  cx={33 + side * 6}
                  cy={trunkTop + 2}
                  r={4.5}
                  {...paint(LEAF, 1)}
                />
              ))}
            {[
              [26, 33, '#ff9fb3'],
              [40, 33.5, '#ffd166'],
              [30, trunkTop - 3, '#ff9fb3'],
              [36, trunkTop, '#ffd166'],
              [22, 38.5, '#ffd166'],
              [45, 38.5, '#ff9fb3'],
            ]
              .slice(0, level('flowers') * 2)
              .map(([x, y, color]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r={1.1} fill={color as string} />
              ))}
            {level('house') > 0 && (
              <>
                <rect
                  x={40}
                  y={25.5}
                  width={7}
                  height={6}
                  fill="#f3e2c7"
                  stroke={WOOD.shade}
                  strokeWidth={0.8}
                />
                <path
                  d="M39 26L43.5 21.5L48 26z"
                  fill="#e07a5f"
                  stroke="#8c3b2a"
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
              </>
            )}
            {level('house') > 1 && (
              <>
                <rect x={42.6} y={28} width={2} height={3.5} fill={WOOD.fill} />
                <circle cx={46.5} cy={19} r={1.2} fill="#d9dde2" />
                <circle cx={48} cy={16.5} r={1.5} fill="#e8ebee" />
              </>
            )}
            {level('bird') > 0 && (
              <>
                <circle
                  cx={37}
                  cy={trunkTop - 6}
                  r={1.8}
                  fill="#8fc7ff"
                  stroke="#2f6f9e"
                  strokeWidth={0.6}
                />
                <path d={`M38.6 ${trunkTop - 6}l1.2 .3l-1.2 .4z`} fill={GOLD.fill} />
                <Sparkle x={52} y={14} size={2.2} />
              </>
            )}
          </>
        )}
        {mist > 0 && <Cloud x={10} y={57} width={9 + mist * 3} />}
        {mist > 1 && <Cloud x={54} y={57.5} width={12} />}
      </g>
    )
  },
)
