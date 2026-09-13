import { creature } from '../creature'
import {
  Blush,
  capsule,
  fan,
  Flame,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  polar,
  poly,
  Sparkle,
  spread,
  Waves,
  WHITE,
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
const cracks = ['M20 52l3-3l2 3l3-2', 'M36 50l3-3l2 2l3-3']

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
    const radius = count > 4 ? 3.8 : count > 2 ? 4.4 : 5.2
    const reach = Math.min(80, 22 * (count - 1))
    const heads = spread(count, -reach, reach).map((angle, index) => {
      const length = count > 3 && index % 2 ? 12.5 : 19
      return [...polar(32, 48, angle, length), angle, length]
    })
    const ordered = [...heads].sort((a, b) => b[3] - a[3])
    const fins = level('fins')
    const horns = level('horns')
    const flames = level('flames')
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {level('waves') > 0 && <Waves y={58} count={level('waves')} />}
        <path d={capsule(47, 55, 56, 48, 3.5)} {...paint(body)} />
        {ordered.map(([x, y, angle]) => (
          <g key={angle}>
            <path d={capsule(32 + angle * 0.12, 46, x, y, count > 4 ? 3.4 : 4.2)} {...paint(body)} />
            {fins > 0 &&
              [-1, 1].map((side) => (
                <Leaf
                  key={side}
                  x={x + side * radius * 0.6}
                  y={y - radius * 0.4}
                  size={1.4 + fins * 0.7}
                  angle={side * 45}
                  color={accent}
                  vein={false}
                />
              ))}
            {horns > 0 &&
              [-1, 1].map((side) => (
                <path
                  key={side}
                  d={poly([
                    [x + side * radius * 0.3, y - radius * 0.8],
                    [x + side * radius * 0.7, y - radius - horns * 1.3],
                    [x + side * radius * 0.85, y - radius * 0.5],
                  ])}
                  {...paint(GOLD, 0.6)}
                />
              ))}
            {flames > 2 && <Flame x={x} y={y - radius - 0.5} size={1.3} />}
            <circle cx={x} cy={y} r={radius} {...paint(body)} />
            <circle cx={x - radius * 0.38} cy={y - radius * 0.1} r={radius * 0.24} fill={INK} />
            <circle cx={x + radius * 0.38} cy={y - radius * 0.1} r={radius * 0.24} fill={INK} />
            <path
              d={`M${x - radius * 0.3} ${y + radius * 0.35}A${radius * 0.4} ${radius * 0.4} 0 0 0 ${x + radius * 0.3} ${y + radius * 0.35}`}
              {...line(INK, 0.8)}
            />
          </g>
        ))}
        {flames > 0 && [22, 42].map((x) => <Flame key={x} x={x} y={44.5} size={1.6 + flames * 0.3} />)}
        <path d={fan(32, 57.5, 19, -90, 90)} {...paint(body)} />
        <path d={capsule(26, 52, 38, 52, 8)} fill={body.light} />
        {level('scales') > 0 && (
          <path
            d="M20 47a1.5 1.5 0 0 0 3 0M26 44.5a1.5 1.5 0 0 0 3 0M35 44.5a1.5 1.5 0 0 0 3 0M41 47a1.5 1.5 0 0 0 3 0"
            {...line(body.shade, 0.8)}
            opacity={0.5}
          />
        )}
        {level('scales') > 1 && (
          <path d="M23 51a1.5 1.5 0 0 0 3 0M38 51a1.5 1.5 0 0 0 3 0" {...line(accent.shade, 0.9)} opacity={0.6} />
        )}
        {cracks.slice(0, level('cracks')).map((d) => (
          <g key={d}>
            <path d={d} {...line('#ff7a3d', 1.5)} />
            <path d={d} {...line('#ffd166', 0.6)} />
          </g>
        ))}
        <Blush x={25} y={49} r={1.6} />
        <Blush x={39} y={49} r={1.6} />
        {level('pearls') > 0 && <circle cx={10} cy={55} r={2.4} fill={WHITE} stroke="#9fd3ff" strokeWidth={0.8} />}
        {level('pearls') > 1 && <circle cx={55} cy={40} r={2} fill={WHITE} stroke="#9fd3ff" strokeWidth={0.8} />}
        {level('embers') > 0 && <Sparkle x={10} y={30} size={1.8} color={EMBER} />}
        {level('embers') > 1 && <Sparkle x={56} y={24} size={2.2} color={EMBER} />}
      </g>
    )
  },
)
