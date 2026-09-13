import { creature } from '../creature'
import {
  band,
  Blush,
  Eye,
  fan,
  Flame,
  Glow,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  poly,
  polar,
  Sparkle,
  spread,
  tone,
  tri,
} from '../kit'

type Step =
  | 'eyeliner'
  | 'ears'
  | 'collar'
  | 'stripes'
  | 'headdress'
  | 'size'
  | 'wings'
  | 'sun'
  | 'bell'
  | 'tails'
  | 'ghostfire'
  | 'eyes'
  | 'lantern'

const PINK = '#ff8fa3'
const ghostfires = [
  [10, 26],
  [54, 22],
  [8, 46],
  [56, 44],
]

// A kitten crowned into the winged Sphinx, or whose tail splits into the ghostly Nekomata.
export const cat = creature<Step>(
  [
    [
      'eyeliner',
      'ears',
      'collar',
      'stripes',
      'headdress',
      'size',
      'wings',
      'headdress',
      'collar',
      'ears',
      'size',
      'wings',
      'headdress',
      'stripes',
      'sun',
      'wings',
      'headdress',
      'size',
      'sun',
    ],
    [
      'ears',
      'bell',
      'tails',
      'stripes',
      'ghostfire',
      'size',
      'tails',
      'ears',
      'ghostfire',
      'eyes',
      'size',
      'stripes',
      'tails',
      'ghostfire',
      'lantern',
      'size',
      'eyes',
      'ghostfire',
      'lantern',
    ],
  ],
  (level, { body, accent }, nekomata) => {
    const grow = 0.88 + level('size') * 0.04
    const ears = level('ears')
    const headdress = level('headdress')
    const wings = level('wings')
    const tails = level('tails')
    const earHeight = 6 + ears * 2
    const cloth = tone(215, 60, 55)
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {level('sun') > 0 && (
          <>
            <Glow x={32} y={30} r={17} color={GOLD.fill} />
            <circle cx={32} cy={30} r={14} {...line(GOLD.fill, 2)} />
          </>
        )}
        {level('sun') > 1 &&
          spread(8, 0, 315).map((angle) => (
            <path key={angle} d={tri(...polar(32, 30, angle, 15.5), 2.4, 3, angle)} fill={GOLD.fill} />
          ))}
        {wings > 0 &&
          [-1, 1].map((side) =>
            spread(2 + wings, 30, 100).map((angle, index) => (
              <Leaf
                key={`${side}${angle}`}
                x={32 + side * 7}
                y={43}
                size={4 + wings * 1.8}
                angle={side * angle}
                color={index % 2 ? cloth : GOLD}
                vein={false}
              />
            )),
          )}
        {(nekomata ? (tails > 0 ? [-1, 1] : [1]) : [1]).map((side) => {
          const reach = nekomata ? 6 + tails * 2 : 7
          const from = 60 - reach * 4
          const [fx, fy] = polar(32 + side * 9, 48, side * from, 8)
          return (
            <g key={side}>
              <path
                d={side > 0 ? band(41, 48, 8, 3.2, from, 180) : band(23, 48, 8, 3.2, 180, 360 - from)}
                {...paint(body)}
              />
              {nekomata && tails > 2 && <Flame x={fx} y={fy - 1} size={2} cold />}
            </g>
          )
        })}
        <path d="M23 57.5V46A9 9 0 0 1 41 46V57.5z" {...paint(body)} />
        <path d="M28 55V50A4 4 0 0 1 36 50V55z" fill={body.light} />
        {level('stripes') > 1 && (
          <path d="M24.5 46h3M24 50h3M39.5 46h-3M40 50h-3" {...line(body.shade, 1)} opacity={0.5} />
        )}
        {[28, 36].map((x) => (
          <path key={x} d={fan(x, 57.5, 3, -90, 90)} {...paint(body)} />
        ))}
        {headdress > 1 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={poly([
                [32 + side * 8, 26],
                [32 + side * 11.5, headdress > 2 ? 47 : 41],
                [32 + side * 6.5, headdress > 2 ? 47 : 41],
                [32 + side * 5.5, 33],
              ])}
              {...paint(cloth, 1)}
            />
          ))}
        {headdress > 1 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${32 + side * 8.5} 32l${side * 2} 0M${32 + side * 9} 36l${side * 2} 0`}
              {...line(GOLD.fill, 1.2)}
            />
          ))}
        {!nekomata && level('collar') > 0 && (
          <path d="M25 38.5A10 10 0 0 0 39 38.5" {...line(GOLD.fill, level('collar') > 1 ? 3.6 : 2)} />
        )}
        {!nekomata &&
          level('collar') > 1 &&
          [28, 32, 36].map((x) => (
            <circle key={x} cx={x} cy={x === 32 ? 41.3 : 40.7} r={0.9} fill={cloth.fill} />
          ))}
        {level('bell') > 0 && (
          <>
            <path d="M25.5 38.5A9 9 0 0 0 38.5 38.5" {...line('#d64550', 1.8)} />
            <circle cx={32} cy={41.8} r={1.9} {...paint(GOLD, 0.6)} />
          </>
        )}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path
              d={poly([[32 + side * 3, 25], [32 + side * 7.5, 26 - earHeight], [32 + side * 9.5, 29]])}
              {...paint(body)}
            />
            <path
              d={poly([[32 + side * 5, 26], [32 + side * 7.4, 27.5 - earHeight * 0.75], [32 + side * 8.4, 28.5]])}
              fill={PINK}
              opacity={0.7}
            />
            {ears > 1 && (
              <path d={`M${32 + side * 7.5} ${26 - earHeight}l${side * 0.6} -2.5`} {...line(body.shade, 1)} />
            )}
          </g>
        ))}
        <circle cx={32} cy={31} r={8.8} {...paint(body)} />
        {level('stripes') > 0 && (
          <path d="M30.5 24v2.5M32 23.5v3M33.5 24v2.5" {...line(body.shade, 1)} opacity={0.5} />
        )}
        {headdress > 0 && <path d="M23.5 27A10 10 0 0 1 40.5 27" {...line(GOLD.fill, 2.4)} />}
        {headdress > 3 && <path d={poly([[32, 20.5], [33.6, 23], [32, 25.5], [30.4, 23]])} {...paint(GOLD, 0.7)} />}
        <Eye x={28} y={31} r={1.7} glow={nekomata && level('eyes') > 0 ? accent.fill : undefined} />
        <Eye x={36} y={31} r={1.7} glow={nekomata && level('eyes') > 1 ? accent.fill : undefined} />
        {level('eyeliner') > 0 && <path d="M26.2 30.6l-2.4-1M37.8 30.6l2.4-1" {...line(INK, 1)} />}
        <path d={tri(32, 33.7, 2, 1.1, 180)} fill={PINK} />
        <path d="M30.3 35.2A0.9 0.9 0 0 0 32 35.2A0.9 0.9 0 0 0 33.7 35.2" {...line(INK, 0.9)} />
        <path d="M26 34.3l-4-.6M26 35.6l-4 .6M38 34.3l4-.6M38 35.6l4 .6" {...line(body.shade, 0.7)} />
        <Blush x={25.8} y={33.6} r={1.5} />
        <Blush x={38.2} y={33.6} r={1.5} />
        {nekomata &&
          ghostfires.slice(0, level('ghostfire')).map(([x, y]) => (
            <g key={x}>
              <Glow x={x} y={y - 3} r={5} color={accent.fill} />
              <Flame x={x} y={y} size={2.4} cold />
            </g>
          ))}
        {level('lantern') > 0 && (
          <g>
            {level('lantern') > 1 && <Glow x={52} y={33} r={7} color="#ffb36b" />}
            <path d="M52 24v4" {...line(INK, 0.8)} />
            <circle cx={52} cy={33} r={4.2} fill="#f26b5b" stroke="#8c2f25" strokeWidth={0.8} />
            <path d="M48.3 31h7.4M48.3 35h7.4" {...line('#8c2f25', 0.6)} />
          </g>
        )}
        {level('sun') > 1 && <Sparkle x={9} y={20} size={2.2} />}
      </g>
    )
  },
)
