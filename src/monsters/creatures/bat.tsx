import { creature } from '../creature'
import { Blush, Eye, GOLD, INK, Leaf, line, paint, poly, polar, Smile, Sparkle, spread, tone, tri, WHITE } from '../kit'

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
        {sun > 0 && <circle cx={32} cy={34} r={15} fill={NIGHT.fill} stroke={GOLD.fill} strokeWidth={1.6} />}
        {sun > 1 &&
          spread(10, 0, 324).map((angle) => (
            <path key={angle} d={tri(...polar(32, 34, angle, 16.2), 2.2, 2.8, angle)} fill={GOLD.fill} />
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
        {cape > 0 && <path d={poly([[21, 38], [15 - cape, 58.5], [49 + cape, 58.5], [43, 38]])} {...paint(NIGHT)} />}
        {cape > 1 && <path d={poly([[24, 42], [21, 57], [43, 57], [40, 42]])} fill={RED.fill} />}
        {cape > 2 &&
          [-1, 1].map((side) => (
            <path key={side} d={poly([[32 + side * 5, 43], [32 + side * 12, 31], [32 + side * 10, 44]])} {...paint(NIGHT)} />
          ))}
        {wings > 0 &&
          [-1, 1].map((side) => {
            const s = 5 + wings * 3
            const x = 32 + side * 7
            const y = 39
            return (
              <path
                key={side}
                d={poly([
                  [x, y - 3],
                  [x + side * s * 1.3, y - s * 0.5],
                  [x + side * s * 1.15, y + s * 0.35],
                  [x + side * s * 0.8, y + s * 0.1],
                  [x + side * s * 0.45, y + s * 0.45],
                  [x, y + s * 0.3],
                ])}
                {...paint(wing)}
              />
            )
          })}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path d={poly([[32 + side * 3, 34], [32 + side * 7, 33 - earHeight], [32 + side * 10, 36]])} {...paint(body)} />
            <path
              d={poly([[32 + side * 5, 34.5], [32 + side * 7, 35 - earHeight * 0.8], [32 + side * 8.4, 35.5]])}
              fill="#ff9fb3"
              opacity={0.6}
            />
            {level('jade') > 0 && <circle cx={32 + side * 9.5} cy={38.5} r={1.3} {...paint(JADE, 0.6)} />}
          </g>
        ))}
        <path d="M28 52.5l-1 2.5M30 53l-.4 2.6M34 53l.4 2.6M36 52.5l1 2.5" {...line(body.shade, 1)} />
        <circle cx={32} cy={42} r={10.5} {...paint(body)} />
        <circle cx={32} cy={46.5} r={5.4} fill={body.light} />
        <Eye x={28.5} y={40} r={1.7} glow={glow} />
        <Eye x={35.5} y={40} r={1.7} glow={glow} />
        <circle cx={32} cy={42.4} r={0.9} fill={INK} />
        <Smile x={32} y={43.6} w={1.8} />
        {level('fangs') > 0 &&
          [30.8, 33.2].map((x) => (
            <path key={x} d={tri(x, 44.3, 1.4, 1.3 + level('fangs') * 0.6, 180)} fill={WHITE} stroke={INK} strokeWidth={0.4} />
          ))}
        <Blush x={25.5} y={43.5} r={1.6} />
        <Blush x={38.5} y={43.5} r={1.6} />
        {level('bowtie') > 0 && (
          <g>
            <path d={`${tri(32, 51.5, 4, 4.5, -90)}${tri(32, 51.5, 4, 4.5, 90)}`} {...paint(RED, 0.7)} />
            <circle cx={32} cy={51.5} r={1} fill={RED.shade} />
          </g>
        )}
        {level('jade') > 1 &&
          [28, 30, 32, 34, 36].map((x) => <circle key={x} cx={x} cy={x === 32 ? 51.5 : 51} r={0.9} fill={JADE.fill} />)}
        {level('jade') > 2 && <circle cx={32} cy={54} r={1.8} {...paint(JADE, 0.6)} />}
        {(moon > 2 || sun > 1) && <Sparkle x={10} y={20} size={2.2} />}
      </g>
    )
  },
)
