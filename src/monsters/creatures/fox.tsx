import { creature } from '../creature'
import {
  Blush,
  Eye,
  Flame,
  Glow,
  INK,
  line,
  paint,
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
    const earHeight = 5 + ears * 2
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {foxfire > 2 && <Glow x={32} y={38} r={27} color={snowy ? '#bfe6ff' : '#9fd7ff'} />}
        {angles.map((angle) => {
          const length = 22
          const tip = polar(32, 52, angle, length)
          const middle = polar(32, 52, angle, length * 0.55)
          const left = polar(...middle, angle - 90, 7)
          const edge = polar(...middle, angle + 90, 7)
          const white = polar(32, 52, angle, length * 0.84)
          return (
            <g key={angle}>
              <path
                d={`M32 52Q${left.join(' ')} ${tip.join(' ')}Q${edge.join(' ')} 32 52z`}
                {...paint(body)}
              />
              <circle cx={white[0]} cy={white[1]} r={2.6} fill={WHITE} />
            </g>
          )
        })}
        <path d="M32 35C40 37 42 48 40 57H24C22 48 24 37 32 35z" {...paint(body)} />
        <ellipse cx={32} cy={49} rx={4.5} ry={6} fill={WHITE} />
        {[28.5, 35.5].map((x) => (
          <rect key={x} x={x - 2} y={52} width={4} height={6} rx={2} {...paint(body)} />
        ))}
        {level('bell') > 0 && (
          <>
            <path d="M26 39Q32 42 38 39" {...line('#d64550', 1.8)} />
            <circle cx={32} cy={42} r={1.9} {...paint(tone(45, 90, 65), 0.6)} />
          </>
        )}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path
              d={`M${32 + side * 4} 25L${32 + side * 8} ${25 - earHeight}L${32 + side * 10.5} 28z`}
              {...paint(body)}
            />
            <path
              d={`M${32 + side * 6} 25.5L${32 + side * 8} ${26.5 - earHeight * 0.7}L${32 + side * 9.3} 27.5z`}
              fill={ears > 1 ? INK : body.shade}
              opacity={0.55}
            />
          </g>
        ))}
        <path
          d="M21.5 29.5Q23.5 22.5 32 23.5Q40.5 22.5 42.5 29.5Q40.5 37 32 39Q23.5 37 21.5 29.5z"
          {...paint(body)}
        />
        <path d="M23.5 32Q28 36.5 32 39Q36 36.5 40.5 32Q36 35 32 35Q28 35 23.5 32z" fill={WHITE} />
        <Eye x={28} y={30} r={1.6} />
        <Eye x={36} y={30} r={1.6} />
        <ellipse cx={32} cy={34.2} rx={1.2} ry={0.9} fill={INK} />
        <Blush x={25.5} y={33.5} r={1.5} />
        <Blush x={38.5} y={33.5} r={1.5} />
        {marks > 0 && (
          <path
            d="M22.8 30.5l2.6 .8M22.8 32.3l2.4 .4M41.2 30.5l-2.6 .8M41.2 32.3l-2.4 .4"
            {...line(MARK, 1.1)}
          />
        )}
        {marks > 1 && (
          <path d="M32 24.5C33.3 26 33 27.6 32 28.3C31 27.6 30.7 26 32 24.5z" fill={MARK} />
        )}
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
