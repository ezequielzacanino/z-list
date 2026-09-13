import { creature } from '../creature'
import { Blush, capsule, Eye, fan, Flame, Glow, INK, line, paint, Sparkle, tone, tri, type Tone } from '../kit'

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
            <path key={side} d={tri(x + side * 4.2, y - radius + 2.5, 5, 6, side * 20)} {...paint(ear)} />
          ) : (
            <path
              key={side}
              d={capsule(x + side * (radius - 0.5), y - 2, x + side * (radius + 0.8), y + 2.5 + ears, 4.6 + ears)}
              {...paint(ear)}
            />
          ),
        )}
        <circle cx={x} cy={y} r={radius} {...paint(body)} />
        <circle cx={x} cy={y + 3} r={3.3} fill={body.light} />
        {orthrus && index === 0 && level('spots') > 0 && (
          <circle cx={x + 2.8} cy={y - 1.3} r={2.6} fill={ear.fill} opacity={0.8} />
        )}
        <path d={fan(x, y + 1.2, 1.4, 90, 270)} fill={INK} />
        <Eye x={x - 2.8} y={y - 1.3} r={1.45} />
        <Eye x={x + 2.8} y={y - 1.3} r={1.45} />
        <Blush x={x - 4.4} y={y + 2.4} r={1.4} />
        <Blush x={x + 4.4} y={y + 2.4} r={1.4} />
        <path d={`M${x - 1.6} ${y + 3.6}A2 2 0 0 0 ${x + 1.6} ${y + 3.6}`} {...line(INK, 1)} />
        {index === heads.length - 1 && <path d={fan(x + 0.9, y + 4.6, 1.2, 90, 270)} fill="#ff8fa3" />}
        {collar > 0 && (
          <path d={capsule(x - 4.5, y + radius - 0.2, x + 4.5, y + radius - 0.2, 2.2)} {...paint(tone(0, 65, 62), 0.7)} />
        )}
        {collar > 1 && <circle cx={x} cy={y + radius + 2} r={1.3} {...paint(tone(45, 90, 65), 0.6)} />}
        {collar > 2 &&
          [-3, 3].map((offset) => (
            <path key={offset} d={tri(x + offset, y + radius + 0.6, 1.8, 2.2, offset * 8)} fill="#c8c8d0" />
          ))}
      </g>
    )
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {mane > 2 && <Glow x={32} y={40} r={27} color={orthrus ? '#8fd3ff' : '#ff9a5a'} />}
        <Tail level={tail} color={body} cold={orthrus} burning={paws > 2} />
        {[-1, 1].map((side) => (
          <circle key={side} cx={32 + side * 9.5} cy={52.5} r={4.6} {...paint(body)} />
        ))}
        {paws > 1 && [22, 42].map((x) => <Flame key={x} x={x} y={57} size={2.6} cold={orthrus} />)}
        <circle cx={32} cy={47} r={10} {...paint(body)} />
        <circle cx={32} cy={49.5} r={5.8} fill={body.light} />
        {mane > 0 && [28, 32, 36].map((x) => <circle key={x} cx={x} cy={41.5} r={2.4} fill={body.light} />)}
        {[28, 36].map((x) => (
          <path key={x} d={capsule(x, 52, x, 55.5, 5.2)} {...paint(body)} />
        ))}
        {paws > 0 && [28, 36].map((x) => <Flame key={x} x={x} y={58} size={1.6 + paws * 0.5} cold={orthrus} />)}
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

function Tail({ level, color, cold, burning }: { level: number; color: Tone; cold: boolean; burning: boolean }) {
  if (level === 0) return <circle cx={43.5} cy={50} r={2.6} {...paint(color)} />
  return (
    <>
      <path d={capsule(41, 51, 49, 39.5, level > 1 ? 4.6 : 3.2)} {...paint(color)} />
      {level > 1 && <circle cx={49} cy={38.5} r={2.6} fill={color.light} />}
      {burning && <Flame x={49} y={37} size={2.4} cold={cold} />}
    </>
  )
}
