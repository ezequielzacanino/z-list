import { creature } from '../creature'
import {
  Blush,
  Eye,
  Glow,
  GOLD,
  Leaf,
  line,
  paint,
  Sparkle,
  spread,
  Star,
  Tube,
  WHITE,
} from '../kit'

type Step = 'mane' | 'horn' | 'wings' | 'tail' | 'size' | 'hooves' | 'stars'

const rainbow = ['#ff8a80', '#ffd166', '#8fd6a0', '#8fc7ff']
const legs = [26, 31, 40, 45]

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
    const hornHeight = 3 + horn * 2.5
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {stars > 2 && <Glow x={34} y={38} r={26} color={accent.light} />}
        {pegasus &&
          wings > 0 &&
          spread(2 + wings, 15, 80).map((angle) => (
            <Leaf
              key={angle}
              x={39}
              y={38}
              size={4 + wings * 1.8}
              angle={angle}
              color={{ fill: WHITE, shade: body.shade, light: WHITE }}
              vein={false}
            />
          ))}
        {(tail > 2 ? rainbow.slice(0, 3) : [accent.fill]).map((color, index) => (
          <path
            key={color}
            d={`M48 41Q${53 + tail * 2} ${43 + index * 1.5} ${51 + tail * 2} ${47 + tail * 2.5 + index}`}
            {...line(color, tail > 0 ? 2.6 : 2)}
          />
        ))}
        {legs.map((x) => (
          <g key={x}>
            <rect x={x - 1.8} y={46} width={3.6} height={11.5} rx={1.6} {...paint(body)} />
            {level('hooves') > 0 && (
              <rect
                x={x - 1.9}
                y={55}
                width={3.8}
                height={2.6}
                rx={0.8}
                fill={GOLD.fill}
                stroke={GOLD.shade}
                strokeWidth={0.6}
              />
            )}
          </g>
        ))}
        <ellipse cx={37} cy={44} rx={12} ry={8} {...paint(body)} />
        {stars > 1 && <Star x={42} y={43.5} size={2.3} color={accent} />}
        <Tube d="M30 42Q25 37 23 31" color={body} width={7} />
        {mane > 1 && <Tube d="M25.5 23.5Q30.5 28 30 37" color={accent} width={2.4} />}
        {mane > 2 && <path d="M23.5 25Q27 30 27 38" {...line(rainbow[1], 2.2)} />}
        {mane > 3 && <path d="M27.5 23Q33 28 33 35" {...line(rainbow[3], 2)} />}
        <path d="M21.5 24L23.5 18.5L26 23.5z" {...paint(body)} />
        {mane > 0 &&
          [
            [25.5, 23],
            [27.5, 26.5],
          ].map(([x, y]) => <circle key={x} cx={x} cy={y} r={2.3} {...paint(accent, 0.8)} />)}
        {horn > 0 && (
          <g>
            <path
              d={`M18.5 23.8L${16.5 - horn * 0.6} ${22 - hornHeight}L21.8 23z`}
              {...paint(GOLD, 0.8)}
            />
            {Array.from({ length: horn }, (_, index) => (
              <path
                key={index}
                d={`M${18.6 - index * 0.25} ${22 - (index + 1) * 2.2}l${2.6 - index * 0.3} .9`}
                {...line(GOLD.shade, 0.6)}
              />
            ))}
          </g>
        )}
        <ellipse cx={20} cy={29} rx={7} ry={6.5} {...paint(body)} />
        <ellipse
          cx={14.5}
          cy={32.5}
          rx={4.5}
          ry={3.6}
          fill={body.light}
          stroke={body.shade}
          strokeWidth={0.8}
        />
        <circle cx={12.6} cy={32} r={0.6} fill={body.shade} />
        <Eye x={20.5} y={27.5} r={1.7} />
        <Blush x={18.5} y={31.8} r={1.3} />
        <path d="M12.8 35Q14 35.8 15.2 35" {...line('#3a2c2b', 0.9)} />
        {stars > 0 && <Sparkle x={54} y={22} size={2.4} />}
        {stars > 2 && <Sparkle x={9} y={16} size={1.8} />}
      </g>
    )
  },
)
