import { creature } from '../creature'
import { FaceFront } from '../faces'
import {
  Flame,
  Glow,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  polar,
  ribbon,
  Silhouette,
  smooth,
  Sparkle,
  spread,
  tone,
  tri,
  type Point,
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
    const tailPaths = (nekomata ? (tails > 0 ? [-1, 1] : [1]) : [1]).map((side) => {
      const reach = nekomata ? 6 + tails * 2 : 7
      return [
        [32 + side * 6, 54],
        [32 + side * 13, 52],
        [32 + side * (15 + reach * 0.3), 50 - reach],
        [32 + side * (12 + reach * 0.2), 44 - reach * 1.4],
      ] as Point[]
    })
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
        {nekomata &&
          tails > 2 &&
          tailPaths.map((path, index) => <Flame key={index} x={path[3][0]} y={path[3][1] - 1} size={2} cold />)}
        <Silhouette color={body.fill}>
          {tailPaths.map((path, index) => (
            <path key={index} d={ribbon(path, [3.6, 3.6, 3.2, 2.4])} />
          ))}
          <path d={smooth([[32, 37.5], [39, 40.5], [41.5, 49], [40.5, 57.5], [23.5, 57.5], [22.5, 49], [25, 40.5]], true)} />
          {[27.5, 36.5].map((x) => (
            <path key={x} d={ribbon([[x, 49], [x, 56.5]], [5, 5.5])} />
          ))}
          {[-1, 1].map((side) => (
            <path
              key={side}
              d={smooth([[32 + side * 3, 25], [32 + side * 7.5, 26 - earHeight], [32 + side * 10, 29.5]], true)}
            />
          ))}
          <path
            d={smooth(
              [[32, 22], [38.5, 23.5], [41.5, 29], [40.5, 35.5], [36, 39.5], [28, 39.5], [23.5, 35.5], [22.5, 29], [25.5, 23.5]],
              true,
            )}
          />
        </Silhouette>
        <path d={smooth([[32, 46], [36, 48], [36.5, 55], [27.5, 55], [28, 48]], true)} fill={body.light} />
        {level('stripes') > 1 && (
          <path d="M24.5 46h3M24 50h3M39.5 46h-3M40 50h-3" {...line(body.shade, 1)} opacity={0.5} />
        )}
        {headdress > 1 && (
          <Silhouette color={cloth.fill} width={1.6}>
            {[-1, 1].map((side) => (
              <path
                key={side}
                d={smooth(
                  [
                    [32 + side * 8, 25],
                    [32 + side * 12, headdress > 2 ? 46 : 40],
                    [32 + side * 6.5, headdress > 2 ? 47 : 41],
                    [32 + side * 5.5, 33],
                  ],
                  true,
                )}
              />
            ))}
          </Silhouette>
        )}
        {headdress > 1 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${32 + side * 8.5} 32l${side * 2} 0M${32 + side * 9} 36l${side * 2} 0`}
              {...line(GOLD.fill, 1.2)}
            />
          ))}
        {!nekomata && level('collar') > 0 && (
          <path d="M24.5 38Q32 43 39.5 38" {...line(GOLD.fill, level('collar') > 1 ? 3.6 : 2)} />
        )}
        {!nekomata &&
          level('collar') > 1 &&
          [28, 32, 36].map((x) => (
            <circle key={x} cx={x} cy={x === 32 ? 41.3 : 40.5} r={0.9} fill={cloth.fill} />
          ))}
        {level('bell') > 0 && (
          <>
            <path d="M25 38Q32 42.5 39 38" {...line('#d64550', 1.8)} />
            <circle cx={32} cy={41.8} r={1.9} {...paint(GOLD, 0.6)} />
          </>
        )}
        {[-1, 1].map((side) => (
          <path
            key={side}
            d={smooth([[32 + side * 5, 26], [32 + side * 7.4, 27.5 - earHeight * 0.75], [32 + side * 8.6, 28.5]], true)}
            fill={PINK}
            opacity={0.7}
          />
        ))}
        {level('stripes') > 0 && (
          <path d="M30.5 24v2.5M32 23.5v3M33.5 24v2.5" {...line(body.shade, 1)} opacity={0.5} />
        )}
        {headdress > 0 && <path d="M23.5 27.5Q32 22.5 40.5 27.5" {...line(GOLD.fill, 2.4)} />}
        {headdress > 3 && <path d={smooth([[32, 20.5], [33.6, 23], [32, 25.5], [30.4, 23]], true)} {...paint(GOLD, 0.7)} />}
        <FaceFront x={32} y={31} gap={4} />
        {nekomata && level('eyes') > 0 && <circle cx={28} cy={31} r={3} fill={accent.fill} opacity={0.35} />}
        {nekomata && level('eyes') > 1 && <circle cx={36} cy={31} r={3} fill={accent.fill} opacity={0.35} />}
        {level('eyeliner') > 0 && <path d="M26.2 30.6l-2.4-1M37.8 30.6l2.4-1" {...line(INK, 1)} />}
        <path d={tri(32, 33.6, 2, 1.1, 180)} fill={PINK} />
        <path d="M26 34.3l-4-.6M26 35.6l-4 .6M38 34.3l4-.6M38 35.6l4 .6" {...line(body.shade, 0.7)} />
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
