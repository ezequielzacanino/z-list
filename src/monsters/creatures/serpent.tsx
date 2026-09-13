import { creature } from '../creature'
import {
  Blush,
  Crown,
  Eye,
  Glow,
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
    const d = smooth(points)
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
            spread(2 + wings, 35, 95).map((angle) => (
              <Leaf
                key={`${side}${angle}`}
                x={28 + side * 3}
                y={39}
                size={3 + wings * 1.7}
                angle={side * angle}
                color={accent}
              />
            )),
          )}
        {spikes > 0 &&
          points
            .slice(0, -1)
            .map(([x, y], index) =>
              spikes > 1 || index % 2 ? (
                <path
                  key={index}
                  d={`M${x - 1.8} ${y - 2}L${x} ${y - 4.5 - spikes * 1.3}L${x + 1.8} ${y - 2}z`}
                  {...paint(accent, 0.8)}
                />
              ) : null,
            )}
        <Tube d={d} color={body} width={7.5} />
        {level('scales') > 0 && <path d={d} {...line(body.light, 2.4)} />}
        {level('scales') > 1 &&
          points.map(([x, y]) => (
            <circle
              key={`${x}${y}`}
              cx={x + 1.5}
              cy={y - 1.5}
              r={0.9}
              fill={body.shade}
              opacity={0.4}
            />
          ))}
        {level('scales') > 2 &&
          points.slice(1).map(([x, y], index) => {
            const [px, py] = points[index]
            return (
              <circle
                key={`${x}${y}`}
                cx={(x + px) / 2}
                cy={(y + py) / 2 + 1.5}
                r={1.2}
                fill={accent.fill}
              />
            )
          })}
        {crest > 0 &&
          spread(1 + crest * 2, -10, 80).map((angle, index) => (
            <Leaf
              key={angle}
              x={31}
              y={22}
              size={2 + crest * 1.3 + (index % 2)}
              angle={angle}
              color={index % 2 ? accent : { ...accent, fill: '#ffd166' }}
              vein={false}
            />
          ))}
        <ellipse cx={28} cy={24} rx={8.5} ry={7} {...paint(body)} />
        <ellipse cx={26} cy={27.5} rx={4} ry={2.2} fill={body.light} />
        {gaze > 0 &&
          [25, 31].map((x) => <circle key={x} cx={x} cy={23} r={2.8} fill={accent.light} />)}
        <Eye x={25} y={23} r={1.7} glow={gaze > 1 ? accent.fill : undefined} />
        <Eye x={31} y={23} r={1.7} glow={gaze > 1 ? accent.fill : undefined} />
        <Blush x={22.5} y={26.5} />
        <Blush x={33.5} y={26.5} />
        <path d="M26.5 28.2Q28 29.4 29.5 28.2" {...line('#3a2c2b', 1.1)} />
        {level('fangs') > 0 &&
          [26.8, 29.2].map((x) => (
            <path key={x} d={`M${x - 0.7} 28.6L${x + 0.7} 28.6L${x} 30.4z`} fill={WHITE} />
          ))}
        {crown > 0 && (
          <Crown x={28} y={18.2} width={5 + crown * 2} gem={crown > 2 ? accent.fill : undefined} />
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
