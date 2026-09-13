import { creature, type Look } from '../creature'
import {
  beads,
  Blush,
  capsule,
  Cloud,
  Eye,
  fan,
  Flame,
  GOLD,
  INK,
  line,
  paint,
  poly,
  polar,
  Sparkle,
  spread,
  taper,
  tri,
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

function Dragon({ level, look: { body, accent } }: Props) {
  const grow = 0.9 + level('size') * 0.04
  const wings = level('wings')
  const spikes = level('spikes')
  const horns = level('horns')
  const fire = level('fire')
  const tail = level('tail')
  const span = 6 + wings * 4
  const tip: Point = tail > 0 ? [60, 45] : [52, 49]
  return (
    <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
      {wings > 0 && (
        <path
          d={poly([[33, 37], [33 + span * 0.3, 37 - span * 1.15], [33 + span * 0.95, 37 - span * 0.55]])}
          {...paint(accent)}
        />
      )}
      <path d={poly([[41, 49], tip, [45, 56]])} {...paint(body)} />
      {tail > 1 && <path d={tri(tip[0], tip[1], 5, 5, 75)} {...paint(accent, 0.9)} />}
      {spread(spikes + 1, -45, 55)
        .slice(0, spikes > 0 ? spikes + 1 : 0)
        .map((angle) => {
          const [x, y] = polar(34, 45, angle, 11.3)
          return <path key={angle} d={tri(x, y, 4.2, 2.5 + spikes, angle)} {...paint(accent, 0.8)} />
        })}
      {[27.5, 40.5].map((x) => (
        <path key={x} d={fan(x, 58, 5.5, -90, 90)} {...paint(body)} />
      ))}
      {level('claws') > 0 &&
        [23.5, 26.5, 36.5, 39.5].map((x) => <path key={x} d={tri(x, 58, 1.6, 1.6, -90)} fill={WHITE} />)}
      <path d={capsule(27, 41, 21, 33, 9)} {...paint(body)} />
      <circle cx={34} cy={45} r={12} {...paint(body)} />
      {level('belly') > 0 && (
        <>
          <path d={fan(34, 46, 8.5, 90, 270)} fill={body.light} />
          <path d="M28 49.5H40M30 53H38" {...line(body.shade, 0.8)} opacity={0.35} />
        </>
      )}
      {wings > 0 && (
        <>
          <path
            d={poly([[37, 39], [37 + span * 0.6, 39 - span * 1.1], [37 + span * 1.05, 39 - span * 0.2]])}
            {...paint(accent)}
          />
          <path
            d={`M37 39L${37 + span * 0.75} ${39 - span * 0.7}`}
            {...line(accent.shade, 0.9)}
            opacity={0.6}
          />
        </>
      )}
      {horns > 0 && (
        <>
          <path d={tri(15.5, 24.5, 3.2, 3 + horns * 2, -20)} {...paint(GOLD, 0.9)} />
          <path d={tri(22, 25, 4, 4 + horns * 2.4, 15)} {...paint(GOLD, 0.9)} />
        </>
      )}
      <path d={taper(19.5, 31, 8.2, 8, 35.5, 3.4)} {...paint(body)} />
      <path d={taper(16, 35.5, 3.6, 8.5, 36.5, 2.2)} fill={body.light} />
      <path d="M15 27.2L20 25.6" {...line(INK, 1.1)} />
      <circle cx={6.3} cy={34.6} r={0.7} fill={INK} />
      <path d="M6 37.5Q10 39.5 14 38.5" {...line(INK, 0.9)} />
      <Eye x={18.5} y={29} r={1.8} />
      <Blush x={22.5} y={34} r={1.6} />
      {fire > 0 && <Flame x={3.5} y={36.5} size={1 + fire} angle={-90} />}
      {fire > 2 && (
        <>
          <Sparkle x={52} y={14} size={2} color={{ ...GOLD, fill: '#ffb36b' }} />
          <Sparkle x={8} y={16} size={1.6} />
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
  const segments = beads(points, points.length * 2)
  const whiskers = level('whiskers')
  const horns = level('horns')
  const mane = level('mane')
  const pearl = level('pearl')
  const cloud = level('cloud')
  const scales = level('scales')
  return (
    <>
      {cloud > 0 && <Cloud x={38} y={55} width={14 + cloud * 8} />}
      {mane > 0 &&
        segments
          .slice(0, -1)
          .map(([x, y], index) =>
            mane > 2 || index % (3 - mane) === 0 ? (
              <path key={index} d={tri(x, y - 2.5, 3.6, 3.5, -10)} {...paint(accent, 0.8)} />
            ) : null,
          )}
      {segments.map(([x, y], index) => {
        const r = 3 + (index / segments.length) * 1.4
        return (
          <g key={index}>
            <circle cx={x} cy={y} r={r} {...paint(body)} />
            {scales > 0 && <path d={fan(x, y, r * 0.55, 100, 260)} fill={body.light} />}
            {scales > 1 && index % 2 === 0 && <circle cx={x} cy={y - r * 0.4} r={0.8} fill={accent.fill} />}
          </g>
        )
      })}
      {pearl > 0 && (
        <>
          <path d={capsule(20, 40, 11, 45, 2.6)} {...paint(body)} />
          <circle cx={9} cy={45} r={2 + pearl * 0.8} fill={WHITE} stroke="#9fd3ff" strokeWidth={0.8} />
          <circle cx={8.2} cy={44.2} r={0.8} fill="#9fd3ff" />
        </>
      )}
      {horns > 0 &&
        [-1, 1].map((side) => (
          <g key={side}>
            <path d={capsule(17 + side * 2, 26, 19 + side * 3, 22 - horns * 2, 1.8)} {...paint(GOLD, 0.8)} />
            {horns > 1 && (
              <path d={tri(18 + side * 2.5, 23.5 - horns, 1.6, 2.4, side * 60)} {...paint(GOLD, 0.6)} />
            )}
          </g>
        ))}
      <path d={taper(16.5, 30.5, 6.6, 7.5, 33.5, 3)} {...paint(body)} />
      <path d={taper(13, 34, 2.8, 8, 34.5, 2)} fill={body.light} />
      <path d="M13.2 27.2L17.5 25.8" {...line(INK, 1)} />
      <circle cx={5.8} cy={32.7} r={0.6} fill={INK} />
      <path d="M5.5 35.3Q9 37 12.5 36" {...line(INK, 0.8)} />
      <Eye x={16.5} y={28.8} r={1.6} />
      <Blush x={19.5} y={33} r={1.5} />
      {whiskers > 0 &&
        [-1, 1].map((side) => (
          <path
            key={side}
            d={`M6.5 ${33.5 + side}L${4 - whiskers} ${36.5 + side * 2 + whiskers}L${5 - whiskers * 1.5} ${39.5 + side + whiskers * 2}`}
            {...line(accent.shade, 0.9)}
          />
        ))}
      {cloud > 1 && <Sparkle x={52} y={14} size={2.4} />}
    </>
  )
}
