import { creature } from '../creature'
import { Blush, Eye, Glow, GOLD, INK, Leaf, line, paint, Sparkle, Tube, WATER, WHITE } from '../kit'

type Step =
  | 'fins'
  | 'scales'
  | 'whiskers'
  | 'waterfall'
  | 'horns'
  | 'mane'
  | 'legs'
  | 'patterns'
  | 'coins'
  | 'lotus'
  | 'glow'

const coins = [
  [12, 18],
  [53, 14],
  [9, 44],
  [55, 50],
]
const patches = [
  [35, 34, 4, 2.6],
  [27, 40, 3, 2],
  [42, 40.5, 2.6, 1.8],
]

// A koi that climbs the waterfall and turns into a dragon, or a golden koi that gathers coins.
export const koi = creature<Step>(
  [
    [
      'fins',
      'scales',
      'whiskers',
      'fins',
      'waterfall',
      'whiskers',
      'scales',
      'horns',
      'fins',
      'mane',
      'waterfall',
      'horns',
      'legs',
      'whiskers',
      'mane',
      'horns',
      'legs',
      'mane',
      'waterfall',
    ],
    [
      'patterns',
      'fins',
      'scales',
      'coins',
      'whiskers',
      'fins',
      'patterns',
      'coins',
      'scales',
      'lotus',
      'fins',
      'coins',
      'glow',
      'patterns',
      'scales',
      'whiskers',
      'coins',
      'lotus',
      'glow',
    ],
  ],
  (level, { body, accent }, golden) => {
    const fins = level('fins')
    const waterfall = level('waterfall')
    const whiskers = level('whiskers')
    const horns = level('horns')
    const scales = level('scales')
    return (
      <>
        {waterfall > 0 && (
          <g opacity={0.9}>
            {waterfall > 1 && (
              <rect x={40} y={4} width={16} height={54} rx={4} fill={WATER.light} opacity={0.7} />
            )}
            <path d="M44 4V56M49 4V58M54 4V55" {...line(WATER.shade, 1.1)} opacity={0.5} />
          </g>
        )}
        {waterfall > 2 && <Glow x={32} y={36} r={27} color={WATER.fill} />}
        {level('glow') > 1 && <Glow x={32} y={36} r={27} color={GOLD.fill} />}
        {level('lotus') > 0 && (
          <g>
            <ellipse
              cx={32}
              cy={57}
              rx={10 + level('lotus') * 3}
              ry={2.6}
              fill="hsl(110 45% 62%)"
              stroke="hsl(110 35% 30%)"
              strokeWidth={0.8}
            />
            {[-40, -15, 15, 40].map((angle) => (
              <Leaf
                key={angle}
                x={32}
                y={57}
                size={2.5 + level('lotus')}
                angle={angle}
                color={{ fill: '#ffb3c1', shade: '#b0566a', light: WHITE }}
                vein={false}
              />
            ))}
          </g>
        )}
        {coins.slice(0, level('coins')).map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r={2.8} {...paint(GOLD, 0.8)} />
            <rect x={x - 0.8} y={y - 0.8} width={1.6} height={1.6} fill={GOLD.shade} />
          </g>
        ))}
        <g transform="rotate(-28 32 38)">
          <path
            d={`M45 38L${56 + fins} ${31 - fins}Q53 38 ${56 + fins} ${45 + fins}z`}
            {...paint(golden ? body : accent)}
          />
          {fins > 1 && <path d="M26 30.5Q32 24 39 30.5z" {...paint(golden ? body : accent)} />}
          {fins > 2 &&
            [-1, 1].map((side) => (
              <Leaf
                key={side}
                x={27}
                y={side > 0 ? 45 : 31}
                size={5}
                angle={side > 0 ? 200 : -20}
                color={{ ...body, fill: body.light }}
              />
            ))}
          {level('mane') > 0 &&
            [24, 30, 36, 42]
              .slice(0, level('mane') + 1)
              .map((x) => (
                <Leaf key={x} x={x} y={30.5} size={2.6} angle={-10} color={accent} vein={false} />
              ))}
          {level('legs') > 0 &&
            [28, 38]
              .slice(0, level('legs') > 1 ? 2 : 1)
              .map((x) => (
                <Tube key={x} d={`M${x} 45l${x > 30 ? 1.5 : -1.5} 4.5`} color={body} width={1.8} />
              ))}
          <ellipse cx={32} cy={38} rx={15.5} ry={8.5} {...paint(body)} />
          <ellipse cx={30} cy={42} rx={9} ry={3} fill={body.light} opacity={0.8} />
          {patches.slice(0, level('patterns') || (golden ? 0 : 2)).map(([x, y, rx, ry]) => (
            <ellipse
              key={x}
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              fill={golden ? WHITE : accent.fill}
              opacity={0.85}
            />
          ))}
          {scales > 0 && (
            <path
              d="M31 36q1.5 1.5 3 0M35 36q1.5 1.5 3 0M39 36q1.5 1.5 3 0"
              {...line(scales > 2 ? GOLD.shade : body.shade, 0.8)}
              opacity={0.5}
            />
          )}
          {scales > 1 && (
            <path
              d="M33 39.5q1.5 1.5 3 0M37 39.5q1.5 1.5 3 0"
              {...line(body.shade, 0.8)}
              opacity={0.5}
            />
          )}
          {horns > 0 && (
            <>
              <path d={`M21 31L${19 - horns} ${27 - horns * 2}`} {...line(GOLD.shade, 2.2)} />
              <path d={`M21 31L${19 - horns} ${27 - horns * 2}`} {...line(GOLD.fill, 1.1)} />
              {horns > 2 && <path d="M19.5 27l-3 -.5" {...line(GOLD.shade, 1.3)} />}
            </>
          )}
          <Eye x={21.5} y={35.5} r={1.8} />
          <Blush x={23} y={39.5} r={1.4} />
          <ellipse cx={16.8} cy={39} rx={1} ry={0.8} fill={INK} />
          {whiskers > 0 && (
            <path d={`M17 40q-3 1 -4 ${3 + whiskers}`} {...line(accent.shade, 0.9)} />
          )}
          {whiskers > 1 && (
            <path d={`M17 40.5q-1 3 1 ${5 + whiskers}`} {...line(accent.shade, 0.9)} />
          )}
        </g>
        {level('glow') > 0 && <Sparkle x={50} y={26} size={2} />}
        {waterfall > 2 && <Sparkle x={10} y={16} size={2.2} />}
      </>
    )
  },
)
