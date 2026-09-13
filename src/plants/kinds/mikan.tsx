import { hsl, mix, Radial, url } from '../paint'
import { Blossom, Puff } from '../parts'
import { plant } from '../plant'
import { soilY } from '../pot'
import { drop, ribbon, type Point } from '../shapes'

type Step = 'trunk' | 'canopy' | 'blossoms' | 'fruit' | 'ripe'

const base = soilY('bowl')
const spine: Point[] = [
  [32, base],
  [31.5, 40],
  [32.5, 34],
  [32, 29],
  [32, 26],
]
// Canopy puffs relative to the trunk top, with their radius.
const puffs = [
  [0, -3, 7],
  [-6.5, 1, 5.5],
  [6.5, 1, 5.5],
  [-3.5, -8, 5],
  [3.5, -8, 5],
]
const fruits = [
  [-4, 2],
  [5, -1],
  [0, -7],
  [-7, -4],
  [7, 4],
]
const flowers = [
  [-2, -4],
  [4, 3],
  [-6, 1],
]
const UNRIPE = { h: 75, s: 55, l: 58 }

// A citrus seedling that rounds into a leafy crown, flowers white and hangs ripening fruit.
export const mikan = plant<Step>(
  'bowl',
  [
    'trunk',
    'canopy',
    'trunk',
    'canopy',
    'trunk',
    'canopy',
    'blossoms',
    'canopy',
    'trunk',
    'blossoms',
    'canopy',
    'fruit',
    'blossoms',
    'fruit',
    'fruit',
    'ripe',
    'fruit',
    'ripe',
    'fruit',
  ],
  (level, { id, bloom }) => {
    const trunk = level('trunk')
    const shown = spine.slice(0, 1 + trunk)
    const [tx, ty] = shown[shown.length - 1]
    const scale = 0.55 + trunk * 0.12
    const fruit = level('fruit')
    const tint = mix(UNRIPE, bloom, level('ripe') / 2)
    return (
      <g>
        <defs>
          <Radial id={`${id}-fruit`} colors={[hsl(tint, 18), hsl(tint), hsl(tint, -10)]} />
          <Radial id={`${id}-white`} colors={['hsl(40 100% 99%)', 'hsl(40 40% 90%)']} x={0.5} y={0.5} r={0.6} />
        </defs>
        {trunk === 0 ? (
          <g>
            <path d={ribbon([[32, base], [32.2, base - 4]], [1.1, 0.7])} fill={url(id, 'leaf')} />
            <path d={drop(32.2, base - 3.8, 3.6, 1.2, -55)} fill={url(id, 'leaf')} />
            <path d={drop(32.2, base - 3.8, 3.6, 1.2, 55)} fill={url(id, 'leaf')} />
          </g>
        ) : (
          <path
            d={ribbon(shown, shown.map((_, index) => 0.9 + (1 + trunk * 0.6) * (1 - index / (shown.length - 1))))}
            fill={url(id, 'bark')}
          />
        )}
        {trunk > 0 &&
          puffs
            .slice(0, level('canopy'))
            .map(([dx, dy, r], index) => (
              <Puff key={index} x={tx + dx * scale} y={ty - 2 + dy * scale} r={r * scale} fill={url(id, 'foliage')} />
            ))}
        {fruit < 3 &&
          flowers
            .slice(0, level('blossoms'))
            .map(([dx, dy], index) => (
              <Blossom key={index} id={id} x={tx + dx} y={ty - 2 + dy} r={1.6} turn={index * 23} fill={url(id, 'white')} />
            ))}
        {fruits.slice(0, fruit).map(([dx, dy], index) => (
          <circle key={index} cx={tx + dx} cy={ty - 2 + dy} r={1.9} fill={url(id, 'fruit')} />
        ))}
      </g>
    )
  },
)
