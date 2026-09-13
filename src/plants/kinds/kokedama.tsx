import { hsl, Radial, url } from '../paint'
import { Halo } from '../parts'
import { plant } from '../plant'
import { soilY } from '../pot'
import { drop, polar, ribbon, trace, type Point } from '../shapes'

type Step = 'ball' | 'fronds' | 'unfurl' | 'mushrooms' | 'glow'

const plate = soilY('plate')
const angles = [-8, 32, -42, 58, -66, 14]
const fireflies: Point[] = [
  [15, 30],
  [49, 22],
  [46, 42],
]
const STEM = { h: 40, s: 40, l: 90 }

// A moss ball on a dish that sprouts fern fronds, uncurls them and gathers tiny mushrooms.
export const kokedama = plant<Step>(
  'plate',
  [
    'fronds',
    'ball',
    'fronds',
    'unfurl',
    'fronds',
    'mushrooms',
    'ball',
    'unfurl',
    'fronds',
    'glow',
    'mushrooms',
    'unfurl',
    'fronds',
    'ball',
    'glow',
    'unfurl',
    'fronds',
    'mushrooms',
    'glow',
  ],
  (level, { id, leaf, bloom }) => {
    const radius = 6 + level('ball') * 1.2
    const cy = plate - radius + 0.8
    const top: Point = [32, cy - radius + 1]
    const unfurl = level('unfurl')
    const length = 6 + unfurl * 2.6
    const moss = { h: leaf.h - 10, s: leaf.s, l: leaf.l - 4 }
    const glow = level('glow')
    return (
      <g>
        <defs>
          <Radial id={`${id}-moss`} colors={[hsl(moss, 16), hsl(moss), hsl(moss, -14)]} y={0.25} />
          <Radial id={`${id}-cap`} colors={[hsl(bloom, 14), hsl(bloom), hsl(bloom, -10)]} y={0.2} />
          <Radial id={`${id}-firefly`} colors={['hsl(55 100% 85% / 0.95)', 'hsl(55 100% 70% / 0)']} x={0.5} y={0.5} r={0.5} />
        </defs>
        {glow > 2 && <Halo id={id} x={32} y={36} r={22} />}
        {angles.slice(0, 1 + level('fronds')).map((angle, index) => {
          const side = angle < 0 ? -1 : 1
          const mid = polar(top[0], top[1], angle, length * 0.55)
          const tip = polar(mid[0], mid[1], angle + side * (unfurl < 2 ? 60 : 22), length * 0.45)
          const spine: Point[] = [top, mid, tip]
          const along = trace(spine, 4)
          return (
            <g key={index}>
              <path d={ribbon(spine, [1, 0.8, 0.5])} fill={url(id, 'leaf')} />
              {unfurl < 2 && <circle cx={tip[0]} cy={tip[1]} r={1.3} fill={url(id, 'leaf')} />}
              {along.slice(2, unfurl < 1 ? 2 : -1).map(([x, y], order) =>
                [-1, 1].map((twin) => (
                  <path
                    key={`${order}${twin}`}
                    d={drop(x, y, 2 + unfurl * 0.35 - order * 0.12, 0.6, angle + twin * 70)}
                    fill={url(id, 'leaf')}
                  />
                )),
              )}
            </g>
          )
        })}
        <circle cx={32} cy={cy} r={radius} fill={url(id, 'moss')} />
        {[
          [-0.4, -0.3, 0.3],
          [0.35, 0.1, 0.22],
          [-0.15, 0.45, 0.2],
        ].map(([dx, dy, r]) => (
          <circle key={dx} cx={32 + dx * radius} cy={cy + dy * radius} r={r * radius} fill={hsl(moss, -6, 0.35)} />
        ))}
        {[
          [26, cy - 1],
          [38.5, cy - 2],
          [29.5, cy - radius * 0.7],
        ]
          .slice(0, level('mushrooms'))
          .map(([x, y]) => (
            <g key={x}>
              <path d={ribbon([[x, y + 1], [x, y - 1.4]], [0.9, 0.8])} fill={hsl(STEM)} />
              <path d={`M${x - 1.8} ${y - 1}A1.8 1.6 0 0 1 ${x + 1.8} ${y - 1}z`} fill={url(id, 'cap')} />
            </g>
          ))}
        {fireflies.slice(0, glow).map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={2.4} fill={url(id, 'firefly')} />
        ))}
      </g>
    )
  },
)
