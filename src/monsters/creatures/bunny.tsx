import { creature } from '../creature'
import {
  Blush,
  capsule,
  Eye,
  fan,
  Flower,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  Sparkle,
  tri,
  WHITE,
  WOOD,
} from '../kit'

type Step =
  | 'ears'
  | 'fluff'
  | 'moon'
  | 'mochi'
  | 'size'
  | 'mallet'
  | 'stars'
  | 'antlers'
  | 'flowers'
  | 'scarf'
  | 'feet'

const PINK = '#ffb3c1'

// Crescent whose back faces the left.
function crescent(x: number, y: number, r: number) {
  return `M${x} ${y - r}A${r} ${r} 0 1 0 ${x} ${y + r}A${r * 0.72} ${r} 0 1 1 ${x} ${y - r}z`
}

// A bunny that pounds mochi under a growing moon, or sprouts the antlers of a jackalope.
export const bunny = creature<Step>(
  [
    [
      'ears',
      'fluff',
      'moon',
      'ears',
      'mochi',
      'size',
      'moon',
      'mallet',
      'ears',
      'stars',
      'moon',
      'mallet',
      'fluff',
      'size',
      'mochi',
      'stars',
      'moon',
      'mallet',
      'stars',
    ],
    [
      'ears',
      'antlers',
      'fluff',
      'size',
      'antlers',
      'ears',
      'flowers',
      'antlers',
      'scarf',
      'size',
      'antlers',
      'flowers',
      'fluff',
      'ears',
      'antlers',
      'scarf',
      'size',
      'flowers',
      'feet',
    ],
  ],
  (level, { body, accent }) => {
    const grow = 0.9 + level('size') * 0.035
    const earHeight = 9 + level('ears') * 2.5
    const moon = level('moon')
    const antlers = level('antlers')
    const mallet = level('mallet')
    const tips: number[][] = []
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {moon > 3 && <circle cx={32} cy={27} r={16} fill="#fff3c4" stroke={GOLD.shade} strokeWidth={0.6} />}
        {moon > 3 && <circle cx={25} cy={20} r={2} fill="#f3e3a6" />}
        {moon > 2 && <circle cx={32} cy={33} r={13} fill={GOLD.light} opacity={0.6} />}
        {moon > 0 && moon < 4 && <path d={crescent(49, 15, 2 + moon * 2)} {...paint(GOLD, 0.7)} />}
        {[-1, 1].map((side) => {
          const x = 32 + side * 4.2
          return (
            <g key={side} transform={`rotate(${side * 12} ${x} 29)`}>
              <path d={capsule(x, 26.2, x, 31.8 - earHeight, 5.6)} {...paint(body)} />
              <path d={capsule(x, 26.5, x, 32 - earHeight + 1.2, 2.4)} fill={PINK} />
            </g>
          )
        })}
        {antlers > 0 &&
          [-1, 1].map((side) => {
            const x = 32 + side * 6
            const endX = x + side * (3 + antlers * 2.2)
            const endY = 29 - antlers * 2.6
            const middleX = (x + endX) / 2
            const middleY = (29 + endY) / 2
            tips.push([endX, endY])
            return (
              <g key={side}>
                <path d={`M${x} 29L${endX} ${endY}`} {...line(WOOD.shade, 2.8)} />
                {antlers > 1 && <path d={`M${middleX} ${middleY}l${-side * 1} -4.5`} {...line(WOOD.shade, 2.2)} />}
                {antlers > 3 && (
                  <path d={`M${middleX + side * 2} ${middleY - 2}l${side * 3.5} -0.5`} {...line(WOOD.shade, 2.2)} />
                )}
                <path d={`M${x} 29L${endX} ${endY}`} {...line(WOOD.fill, 1.3)} />
              </g>
            )
          })}
        {tips.slice(0, level('flowers')).map(([x, y]) => (
          <Flower key={x} x={x} y={y} size={1.3} color={{ fill: PINK, shade: '#b0566a', light: WHITE }} />
        ))}
        {level('flowers') > 2 && <Flower x={32} y={25} size={1.2} color={accent} />}
        <circle cx={42.5} cy={52} r={3} fill={WHITE} stroke={body.shade} strokeWidth={1} />
        <circle cx={32} cy={48} r={10.5} {...paint(body)} />
        <circle cx={32} cy={50.5} r={6} fill={body.light} />
        {[26, 38].map((x) => (
          <path key={x} d={fan(x, 58, level('feet') ? 5 : 4, -90, 90)} {...paint(body)} />
        ))}
        {level('mochi') > 0 && level('mochi') < 2 && (
          <circle cx={14.5} cy={54.5} r={3.6} fill={WHITE} stroke="#d9cfc2" strokeWidth={0.9} />
        )}
        {level('mochi') > 1 && (
          <g>
            <path d="M14 58V41" {...line(WOOD.fill, 1)} />
            {[
              [54, WHITE],
              [49, PINK],
              [44, '#a8d8a0'],
            ].map(([y, color]) => (
              <circle key={y} cx={14} cy={y as number} r={2.6} fill={color as string} stroke="#b9ab9a" strokeWidth={0.6} />
            ))}
          </g>
        )}
        {mallet > 0 && (
          <g>
            <path d={capsule(41, 49, 48, 38, 1.8)} {...paint(WOOD, 0.8)} />
            <rect
              x={43.5}
              y={31.5}
              width={6 + mallet * 1.5}
              height={4 + mallet * 0.6}
              rx={1.4}
              transform="rotate(-33 47 35)"
              {...paint(mallet > 2 ? GOLD : WOOD, 0.9)}
            />
          </g>
        )}
        <circle cx={32} cy={35.5} r={8.5} {...paint(body)} />
        {level('fluff') > 0 && (
          <path d="M24.2 36.5A1.5 1.5 0 0 0 24.2 39.5M39.8 36.5A1.5 1.5 0 0 1 39.8 39.5" {...line(body.shade, 1)} />
        )}
        {level('fluff') > 1 &&
          [29, 32, 35].map((x) => <circle key={x} cx={x} cy={x === 32 ? 43 : 42.3} r={2} fill={body.light} />)}
        <Eye x={29} y={35.3} r={1.6} />
        <Eye x={35} y={35.3} r={1.6} />
        <path d={tri(32, 37.6, 2, 1.2, 180)} fill="#ff8fa3" />
        <path d="M30.8 39.2A1.4 1.4 0 0 0 33.2 39.2" {...line(INK, 0.9)} />
        <Blush x={26.5} y={38.5} r={1.5} />
        <Blush x={37.5} y={38.5} r={1.5} />
        {level('scarf') > 0 && <path d={capsule(25.5, 43.5, 38.5, 43.5, 3.4)} {...paint(accent, 0.9)} />}
        {level('scarf') > 1 && <path d={capsule(35.5, 45, 36.8, 50, 2.4)} {...paint(accent, 0.8)} />}
        {level('stars') > 0 && <Sparkle x={10} y={20} size={2.2} />}
        {level('stars') > 1 && <Sparkle x={55} y={34} size={1.8} />}
        {level('stars') > 2 && <Glow x={32} y={40} r={26} color={GOLD.light} />}
      </g>
    )
  },
)
