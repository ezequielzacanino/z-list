import type { ReactNode } from 'react'
import { creature, type Look } from '../creature'
import { FaceSide } from '../faces'
import {
  Cloud,
  drop,
  Flame,
  INK,
  line,
  ribbon,
  Silhouette,
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

// Dragon head in profile, snout toward +x, about sixteen units long with a heavy brow.
const skull: Point[] = [
  [-6, -3.5],
  [-2, -6],
  [3, -5.5],
  [6.5, -3.5],
  [9.5, -1.5],
  [9.8, 1],
  [7, 3],
  [2, 4],
  [-3.5, 3.8],
  [-6.8, 1],
]
const jaw: Point[] = [
  [-4, 1.4],
  [2, 1.2],
  [8.8, 1.4],
  [7, 3],
  [2, 3.9],
  [-3.5, 3.6],
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

// Horns of one head, drawn behind the head silhouette.
function Horns({ level, long = false }: { level: number; long?: boolean }) {
  if (level === 0) return null
  return (
    <Silhouette color={WHITE} width={1.8}>
      <g transform={long ? 'scale(1.12 1)' : undefined}>
        <path d={horn(-3.8, -4.4, 3 + level * 2.4, 1.6)} />
        <path d={horn(0.6, -5.3, 2 + level * 1.7, 1.3)} />
      </g>
    </Silhouette>
  )
}

// Face drawn over the head silhouette.
function Face({
  body,
  long = false,
  children,
}: {
  body: Look['body']
  long?: boolean
  children?: ReactNode
}) {
  return (
    <g transform={long ? 'scale(1.12 1)' : undefined}>
      <path d={smooth(jaw, true)} fill={body.light} />
      <circle cx={8.2} cy={-1.4} r={0.65} fill={INK} />
      <FaceSide x={1} y={-1.8} snout={8.2} />
      {children}
    </g>
  )
}

// Back line from the neck to the tail root, where spikes stand.
const spine: Point[] = [
  [17, 30],
  [21, 36],
  [28, 36.5],
  [36, 36],
  [42, 39],
  [44, 46],
]

const HEAD = 'translate(13 24) rotate(8) scale(-1.05 1.05)'

function Dragon({ level, look: { body, accent } }: Props) {
  const grow = 0.9 + level('size') * 0.04
  const wings = level('wings')
  const spikes = level('spikes')
  const horns = level('horns')
  const fire = level('fire')
  const tail = level('tail')
  const claws = level('claws')
  const span = 7 + wings * 4
  const shoulder: Point = [31, 38]
  const tips: Point[] = [
    [31 + span * 0.45, 38 - span * 1.55],
    [31 + span * 1.2, 38 - span * 1.15],
    [31 + span * 1.5, 38 - span * 0.45],
  ]
  const scallop = (from: Point, to: Point) => {
    const [mx, my] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2]
    const [cx, cy] = [mx + (shoulder[0] - mx) * 0.35, my + (shoulder[1] - my) * 0.35]
    return `Q${cx} ${cy} ${to[0]} ${to[1]}`
  }
  const wing = `M${shoulder.join(' ')}Q${31 + span * 0.05} ${38 - span * 1.3} ${tips[0].join(' ')}${scallop(tips[0], tips[1])}${scallop(tips[1], tips[2])}${scallop(tips[2], [34, 39])}z`
  const tailPath: Point[] =
    tail > 0 ? [[42, 48], [51, 53], [59, 49], [62, 41 - tail * 1.5]] : [[42, 48], [50, 53], [56, 52]]
  const tailTip = tailPath[tailPath.length - 1]
  const backbone = trace(spine, 4)
  return (
    <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
      {wings > 0 && (
        <g>
          <Silhouette color={accent.fill}>
            <path d={wing} />
          </Silhouette>
          {tips.map((tip) => (
            <path
              key={tip.join()}
              d={`M${shoulder.join(' ')}L${tip.join(' ')}`}
              {...line(accent.shade, 1)}
              opacity={0.5}
            />
          ))}
        </g>
      )}
      {(spikes > 0 || tail > 1) && (
        <Silhouette color={accent.fill} width={1.8}>
          {backbone
            .filter((_, index) => index % 4 === 2)
            .slice(0, spikes > 0 ? spikes + 1 : 0)
            .map(([x, y], index) => {
              const [px, py] = backbone[Math.max(0, index * 4 + 1)]
              const angle = (Math.atan2(x - px, py - y) * 180) / Math.PI - 90
              return <path key={x} d={tri(x, y, 3.6, 2.5 + spikes, angle)} />
            })}
          {tail > 1 && <path d={tri(tailTip[0], tailTip[1], 5, 5.5, 30)} />}
        </Silhouette>
      )}
      <g transform={HEAD}>
        <Horns level={horns} />
      </g>
      <Silhouette color={body.fill}>
        <path d={ribbon(tailPath, tail > 0 ? [7, 5, 3.2, 1.8] : [7, 4.5, 2.5])} />
        <path d={ribbon([[38, 47], [40, 53], [40, 57]], [7, 6, 6.5])} />
        {[36.5, 40, 43.5].map((x) => (
          <circle key={x} cx={x} cy={57.5} r={2} />
        ))}
        <path d={ribbon([[24, 41], [18, 34], [15, 27]], [9, 7, 6.5])} />
        <path
          d={smooth(
            [[21, 42], [27, 37], [36, 36.5], [43, 40], [45, 47], [41, 53], [30, 54], [22, 51]],
            true,
          )}
        />
        <path d={ribbon([[25, 48], [23, 53], [22, 57]], [6.5, 5.5, 6])} />
        {[18.5, 22, 25.5].map((x) => (
          <circle key={x} cx={x} cy={57.5} r={2} />
        ))}
        <g transform={HEAD}>
          <path d={smooth(skull, true)} />
        </g>
      </Silhouette>
      {level('belly') > 0 && (
        <>
          <path
            d={smooth([[22, 45], [23, 50], [29, 53], [38, 52.5], [42, 48], [40, 44], [31, 43]], true)}
            fill={body.light}
          />
          <path d="M24 47.5H39M25 50.5H38" {...line(body.shade, 0.8)} opacity={0.3} />
        </>
      )}
      {claws > 0 &&
        [18.5, 22, 36.5, 40].map((x) => <path key={x} d={tri(x, 59, 1.6, 1.8, -100)} fill={WHITE} />)}
      <g transform={HEAD}>
        <Face body={body} />
      </g>
      {fire > 0 && <Flame x={3} y={23.5} size={1 + fire} angle={-90} />}
      {fire > 2 && (
        <>
          <Sparkle x={52} y={14} size={2} color={{ fill: '#ffb36b', shade: '#a8781f', light: '#fff1c2' }} />
          <Sparkle x={8} y={12} size={1.6} />
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

const RYU_HEAD = 'translate(15 31) rotate(6) scale(-0.95 0.95)'

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
    2,
    ...points.slice(1).map((_, index) => 4.5 + ((index + 1) / (points.length - 1)) * 3.5),
  ]
  return (
    <>
      {cloud > 0 && <Cloud x={38} y={55} width={14 + cloud * 8} />}
      {mane > 0 && (
        <Silhouette color={accent.fill} width={1.8}>
          {path
            .filter((_, index) => index % 3 === 0)
            .slice(-4 - mane * 2)
            .map(([x, y], index) => (
              <path key={index} d={drop(x, y - 2, (2.2 + mane * 0.5) * 1.6, (2.2 + mane * 0.5) * 0.5, -25)} />
            ))}
        </Silhouette>
      )}
      <g transform={RYU_HEAD}>
        <Horns level={horns} long />
      </g>
      <Silhouette color={body.fill}>
        <path d={ribbon(points, widths)} />
        {pearl > 0 && <path d={ribbon([[19, 40], [12, 44]], [3.2, 2.6])} />}
        <g transform={RYU_HEAD}>
          <path d={smooth(skull, true)} transform="scale(1.12 1)" />
        </g>
      </Silhouette>
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
            <circle
              key={index}
              cx={x}
              cy={y - 1.6}
              r={0.9}
              fill={scales > 1 && index % 2 ? accent.fill : body.light}
            />
          ))}
      {pearl > 0 && (
        <>
          <circle cx={9.5} cy={45} r={2 + pearl * 0.8} fill={WHITE} stroke={INK} strokeWidth={1} />
          <circle cx={8.7} cy={44.2} r={0.8} fill="#9fd3ff" />
        </>
      )}
      <g transform={RYU_HEAD}>
        <Face body={body} long>
          {whiskers > 0 &&
            [-1, 1].map((side) => (
              <path
                key={side}
                d={`M8.5 ${0.8 + side * 0.6}C${12 + whiskers} ${1 + side} ${13 + whiskers * 1.5} ${4 + whiskers} ${10 + whiskers * 1.2} ${6 + whiskers * 2 + side}`}
                {...line(INK, 1)}
              />
            ))}
        </Face>
      </g>
      {cloud > 1 && <Sparkle x={52} y={14} size={2.4} />}
    </>
  )
}
