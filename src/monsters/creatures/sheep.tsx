import { creature } from '../creature'
import {
  Blush,
  Cloud,
  Eye,
  GOLD,
  INK,
  Leaf,
  LEAF,
  line,
  mixHue,
  paint,
  polar,
  Sparkle,
  spread,
  tone,
  WATER,
  WHITE,
} from '../kit'

type Step =
  | 'wool'
  | 'cheeks'
  | 'bell'
  | 'drops'
  | 'float'
  | 'rainbow'
  | 'sun'
  | 'legs'
  | 'horns'
  | 'gold'
  | 'laurel'
  | 'sparkle'

const puffs = [
  [32, 45, 9],
  [23, 43, 5.5],
  [41, 43, 5.5],
  [26, 51, 5.5],
  [38, 51, 5.5],
  [32, 36, 5.5],
  [24, 36.5, 4],
  [40, 36.5, 4],
]
const bands = ['#ff8a80', '#ffd166', '#8fd6a0', '#8fc7ff']

// A lamb whose wool turns into a rainbow rain cloud, or into the golden fleece of a ram.
export const sheep = creature<Step>(
  [
    [
      'wool',
      'cheeks',
      'bell',
      'wool',
      'drops',
      'float',
      'wool',
      'rainbow',
      'cheeks',
      'float',
      'sun',
      'wool',
      'rainbow',
      'drops',
      'float',
      'sun',
      'rainbow',
      'legs',
      'sun',
    ],
    [
      'wool',
      'horns',
      'gold',
      'legs',
      'horns',
      'wool',
      'gold',
      'bell',
      'horns',
      'sparkle',
      'gold',
      'wool',
      'laurel',
      'horns',
      'sparkle',
      'gold',
      'legs',
      'laurel',
      'sparkle',
    ],
  ],
  (level, { body }, ram) => {
    const share = level('gold') / 4
    const wool = ram
      ? tone(mixHue(40, 45, share), 15 + share * 70, 94 - share * 22)
      : { fill: WHITE, shade: '#8f9cab', light: WHITE }
    const float = ram ? 0 : level('float')
    const lift = float * 1.6
    const count = 4 + level('wool')
    const grow = 0.78 + level('wool') * 0.06
    const horns = level('horns')
    const rainbow = level('rainbow')
    return (
      <>
        {rainbow > 0 &&
          bands
            .slice(0, rainbow + 1)
            .map((color, index) => (
              <path
                key={color}
                d={`M${32 - 14 - rainbow * 3 + index * 2} 50A${14 + rainbow * 3 - index * 2} ${14 + rainbow * 3 - index * 2} 0 0 1 ${32 + 14 + rainbow * 3 - index * 2} 50`}
                {...line(color, 2)}
              />
            ))}
        {level('sun') > 0 && (
          <g>
            <circle cx={52} cy={13} r={3 + level('sun')} {...paint(GOLD, 0.7)} />
            {level('sun') > 1 &&
              spread(8, 0, 315).map((angle) => (
                <path
                  key={angle}
                  d={`M52 ${7 - level('sun')}v-2`}
                  {...line(GOLD.shade, 1.1)}
                  transform={`rotate(${angle} 52 13)`}
                />
              ))}
          </g>
        )}
        {float > 0 && <Cloud x={32} y={57.5} width={16 + float * 4} />}
        {float < 2 &&
          [25, 29, 35, 39].map((x) => (
            <g key={x}>
              <rect
                x={x - 1.3}
                y={50}
                width={2.6}
                height={7.5 - float * 2}
                rx={1.2}
                fill={body.fill}
                stroke={body.shade}
                strokeWidth={0.8}
              />
              {level('legs') > 1 && (
                <rect x={x - 1.4} y={55.5} width={2.8} height={2} rx={0.6} fill={GOLD.fill} />
              )}
            </g>
          ))}
        {level('drops') > 0 &&
          [
            [24, 58],
            [40, 58.5],
            [32, 60],
          ]
            .slice(0, level('drops') + 1)
            .map(([x, y]) => (
              <path
                key={x}
                d={`M${x} ${y - 3.5}q1.8 2.2 0 3.5q-1.8-1.3 0-3.5z`}
                {...paint(WATER, 0.6)}
              />
            ))}
        <g transform={`translate(0 ${-lift})`}>
          <g transform={`translate(32 44) scale(${grow}) translate(-32 -44)`}>
            {puffs.slice(0, count).map(([x, y, r]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={r + 0.9} fill={wool.shade} />
            ))}
            {puffs.slice(0, count).map(([x, y, r]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={wool.fill} />
            ))}
          </g>
          {horns > 0 &&
            [-1, 1].map((side) => {
              const size = 2 + horns * 1.3
              return (
                <path
                  key={side}
                  d={`M${32 + side * 4} 36.5q${side * size * 1.6} -${size} ${side * size * 1.8} ${size * 0.6}q${side * 0.2} ${size} ${-side * size * 0.8} ${size * 0.9}q${-side * size * 0.6} 0 ${-side * size * 0.4} ${-size * 0.6}`}
                  {...line(tone(35, 35, 45).fill, 2.6)}
                />
              )
            })}
          {[-1, 1].map((side) => (
            <ellipse
              key={side}
              cx={32 + side * 8}
              cy={39.5}
              rx={3}
              ry={1.5}
              transform={`rotate(${side * 20} ${32 + side * 8} 39.5)`}
              fill={body.fill}
              stroke={body.shade}
              strokeWidth={0.8}
            />
          ))}
          <ellipse cx={32} cy={40.5} rx={5.8} ry={6.5} {...paint(body)} />
          <Eye x={29.8} y={39.8} r={1.2} />
          <Eye x={34.2} y={39.8} r={1.2} />
          <path d="M31 43.6h2M32 43.6v.8" {...line(INK, 0.9)} />
          {level('cheeks') > 0 && (
            <>
              <Blush x={28} y={43} r={1 + level('cheeks') * 0.3} />
              <Blush x={36} y={43} r={1 + level('cheeks') * 0.3} />
            </>
          )}
          {level('bell') > 0 && (
            <>
              <path d="M28 46.8Q32 48.8 36 46.8" {...line('#d64550', 1.4)} />
              <circle cx={32} cy={49} r={1.7} {...paint(GOLD, 0.6)} />
            </>
          )}
          {level('laurel') > 0 &&
            spread(level('laurel') * 3, -70, 70).map((angle) => {
              const [x, y] = polar(32, 40, angle, 8)
              return (
                <Leaf
                  key={angle}
                  x={x}
                  y={y}
                  size={1.6}
                  angle={angle}
                  color={level('laurel') > 1 ? GOLD : LEAF}
                  vein={false}
                />
              )
            })}
        </g>
        {level('sparkle') > 0 && <Sparkle x={20} y={30} size={1.8} />}
        {level('sparkle') > 1 && <Sparkle x={46} y={34} size={2.2} />}
        {level('sparkle') > 2 && <Sparkle x={52} y={50} size={1.6} />}
      </>
    )
  },
)
