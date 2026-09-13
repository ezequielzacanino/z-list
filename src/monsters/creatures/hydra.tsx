import { creature } from '../creature'
import { FaceSide } from '../faces'
import {
  drop,
  Flame,
  INK,
  line,
  polar,
  ribbon,
  Silhouette,
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
const cracks = ['M20 51l3-3l2 3l3-2', 'M36 50l3-3l2 2l3-3']

// Snake head in profile, snout toward +x, about thirteen units long.
const skull: Point[] = [
  [-5, -2.6],
  [-1.5, -4.6],
  [3, -4.2],
  [6.8, -2],
  [8, 0.6],
  [6, 2.8],
  [1.5, 3.6],
  [-3, 3.2],
  [-5.8, 0.8],
]
const jaw: Point[] = [
  [-3, 1.2],
  [2, 1],
  [7, 1],
  [5.8, 2.6],
  [1.5, 3.4],
  [-3, 3],
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
    const k = count > 4 ? 0.8 : count > 2 ? 0.95 : 1.1
    const reach = Math.min(84, 26 * (count - 1))
    const fins = level('fins')
    const horns = level('horns')
    const flames = level('flames')
    const heads = spread(count, -reach, reach).map((angle, index) => {
      const length = count > 3 && index % 2 ? 23 : 32
      const [x, y] = polar(30, 42, angle, length)
      const facing = angle === 0 ? -50 : Math.sign(angle) * (60 + Math.abs(angle) * 0.3)
      const mirror = facing < 0
      const [sx, sy]: Point = [30 + angle * 0.08, 41]
      const [bx, by] = polar(x, y, facing + 180, 4 * k)
      const [mx, my] = polar((sx + bx) / 2, (sy + by) / 2, angle - 90 * Math.sign(angle || -1), 3.5)
      const transform = `translate(${x} ${y}) rotate(${mirror ? facing + 90 : facing - 90}) scale(${mirror ? -k : k} ${k})`
      return { angle, transform, mirror, neck: [[sx, sy], [mx, my], [bx, by]] as Point[] }
    })
    const ordered = [...heads].sort((a, b) => b.angle - a.angle)
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {level('waves') > 0 && <Waves y={58} count={level('waves')} />}
        {(fins > 0 || horns > 0) && (
          <Silhouette color={fins > 0 ? accent.fill : WHITE} width={1.8}>
            {ordered.map(({ angle, transform }) => (
              <g key={angle} transform={transform}>
                {fins > 0 &&
                  [-1, 1].map((side) => (
                    <path key={side} d={drop(-2.5, -3.2, (2 + fins) * 1.6, (2 + fins) * 0.5, side * 40 - 30)} />
                  ))}
                {horns > 0 &&
                  [-1, 1].map((side) => (
                    <path
                      key={side}
                      d={smooth(
                        [
                          [-3.5 + side * 2, -3.4],
                          [-3 + side * 2.5, -6 - horns * 1.7],
                          [-1.5 + side * 2, -3.6],
                        ],
                        true,
                      )}
                    />
                  ))}
              </g>
            ))}
          </Silhouette>
        )}
        <Silhouette color={body.fill}>
          <path d={ribbon([[46, 53], [55, 54], [61, 48], [61, 39]], [6.5, 5, 3.2, 1.6])} />
          {ordered.map(({ angle, neck }) => (
            <path key={angle} d={ribbon(neck, [6.5 * k, 5.6 * k, 4.8 * k])} />
          ))}
          <path
            d={smooth(
              [
                [14, 57],
                [12.5, 48],
                [18, 40.5],
                [29, 38],
                [39, 39.5],
                [47, 45],
                [48.5, 53],
                [45, 58],
                [36, 58.8],
                [20, 58.8],
              ],
              true,
            )}
          />
          {[[19, 53, 16], [41, 53, 44]].map(([x, y, tx]) => (
            <g key={x}>
              <path d={ribbon([[x, y], [tx, 57]], [6.5, 6])} />
              {[-2.6, 0, 2.6].map((dx) => (
                <circle key={dx} cx={tx + dx} cy={57.8} r={1.7} />
              ))}
            </g>
          ))}
          {ordered.map(({ angle, transform }) => (
            <g key={angle} transform={transform}>
              <path d={smooth(skull, true)} />
            </g>
          ))}
        </Silhouette>
        <path
          d={smooth(
            [
              [19, 56.5],
              [18, 49],
              [24, 45],
              [31, 44],
              [38, 45.5],
              [43, 50.5],
              [42, 56.5],
            ],
            true,
          )}
          fill={body.light}
        />
        {level('scales') > 0 &&
          [[18, 45], [23, 41.5], [36, 42], [43, 47], [29, 40.5]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1} fill={body.light} />
          ))}
        {level('scales') > 1 &&
          [[21, 49], [41, 49.5]].map(([x, y]) => <circle key={x} cx={x} cy={y} r={1} fill={accent.fill} />)}
        {cracks.slice(0, level('cracks')).map((d) => (
          <g key={d}>
            <path d={d} {...line('#ff7a3d', 1.5)} />
            <path d={d} {...line('#ffd166', 0.6)} />
          </g>
        ))}
        {flames > 0 && [21, 42].map((x) => <Flame key={x} x={x} y={43} size={1.4 + flames * 0.3} />)}
        {ordered.map(({ angle, transform }) => (
          <g key={angle} transform={transform}>
            {flames > 2 && <Flame x={9.5} y={-0.5} size={1.6} angle={90} />}
            <path d={smooth(jaw, true)} fill={body.light} />
            <circle cx={6.6} cy={-1} r={0.55} fill={INK} />
            <FaceSide x={0.8} y={-1.4} snout={6.8} size={0.9} />
          </g>
        ))}
        {level('pearls') > 0 && <circle cx={9} cy={56} r={2.4} fill={WHITE} stroke={INK} strokeWidth={1} />}
        {level('pearls') > 1 && <circle cx={56} cy={33} r={2} fill={WHITE} stroke={INK} strokeWidth={1} />}
        {level('embers') > 0 && <Sparkle x={10} y={30} size={1.8} color={EMBER} />}
        {level('embers') > 1 && <Sparkle x={56} y={24} size={2.2} color={EMBER} />}
      </g>
    )
  },
)
