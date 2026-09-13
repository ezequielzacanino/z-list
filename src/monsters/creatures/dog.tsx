import { creature } from '../creature'
import { Blush, Eye, Flame, Glow, INK, line, paint, Sparkle, tone, Tube, type Tone } from '../kit'

type Step = 'heads' | 'ears' | 'size' | 'tail' | 'paws' | 'collar' | 'mane' | 'spots'

// Head positions and tilts for one, two and three heads.
const layouts = [
  [[32, 31, 0]],
  [
    [25, 32, -10],
    [39, 30, 10],
  ],
  [
    [19.5, 35, -16],
    [44.5, 35, 16],
    [32, 27.5, 0],
  ],
]

// A puppy that sprouts a second head, grows, then a third, with burning paws: Cerberus.
// Orthrus stays with two heads and icy paws.
export const dog = creature<Step>(
  [
    [
      'heads',
      'ears',
      'size',
      'heads',
      'tail',
      'size',
      'paws',
      'collar',
      'size',
      'ears',
      'paws',
      'collar',
      'size',
      'tail',
      'paws',
      'mane',
      'collar',
      'mane',
      'mane',
    ],
    [
      'heads',
      'ears',
      'size',
      'spots',
      'tail',
      'size',
      'paws',
      'collar',
      'size',
      'ears',
      'paws',
      'collar',
      'size',
      'tail',
      'paws',
      'mane',
      'collar',
      'mane',
      'mane',
    ],
  ],
  (level, { body, hue }, orthrus) => {
    const heads = layouts[level('heads')]
    const radius = [7.5, 6.6, 6.2][heads.length - 1]
    const grow = 0.86 + level('size') * 0.045
    const ear = tone(hue, 40, 56)
    const ears = level('ears')
    const paws = level('paws')
    const collar = level('collar')
    const mane = level('mane')
    const tail = level('tail')
    const head = ([x, y, tilt]: number[], index: number) => (
      <g key={index} transform={`rotate(${tilt} ${x} ${y})`}>
        {mane > 1 && <Flame x={x} y={y - radius + 2} size={3.2} cold={orthrus} />}
        {[-1, 1].map((side) =>
          ears > 1 ? (
            <path
              key={side}
              d={`M${x + side * 2} ${y - radius + 2}L${x + side * 5.5} ${y - radius - 4}L${x + side * 6.5} ${y - 1}z`}
              {...paint(ear)}
            />
          ) : (
            <ellipse
              key={side}
              cx={x + side * (radius - 0.5)}
              cy={y}
              rx={2.3 + ears * 0.5}
              ry={4.2 + ears}
              transform={`rotate(${side * -18} ${x + side * radius} ${y})`}
              {...paint(ear)}
            />
          ),
        )}
        <circle cx={x} cy={y} r={radius} {...paint(body)} />
        <ellipse cx={x} cy={y + 3} rx={3.8} ry={2.8} fill={body.light} />
        {orthrus && index === 0 && level('spots') > 0 && (
          <ellipse cx={x + 2.8} cy={y - 1.3} rx={2.8} ry={2.4} fill={ear.fill} opacity={0.8} />
        )}
        <ellipse cx={x} cy={y + 1.9} rx={1.3} ry={0.95} fill={INK} />
        <Eye x={x - 2.8} y={y - 1.3} r={1.45} />
        <Eye x={x + 2.8} y={y - 1.3} r={1.45} />
        <Blush x={x - 4.4} y={y + 2.4} r={1.4} />
        <Blush x={x + 4.4} y={y + 2.4} r={1.4} />
        <path d={`M${x - 1.6} ${y + 3.8}Q${x} ${y + 5} ${x + 1.6} ${y + 3.8}`} {...line(INK, 1)} />
        {index === heads.length - 1 && (
          <ellipse cx={x + 0.9} cy={y + 5.2} rx={1} ry={1.3} fill="#ff8fa3" />
        )}
        {collar > 0 && (
          <path
            d={`M${x - 4.5} ${y + radius - 1}Q${x} ${y + radius + 2} ${x + 4.5} ${y + radius - 1}`}
            {...line('#e05a5a', 2.2)}
          />
        )}
        {collar > 1 && (
          <circle cx={x} cy={y + radius + 2.2} r={1.3} {...paint(tone(45, 90, 65), 0.6)} />
        )}
        {collar > 2 &&
          [-3, 3].map((offset) => (
            <path
              key={offset}
              d={`M${x + offset - 0.9} ${y + radius}L${x + offset * 1.25} ${y + radius + 2.4}L${x + offset + 0.9} ${y + radius + 0.2}z`}
              fill="#c8c8d0"
            />
          ))}
      </g>
    )
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {mane > 2 && <Glow x={32} y={40} r={27} color={orthrus ? '#8fd3ff' : '#ff9a5a'} />}
        <Tail level={tail} color={body} cold={orthrus} burning={paws > 2} />
        {[-1, 1].map((side) => (
          <ellipse key={side} cx={32 + side * 9.5} cy={52} rx={5} ry={4.5} {...paint(body)} />
        ))}
        {paws > 1 && [22, 42].map((x) => <Flame key={x} x={x} y={57} size={2.6} cold={orthrus} />)}
        <ellipse cx={32} cy={47} rx={11} ry={9.5} {...paint(body)} />
        <ellipse cx={32} cy={49} rx={6} ry={6} fill={body.light} />
        {mane > 0 &&
          [28, 32, 36].map((x) => <circle key={x} cx={x} cy={41.5} r={2.4} fill={body.light} />)}
        {[28, 36].map((x) => (
          <rect key={x} x={x - 2.6} y={50} width={5.2} height={8} rx={2.6} {...paint(body)} />
        ))}
        {paws > 0 &&
          [28, 36].map((x) => (
            <Flame key={x} x={x} y={58} size={1.6 + paws * 0.5} cold={orthrus} />
          ))}
        {heads.map(head)}
        {mane > 2 && (
          <>
            <Sparkle x={8} y={22} size={2.2} />
            <Sparkle x={56} y={20} size={2.6} />
          </>
        )}
      </g>
    )
  },
)

function Tail({
  level,
  color,
  cold,
  burning,
}: {
  level: number
  color: Tone
  cold: boolean
  burning: boolean
}) {
  if (level === 0) return <circle cx={43.5} cy={50} r={2.6} {...paint(color)} />
  return (
    <>
      <Tube d="M41 51C47 50 50 45 49 39" color={color} width={level > 1 ? 4.6 : 3.2} />
      {level > 1 && <circle cx={49} cy={38.5} r={2.6} fill={color.light} />}
      {burning && <Flame x={49} y={37} size={2.4} cold={cold} />}
    </>
  )
}
