import type { ReactNode } from 'react'
import { creature, type Look } from '../creature'
import {
  Blush,
  Cloud,
  Eye,
  Flame,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  ribbon,
  smooth,
  Sparkle,
  trace,
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

// Dragon head in profile, snout toward +x, about fourteen units long.
const skull: Point[] = [
  [-5, -3],
  [-1, -5],
  [3.5, -4.5],
  [7, -2.2],
  [8.2, 0.4],
  [6.5, 2.6],
  [2, 3.6],
  [-3, 3.4],
  [-5.8, 0.8],
]
const jaw: Point[] = [
  [-3.5, 1.2],
  [2, 0.9],
  [7.2, 1],
  [6.5, 2.5],
  [2, 3.4],
  [-3, 3.2],
]

// Curved horn growing back from the skull, longer at each level.
function horn(x: number, y: number, length: number, thickness: number) {
  return smooth(
    [
      [x + thickness, y],
      [x - 1, y - length * 0.6],
      [x - length * 0.55, y - length],
      [x - 2, y - length * 0.45],
      [x - thickness, y + 0.5],
    ],
    true,
  )
}

function Head({
  body,
  horns,
  long = false,
  children,
}: {
  body: Look['body']
  horns: number
  long?: boolean
  children?: ReactNode
}) {
  return (
    <g transform={long ? 'scale(1.12 1)' : undefined}>
      {horns > 0 && <path d={horn(-3.2, -3.6, 3 + horns * 2.2, 1.5)} {...paint(GOLD, 0.8)} />}
      {horns > 0 && <path d={horn(0.6, -4.3, 2 + horns * 1.6, 1.2)} {...paint(GOLD, 0.8)} />}
      <path d={smooth(skull, true)} {...paint(body)} />
      <path d={smooth(jaw, true)} fill={body.light} />
      <path d="M-1.6 -5.2L2.6 -3.8" {...line(INK, 1.1)} />
      <Eye x={0.8} y={-1.7} r={1.6} />
      <circle cx={6.8} cy={-1.1} r={0.6} fill={INK} />
      <path d="M7.4 1.5Q3.5 2.8 0.5 2" {...line(INK, 0.9)} />
      <Blush x={-2.8} y={0.8} r={1.4} />
      {children}
    </g>
  )
}

// Back line from the neck to the tail root, where spikes stand.
const spine: Point[] = [
  [19, 34],
  [24, 37.5],
  [31, 35.8],
  [39, 37],
  [45, 42],
  [47, 49],
]

function Dragon({ level, look: { body, accent } }: Props) {
  const grow = 0.9 + level('size') * 0.04
  const wings = level('wings')
  const spikes = level('spikes')
  const horns = level('horns')
  const fire = level('fire')
  const tail = level('tail')
  const claws = level('claws')
  const span = 7 + wings * 4
  const shoulder: Point = [33, 39]
  const tips: Point[] = [
    [33 + span * 0.45, 39 - span * 1.55],
    [33 + span * 1.2, 39 - span * 1.15],
    [33 + span * 1.5, 39 - span * 0.45],
  ]
  const scallop = (from: Point, to: Point) => {
    const [mx, my] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
    const [cx, cy] = [mx + (shoulder[0] - mx) * 0.35, my + (shoulder[1] - my) * 0.35]
    return `Q${cx} ${cy} ${to[0]} ${to[1]}`
  }
  const wing = `M${shoulder.join(' ')}Q${33 + span * 0.05} ${39 - span * 1.3} ${tips[0].join(' ')}${scallop(tips[0], tips[1])}${scallop(tips[1], tips[2])}${scallop(tips[2], [36, 40])}z`
  const tailPath: Point[] =
    tail > 0 ? [[43, 50], [51, 54], [58, 51], [61, 44 - tail]] : [[43, 50], [50, 54], [55, 53]]
  const tailTip = tailPath[tailPath.length - 1]
  const backbone = trace(spine, 4)
  const foot = (x: number) =>
    smooth(
      [[x - 4.5, 57], [x - 2.5, 55.4], [x, 55], [x + 2.5, 55.4], [x + 4.5, 57], [x + 3.5, 59], [x - 3.5, 59]],
      true,
    )
  return (
    <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
      {wings > 0 && (
        <g>
          <path d={wing} {...paint(accent)} />
          {tips.map((tip) => (
            <path
              key={tip.join()}
              d={`M${shoulder.join(' ')}L${tip.join(' ')}`}
              {...line(accent.shade, 0.8)}
              opacity={0.6}
            />
          ))}
        </g>
      )}
      <path d={ribbon(tailPath, tail > 0 ? [8, 6, 3.5, 1.6] : [8, 5, 2.5])} {...paint(body)} />
      {tail > 1 && <path d={tri(tailTip[0], tailTip[1], 5, 5.5, 30)} {...paint(accent, 0.9)} />}
      {spikes > 0 &&
        backbone
          .filter((_, index) => index % 4 === 2)
          .slice(0, spikes + 1)
          .map(([x, y], index) => {
            const [px, py] = backbone[Math.max(0, index * 4 + 1)]
            const angle = (Math.atan2(x - px, py - y) * 180) / Math.PI - 90
            return <path key={x} d={tri(x, y, 3.6, 2.5 + spikes, angle)} {...paint(accent, 0.8)} />
          })}
      <path d={ribbon([[39, 50], [41, 58]], [8, 6])} {...paint(body)} />
      <path d={foot(41)} {...paint(body)} />
      <path d={ribbon([[26, 42], [19, 36], [16, 29]], [10, 8, 7])} {...paint(body)} />
      <path
        d={smooth(
          [[19, 45], [22, 38.5], [30, 36], [39, 37.5], [46, 43], [46.5, 51], [40, 56.5], [27, 57], [19, 52]],
          true,
        )}
        {...paint(body)}
      />
      {level('belly') > 0 && (
        <>
          <path
            d={smooth([[21, 46], [20, 52], [26, 56], [36, 56], [43, 51], [41, 46], [30, 45]], true)}
            fill={body.light}
          />
          <path d="M23 49H39M23 53H38" {...line(body.shade, 0.8)} opacity={0.3} />
        </>
      )}
      <path d={ribbon([[25, 50], [23, 58]], [7.5, 5.5])} {...paint(body)} />
      <path d={foot(23)} {...paint(body)} />
      {claws > 0 &&
        [19.5, 22.5, 37.5, 40.5].map((x) => (
          <path key={x} d={tri(x, 58.5, 1.6, 1.8, -100)} fill={WHITE} />
        ))}
      <g transform="translate(14 27) rotate(10) scale(-1 1)">
        <Head body={body} horns={horns} />
      </g>
      {fire > 0 && <Flame x={4.5} y={26.5} size={1 + fire} angle={-90} />}
      {fire > 2 && (
        <>
          <Sparkle x={52} y={14} size={2} color={{ ...GOLD, fill: '#ffb36b' }} />
          <Sparkle x={8} y={14} size={1.6} />
        </>
      )}
    </g>
  )
}

// Spine of the long eastern dragon from the tail end to the neck.
const coil: Point[] = [
  [59, 24],
  [56, 37],
  [49, 47],
  [39, 50],
  [31, 45],
  [26, 38],
  [20, 36],
]

function Ryu({ level, look: { body, accent } }: Props) {
  const points = coil.slice(coil.length - 3 - level('length'))
  const path = trace(points, 6)
  const whiskers = level('whiskers')
  const horns = level('horns')
  const mane = level('mane')
  const pearl = level('pearl')
  const cloud = level('cloud')
  const scales = level('scales')
  const widths = [
    1.8,
    ...points.slice(1).map((_, index) => 4 + ((index + 1) / (points.length - 1)) * 3.5),
  ]
  return (
    <>
      {cloud > 0 && <Cloud x={38} y={55} width={14 + cloud * 8} />}
      {mane > 0 &&
        path
          .filter((_, index) => index % 3 === 0)
          .slice(-4 - mane * 2)
          .map(([x, y], index) => (
            <Leaf
              key={index}
              x={x}
              y={y - 2}
              size={2.2 + mane * 0.5}
              angle={-25}
              color={accent}
              vein={false}
            />
          ))}
      <path d={ribbon(points, widths)} {...paint(body)} />
      <path
        d={ribbon(
          points.map(([x, y]) => [x, y + 1.2] as Point),
          widths.map((width) => width * 0.5),
        )}
        fill={body.light}
      />
      {scales > 0 &&
        path
          .filter((_, index) => index % 3 === 1)
          .slice(2)
          .map(([x, y], index) => (
            <path
              key={index}
              d={`M${x - 1.4} ${y - 1.8}a1.4 1.4 0 0 0 2.8 0`}
              {...line(scales > 1 && index % 2 ? accent.shade : body.shade, 0.8)}
              opacity={0.55}
            />
          ))}
      {pearl > 0 && (
        <>
          <path d={ribbon([[19, 40], [12, 44]], [3, 2.4])} {...paint(body)} />
          <circle cx={9.5} cy={45} r={2 + pearl * 0.8} fill={WHITE} stroke="#9fd3ff" strokeWidth={0.8} />
          <circle cx={8.7} cy={44.2} r={0.8} fill="#9fd3ff" />
        </>
      )}
      <g transform="translate(15 31) rotate(6) scale(-1 1)">
        <Head body={body} horns={horns} long>
          {whiskers > 0 &&
            [-1, 1].map((side) => (
              <path
                key={side}
                d={`M6.5 ${0.5 + side * 0.6}C${10 + whiskers} ${1 + side} ${11 + whiskers * 1.5} ${4 + whiskers} ${8 + whiskers * 1.2} ${6 + whiskers * 2 + side}`}
                {...line(accent.shade, 0.9)}
              />
            ))}
        </Head>
      </g>
      {cloud > 1 && <Sparkle x={52} y={14} size={2.4} />}
    </>
  )
}
