import { creature } from '../creature'
import { Blush, capsule, Eye, fan, Glow, GOLD, LEAF, line, paint, Smile, tone, WHITE, WOOD } from '../kit'

type Step =
  | 'spots'
  | 'cap'
  | 'babies'
  | 'arms'
  | 'moss'
  | 'spores'
  | 'staff'
  | 'glow'
  | 'gills'
  | 'moths'
  | 'moon'
  | 'dots'

const STEM = tone(40, 35, 90)
const babies = [
  [12, 58, 0.8],
  [52, 58, 0.95],
  [6.5, 58, 0.6],
  [57.5, 58, 0.7],
]

// A little mushroom that gathers a family and a staff as forest guardian, or glows as a moon mushroom.
export const mushroom = creature<Step>(
  [
    [
      'spots',
      'cap',
      'babies',
      'spots',
      'arms',
      'cap',
      'babies',
      'moss',
      'spores',
      'babies',
      'staff',
      'cap',
      'spots',
      'spores',
      'babies',
      'moss',
      'staff',
      'arms',
      'spores',
    ],
    [
      'dots',
      'cap',
      'glow',
      'gills',
      'babies',
      'glow',
      'cap',
      'moths',
      'babies',
      'dots',
      'glow',
      'moon',
      'cap',
      'moths',
      'babies',
      'gills',
      'glow',
      'moon',
      'moths',
    ],
  ],
  (level, { body, accent, accentHue }, lunar) => {
    const cap = level('cap')
    const width = 24 + cap * 4
    const height = 11 + cap * 2
    const capTone = lunar ? tone(accentHue, 45, 72) : body
    const glow = level('glow')
    const top = 44 - height
    const spots = [
      [32, top + 3, 1.8],
      [32 - width * 0.28, top + height * 0.5, 1.5],
      [32 + width * 0.3, top + height * 0.45, 1.6],
      [32 - width * 0.12, top + height * 0.72, 1.1],
      [32 + width * 0.12, top + height * 0.75, 1.2],
      [32 - width * 0.4, 42, 1],
    ]
    return (
      <>
        {glow > 0 && <Glow x={32} y={top + height / 2} r={width / 2 + 4 + glow * 2} color={accent.light} />}
        {level('moon') > 0 && (
          <path
            d={`M50 ${12 - level('moon') * 2}A${3 + level('moon') * 1.5} ${3 + level('moon') * 1.5} 0 1 0 50 ${12 + level('moon') * 2}A${2.2 + level('moon')} ${3 + level('moon') * 1.5} 0 1 1 50 ${12 - level('moon') * 2}z`}
            {...paint(GOLD, 0.7)}
          />
        )}
        {babies.slice(0, level('babies')).map(([x, y, scale]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}>
            <rect x={-2} y={-6} width={4} height={6} rx={1.5} fill={STEM.fill} stroke={STEM.shade} strokeWidth={0.8} />
            <path d={fan(0, -5.5, 6, -90, 90)} {...paint(capTone, 1)} />
            {lunar && <circle cx={0} cy={-8.5} r={1.2} fill={accent.light} />}
          </g>
        ))}
        {level('moss') > 0 &&
          [22, 27, 37, 42]
            .slice(0, level('moss') * 2)
            .map((x) => <path key={x} d={fan(x, 58, 2.6, -90, 90)} fill={LEAF.fill} />)}
        {level('staff') > 0 && (
          <g>
            <path d={capsule(17.5, 58, 15.5, 34, 1.8)} {...paint(WOOD, 0.8)} />
            {level('staff') > 1 ? (
              <>
                <Glow x={15.3} y={32} r={4} color={accent.light} />
                <circle cx={15.3} cy={32} r={2.2} fill={accent.light} stroke={accent.shade} strokeWidth={0.6} />
              </>
            ) : (
              <path d={fan(15.5, 35, 3.5, -90, 90)} {...paint(capTone, 0.8)} />
            )}
          </g>
        )}
        {level('arms') > 0 &&
          [-1, 1]
            .slice(0, level('arms') > 1 ? 2 : 1)
            .map((side) => (
              <path
                key={side}
                d={capsule(32 + side * 7, 50, 32 + side * 12, side > 0 ? 45 : 53, 1.8)}
                {...paint(STEM, 1)}
              />
            ))}
        <path d="M24 57.5V49A8 8 0 0 1 40 49V57.5z" {...paint(STEM)} />
        <Eye x={29.5} y={49.5} r={1.5} />
        <Eye x={34.5} y={49.5} r={1.5} />
        <Blush x={27} y={52.5} r={1.3} />
        <Blush x={37} y={52.5} r={1.3} />
        <Smile x={32} y={52.3} w={1.3} />
        <path d={`M${32 - width / 2} 44A${width / 2} ${height} 0 0 1 ${32 + width / 2} 44z`} {...paint(capTone)} />
        {level('gills') > 0 && (
          <path
            d={`M${32 - width * 0.3} 45.5l1.5-1.5M28 46l.8-1.6M36 46l-.8-1.6M${32 + width * 0.3} 45.5l-1.5-1.5`}
            {...line(capTone.shade, 0.7)}
          />
        )}
        {!lunar &&
          spots
            .slice(0, level('spots') * 2)
            .map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={WHITE} />)}
        {lunar &&
          spots
            .slice(0, level('dots') * 3)
            .map(([x, y, r]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={r * 0.8} fill={glow > 2 ? WHITE : accent.light} />
            ))}
        {[
          [14, 26],
          [50, 30],
          [20, 14],
          [44, 16],
          [8, 40],
          [56, 44],
        ]
          .slice(0, level('spores') * 2)
          .map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={1} fill="#f4ffb0" stroke="#b8c26a" strokeWidth={0.4} />
          ))}
        {[
          [12, 22],
          [52, 28],
          [18, 10],
        ]
          .slice(0, level('moths'))
          .map(([x, y]) => (
            <g key={x}>
              {[-1.4, 1.4].map((offset) => (
                <circle key={offset} cx={x + offset} cy={y} r={1.4} fill={WHITE} stroke="#b9c2cc" strokeWidth={0.5} />
              ))}
            </g>
          ))}
      </>
    )
  },
)
