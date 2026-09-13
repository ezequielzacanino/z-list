import { creature } from '../creature'
import {
  Blush,
  Eye,
  Flame,
  Glow,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  Sparkle,
  spread,
  tone,
  Tube,
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
            <path
              key={angle}
              d="M32 13v-4"
              {...line(GOLD.fill, 1.6)}
              transform={`rotate(${angle} 32 30)`}
            />
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
          const d = `M${32 + side * 8} 55C${32 + side * 16} 55 ${32 + side * 18} ${48 - reach} ${32 + side * 15} ${42 - reach}`
          return (
            <g key={side}>
              <Tube d={d} color={body} width={3} />
              {nekomata && tails > 2 && <Flame x={32 + side * 15} y={41 - reach} size={2} cold />}
            </g>
          )
        })}
        <path d="M32 37C41 39 43 49 41 57H23C21 49 23 39 32 37z" {...paint(body)} />
        <ellipse cx={32} cy={50} rx={4.5} ry={5.5} fill={body.light} />
        {level('stripes') > 1 && (
          <path
            d="M24.5 46q2 1 3 0M24 50q2 1 3 0M39.5 46q-2 1-3 0M40 50q-2 1-3 0"
            {...line(body.shade, 1)}
            opacity={0.5}
          />
        )}
        {[28, 36].map((x) => (
          <ellipse key={x} cx={x} cy={57.3} rx={3} ry={1.9} {...paint(body)} />
        ))}
        {headdress > 1 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${32 + side * 8} 26Q${32 + side * 12} 34 ${32 + side * 11} ${headdress > 2 ? 47 : 41}H${32 + side * 6.5}L${32 + side * 5.5} 33z`}
              fill={cloth.fill}
              stroke={cloth.shade}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          ))}
        {headdress > 1 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${32 + side * 9} 32l${side * 2} 0M${32 + side * 9.5} 36l${side * 2} 0`}
              {...line(GOLD.fill, 1.2)}
            />
          ))}
        {!nekomata && level('collar') > 0 && (
          <path d="M25 38.5Q32 43 39 38.5" {...line(GOLD.fill, level('collar') > 1 ? 3.6 : 2)} />
        )}
        {!nekomata &&
          level('collar') > 1 &&
          [28, 32, 36].map((x) => (
            <circle key={x} cx={x} cy={x === 32 ? 41.4 : 40.6} r={0.9} fill={cloth.fill} />
          ))}
        {level('bell') > 0 && (
          <>
            <path d="M25.5 38.5Q32 42 38.5 38.5" {...line('#d64550', 1.8)} />
            <circle cx={32} cy={41.8} r={1.9} {...paint(GOLD, 0.6)} />
          </>
        )}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path
              d={`M${32 + side * 3} 25L${32 + side * 7.5} ${26 - earHeight}L${32 + side * 9.5} 29z`}
              {...paint(body)}
            />
            <path
              d={`M${32 + side * 5} 26L${32 + side * 7.4} ${27.5 - earHeight * 0.75}L${32 + side * 8.4} 28.5z`}
              fill={PINK}
              opacity={0.7}
            />
            {ears > 1 && (
              <path
                d={`M${32 + side * 7.5} ${26 - earHeight}l${side * 0.6} -2.5`}
                {...line(body.shade, 1)}
              />
            )}
          </g>
        ))}
        <ellipse cx={32} cy={31} rx={9.5} ry={8} {...paint(body)} />
        {level('stripes') > 0 && (
          <path d="M30.5 24.3v2.5M32 23.8v3M33.5 24.3v2.5" {...line(body.shade, 1)} opacity={0.5} />
        )}
        {headdress > 0 && <path d="M23.5 27Q32 21.5 40.5 27" {...line(GOLD.fill, 2.4)} />}
        {headdress > 3 && (
          <path
            d="M32 20.5C33.8 22 33.4 24.5 32 25.2C30.6 24.5 30.2 22 32 20.5z"
            {...paint(GOLD, 0.7)}
          />
        )}
        <Eye x={28} y={31} r={1.7} glow={nekomata && level('eyes') > 0 ? accent.fill : undefined} />
        <Eye x={36} y={31} r={1.7} glow={nekomata && level('eyes') > 1 ? accent.fill : undefined} />
        {level('eyeliner') > 0 && <path d="M26.2 30.6l-2.4-1M37.8 30.6l2.4-1" {...line(INK, 1)} />}
        <path d="M31 33.8h2l-1 1.1z" fill={PINK} />
        <path d="M30.3 35.4Q31.2 36.2 32 35.4Q32.8 36.2 33.7 35.4" {...line(INK, 0.9)} />
        <path
          d="M26 34.3l-4-.6M26 35.6l-4 .6M38 34.3l4-.6M38 35.6l4 .6"
          {...line(body.shade, 0.7)}
        />
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
            <ellipse
              cx={52}
              cy={33}
              rx={3.6}
              ry={4.6}
              fill="#f26b5b"
              stroke="#8c2f25"
              strokeWidth={0.8}
            />
            <path d="M48.8 31h6.4M48.6 35h6.8" {...line('#8c2f25', 0.6)} />
          </g>
        )}
        {level('sun') > 1 && <Sparkle x={9} y={20} size={2.2} />}
      </g>
    )
  },
)
