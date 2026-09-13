import { creature } from '../creature'
import {
  Blush,
  capsule,
  Eye,
  fan,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  poly,
  Sparkle,
  Star,
  tri,
  WHITE,
} from '../kit'

type Step = 'mane' | 'horn' | 'wings' | 'tail' | 'size' | 'hooves' | 'stars'

const rainbow = ['#ff8a80', '#ffd166', '#8fd6a0', '#8fc7ff']
const farLegs = [32.5, 48.5]
const nearLegs = [27, 43]
const manes = [
  [27, 22, 3.6],
  [29, 28, 3.4],
  [31, 34, 3.2],
]

// A foal whose forehead grows a spiral horn into a unicorn, or whose back grows wings into Pegasus.
export const pony = creature<Step>(
  [
    [
      'mane',
      'horn',
      'tail',
      'horn',
      'mane',
      'size',
      'hooves',
      'horn',
      'mane',
      'tail',
      'stars',
      'size',
      'horn',
      'mane',
      'hooves',
      'tail',
      'stars',
      'size',
      'stars',
    ],
    [
      'mane',
      'wings',
      'tail',
      'wings',
      'mane',
      'size',
      'hooves',
      'wings',
      'mane',
      'tail',
      'stars',
      'size',
      'wings',
      'mane',
      'hooves',
      'tail',
      'stars',
      'size',
      'stars',
    ],
  ],
  (level, { body, accent }, pegasus) => {
    const grow = 0.88 + level('size') * 0.04
    const mane = level('mane')
    const tail = level('tail')
    const horn = level('horn')
    const wings = level('wings')
    const stars = level('stars')
    const hooves = level('hooves')
    const wingRadius = 9 + wings * 3
    const leg = (x: number) => (
      <g key={x}>
        <path d={capsule(x, 46, x, 56.5, 4.2)} {...paint(body)} />
        {hooves > 0 && (
          <path d={`M${x - 2.1} 55H${x + 2.1}V56.5A2.1 2.1 0 0 1 ${x - 2.1} 56.5z`} {...paint(GOLD, 0.8)} />
        )}
      </g>
    )
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {stars > 2 && <Glow x={34} y={38} r={26} color={accent.light} />}
        {farLegs.map(leg)}
        {(tail > 2 ? [accent.fill, ...rainbow.slice(0, 2)] : [accent.fill]).map((color, index) => (
          <path
            key={color}
            d={fan(50, 42.5, 5 + tail * 1.6 - index * 2.2, 0, 180)}
            {...paint({ ...accent, fill: color })}
          />
        ))}
        <path d={capsule(29.5, 42.5, 44.5, 42.5, 15)} {...paint(body)} />
        {nearLegs.map(leg)}
        {stars > 1 && <Star x={44} y={41} size={2.3} color={accent} />}
        {manes.slice(0, Math.min(3, mane)).map(([x, y, r], index) => (
          <circle
            key={y}
            cx={x}
            cy={y}
            r={r}
            {...paint({ ...accent, fill: mane > 2 ? rainbow[index] : accent.fill })}
          />
        ))}
        <path d={poly([[22, 43], [31, 43], [26.5, 23], [18.5, 25.5]])} {...paint(body)} />
        <path d={tri(21, 20, 5, 9, 15)} {...paint(body)} />
        <circle cx={18} cy={26} r={7.5} {...paint(body)} />
        {mane > 3 && <circle cx={20.5} cy={19} r={2.6} {...paint(accent)} />}
        {horn > 0 && (
          <g>
            <path d={tri(15.5, 20, 3.4, 3 + horn * 2.5, -25)} {...paint(GOLD, 0.8)} />
            {Array.from({ length: horn }, (_, index) => (
              <path
                key={index}
                d={`M${14.6 - index * 1} ${17.8 - index * 2}l2.2 1`}
                {...line(GOLD.shade, 0.6)}
              />
            ))}
          </g>
        )}
        <circle cx={11.5} cy={30} r={4.6} {...paint({ ...body, fill: body.light })} />
        <circle cx={9.6} cy={29} r={0.7} fill={INK} />
        <path d="M9.5 32.5A2 2 0 0 0 13 32.5" {...line(INK, 0.9)} />
        <Eye x={19} y={24.5} r={1.7} />
        <Blush x={17} y={29.5} r={1.4} />
        {pegasus &&
          wings > 0 &&
          [WHITE, accent.light, WHITE].slice(0, Math.min(3, wings)).map((color, index) => (
            <path
              key={index}
              d={fan(37, 39, wingRadius * (1 - index * 0.28), 0, 75)}
              {...paint({ ...body, fill: color })}
            />
          ))}
        {stars > 0 && <Sparkle x={54} y={20} size={2.4} />}
        {stars > 2 && <Sparkle x={8} y={14} size={1.8} />}
      </g>
    )
  },
)
