import { url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { blade, polar, ribbon, spread, type Point } from '../shapes'

type Step = 'stem' | 'leaves' | 'buds' | 'flowers' | 'fallen'

const base = soilY('bowl')
const branches: Point[][] = [
  [
    [32, base],
    [31, 39],
    [32, 33],
  ],
  [
    [32, 33],
    [32.5, 28],
    [32, 23],
  ],
  [
    [31.5, 38],
    [27, 34],
    [24, 31],
  ],
  [
    [32, 34],
    [36, 31],
    [40, 29],
  ],
]
const spots: Point[] = [
  [27.5, 27],
  [37, 25.5],
  [32, 20.5],
  [23.5, 33.5],
  [41, 32],
]

// Camellia flower facing the viewer: six round petals around a golden center.
function Camellia({ id, x, y, r }: { id: string; x: number; y: number; r: number }) {
  return (
    <g>
      {spread(6, 0, 300).map((angle) => {
        const [px, py] = polar(x, y, angle, r * 0.45)
        return <circle key={angle} cx={px} cy={py} r={r * 0.55} fill={url(id, 'bloom')} />
      })}
      <circle cx={x} cy={y} r={r * 0.45} fill={url(id, 'bloom')} />
      <circle cx={x} cy={y} r={r * 0.22} fill="hsl(46 90% 66%)" />
    </g>
  )
}

// A camellia cutting that fills out into a glossy bush, buds and drops whole flowers.
export const tsubaki = plant<Step>(
  'bowl',
  [
    'stem',
    'leaves',
    'leaves',
    'stem',
    'leaves',
    'buds',
    'leaves',
    'stem',
    'buds',
    'leaves',
    'flowers',
    'buds',
    'leaves',
    'flowers',
    'buds',
    'flowers',
    'fallen',
    'flowers',
    'fallen',
  ],
  (level, { id }) => {
    const stem = level('stem')
    const shown = stem === 0 ? [branches[0].slice(0, 2)] : branches.slice(0, 1 + stem)
    const flowers = level('flowers')
    const count = 3 + level('leaves') * 3
    const center: Point = [32, 38 - stem * 3.2]
    const spreadR = 3 + stem * 2.4
    const leaves = Array.from({ length: count }, (_, index) => {
      const angle = (index * 137.5) % 360
      const [x, y] = polar(center[0], center[1], angle, spreadR * (0.45 + ((index % 4) + 1) * 0.14))
      return { x, y, angle: angle > 180 ? angle - 360 : angle }
    })
    return (
      <g>
        {shown.map((points, index) => (
          <path key={index} d={ribbon(points, [1.6, 1.2, 0.9])} fill={url(id, 'bark')} />
        ))}
        {leaves.map(({ x, y, angle }, index) => (
          <path key={index} d={blade(x, y, 6.5, 3.6, angle * 0.6)} fill={url(id, 'leaf')} />
        ))}
        {spots.slice(flowers, flowers + level('buds')).map(([x, y], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r={1.6} fill={url(id, 'bloom')} />
            <path d={blade(x, y + 1.6, 1.6, 2.2, 0)} fill={url(id, 'leaf')} />
          </g>
        ))}
        {spots.slice(0, flowers).map(([x, y], index) => (
          <Camellia key={index} id={id} x={x} y={y} r={3.4} />
        ))}
        {[
          [15.5, 57],
          [48.5, 57.4],
        ]
          .slice(0, level('fallen'))
          .map(([x, y]) => (
            <Camellia key={x} id={id} x={x} y={y} r={2.2} />
          ))}
      </g>
    )
  },
)
