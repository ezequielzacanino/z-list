import { creature } from '../creature'
import {
  Blush,
  capsule,
  Eye,
  fan,
  Glow,
  GOLD,
  INK,
  Leaf,
  line,
  paint,
  poly,
  Sparkle,
  WATER,
  WHITE,
} from '../kit'

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
  [35, 34, 3.2],
  [27, 40, 2.4],
  [42, 40.5, 2.1],
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
    const finTone = golden ? body : accent
    return (
      <>
        {waterfall > 0 && (
          <g opacity={0.9}>
            {waterfall > 1 && <rect x={40} y={4} width={16} height={54} rx={4} fill={WATER.light} opacity={0.7} />}
            <path d="M44 4V56M49 4V58M54 4V55" {...line(WATER.shade, 1.1)} opacity={0.5} />
          </g>
        )}
        {waterfall > 2 && <Glow x={32} y={36} r={27} color={WATER.fill} />}
        {level('glow') > 1 && <Glow x={32} y={36} r={27} color={GOLD.fill} />}
        {level('lotus') > 0 && (
          <g>
            <path
              d={capsule(22 - level('lotus') * 3, 57, 42 + level('lotus') * 3, 57, 3.6)}
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
          <path d={poly([[45, 38], [56 + fins, 31 - fins], [52, 38], [56 + fins, 45 + fins]])} {...paint(finTone)} />
          {fins > 1 && <path d={fan(32.5, 31, 6.5, -90, 90)} {...paint(finTone)} />}
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
              .map((x) => <Leaf key={x} x={x} y={30.5} size={2.6} angle={-10} color={accent} vein={false} />)}
          {level('legs') > 0 &&
            [28, 38]
              .slice(0, level('legs') > 1 ? 2 : 1)
              .map((x) => <path key={x} d={capsule(x, 45, x + (x > 30 ? 1.5 : -1.5), 49.5, 2.2)} {...paint(body, 1)} />)}
          <path d={capsule(24.5, 38, 39.5, 38, 17)} {...paint(body)} />
          <path d={capsule(25, 42, 35, 42, 4)} fill={body.light} opacity={0.8} />
          {patches.slice(0, level('patterns') || (golden ? 0 : 2)).map(([x, y, r]) => (
            <circle key={x} cx={x} cy={y} r={r} fill={golden ? WHITE : accent.fill} opacity={0.85} />
          ))}
          {scales > 0 && (
            <path
              d="M31 36a1.5 1.5 0 0 0 3 0M35 36a1.5 1.5 0 0 0 3 0M39 36a1.5 1.5 0 0 0 3 0"
              {...line(scales > 2 ? GOLD.shade : body.shade, 0.8)}
              opacity={0.5}
            />
          )}
          {scales > 1 && (
            <path d="M33 39.5a1.5 1.5 0 0 0 3 0M37 39.5a1.5 1.5 0 0 0 3 0" {...line(body.shade, 0.8)} opacity={0.5} />
          )}
          {horns > 0 && (
            <>
              <path d={capsule(21, 31, 19 - horns, 27 - horns * 2, 1.8)} {...paint(GOLD, 0.7)} />
              {horns > 2 && <path d={capsule(19.5, 27, 16.5, 26.5, 1.2)} {...paint(GOLD, 0.5)} />}
            </>
          )}
          <Eye x={21.5} y={35.5} r={1.8} />
          <Blush x={23} y={39.5} r={1.4} />
          <circle cx={16.8} cy={39} r={0.9} fill={INK} />
          {whiskers > 0 && <path d={`M17 40l-3 1.5l-1 ${2 + whiskers}`} {...line(accent.shade, 0.9)} />}
          {whiskers > 1 && <path d={`M17 40.5l-.5 2.5l1.5 ${3 + whiskers}`} {...line(accent.shade, 0.9)} />}
        </g>
        {level('glow') > 0 && <Sparkle x={50} y={26} size={2} />}
        {waterfall > 2 && <Sparkle x={10} y={16} size={2.2} />}
      </>
    )
  },
)
