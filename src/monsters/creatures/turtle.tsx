import { creature } from '../creature'
import {
  beads,
  Blush,
  capsule,
  Cloud,
  Eye,
  fan,
  Glow,
  GOLD,
  INK,
  LEAF,
  line,
  paint,
  Sparkle,
  spread,
  tone,
  tri,
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
    const trunkTop = 34 - (tree > 1 ? 4 + tree * 3 : 0)
    const serpent = tone(150, 40, 60)
    const tail = serpentTail.slice(0, Math.min(snake, 4) + 2)
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {mist > 2 && <Glow x={32} y={40} r={27} color="#9fe8d8" />}
        {genbu && snake > 0 && (
          <>
            {beads(tail, tail.length * 2).map(([x, y], index) => (
              <circle key={index} cx={x} cy={y} r={2.4} {...paint(serpent)} />
            ))}
            {snake > 4 && (
              <>
                <circle cx={42} cy={31} r={3.4} {...paint(serpent)} />
                <Eye x={41} y={30.4} r={1} glow={eyes > 1 ? '#9fe8ff' : undefined} />
              </>
            )}
          </>
        )}
        {[22, 44].map((x) => (
          <path key={x} d={fan(x, 58, 4.4, -90, 90)} {...paint(body)} />
        ))}
        <path d={capsule(21, 50, 14, 46, 5)} {...paint(body)} />
        <circle cx={12.5} cy={45} r={5.5} {...paint(body)} />
        <Eye x={11.5} y={44.2} r={1.4} glow={genbu && eyes > 0 ? '#9fe8ff' : undefined} />
        <Blush x={14.8} y={47.2} r={1.2} />
        <path d="M9.4 47.4A1.4 1.4 0 0 0 11.8 47.4" {...line(INK, 1)} />
        <path d={fan(33, 52, 18.5, -90, 90)} {...paint(shellTone)} />
        <path d={capsule(14, 52.5, 52, 52.5, 3.4)} {...paint({ ...shellTone, fill: shellTone.light })} />
        {shell > 0 && <path d={fan(33, 51, 10, -90, 90)} {...line(shellTone.shade, 1)} opacity={0.55} />}
        {shell > 1 && (
          <path d="M33 33.5V41M17 43.5L24 45M49 43.5L42 45" {...line(shellTone.shade, 1)} opacity={0.55} />
        )}
        {shell > 2 && spread(6, 17, 49).map((x) => <circle key={x} cx={x} cy={52.5} r={0.9} fill={GOLD.fill} />)}
        {genbu &&
          runes
            .slice(0, level('runes') + 1)
            .map((d) => (level('runes') ? <path key={d} d={d} {...line(GOLD.fill, 1.2)} /> : null))}
        {!genbu && (
          <>
            {[
              [27, 36],
              [39, 36],
              [33, 34],
              [21.5, 41],
              [44.5, 41],
              [33, 37],
            ]
              .slice(0, level('moss') * 2)
              .map(([x, y]) => (
                <path key={`${x}${y}`} d={fan(x, y + 1, 3, -90, 90)} fill={LEAF.fill} />
              ))}
            {tree === 1 && <path d="M33 34V29" {...line(LEAF.shade, 1.3)} />}
            {tree > 1 && <path d={capsule(33, 35, 33, trunkTop, 2.8)} {...paint(WOOD, 1)} />}
            {tree > 1 && <circle cx={33} cy={trunkTop - 1} r={3 + tree * 1.3} {...paint(LEAF, 1)} />}
            {tree > 3 &&
              [-1, 1].map((side) => (
                <circle key={side} cx={33 + side * 6} cy={trunkTop + 2} r={4.5} {...paint(LEAF, 1)} />
              ))}
            {[
              [26, 35, '#ff9fb3'],
              [40, 35.5, '#ffd166'],
              [30, trunkTop - 3, '#ff9fb3'],
              [36, trunkTop, '#ffd166'],
              [22, 40.5, '#ffd166'],
              [45, 40.5, '#ff9fb3'],
            ]
              .slice(0, level('flowers') * 2)
              .map(([x, y, color]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r={1.1} fill={color as string} />
              ))}
            {level('house') > 0 && (
              <>
                <rect x={40} y={31} width={7} height={6} fill="#f3e2c7" stroke={WOOD.shade} strokeWidth={0.8} />
                <path d={tri(43.5, 31, 9, 4.5)} fill="#e07a5f" stroke="#8c3b2a" strokeWidth={0.8} strokeLinejoin="round" />
              </>
            )}
            {level('house') > 1 && (
              <>
                <rect x={42.6} y={33.5} width={2} height={3.5} fill={WOOD.fill} />
                <circle cx={46.5} cy={24.5} r={1.2} fill="#d9dde2" />
                <circle cx={48} cy={22} r={1.5} fill="#e8ebee" />
              </>
            )}
            {level('bird') > 0 && (
              <>
                <circle cx={37} cy={trunkTop - 6} r={1.8} fill="#8fc7ff" stroke="#2f6f9e" strokeWidth={0.6} />
                <path d={tri(38.6, trunkTop - 6, 0.9, 1.3, 90)} fill={GOLD.fill} />
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
