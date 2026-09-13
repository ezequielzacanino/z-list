import { creature, type Look } from '../creature'
import {
  Blush,
  Cloud,
  Eye,
  Flame,
  GOLD,
  Leaf,
  line,
  paint,
  smooth,
  Sparkle,
  spread,
  Tube,
  WHITE,
  type Point,
} from '../kit'

type Step =
  | 'belly'
  | 'horns'
  | 'tail'
  | 'spikes'
  | 'wings'
  | 'size'
  | 'claws'
  | 'fire'
  | 'whiskers'
  | 'scales'
  | 'length'
  | 'mane'
  | 'pearl'
  | 'cloud'

// A lizard hatchling that becomes a winged fire dragon, or a long cloud-riding ryū.
export const lizard = creature<Step>(
  [
    [
      'belly',
      'horns',
      'tail',
      'spikes',
      'horns',
      'wings',
      'size',
      'spikes',
      'wings',
      'tail',
      'horns',
      'claws',
      'size',
      'spikes',
      'wings',
      'fire',
      'size',
      'fire',
      'fire',
    ],
    [
      'whiskers',
      'scales',
      'length',
      'horns',
      'mane',
      'length',
      'whiskers',
      'horns',
      'scales',
      'length',
      'mane',
      'pearl',
      'horns',
      'length',
      'whiskers',
      'mane',
      'cloud',
      'pearl',
      'cloud',
    ],
  ],
  (level, look, ryu) =>
    ryu ? <Ryu level={level} look={look} /> : <Dragon level={level} look={look} />,
)

type Props = { level: (step: Step) => number; look: Look }

const ridge: Point[] = [
  [32, 20],
  [38, 22.5],
  [42.5, 28],
  [44.5, 36],
]

function Dragon({ level, look: { body, accent } }: Props) {
  const grow = 0.9 + level('size') * 0.04
  const wings = level('wings')
  const spikes = level('spikes')
  const horns = level('horns')
  const fire = level('fire')
  const tail = level('tail')
  return (
    <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
      {wings > 0 &&
        [-1, 1].map((side) => {
          const s = 5 + wings * 3
          const x = 32 + side * 7
          const y = 38
          return (
            <path
              key={side}
              d={`M${x} ${y}L${x + side * s * 0.9} ${y - s}L${x + side * s * 1.25} ${y - s * 0.15}Q${x + side * s * 0.9} ${y + s * 0.1} ${x + side * s * 0.65} ${y + s * 0.4}Q${x + side * s * 0.4} ${y + s * 0.1} ${x} ${y + s * 0.45}z`}
              {...paint(accent)}
            />
          )
        })}
      <Tube
        d={tail > 0 ? 'M38 52C46 55 52 53 55 46' : 'M38 52C42 55 46 55 48 53'}
        color={body}
        width={4.5}
      />
      {tail > 1 && <path d="M55 41L58 46.5L53 47.5z" {...paint(accent, 0.8)} />}
      {ridge
        .slice(0, spikes + 1)
        .map(([x, y]) =>
          spikes > 0 ? (
            <path
              key={x}
              d={`M${x - 2} ${y + 2}L${x + 1} ${y - 1.5 - spikes}L${x + 2.5} ${y + 2.5}z`}
              {...paint(accent, 0.8)}
            />
          ) : null,
        )}
      {horns > 0 &&
        [-1, 1].map((side) => (
          <path
            key={side}
            d={`M${32 + side * 4} 24Q${32 + side * 6} ${22 - horns * 2} ${32 + side * (7 + horns * 1.5)} ${19 - horns * 2.2}Q${32 + side * 7.5} 23 ${32 + side * 7.5} 25z`}
            {...paint(GOLD, 0.9)}
          />
        ))}
      {[26, 38].map((x) => (
        <ellipse key={x} cx={x} cy={56} rx={4.2} ry={2.6} {...paint(body)} />
      ))}
      {level('claws') > 0 &&
        [23.5, 26, 28.5, 35.5, 38, 40.5].map((x) => (
          <path key={x} d={`M${x - 0.7} 57.8L${x} 59.6L${x + 0.7} 57.8z`} fill={WHITE} />
        ))}
      <ellipse cx={32} cy={46} rx={11.5} ry={10.5} {...paint(body)} />
      {level('belly') > 0 && (
        <>
          <ellipse cx={32} cy={48.5} rx={6.5} ry={7} fill={body.light} />
          <path d="M28 46h8M27.5 49h9M28.5 52h7" {...line(body.shade, 0.8)} opacity={0.35} />
        </>
      )}
      {[-1, 1].map((side) => (
        <ellipse
          key={side}
          cx={32 + side * 10.5}
          cy={45}
          rx={2.4}
          ry={3.4}
          transform={`rotate(${side * -25} ${32 + side * 10.5} 45)`}
          {...paint(body)}
        />
      ))}
      <circle cx={32} cy={30} r={9.5} {...paint(body)} />
      <ellipse cx={32} cy={34.3} rx={5.5} ry={3.6} fill={body.light} />
      <circle cx={30.4} cy={33.2} r={0.6} fill={body.shade} />
      <circle cx={33.6} cy={33.2} r={0.6} fill={body.shade} />
      <Eye x={27.5} y={28.5} r={1.8} />
      <Eye x={36.5} y={28.5} r={1.8} />
      <Blush x={24.8} y={32.5} />
      <Blush x={39.2} y={32.5} />
      <path d="M30 36.3Q32 37.6 34 36.3" {...line('#3a2c2b', 1.1)} />
      {fire > 0 && <Flame x={39} y={37} size={1 + fire} angle={75} />}
      {fire > 2 && (
        <>
          <Sparkle x={54} y={30} size={2} color={{ ...GOLD, fill: '#ffb36b' }} />
          <Sparkle x={56} y={40} size={1.6} />
        </>
      )}
    </g>
  )
}

