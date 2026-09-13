import { creature } from '../creature'
import {
  Blush,
  capsule,
  Eye,
  fan,
  Flame,
  Glow,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  poly,
  Sparkle,
  spread,
  tri,
  WATER,
  type Point,
} from '../kit'

type Step =
  | 'gills'
  | 'spots'
  | 'bubbles'
  | 'fins'
  | 'size'
  | 'horns'
  | 'wings'
  | 'tail'
  | 'flames'
  | 'embers'
  | 'crown'

const EMBER = { fill: '#ffb36b', shade: '#a4481c', light: '#ffe0b8' }
const spots = [
  [22, 36, 1],
  [42, 37, 1.1],
  [28, 48, 0.9],
  [36, 50, 1],
  [40, 45, 0.8],
  [24, 44, 0.8],
]

// An axolotl whose gills turn into horns and fins of a water dragon, or into the flames of a salamander.
export const axolotl = creature<Step>(
  [
    [
      'gills',
      'spots',
      'bubbles',
      'gills',
      'fins',
      'size',
      'horns',
      'bubbles',
      'gills',
      'spots',
      'wings',
      'size',
      'horns',
      'fins',
      'wings',
      'bubbles',
      'size',
      'horns',
      'wings',
    ],
    [
      'gills',
      'spots',
      'tail',
      'gills',
      'flames',
      'size',
      'spots',
      'flames',
      'gills',
      'embers',
      'size',
      'tail',
      'flames',
      'spots',
      'crown',
      'size',
      'flames',
      'embers',
      'crown',
    ],
  ],
  (level, { body, accent }, salamander) => {
    const grow = 0.86 + level('size') * 0.045
    const gills = level('gills')
    const wings = level('wings')
    const flames = level('flames')
    const tail = level('tail')
    const tailEnd: Point = tail > 0 ? [55, 44 - tail * 2] : [50, 50]
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {(wings > 2 || flames > 3) && <Glow x={32} y={40} r={26} color={salamander ? EMBER.fill : WATER.fill} />}
        {wings > 0 &&
          [-1, 1].map((side) => (
            <Leaf
              key={side}
              x={32 + side * 7}
              y={46}
              size={5 + wings * 2}
              angle={side * 70}
              color={{ ...WATER, fill: accent.light }}
              vein={false}
            />
          ))}
        <path d={poly([[36.5, 49], tailEnd, [40, 55.5]])} {...paint(body)} />
        {level('fins') > 0 && <Leaf x={46} y={53} size={3 + level('fins')} angle={60} color={accent} vein={false} />}
        {flames > 0 && <Flame x={tailEnd[0]} y={tailEnd[1] + 1} size={1.8 + flames * 0.4} />}
        {flames > 1 && <Flame x={39} y={43} size={1.8} />}
        {[26, 38].map((x) => (
          <path key={x} d={fan(x, 58, 3, -90, 90)} {...paint(body)} />
        ))}
        <circle cx={32} cy={48} r={8} {...paint(body)} />
        <circle cx={32} cy={50} r={5} fill={body.light} />
        {[-1, 1].map((side) => (
          <circle key={side} cx={32 + side * 8.3} cy={49} r={2.1} {...paint(body)} />
        ))}
        {[-1, 1].map((side) =>
          [29, 33, 37].map((y, index) => {
            const angle = side * (50 + index * 40)
            return salamander && gills > 2 ? (
              <Flame key={`${side}${y}`} x={32 + side * 12} y={y + 1} size={2} angle={angle} />
            ) : (
              <Leaf
                key={`${side}${y}`}
                x={32 + side * 11.5}
                y={y}
                size={2.4 + gills * 1.1}
                angle={angle}
                color={accent}
                vein={gills > 1}
              />
            )
          }),
        )}
        <path d={capsule(25.5, 34, 38.5, 34, 19)} {...paint(body)} />
        {spots.slice(0, level('spots') * 2).map(([x, y, r]) => (
          <circle
            key={`${x}${y}`}
            cx={x}
            cy={y}
            r={r}
            fill={salamander ? EMBER.fill : body.shade}
            opacity={salamander ? 0.9 : 0.35}
          />
        ))}
        {level('horns') > 0 &&
          [-1, 1].map((side) => (
            <path key={side} d={tri(32 + side * 5, 25.5, 3, 1.5 + level('horns') * 1.8, side * 10)} {...paint(GOLD, 0.7)} />
          ))}
        {level('fins') > 1 && <path d="M27 25A7 7 0 0 1 37 25" {...line(accent.fill, 2)} />}
        {level('crown') > 0 &&
          spread(level('crown') * 2 + 1, -8, 8).map((x) => (
            <Flame key={x} x={32 + x} y={26 - (level('crown') - 1) * 0.5} size={1.3 + level('crown') * 0.3} />
          ))}
        <Eye x={25.5} y={33.5} r={1.8} />
        <Eye x={38.5} y={33.5} r={1.8} />
        <path d="M27.5 37.8A6 6 0 0 0 36.5 37.8" {...line(INK, 1.1)} />
        <Blush x={22} y={37.5} />
        <Blush x={42} y={37.5} />
        {[
          [52, 22, 2],
          [56, 15, 1.3],
          [48, 12, 1],
        ]
          .slice(0, level('bubbles'))
          .map(([x, y, r]) => (
            <circle key={y} cx={x} cy={y} r={r} fill={WATER.light} stroke={WATER.shade} strokeWidth={0.6} />
          ))}
        {level('embers') > 0 && <Sparkle x={10} y={24} size={2} color={EMBER} />}
        {level('embers') > 1 && <Sparkle x={52} y={16} size={2.4} color={EMBER} />}
      </g>
    )
  },
)
