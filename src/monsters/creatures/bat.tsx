import { creature } from '../creature'
import {
  Blush,
  Eye,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  Smile,
  Sparkle,
  spread,
  tone,
  WHITE,
} from '../kit'

type Step =
  | 'ears'
  | 'wings'
  | 'fangs'
  | 'size'
  | 'bowtie'
  | 'cape'
  | 'moon'
  | 'eyes'
  | 'jade'
  | 'feathers'
  | 'sun'

const NIGHT = tone(250, 20, 22)
const RED = tone(355, 65, 52)
const JADE = tone(155, 55, 48)
const QUETZAL = tone(160, 60, 42)

// A round bat that dresses up as a cozy vampire, or rises as Camazotz under an obsidian sun.
export const bat = creature<Step>(
  [
    [
      'ears',
      'wings',
      'fangs',
      'size',
      'wings',
      'bowtie',
      'cape',
      'ears',
      'wings',
      'moon',
      'size',
      'cape',
      'fangs',
      'moon',
      'wings',
      'size',
      'cape',
      'eyes',
      'moon',
    ],
    [
      'ears',
      'wings',
      'jade',
      'size',
      'wings',
      'ears',
      'feathers',
      'jade',
      'wings',
      'size',
      'feathers',
      'eyes',
      'ears',
      'jade',
      'wings',
      'sun',
      'size',
      'feathers',
      'sun',
    ],
  ],
  (level, { body, hue }, camazotz) => {
    const grow = 0.86 + level('size') * 0.045
    const wing = tone(hue, 30, 48)
    const wings = level('wings')
    const ears = level('ears')
    const cape = level('cape')
    const moon = level('moon')
    const sun = level('sun')
    const feathers = level('feathers')
    const earHeight = 6 + ears * 2.4
    const glow = level('eyes') > 0 ? (camazotz ? GOLD.fill : '#ff5a6e') : undefined
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {moon > 0 && (
          <path
            d={`M50 ${14 - moon * 2}A${2.5 + moon * 1.5} ${2.5 + moon * 1.5} 0 1 0 50 ${14 + moon * 2}A${2 + moon} ${2.5 + moon * 1.5} 0 1 1 50 ${14 - moon * 2}z`}
            {...paint(GOLD, 0.7)}
          />
        )}
        {sun > 0 && (
          <circle cx={32} cy={34} r={15} fill={NIGHT.fill} stroke={GOLD.fill} strokeWidth={1.6} />
        )}
        {sun > 1 &&
          spread(10, 0, 324).map((angle) => (
            <path
              key={angle}
              d="M32 17.5v-3"
              {...line(GOLD.fill, 1.6)}
              transform={`rotate(${angle} 32 34)`}
            />
          ))}
        {feathers > 0 &&
          spread(1 + feathers * 2, -55, 55).map((angle, index) => (
            <Leaf
              key={angle}
              x={32}
              y={30}
              size={4 + feathers * 1.2}
              angle={angle}
              color={index % 2 ? GOLD : QUETZAL}
              vein={false}
            />
          ))}
        {cape > 0 && (
          <path d={`M21 38Q${15 - cape} 58 22 58.5H42Q${49 + cape} 58 43 38z`} {...paint(NIGHT)} />
        )}
        {cape > 1 && <path d="M24 42Q20 56 25 57H39Q44 56 40 42z" fill={RED.fill} />}
        {cape > 2 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${32 + side * 5} 43L${32 + side * 12} 31L${32 + side * 10} 44z`}
              {...paint(NIGHT)}
            />
          ))}
        {wings > 0 &&
          [-1, 1].map((side) => {
            const s = 5 + wings * 3
            const x = 32 + side * 7
            const y = 39
            return (
              <path
                key={side}
                d={`M${x} ${y - 3}Q${x + side * s * 0.6} ${y - s * 0.9} ${x + side * s * 1.3} ${y - s * 0.3}Q${x + side * s * 1.1} ${y + s * 0.05} ${x + side * s * 1.2} ${y + s * 0.4}Q${x + side * s * 0.85} ${y + s * 0.15} ${x + side * s * 0.7} ${y + s * 0.5}Q${x + side * s * 0.4} ${y + s * 0.2} ${x} ${y + s * 0.45}z`}
                {...paint(wing)}
              />
            )
          })}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path
              d={`M${32 + side * 3} 34L${32 + side * 7} ${33 - earHeight}L${32 + side * 10} 36z`}
              {...paint(body)}
            />
            <path
              d={`M${32 + side * 5} 34.5L${32 + side * 7} ${35 - earHeight * 0.8}L${32 + side * 8.4} 35.5z`}
              fill="#ff9fb3"
              opacity={0.6}
            />
            {level('jade') > 0 && (
              <circle cx={32 + side * 9.5} cy={38.5} r={1.3} {...paint(JADE, 0.6)} />
            )}
          </g>
        ))}
        <path
          d="M28 52.5l-1 2.5M30 53l-.4 2.6M34 53l.4 2.6M36 52.5l1 2.5"
          {...line(body.shade, 1)}
        />
        <circle cx={32} cy={42} r={10.5} {...paint(body)} />
        <ellipse cx={32} cy={46.5} rx={6} ry={5} fill={body.light} />
        <Eye x={28.5} y={40} r={1.7} glow={glow} />
        <Eye x={35.5} y={40} r={1.7} glow={glow} />
        <ellipse cx={32} cy={42.5} rx={1} ry={0.7} fill={INK} />
        <Smile x={32} y={43.8} w={1.8} />
        {level('fangs') > 0 &&
          [30.8, 33.2].map((x) => (
            <path
              key={x}
              d={`M${x - 0.7} 44.4L${x + 0.7} 44.4L${x} ${45.6 + level('fangs') * 0.6}z`}
              fill={WHITE}
              stroke={INK}
              strokeWidth={0.4}
            />
          ))}
        <Blush x={25.5} y={43.5} r={1.6} />
        <Blush x={38.5} y={43.5} r={1.6} />
        {level('bowtie') > 0 && (
          <g>
            <path d="M32 51.5L27.5 49.5V53.5zM32 51.5L36.5 49.5V53.5z" {...paint(RED, 0.7)} />
            <circle cx={32} cy={51.5} r={1} fill={RED.shade} />
          </g>
        )}
        {level('jade') > 1 &&
          [28, 30, 32, 34, 36].map((x) => (
            <circle key={x} cx={x} cy={x === 32 ? 51.5 : 51} r={0.9} fill={JADE.fill} />
          ))}
        {level('jade') > 2 && <circle cx={32} cy={54} r={1.8} {...paint(JADE, 0.6)} />}
        {(moon > 2 || sun > 1) && <Sparkle x={10} y={20} size={2.2} />}
      </g>
    )
  },
)
