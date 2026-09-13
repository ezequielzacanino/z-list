import { hsl, Linear, mix, url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { polar, ribbon, type Point } from '../shapes'

type Step = 'trunk' | 'branch' | 'leaves' | 'color' | 'fall'

const base = soilY('bowl')
const spine: Point[] = [
  [32, base],
  [31, 41],
  [33.5, 35],
  [31.5, 29],
  [33, 23],
]
const arms = [
  { from: 2, mid: [27, 33.5], end: [22, 31] },
  { from: 3, mid: [37.5, 28.5], end: [43, 26.5] },
  { from: 4, mid: [28.5, 21.5], end: [24.5, 19] },
] as const
const fallen: Point[] = [
  [15, 58],
  [48, 57.5],
  [11, 50],
  [53, 46],
  [18, 40],
  [47, 36],
]

// Star-shaped maple leaf centered on a point, its stem pointing down before the turn.
function maple(x: number, y: number, r: number, turn: number) {
  const lobes = [
    [0, 1],
    [30, 0.4],
    [62, 0.9],
    [95, 0.42],
    [125, 0.65],
    [180, 0.3],
    [235, 0.65],
    [265, 0.42],
    [298, 0.9],
    [330, 0.4],
  ]
  return `M${lobes.map(([angle, length]) => polar(x, y, angle + turn, r * length).join(' ')).join('L')}z`
}

// A maple seedling that spreads a crown of star leaves which turn red and fall.
export const momiji = plant<Step>(
  'bowl',
  [
    'trunk',
    'leaves',
    'trunk',
    'branch',
    'leaves',
    'trunk',
    'leaves',
    'branch',
    'leaves',
    'trunk',
    'branch',
    'leaves',
    'color',
    'leaves',
    'color',
    'fall',
    'color',
    'fall',
    'fall',
  ],
  (level, { id, leaf, bloom }) => {
    const trunk = level('trunk')
    const shown = spine.slice(0, 1 + trunk)
    const top = shown[shown.length - 1]
    const visibleArms = arms.filter((arm, index) => index < level('branch') && arm.from < shown.length)
    const anchors: Point[] = [top, ...visibleArms.map((arm) => [...arm.end] as Point)]
    const count = trunk === 0 ? 1 : 2 + level('leaves') * 3
    const tint = mix(leaf, bloom, level('color') / 3)
    const leaves = Array.from({ length: count }, (_, index) => {
      const [ax, ay] = anchors[index % anchors.length]
      const angle = (index * 137.5) % 360
      const [x, y] = polar(ax, ay, angle, trunk === 0 ? 0 : 1.5 + (index % 3) * 2)
      return { x, y, turn: angle * 0.3 - 25 }
    })
    return (
      <g>
        <defs>
          <Linear id={`${id}-maple`} colors={[hsl(tint, 16), hsl(tint), hsl(tint, -12)]} angle={150} />
        </defs>
        {trunk === 0 ? (
          <path d={ribbon([[32, base], [32.3, base - 4]], [1.1, 0.7])} fill={url(id, 'leaf')} />
        ) : (
          <path
            d={ribbon(shown, shown.map((_, index) => 1 + (1.2 + trunk * 0.8) * (1 - index / (shown.length - 1))))}
            fill={url(id, 'bark')}
          />
        )}
        {visibleArms.map((arm) => (
          <path
            key={arm.from}
            d={ribbon([spine[arm.from], [...arm.mid], [...arm.end]], [1.5, 1.1, 0.7])}
            fill={url(id, 'bark')}
          />
        ))}
        {leaves.map(({ x, y, turn }, index) => (
          <path
            key={index}
            d={maple(trunk === 0 ? 32.3 : x, trunk === 0 ? base - 5.5 : y, trunk === 0 ? 2.2 : 3.4, turn)}
            fill={url(id, 'maple')}
          />
        ))}
        {fallen.slice(0, level('fall') * 2).map(([x, y], index) => (
          <path key={index} d={maple(x, y, 2, index * 53)} fill={url(id, 'maple')} />
        ))}
      </g>
    )
  },
)
