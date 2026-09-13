import { hsl, Linear, mix, Radial, url, type Tint } from '../paint'
import { Puff } from '../parts'
import { plant } from '../plant'
import { soilY } from '../pot'
import { blade, drop, ribbon, type Point } from '../shapes'

type Step = 'stems' | 'leaves' | 'clusters' | 'color' | 'drops'

const base = soilY('bowl')
const stems: Point[] = [
  [32, 29],
  [24, 33],
  [40, 32],
  [29, 24],
]
// Leaves: base point and angle.
const leaves = [
  [30, 42, -65],
  [34, 42, 65],
  [26, 38, -50],
  [38, 37, 50],
  [31, 36, -20],
  [34, 32, 30],
  [23, 44, -85],
  [41, 44, 85],
  [27, 32, -40],
  [37, 30, 40],
  [29, 45, -30],
  [35, 45, 30],
]
const drops: Point[] = [
  [25.5, 39.5],
  [39, 34],
  [33, 26.5],
  [21, 36],
]
const YOUNG: Tint = { h: 80, s: 35, l: 84 }

// A hydrangea shoot that unfolds broad leaves and round flower heads which deepen into color.
export const ajisai = plant<Step>(
  'bowl',
  [
    'stems',
    'leaves',
    'leaves',
    'stems',
    'leaves',
    'clusters',
    'leaves',
    'stems',
    'clusters',
    'leaves',
    'clusters',
    'color',
    'leaves',
    'clusters',
    'color',
    'drops',
    'clusters',
    'color',
    'drops',
  ],
  (level, { id, bloom }) => {
    const shown = stems.slice(0, 1 + level('stems'))
    const tint = mix(YOUNG, bloom, level('color') / 3)
    const reach = 0.45 + level('stems') * 0.18
    return (
      <g>
        <defs>
          <Radial id={`${id}-ball`} colors={[hsl(tint, 14), hsl(tint), hsl(tint, -10)]} />
          <Linear id={`${id}-drop`} colors={['hsl(200 80% 97%)', 'hsl(200 60% 80% / 0.8)']} />
        </defs>
        {shown.map(([x, y], index) => {
          const end: Point = [32 + (x - 32) * reach, base - (base - y) * reach]
          return (
            <path
              key={index}
              d={ribbon([[32 + (index - 1.5) * 0.8, base], [(32 + end[0]) / 2, (base + end[1]) / 2 + 1], end], [1.4, 1.1, 0.9])}
              fill={url(id, 'leaf')}
            />
          )
        })}
        {leaves.slice(0, 2 + level('leaves') * 2).map(([x, y, angle], index) => (
          <path key={index} d={blade(x, Math.max(y, base - (base - y) * (0.5 + reach * 0.5)), 8, 5, angle)} fill={url(id, 'leaf')} />
        ))}
        {shown.slice(0, level('clusters')).map(([x, y], index) => (
          <g key={index}>
            <Puff x={x} y={y - 1} r={5.2 - index * 0.3} fill={url(id, 'ball')} />
            {[
              [-2, -2.5],
              [2.2, -1.5],
              [0, 1],
              [-2.8, 1.2],
              [2.6, 1.8],
            ].map(([dx, dy]) => (
              <g key={`${dx}${dy}`} fill={hsl(tint, 18)}>
                {[0, 90, 180, 270].map((turn) => (
                  <ellipse key={turn} cx={x + dx} cy={y - 1 + dy - 0.55} rx={0.45} ry={0.6} transform={`rotate(${turn} ${x + dx} ${y - 1 + dy})`} />
                ))}
              </g>
            ))}
          </g>
        ))}
        {drops.slice(0, level('drops') * 2).map(([x, y], index) => (
          <path key={index} d={drop(x, y - 2.6, 2.6, 0.9, 180)} fill={url(id, 'drop')} />
        ))}
      </g>
    )
  },
)
