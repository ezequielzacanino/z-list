import { creature } from '../creature'
import { FaceFront } from '../faces'
import {
  Flame,
  Glow,
  INK,
  line,
  paint,
  polar,
  ribbon,
  Silhouette,
  smooth,
  Sparkle,
  spread,
  tone,
  WHITE,
  type Point,
} from '../kit'

type Step = 'tails' | 'ears' | 'marks' | 'foxfire' | 'bell' | 'size'

const MARK = '#e0475b'
const foxfires = [
  [11, 24],
  [53, 22],
  [9, 44],
]

// A fox kit that gains a tail at a time until it has nine: the kitsune, warm or snowy.
export const fox = creature<Step>(
  [
    [
      'ears',
      'tails',
      'tails',
      'marks',
      'tails',
      'size',
      'tails',
      'foxfire',
      'tails',
      'bell',
      'tails',
      'size',
      'tails',
      'foxfire',
      'marks',
      'tails',
      'size',
      'ears',
      'foxfire',
    ],
    [
      'tails',
      'ears',
      'marks',
      'tails',
      'tails',
      'size',
      'foxfire',
      'tails',
      'tails',
      'bell',
      'size',
      'tails',
      'foxfire',
      'tails',
      'marks',
      'ears',
      'tails',
      'size',
      'foxfire',
    ],
  ],
  (level, { body }, snowy) => {
    const tails = 1 + level('tails')
    // Tails alternate sides, fanning out around the body so every one of them shows.
    const right = Math.ceil(tails / 2)
    const angles = [
      ...spread(right, 50, right > 1 ? 118 : 75),
      ...spread(tails - right, -55, tails - right > 1 ? -118 : -75).slice(0, tails - right),
    ]
    const grow = 0.9 + level('size') * 0.04
    const ears = level('ears')
    const marks = level('marks')
    const foxfire = level('foxfire')
    const earTop = 11 - ears * 2
    const tailPaths = angles.map((angle) => {
      const bend = angle > 0 ? 18 : -18
      return [[32, 50], polar(32, 50, angle + bend, 9), polar(32, 50, angle, 19)] as Point[]
    })
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {foxfire > 2 && <Glow x={32} y={38} r={27} color={snowy ? '#bfe6ff' : '#9fd7ff'} />}
        <Silhouette color={body.fill}>
          {tailPaths.map((path, index) => (
            <path key={index} d={ribbon(path, [5, 8, 6])} />
          ))}
          <path d={smooth([[32, 33], [40, 38], [45, 50], [43, 57.5], [21, 57.5], [19, 50], [24, 38]], true)} />
          {[27, 37].map((x) => (
            <path key={x} d={smooth([[x - 3.5, 55], [x, 53.8], [x + 3.5, 55], [x + 3, 58], [x - 3, 58]], true)} />
          ))}
          {[-1, 1].map((side) => (
            <path
              key={side}
              d={smooth([[32 + side * 15, 27], [32 + side * 13.5, earTop], [32 + side * 4, 21]], true)}
            />
          ))}
          <path
            d={smooth(
              [[32, 18.5], [42, 22], [49.5, 28.5], [43, 38], [32, 42.5], [21, 38], [14.5, 28.5], [22, 22]],
              true,
            )}
          />
        </Silhouette>
        {tailPaths.map((path, index) => (
          <circle key={index} cx={path[2][0]} cy={path[2][1]} r={3} fill={WHITE} />
        ))}
        <path d={smooth([[32, 41], [37, 45], [38, 53], [26, 53], [27, 45]], true)} fill={WHITE} />
        {level('bell') > 0 && (
          <>
            <path d="M25 42Q32 44.5 39 42" {...line('#d64550', 1.8)} />
            <circle cx={32} cy={45} r={1.9} {...paint(tone(45, 90, 65), 0.6)} />
          </>
        )}
        {[-1, 1].map((side) => (
          <path
            key={side}
            d={smooth([[32 + side * 12.5, 24.5], [32 + side * 12, earTop + 5], [32 + side * 7, 22]], true)}
            fill={ears > 1 ? INK : body.shade}
            opacity={0.55}
          />
        ))}
        <path d={smooth([[24, 30], [32, 28.5], [40, 30], [44, 32], [32, 41], [20, 32]], true)} fill={WHITE} />
        <FaceFront x={32} y={28} gap={6} />
        <path d={smooth([[30.4, 32.5], [33.6, 32.5], [32, 34.8]], true)} fill={INK} />
        {marks > 0 && (
          <path d="M17.5 26.5l3 .6M17.5 28.5l3 .1M46.5 26.5l-3 .6M46.5 28.5l-3 .1" {...line(MARK, 1.1)} />
        )}
        {marks > 1 && <path d={smooth([[32, 20.5], [33.6, 23.5], [32, 26], [30.4, 23.5]], true)} fill={MARK} />}
        {foxfires.slice(0, foxfire).map(([x, y]) => (
          <g key={x}>
            <Glow x={x} y={y - 3} r={5} color="#bfe6ff" />
            <Flame x={x} y={y} size={2.5} cold />
          </g>
        ))}
        {foxfire > 2 && <Sparkle x={50} y={46} size={2} />}
      </g>
    )
  },
)
