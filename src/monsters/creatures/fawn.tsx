import { creature } from '../creature'
import {
  Blush,
  Cloud,
  Eye,
  Flame,
  Flower,
  Glow,
  GOLD,
  INK,
  Leaf,
  LEAF,
  line,
  paint,
  Sparkle,
  Tube,
  WHITE,
  WOOD,
} from '../kit'

type Step =
  | 'spots'
  | 'antlers'
  | 'size'
  | 'leaves'
  | 'flowers'
  | 'glow'
  | 'moss'
  | 'scales'
  | 'horn'
  | 'mane'
  | 'hooves'
  | 'clouds'
  | 'whiskers'

const legs = [24, 28.5, 38, 42.5]
const spots = [
  [29, 39],
  [34, 38],
  [39, 40],
  [31, 42.5],
  [37, 43.5],
  [26, 41],
  [42, 42],
]

// A spotted fawn whose antlers become a blooming forest spirit, or a scaled, fire-hoofed qilin.
export const fawn = creature<Step>(
  [
    [
      'spots',
      'antlers',
      'size',
      'leaves',
      'antlers',
      'spots',
      'flowers',
      'antlers',
      'leaves',
      'size',
      'glow',
      'antlers',
      'flowers',
      'moss',
      'leaves',
      'size',
      'glow',
      'flowers',
      'glow',
    ],
    [
      'scales',
      'horn',
      'mane',
      'size',
      'hooves',
      'scales',
      'horn',
      'whiskers',
      'mane',
      'size',
      'hooves',
      'clouds',
      'scales',
      'horn',
      'mane',
      'size',
      'hooves',
      'whiskers',
      'clouds',
    ],
  ],
  (level, { body, accent }, qilin) => {
    const grow = 0.88 + level('size') * 0.04
    const antlers = level('antlers')
    const glow = level('glow')
    const scales = level('scales')
    const tips = [
      [43.5 - antlers * 1.4, 21 - antlers * 1.8],
      [48.5 + antlers * 0.8, 20 - antlers * 1.9],
      [45 - antlers * 0.4, 16 - antlers * 1.6],
    ]
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {glow > 1 && <Glow x={36} y={36} r={26} color={LEAF.light} />}
        {level('clouds') > 0 && <Cloud x={33} y={58} width={16 + level('clouds') * 6} />}
        {legs.map((x) => (
          <rect key={x} x={x - 1.4} y={45} width={2.8} height={12} rx={1.4} {...paint(body)} />
        ))}
        {level('hooves') > 0 &&
          legs.map((x) => <Flame key={x} x={x} y={57.5} size={1.2 + level('hooves') * 0.45} />)}
        <ellipse
          cx={21.5}
          cy={39}
          rx={2.5}
          ry={1.8}
          transform="rotate(-30 21.5 39)"
          fill={WHITE}
          stroke={body.shade}
          strokeWidth={0.8}
        />
        <ellipse cx={33} cy={43} rx={11.5} ry={7.5} {...paint(body)} />
        <ellipse cx={33} cy={46.5} rx={7} ry={3} fill={body.light} />
        {!qilin &&
          spots
            .slice(0, [0, 4, 7][level('spots')])
            .map(([x, y]) => <circle key={x} cx={x} cy={y} r={1} fill={WHITE} />)}
        {level('moss') > 0 &&
          [
            [29, 36.3],
            [34, 35.8],
            [39, 36.8],
          ].map(([x, y]) => <circle key={x} cx={x} cy={y} r={2.2} fill={LEAF.fill} />)}
        {scales > 0 && (
          <path
            d={`M26 42q1.5 1.5 3 0M30 42q1.5 1.5 3 0M34 42q1.5 1.5 3 0${scales > 1 ? 'M28 39q1.5 1.5 3 0M32 39q1.5 1.5 3 0M36 39q1.5 1.5 3 0' : ''}`}
            {...line(scales > 2 ? GOLD.shade : body.shade, 0.9)}
            opacity={0.6}
          />
        )}
        <Tube d="M40 40Q43 35 45 30" color={body} width={6} />
        {qilin &&
          [
            [40.5, 37.5],
            [42, 34],
            [43.5, 30.5],
          ]
            .slice(0, level('mane'))
            .map(([x, y]) => (
              <Leaf key={x} x={x} y={y} size={2.6} angle={-50} color={accent} vein={false} />
            ))}
        <Leaf x={43} y={24.5} size={3.2} angle={-65} color={body} vein={false} />
        {antlers > 0 && (
          <g>
            {tips.slice(0, antlers > 2 ? 3 : 2).map(([x, y]) => (
              <path key={x} d={`M46 23L${x} ${y}`} {...line(WOOD.shade, 2)} />
            ))}
            {antlers > 3 && (
              <path
                d={`M${tips[0][0] + 1} ${tips[0][1] + 3}l-3 -1M${tips[1][0] - 1} ${tips[1][1] + 3}l3 -1`}
                {...line(WOOD.shade, 1.6)}
              />
            )}
          </g>
        )}
        {!qilin &&
          tips
            .slice(0, Math.min(level('leaves'), antlers > 2 ? 3 : 2))
            .map(([x, y]) => <Leaf key={x} x={x} y={y} size={2.4} angle={x < 46 ? -40 : 40} />)}
        {!qilin &&
          tips
            .slice(0, level('flowers'))
            .map(([x, y]) => (
              <Flower
                key={x}
                x={x + 1}
                y={y + 1.5}
                size={1.1}
                color={{ fill: '#ffb3c1', shade: '#b0566a', light: WHITE }}
              />
            ))}
        {level('horn') > 0 && (
          <path d={`M45.6 23.5L47.3 ${20 - level('horn') * 2.5}L49 23.5z`} {...paint(GOLD, 0.8)} />
        )}
        <ellipse cx={46.5} cy={27.5} rx={6} ry={5.3} {...paint(body)} />
        <ellipse
          cx={51.5}
          cy={29.5}
          rx={3.2}
          ry={2.5}
          fill={body.light}
          stroke={body.shade}
          strokeWidth={0.8}
        />
        <circle cx={54} cy={28.8} r={0.8} fill={INK} />
        <Eye x={46.5} y={26.5} r={1.5} />
        <Blush x={48.5} y={30.5} r={1.3} />
        {level('whiskers') > 0 && <path d="M53 31q3 1 4 4" {...line(accent.shade, 0.9)} />}
        {level('whiskers') > 1 && <path d="M52 31.5q1 3 -1 6" {...line(accent.shade, 0.9)} />}
        {glow > 0 && (
          <>
            <Sparkle x={14} y={24} size={1.8} color={{ ...GOLD, fill: '#e6ff9a' }} />
            <Sparkle x={20} y={14} size={1.4} color={{ ...GOLD, fill: '#e6ff9a' }} />
          </>
        )}
        {glow > 2 && <Sparkle x={57} y={44} size={2} />}
      </g>
    )
  },
)
