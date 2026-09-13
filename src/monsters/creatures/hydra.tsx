import { creature } from '../creature'
import {
  Eye,
  Flame,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  polar,
  ribbon,
  smooth,
  Sparkle,
  spread,
  Waves,
  WHITE,
  type Point,
} from '../kit'

type Step =
  | 'heads'
  | 'fins'
  | 'size'
  | 'scales'
  | 'waves'
  | 'pearls'
  | 'horns'
  | 'cracks'
  | 'flames'
  | 'embers'

const EMBER = { fill: '#ffb36b', shade: '#a4481c', light: '#ffe0b8' }
const cracks = ['M22 50l3-3l2 3l3-2', 'M36 48l3-3l2 2l3-3']

// Snake head in profile, snout toward +x, about twelve units long.
const skull: Point[] = [
  [-4.5, -2.4],
  [-1, -4],
  [3, -3.6],
  [6.5, -1.6],
  [7.6, 0.6],
  [5.5, 2.6],
  [1.5, 3.4],
  [-3, 3],
  [-5.4, 0.6],
]
const jaw: Point[] = [
  [-3, 1],
  [2, 0.8],
  [6.5, 0.8],
  [5.5, 2.4],
  [1.5, 3.2],
  [-3, 2.8],
]

// A single-headed hatchling that grows head after head into a seven-headed hydra, of the sea or of lava.
export const hydra = creature<Step>(
  [
    [
      'heads',
      'fins',
      'size',
      'heads',
      'scales',
      'waves',
      'heads',
      'fins',
      'size',
      'heads',
      'waves',
      'pearls',
      'heads',
      'scales',
      'fins',
      'size',
      'heads',
      'waves',
      'pearls',
    ],
    [
      'heads',
      'horns',
      'size',
      'heads',
      'cracks',
      'flames',
      'heads',
      'horns',
      'size',
      'heads',
      'flames',
      'embers',
      'heads',
      'cracks',
      'horns',
      'size',
      'heads',
      'flames',
      'embers',
    ],
  ],
  (level, { body, accent }) => {
    const count = 1 + level('heads')
    const grow = 0.86 + level('size') * 0.045
    const k = count > 4 ? 0.74 : count > 2 ? 0.9 : 1.05
    const reach = Math.min(80, 25 * (count - 1))
    const fins = level('fins')
    const horns = level('horns')
    const flames = level('flames')
    const heads = spread(count, -reach, reach).map((angle, index) => {
      const length = count > 3 && index % 2 ? 19 : 27
      const [x, y] = polar(32, 42, angle, length)
      const facing = angle === 0 ? -55 : Math.sign(angle) * (62 + Math.abs(angle) * 0.3)
      const mirror = facing < 0
      const [sx, sy]: Point = [32 + angle * 0.1, 41]
      const [bx, by] = polar(x, y, facing + 180, 4 * k)
      const [mx, my] = polar((sx + bx) / 2, (sy + by) / 2, angle - 90 * Math.sign(angle || -1), 3)
      return { x, y, angle, mirror, rotate: mirror ? facing + 90 : facing - 90, neck: [[sx, sy], [mx, my], [bx, by]] as Point[] }
    })
    const ordered = [...heads].sort((a, b) => b.angle - a.angle)
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {level('waves') > 0 && <Waves y={58} count={level('waves')} />}
        <path d={ribbon([[48, 52], [57, 52], [61, 45], [59, 37]], [7, 5, 3, 1.4])} {...paint(body)} />
        {ordered.map(({ angle, neck }) => (
          <path key={angle} d={ribbon(neck, [7 * k, 6 * k, 5 * k])} {...paint(body)} />
        ))}
        <path
          d={smooth(
            [
              [15, 57],
              [12, 49],
              [17, 41],
              [26, 36.5],
              [34, 35],
              [42, 37],
              [49, 42],
              [52, 50],
              [49, 57],
              [38, 58.5],
              [24, 58.5],
            ],
            true,
          )}
          {...paint(body)}
        />
        <path
          d={smooth(
            [
              [21, 56],
              [19, 49],
              [25, 44],
              [33, 43],
              [40, 44.5],
              [45, 49.5],
              [44, 56],
            ],
            true,
          )}
          fill={body.light}
        />
        {level('scales') > 0 && (
          <path
            d="M19 45a1.6 1.6 0 0 0 3.2 0M23 41a1.6 1.6 0 0 0 3.2 0M39 41a1.6 1.6 0 0 0 3.2 0M44 45a1.6 1.6 0 0 0 3.2 0M28 39a1.6 1.6 0 0 0 3.2 0M35 39a1.6 1.6 0 0 0 3.2 0"
            {...line(body.shade, 0.8)}
            opacity={0.5}
          />
        )}
        {level('scales') > 1 && (
          <path d="M21 48a1.6 1.6 0 0 0 3.2 0M40 48a1.6 1.6 0 0 0 3.2 0" {...line(accent.shade, 0.9)} opacity={0.6} />
        )}
        {cracks.slice(0, level('cracks')).map((d) => (
          <g key={d}>
            <path d={d} {...line('#ff7a3d', 1.5)} />
            <path d={d} {...line('#ffd166', 0.6)} />
          </g>
        ))}
        {[[19, 52, 16], [45, 52, 48]].map(([x, y, tx]) => (
          <g key={x}>
            <path d={ribbon([[x, y], [tx, 58]], [7, 6.5])} {...paint(body)} />
            <path d={smooth([[tx - 4, 57], [tx - 2, 55.5], [tx, 55.2], [tx + 2, 55.5], [tx + 4, 57], [tx + 3, 59], [tx - 3, 59]], true)} {...paint(body)} />
          </g>
        ))}
        {flames > 0 && [22, 42].map((x) => <Flame key={x} x={x} y={41} size={1.4 + flames * 0.3} />)}
        {ordered.map(({ x, y, angle, mirror, rotate }) => (
          <g key={angle} transform={`translate(${x} ${y}) rotate(${rotate}) scale(${mirror ? -k : k} ${k})`}>
            {fins > 0 &&
              [-1, 1].map((side) => (
                <Leaf key={side} x={-2} y={-3} size={2 + fins} angle={side * 40 - 30} color={accent} vein={false} />
              ))}
            {horns > 0 &&
              [-1, 1].map((side) => (
                <path
                  key={side}
                  d={smooth([[-3.5 + side * 2, -3.2], [-3 + side * 2.5, -5.5 - horns * 1.6], [-1.5 + side * 2, -3.4]], true)}
                  {...paint(GOLD, 0.7)}
                />
              ))}
            {flames > 2 && <Flame x={9} y={-1} size={1.6} angle={90} />}
            <path d={smooth(skull, true)} {...paint(body)} />
            <path d={smooth(jaw, true)} fill={body.light} />
            <path d="M-1.5 -4.4L2 -3.2" {...line(INK, 1)} />
            <Eye x={0.5} y={-1.3} r={1.4} />
            <circle cx={6.3} cy={-0.8} r={0.55} fill={INK} />
            <path d="M6.6 1.4Q3 2.6 0 1.8" {...line(INK, 0.8)} />
          </g>
        ))}
        {level('pearls') > 0 && <circle cx={10} cy={55} r={2.4} fill={WHITE} stroke="#9fd3ff" strokeWidth={0.8} />}
        {level('pearls') > 1 && <circle cx={55} cy={40} r={2} fill={WHITE} stroke="#9fd3ff" strokeWidth={0.8} />}
        {level('embers') > 0 && <Sparkle x={10} y={30} size={1.8} color={EMBER} />}
        {level('embers') > 1 && <Sparkle x={56} y={24} size={2.2} color={EMBER} />}
      </g>
    )
  },
)
