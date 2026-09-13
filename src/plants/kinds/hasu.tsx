import { hsl, Linear, Radial, url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { drop, polar, ribbon, spread, type Point } from '../shapes'

type Step = 'pads' | 'stems' | 'buds' | 'open' | 'ripples' | 'dragonfly'

const water = soilY('basin')
// Floating pads: center, horizontal radius and the angle of their notch.
const pads = [
  [24, water - 1.6, 5.5, 110],
  [40, water - 1.2, 6, 250],
  [31, water - 0.9, 4.2, 160],
  [17.5, water - 1.3, 3.5, 70],
  [46, water - 1, 3.6, 300],
  [34, water - 2, 3, 200],
] as const
const tops: Point[] = [
  [31, 29],
  [38.5, 34],
  [24.5, 36],
]
const ripples = [
  [20, water - 1, 7],
  [44, water - 0.8, 6],
  [32, water - 0.6, 9],
] as const

// Lily pad seen from above at a slant, a wedge cut toward its notch angle.
function pad(cx: number, cy: number, rx: number, notch: number) {
  const ry = rx * 0.28
  const at = (angle: number) => [cx + rx * Math.sin((angle * Math.PI) / 180), cy - ry * Math.cos((angle * Math.PI) / 180)]
  const [ax, ay] = at(notch + 12)
  const [bx, by] = at(notch - 12)
  return `M${cx} ${cy}L${ax} ${ay}A${rx} ${ry} 0 1 1 ${bx} ${by}z`
}

// Lotus flower cupped upward from its base; half open shows only the inner petals.
function Lotus({ id, x, y, size, full }: { id: string; x: number; y: number; size: number; full: boolean }) {
  return (
    <g>
      {full &&
        spread(4, -75, 75).map((angle) => (
          <path key={angle} d={drop(x, y, size * 1.2, size * 0.34, angle)} fill={url(id, 'lotus')} />
        ))}
      {spread(3, -28, 28).map((angle) => (
        <path key={angle} d={drop(x, y, size * 1.35, size * 0.38, angle)} fill={url(id, 'lotus')} />
      ))}
      {full && <ellipse cx={x} cy={y - size * 0.55} rx={size * 0.3} ry={size * 0.14} fill="hsl(48 85% 68%)" />}
    </g>
  )
}

// A lotus in a water basin: pads float out, stems rise, buds swell and open, a dragonfly visits.
export const hasu = plant<Step>(
  'basin',
  [
    'pads',
    'pads',
    'stems',
    'pads',
    'ripples',
    'stems',
    'buds',
    'pads',
    'open',
    'ripples',
    'stems',
    'buds',
    'open',
    'pads',
    'open',
    'buds',
    'ripples',
    'open',
    'dragonfly',
  ],
  (level, { id, bloom }) => {
    const stems = tops.slice(0, level('stems'))
    const open = level('open')
    return (
      <g>
        <defs>
          <Linear id={`${id}-lotus`} colors={['hsl(40 100% 98%)', hsl(bloom, 4), hsl(bloom, -6)]} angle={0} />
          <Radial
            id={`${id}-ripple`}
            colors={['hsl(0 0% 100% / 0)', 'hsl(0 0% 100% / 0)', 'hsl(0 0% 100% / 0)', 'hsl(195 70% 96% / 0.75)', 'hsl(0 0% 100% / 0)']}
            x={0.5}
            y={0.5}
            r={0.5}
          />
          <Linear id={`${id}-wing`} colors={['hsl(195 80% 95% / 0.85)', 'hsl(200 60% 80% / 0.45)']} angle={90} />
        </defs>
        {ripples.slice(0, level('ripples')).map(([x, y, r]) => (
          <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.28} fill={url(id, 'ripple')} />
        ))}
        {stems.map(([x, y], index) => (
          <path
            key={index}
            d={ribbon([[x + (index - 1) * 2, water - 1.2], [x + 1, (water + y) / 2], [x, y]], [1.2, 1, 0.9])}
            fill={url(id, 'leaf')}
          />
        ))}
        {pads.slice(0, 1 + level('pads')).map(([x, y, rx, notch], index) => (
          <path key={index} d={pad(x, y, rx, notch)} fill={url(id, 'foliage')} />
        ))}
        {stems.map(([x, y], index) => {
          const opened = open - index * 2
          if (opened > 0) return <Lotus key={index} id={id} x={x} y={y} size={4.4 - index * 0.5} full={opened > 1} />
          if (index < level('buds')) return <path key={index} d={drop(x, y, 5, 1.6, 0)} fill={url(id, 'lotus')} />
          return null
        })}
        {level('dragonfly') > 0 && (
          <g>
            {[-1, 1].map((side) =>
              [0, 1].map((pair) => {
                const [x, y] = polar(47, 27 + pair * 1.4, side * (70 + pair * 30), 3.2)
                return (
                  <ellipse
                    key={`${side}${pair}`}
                    cx={x}
                    cy={y}
                    rx={2.8}
                    ry={0.9}
                    transform={`rotate(${side * (pair * 25 - 10)} ${x} ${y})`}
                    fill={url(id, 'wing')}
                  />
                )
              }),
            )}
            <path d={ribbon([[47, 25.5], [47, 33]], [1.3, 0.6])} fill="hsl(205 65% 45%)" />
          </g>
        )}
      </g>
    )
  },
)
