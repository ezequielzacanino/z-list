import { Blossom, Halo, Puff } from '../parts'
import { url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { drop, ribbon, type Point } from '../shapes'

type Step = 'trunk' | 'branch' | 'buds' | 'bloom' | 'petals'

const base = soilY('tray')
const spine: Point[] = [
  [31, base],
  [28.5, 45],
  [33, 39],
  [29.5, 33],
  [32.5, 27],
  [30.5, 21],
]
const arms = [
  { from: 2, mid: [26, 38.5], end: [20, 35.5] },
  { from: 3, mid: [36, 32], end: [42.5, 29.5] },
  { from: 4, mid: [27.5, 26], end: [21.5, 23] },
  { from: 5, mid: [35, 19.5], end: [40.5, 16.5] },
] as const
const falling: Point[] = [
  [13, 32],
  [50, 40],
  [18, 45],
  [53, 25],
  [9, 42],
  [46, 12],
]

// A cherry sapling in a bonsai tray that branches out, buds and blooms into a pink cloud.
export const sakura = plant<Step>(
  'tray',
  [
    'trunk',
    'trunk',
    'branch',
    'trunk',
    'branch',
    'buds',
    'trunk',
    'branch',
    'buds',
    'bloom',
    'trunk',
    'branch',
    'bloom',
    'buds',
    'bloom',
    'petals',
    'bloom',
    'petals',
    'petals',
  ],
  (level, { id }) => {
    const trunk = level('trunk')
    const bloom = level('bloom')
    const shown = spine.slice(0, 1 + trunk)
    const thick = 1.6 + trunk * 0.75
    const visibleArms = arms.filter((arm, index) => index < level('branch') && arm.from < shown.length)
    const tips: Point[] = [
      ...(shown.length > 3 ? [shown[shown.length - 1]] : []),
      ...visibleArms.map((arm) => [...arm.end] as Point),
    ]
    const budSpots = visibleArms.flatMap((arm) => [[...arm.end] as Point, [...arm.mid] as Point])
    return (
      <g>
        {bloom > 3 && <Halo id={id} x={31} y={26} r={24} />}
        {trunk === 0 ? (
          <g>
            <path d={ribbon([[31, base], [31.4, base - 5]], [1.2, 0.8])} fill={url(id, 'leaf')} />
            <path d={drop(31.4, base - 4.6, 4.2, 1.3, -60)} fill={url(id, 'leaf')} />
            <path d={drop(31.4, base - 4.6, 3.6, 1.1, 55)} fill={url(id, 'leaf')} />
          </g>
        ) : (
          <path
            d={ribbon(shown, shown.map((_, index) => 0.9 + (thick - 0.9) * (1 - index / (shown.length - 1))))}
            fill={url(id, 'bark')}
          />
        )}
        {visibleArms.map((arm) => (
          <path
            key={arm.from}
            d={ribbon([spine[arm.from], [...arm.mid], [...arm.end]], [1.4 + trunk * 0.2, 1.1, 0.7])}
            fill={url(id, 'bark')}
          />
        ))}
        {trunk > 0 &&
          bloom === 0 &&
          tips.concat(shown.length <= 3 ? [shown[shown.length - 1]] : []).map(([x, y], index) => (
            <g key={index}>
              <path d={drop(x, y, 3.4, 1.1, -45)} fill={url(id, 'leaf')} />
              <path d={drop(x, y, 3, 1, 40)} fill={url(id, 'leaf')} />
            </g>
          ))}
        {budSpots.slice(0, level('buds') * 2).map(([x, y], index) => (
          <circle key={index} cx={x} cy={y - 0.6} r={1.1} fill={url(id, 'bloom')} />
        ))}
        {tips.slice(0, bloom).map(([x, y], index) => (
          <g key={index}>
            <Puff x={x} y={y} r={5.6 - index * 0.3} fill={url(id, 'bloom')} />
            <Blossom id={id} x={x - 2} y={y - 1.5} r={2.2} turn={index * 17} />
            <Blossom id={id} x={x + 2.4} y={y + 1.2} r={1.8} turn={index * 31} />
          </g>
        ))}
        {falling.slice(0, level('petals') * 2).map(([x, y], index) => (
          <ellipse
            key={index}
            cx={x}
            cy={y}
            rx={1.1}
            ry={0.7}
            transform={`rotate(${index * 47} ${x} ${y})`}
            fill={url(id, 'petal')}
          />
        ))}
      </g>
    )
  },
)
