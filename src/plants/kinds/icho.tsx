import { hsl, Linear, mix, url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { polar, ribbon, type Point } from '../shapes'

type Step = 'trunk' | 'branches' | 'leaves' | 'gold' | 'fallen'

const base = soilY('tall')
const spine: Point[] = [
  [32, base],
  [32.5, 37],
  [31.5, 31],
  [32.5, 25],
  [32, 19],
  [32.5, 13],
]
const arms = [
  { from: 2, end: [25, 26] },
  { from: 3, end: [39.5, 20] },
  { from: 4, end: [26, 14.5] },
] as const
const fallen: Point[] = [
  [17, 57.6],
  [46.5, 57.2],
  [13.5, 53],
  [50, 51],
]

// Fan-shaped ginkgo leaf opening from its stem point toward an angle, notched in the middle.
function fan(x: number, y: number, r: number, angle: number) {
  const [ax, ay] = polar(x, y, angle - 40, r)
  const [bx, by] = polar(x, y, angle - 5, r)
  const [nx, ny] = polar(x, y, angle, r * 0.72)
  const [cx, cy] = polar(x, y, angle + 5, r)
  const [dx, dy] = polar(x, y, angle + 40, r)
  return `M${x} ${y}L${ax} ${ay}A${r} ${r} 0 0 1 ${bx} ${by}L${nx} ${ny}L${cx} ${cy}A${r} ${r} 0 0 1 ${dx} ${dy}z`
}

// A ginkgo whip that rises straight, grows fan leaves along short branches and turns gold.
export const icho = plant<Step>(
  'tall',
  [
    'trunk',
    'leaves',
    'trunk',
    'leaves',
    'branches',
    'trunk',
    'leaves',
    'branches',
    'leaves',
    'trunk',
    'leaves',
    'branches',
    'leaves',
    'trunk',
    'leaves',
    'gold',
    'fallen',
    'gold',
    'fallen',
  ],
  (level, { id, leaf, bloom }) => {
    const trunk = level('trunk')
    const shown = spine.slice(0, 2 + trunk)
    const visibleArms = arms.filter((arm, index) => index < level('branches') && arm.from < shown.length)
    const anchors: Point[] = [
      ...shown.slice(Math.max(1, shown.length - 3)),
      ...visibleArms.map((arm) => [...arm.end] as Point),
    ]
    const count = 2 + level('leaves') * 3
    const tint = mix(leaf, bloom, level('gold') / 2)
    const leaves = Array.from({ length: count }, (_, index) => {
      const [ax, ay] = anchors[index % anchors.length]
      const angle = -70 + ((index * 67) % 140)
      const [x, y] = polar(ax, ay, angle, 1.2)
      return { x, y, angle }
    })
    return (
      <g>
        <defs>
          <Linear id={`${id}-fan`} colors={[hsl(tint, 14), hsl(tint), hsl(tint, -10)]} />
        </defs>
        <path
          d={ribbon(shown, shown.map((_, index) => 0.8 + (0.8 + trunk * 0.5) * (1 - index / (shown.length - 1))))}
          fill={url(id, 'bark')}
        />
        {visibleArms.map((arm) => (
          <path key={arm.from} d={ribbon([spine[arm.from], [...arm.end]], [1.1, 0.6])} fill={url(id, 'bark')} />
        ))}
        {leaves.map(({ x, y, angle }, index) => (
          <path key={index} d={fan(x, y, 3.2, angle)} fill={url(id, 'fan')} />
        ))}
        {fallen.slice(0, level('fallen') * 2).map(([x, y], index) => (
          <path key={index} d={fan(x, y, 2.2, 60 + index * 70)} fill={url(id, 'fan')} />
        ))}
      </g>
    )
  },
)
