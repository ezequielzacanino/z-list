import { hsl, Linear, url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { drop, polar } from '../shapes'

type Step = 'stalks' | 'height' | 'leaves' | 'shoots'

const base = soilY('tall')
const SEGMENT = 4.2
// Stalks: position, lean in degrees, width and how many segments shorter than the tallest they stay.
const stalks = [
  { x: 32, lean: 0, width: 3.2, short: 0 },
  { x: 28.5, lean: -9, width: 2.6, short: 2 },
  { x: 35.5, lean: 8, width: 2.4, short: 3 },
]
const shoots = [25.5, 38.5, 34.5]

// A bamboo cane in a tall pot that grows segment by segment, joined by more canes and shoots.
export const take = plant<Step>(
  'tall',
  [
    'height',
    'height',
    'leaves',
    'stalks',
    'height',
    'leaves',
    'height',
    'shoots',
    'height',
    'stalks',
    'leaves',
    'height',
    'shoots',
    'height',
    'leaves',
    'height',
    'shoots',
    'leaves',
    'height',
  ],
  (level, { id, leaf }) => {
    const tallest = 1 + level('height')
    const leaves = level('leaves')
    const cane = { h: leaf.h - 15, s: leaf.s, l: leaf.l + 8 }
    return (
      <g>
        <defs>
          <Linear id={`${id}-cane`} colors={[hsl(cane, 18), hsl(cane), hsl(cane, -12)]} angle={90} />
          <Linear id={`${id}-shoot`} colors={[hsl({ h: 35, s: 40, l: 62 }), hsl({ h: 25, s: 35, l: 42 })]} />
        </defs>
        {shoots.slice(0, level('shoots')).map((x, index) => (
          <path key={x} d={drop(x, base + 0.4, 3.2 + index * 0.6, 1.1, 0)} fill={url(id, 'shoot')} />
        ))}
        {stalks.slice(0, 1 + level('stalks')).map((stalk, index) => {
          const segments = Math.max(1, tallest - stalk.short)
          const height = segments * SEGMENT
          const nodes = Array.from({ length: segments }, (_, node) => base - (node + 1) * SEGMENT)
          const top = base - height
          return (
            <g key={index} transform={`rotate(${stalk.lean} ${stalk.x} ${base})`}>
              {nodes.map((y) => (
                <rect
                  key={y}
                  x={stalk.x - stalk.width / 2}
                  y={y + 0.3}
                  width={stalk.width}
                  height={SEGMENT - 0.3}
                  rx={stalk.width * 0.35}
                  fill={url(id, 'cane')}
                />
              ))}
              {nodes.slice(0, -1).map((y) => (
                <ellipse key={y} cx={stalk.x} cy={y + 0.2} rx={stalk.width * 0.62} ry={0.55} fill={hsl(cane, 20)} />
              ))}
              {Array.from({ length: Math.min(leaves, segments) }, (_, order) => {
                const y = top + order * SEGMENT + 1
                const side = order % 2 ? 1 : -1
                return [0, 1].map((twin) => {
                  const angle = side * (58 + twin * 26)
                  const [x] = polar(stalk.x, y, angle, stalk.width * 0.4)
                  return (
                    <path
                      key={`${order}${twin}`}
                      d={drop(x, y, 7.5 - twin * 1.5, 1.2, angle)}
                      fill={url(id, 'leaf')}
                    />
                  )
                })
              })}
            </g>
          )
        })}
      </g>
    )
  },
)