// Spine of the long eastern dragon from the tail end to the neck.
const coil: Point[] = [
  [58, 26],
  [55, 38],
  [48, 47],
  [39, 49],
  [32, 44],
  [26, 38],
  [20, 37],
]

function Ryu({ level, look: { body, accent } }: Props) {
  const points = coil.slice(coil.length - 3 - level('length'))
  const d = smooth(points)
  const whiskers = level('whiskers')
  const horns = level('horns')
  const mane = level('mane')
  const pearl = level('pearl')
  const cloud = level('cloud')
  return (
    <>
      {cloud > 0 && <Cloud x={38} y={55} width={14 + cloud * 8} />}
      {mane > 0 &&
        points
          .slice(0, -1)
          .map(([x, y], index) =>
            mane > 2 || index % (3 - mane) === 0 ? (
              <Leaf key={x} x={x} y={y - 2.5} size={2.6} angle={-15} color={accent} vein={false} />
            ) : null,
          )}
      <Tube d={d} color={body} width={7} />
      {level('scales') > 0 && <path d={d} {...line(body.light, 2.2)} />}
      {level('scales') > 1 &&
        points.map(([x, y]) => <circle key={x} cx={x} cy={y + 1.2} r={0.9} fill={accent.fill} />)}
      {pearl > 0 && (
        <>
          <Tube d="M21 40Q15 44 11 46" color={body} width={2.6} />
          <circle
            cx={9}
            cy={45}
            r={2 + pearl * 0.8}
            fill={WHITE}
            stroke="#9fd3ff"
            strokeWidth={0.8}
          />
          <circle cx={8.2} cy={44.2} r={0.8} fill="#9fd3ff" />
        </>
      )}
      {horns > 0 &&
        [-1, 1].map((side) => (
          <g key={side}>
            <path
              d={`M${17 + side * 2} 26L${19 + side * 3} ${22 - horns * 2}`}
              {...line(GOLD.shade, 2.2)}
            />
            <path
              d={`M${17 + side * 2} 26L${19 + side * 3} ${22 - horns * 2}`}
              {...line(GOLD.fill, 1.2)}
            />
            {horns > 1 && (
              <path
                d={`M${18 + side * 2.5} ${23 - horns}l${side * 2.5} -1.5`}
                {...line(GOLD.shade, 1)}
              />
            )}
          </g>
        ))}
      <ellipse cx={16} cy={31} rx={7.5} ry={6} {...paint(body)} />
      <ellipse
        cx={10.5}
        cy={33}
        rx={4}
        ry={3}
        fill={body.light}
        stroke={body.shade}
        strokeWidth={1}
      />
      <circle cx={8.5} cy={32} r={0.6} fill={body.shade} />
      <Eye x={16} y={29} r={1.6} />
      <Blush x={18.5} y={33} r={1.5} />
      {whiskers > 0 &&
        spread(2, -1, 1).map((side) => (
          <path
            key={side}
            d={`M9 ${34 + side}q${-3 - whiskers} ${2 + side * 2} ${-2 - whiskers * 2} ${5 + whiskers * 2}q1 ${2 + whiskers} ${-2} ${3 + whiskers}`}
            {...line(accent.shade, 0.9)}
          />
        ))}
      {cloud > 1 && <Sparkle x={52} y={14} size={2.4} />}
    </>
  )
}
