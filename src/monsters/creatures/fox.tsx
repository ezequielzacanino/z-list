import { creature } from '../creature'
import {
  Blush,
  capsule,
  Eye,
  fan,
  Flame,
  Glow,
  INK,
  line,
  paint,
  poly,
  polar,
  Sparkle,
  spread,
  tone,
  WHITE,
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
    const earTop = 12 - ears * 2
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {foxfire > 2 && <Glow x={32} y={38} r={27} color={snowy ? '#bfe6ff' : '#9fd7ff'} />}
        {angles.map((angle) => {
          const [tx, ty] = polar(32, 50, angle, 18)
          const [wx, wy] = polar(32, 50, angle, 19)
          return (
            <g key={angle}>
              <path d={capsule(32, 50, tx, ty, 7.5)} {...paint(body)} />
              <circle cx={wx} cy={wy} r={2.7} fill={WHITE} />
            </g>
          )
        })}
        <path d={poly([[32, 34], [44.5, 57.5], [19.5, 57.5]])} {...paint(body)} />
        <path d={poly([[32, 41], [37.5, 53], [26.5, 53]])} fill={WHITE} />
        {[28, 36].map((x) => (
          <path key={x} d={fan(x, 57.5, 3.2, -90, 90)} {...paint(body)} />
        ))}
        {level('bell') > 0 && (
          <>
            <path d="M26 42.5H38" {...line('#d64550', 1.8)} />
            <circle cx={32} cy={44.5} r={1.9} {...paint(tone(45, 90, 65), 0.6)} />
          </>
        )}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path d={poly([[32 + side * 15, 27], [32 + side * 13, earTop], [32 + side * 2, 22]])} {...paint(body)} />
            <path
              d={poly([[32 + side * 12.5, 23], [32 + side * 12, earTop + 5], [32 + side * 6, 21.5]])}
              fill={ears > 1 ? INK : body.shade}
              opacity={0.55}
            />
          </g>
        ))}
        <path d={poly([[14, 28], [32, 18], [50, 28], [32, 42]])} {...paint(body)} />
        <path d={poly([[17.5, 30], [46.5, 30], [32, 41]])} fill={WHITE} />
        <Eye x={26} y={27.5} r={1.7} />
        <Eye x={38} y={27.5} r={1.7} />
        <path d={poly([[30.4, 32], [33.6, 32], [32, 34.4]])} fill={INK} />
        <Blush x={22} y={31.8} r={1.5} />
        <Blush x={42} y={31.8} r={1.5} />
        {marks > 0 && (
          <path d="M17.5 26.5l3 .6M17.5 28.5l3 .1M46.5 26.5l-3 .6M46.5 28.5l-3 .1" {...line(MARK, 1.1)} />
        )}
        {marks > 1 && <path d={poly([[32, 20.5], [33.6, 23.5], [32, 26], [30.4, 23.5]])} fill={MARK} />}
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
