import { creature } from '../creature'
import {
  beads,
  Blush,
  Crown,
  Eye,
  fan,
  Glow,
  Leaf,
  line,
  paint,
  Sparkle,
  spread,
  taper,
  tri,
  WHITE,
  type Point,
} from '../kit'

type Step = 'length' | 'scales' | 'spikes' | 'crest' | 'wings' | 'aura' | 'crown' | 'gaze' | 'fangs'

// Spine from the tip of the tail to the neck, coiled on the ground; the tail grows backwards.
const spine: Point[] = [
  [55, 48],
  [51, 55],
  [43, 57],
  [35, 56],
  [28, 53],
  [23, 47],
  [24, 41],
  [28, 36],
  [29, 31],
]

// Quetzalcóatl gains a feathered crest and wings; the basilisk, spikes, a crown and a stony gaze.
export const serpent = creature<Step>(
  [
    [
      'length',
      'scales',
      'length',
      'crest',
      'length',
      'scales',
      'wings',
      'length',
      'crest',
      'scales',
      'wings',
      'length',
      'crest',
      'wings',
      'spikes',
      'spikes',
      'spikes',
      'aura',
      'aura',
    ],
    [
      'length',
      'spikes',
      'length',
      'scales',
      'length',
      'spikes',
      'crown',
      'length',
      'scales',
      'spikes',
      'crown',
      'length',
      'scales',
      'crown',
      'gaze',
      'gaze',
      'aura',
      'aura',
      'fangs',
    ],
  ],
  (level, { body, accent }) => {
    const points = spine.slice(spine.length - 4 - level('length'))
    const segments = beads(points, Math.round(points.length * 2.2))
    const scales = level('scales')
    const spikes = level('spikes')
    const wings = level('wings')
    const crest = level('crest')
    const gaze = level('gaze')
    const crown = level('crown')
    return (
      <>
        {level('aura') > 1 && <Glow x={32} y={38} r={27} color={accent.fill} />}
        {wings > 0 &&
          [-1, 1].map((side) =>
            [accent.fill, accent.light, accent.fill].slice(0, wings).map((color, index) => {
              const r = 9 + wings * 2.5 - index * 3
              return (
                <path
                  key={`${side}${index}`}
                  d={side > 0 ? fan(31, 40, r, 20, 95) : fan(25, 40, r, -95, -20)}
                  {...paint({ ...accent, fill: color })}
                />
              )
            }),
          )}
        {spikes > 0 &&
          segments
            .slice(0, -1)
            .map(([x, y], index) =>
              spikes > 1 || index % 2 ? (
                <path key={index} d={tri(x, y - 3, 3.6, 2.5 + spikes * 1.3)} {...paint(accent, 0.8)} />
              ) : null,
            )}
        {segments.map(([x, y], index) => {
          const r = 3 + (index / segments.length) * 1.4
          return (
            <g key={index}>
              <circle cx={x} cy={y} r={r} {...paint(body)} />
              {scales > 0 && <path d={fan(x, y, r * 0.55, 100, 260)} fill={body.light} />}
              {scales > 1 && index % 2 === 1 && (
                <circle cx={x} cy={y - r * 0.45} r={0.9} fill={scales > 2 ? accent.fill : body.shade} opacity={0.6} />
              )}
            </g>
          )
        })}
        {crest > 0 &&
          spread(1 + crest * 2, -10, 80).map((angle, index) => (
            <Leaf
              key={angle}
              x={31}
              y={21}
              size={2 + crest * 1.3 + (index % 2)}
              angle={angle}
              color={index % 2 ? accent : { ...accent, fill: '#ffd166' }}
              vein={false}
            />
          ))}
        <path d={taper(28, 22.5, 7.5, 28, 29, 4.6)} {...paint(body)} />
        <path d={taper(28, 26.5, 3.6, 28, 29.5, 3)} fill={body.light} />
        {gaze > 0 && [25, 31].map((x) => <circle key={x} cx={x} cy={23} r={2.8} fill={accent.light} />)}
        <Eye x={25} y={23} r={1.7} glow={gaze > 1 ? accent.fill : undefined} />
        <Eye x={31} y={23} r={1.7} glow={gaze > 1 ? accent.fill : undefined} />
        <Blush x={22.5} y={26.5} />
        <Blush x={33.5} y={26.5} />
        <path d="M26.5 29.5A1.8 1.8 0 0 0 29.5 29.5" {...line('#3a2c2b', 1.1)} />
        {level('fangs') > 0 &&
          [26.8, 29.2].map((x) => <path key={x} d={tri(x, 30.1, 1.4, 1.8, 180)} fill={WHITE} />)}
        {crown > 0 && (
          <Crown x={28} y={17.6} width={5 + crown * 2} gem={crown > 2 ? accent.fill : undefined} />
        )}
        {level('aura') > 0 && (
          <>
            <Sparkle x={52} y={16} size={2.6} />
            <Sparkle x={11} y={30} size={2} />
          </>
        )}
      </>
    )
  },
)
