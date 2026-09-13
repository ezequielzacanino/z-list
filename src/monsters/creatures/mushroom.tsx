import { creature } from '../creature'
import { Blush, Eye, Glow, GOLD, LEAF, line, paint, Smile, tone, Tube, WHITE, WOOD } from '../kit'

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
        {glow > 0 && (
          <Glow x={32} y={top + height / 2} r={width / 2 + 4 + glow * 2} color={accent.light} />
        )}
        {level('moon') > 0 && (
          <path
            d={`M50 ${12 - level('moon') * 2}A${3 + level('moon') * 1.5} ${3 + level('moon') * 1.5} 0 1 0 50 ${12 + level('moon') * 2}A${2.2 + level('moon')} ${3 + level('moon') * 1.5} 0 1 1 50 ${12 - level('moon') * 2}z`}
            {...paint(GOLD, 0.7)}
          />
        )}
        {babies.slice(0, level('babies')).map(([x, y, scale]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${scale})`}>
            <rect
              x={-2}
              y={-6}
              width={4}
              height={6}
              rx={1.5}
              fill={STEM.fill}
              stroke={STEM.shade}
              strokeWidth={0.8}
            />
            <path d="M-6 -5.5Q-6 -12 0 -12Q6 -12 6 -5.5Q0 -4 -6 -5.5z" {...paint(capTone, 1)} />
            {lunar && <circle cx={0} cy={-9} r={1.2} fill={accent.light} />}
          </g>
        ))}
        {level('moss') > 0 &&
          [22, 27, 37, 42]
            .slice(0, level('moss') * 2)
            .map((x) => <ellipse key={x} cx={x} cy={57.5} rx={3} ry={1.6} fill={LEAF.fill} />)}
        {level('staff') > 0 && (
          <g>
            <Tube d="M17.5 58L15.5 34" color={WOOD} width={1.6} />
            {level('staff') > 1 ? (
              <>
                <Glow x={15.3} y={32} r={4} color={accent.light} />
                <circle
                  cx={15.3}
                  cy={32}
                  r={2.2}
                  fill={accent.light}
                  stroke={accent.shade}
                  strokeWidth={0.6}
                />
              </>
            ) : (
              <path d="M12 35Q12 31 15.5 31Q19 31 19 35z" {...paint(capTone, 0.8)} />
            )}
          </g>
        )}
        {level('arms') > 0 &&
          [-1, 1]
            .slice(0, level('arms') > 1 ? 2 : 1)
            .map((side) => (
              <Tube
                key={side}
                d={`M${32 + side * 7} 50q${side * 3} ${side > 0 ? -1 : 1} ${side * 5} ${side > 0 ? -5 : 3}`}
                color={STEM}
                width={1.8}
              />
            ))}
        <path d="M24 57.5C24 48 26 42 32 42C38 42 40 48 40 57.5z" {...paint(STEM)} />
        <Eye x={29.5} y={49.5} r={1.5} />
        <Eye x={34.5} y={49.5} r={1.5} />
        <Blush x={27} y={52.5} r={1.3} />
        <Blush x={37} y={52.5} r={1.3} />
        <Smile x={32} y={52.5} w={1.3} />
        <path
          d={`M${32 - width / 2} 44Q${32 - width / 2} ${top} 32 ${top}Q${32 + width / 2} ${top} ${32 + width / 2} 44Q32 47.5 ${32 - width / 2} 44z`}
          {...paint(capTone)}
        />
        {level('gills') > 0 && (
          <path
            d={`M${32 - width * 0.3} 45l1.5-1.5M28 45.8l.8-1.6M36 45.8l-.8-1.6M${32 + width * 0.3} 45l-1.5-1.5`}
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
              <circle
                key={`${x}${y}`}
                cx={x}
                cy={y}
                r={r * 0.8}
                fill={glow > 2 ? WHITE : accent.light}
              />
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
            <circle
              key={`${x}${y}`}
              cx={x}
              cy={y}
              r={1}
              fill="#f4ffb0"
              stroke="#b8c26a"
              strokeWidth={0.4}
            />
          ))}
        {[
          [12, 22],
          [52, 28],
          [18, 10],
        ]
          .slice(0, level('moths'))
          .map(([x, y]) => (
            <g key={x}>
              <ellipse
                cx={x - 1.6}
                cy={y}
                rx={1.8}
                ry={1.2}
                fill={WHITE}
                stroke="#b9c2cc"
                strokeWidth={0.5}
              />
              <ellipse
                cx={x + 1.6}
                cy={y}
                rx={1.8}
                ry={1.2}
                fill={WHITE}
                stroke="#b9c2cc"
                strokeWidth={0.5}
              />
            </g>
          ))}
      </>
    )
  },
)
