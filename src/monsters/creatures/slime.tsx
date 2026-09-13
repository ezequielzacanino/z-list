import { creature } from '../creature'
import {
  Blush,
  capsule,
  Crown,
  drop,
  Eye,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  polar,
  poly,
  Smile,
  Sparkle,
  spread,
  tone,
  WHITE,
} from '../kit'

type Step =
  | 'shine'
  | 'drops'
  | 'size'
  | 'crown'
  | 'cape'
  | 'scepter'
  | 'gem'
  | 'facets'
  | 'crystals'
  | 'glow'
  | 'orbit'
  | 'sparkle'

const CAPE = tone(355, 60, 58)
const drops = [
  [10, 57, 3.2],
  [54.5, 57, 3.6],
  [4.5, 57, 2.5],
]
const facets = [
  'M16 42L32 47L48 42',
  'M25 32L32 47L39 32',
  'M12 57L32 47L52 57',
  'M16 42L25 57M48 42L39 57',
]
const shards = [
  [26, 33, -25],
  [38, 33, 25],
  [32, 31, 0],
  [45, 40, 50],
]

// A drop of slime that swells into a crowned king, or hardens into a glowing crystal slime.
export const slime = creature<Step>(
  [
    [
      'shine',
      'drops',
      'size',
      'crown',
      'drops',
      'size',
      'crown',
      'cape',
      'shine',
      'size',
      'scepter',
      'drops',
      'crown',
      'gem',
      'size',
      'cape',
      'crown',
      'scepter',
      'gem',
    ],
    [
      'facets',
      'size',
      'crystals',
      'facets',
      'glow',
      'size',
      'crystals',
      'orbit',
      'facets',
      'size',
      'crystals',
      'glow',
      'sparkle',
      'facets',
      'size',
      'crystals',
      'orbit',
      'glow',
      'sparkle',
    ],
  ],
  (level, { body, accent }, crystal) => {
    const grow = 0.72 + level('size') * 0.07
    const crown = level('crown')
    const cape = level('cape')
    const glow = level('glow')
    const orbit = level('orbit')
    return (
      <>
        {glow > 1 && <Glow x={32} y={44} r={24} color={accent.light} />}
        {drops.slice(0, level('drops')).map(([x, y, r]) => (
          <g key={x}>
            <path d={drop(x, y - r * 2.5, r * 2.5, r, 180)} {...paint(body, 1)} />
            <circle cx={x - r * 0.35} cy={y - r * 0.9} r={0.55} fill={INK} />
            <circle cx={x + r * 0.35} cy={y - r * 0.9} r={0.55} fill={INK} />
          </g>
        ))}
        {level('scepter') > 0 && (
          <g>
            <path d={capsule(47, 57, 53, 38, 1.8)} {...paint(GOLD, 0.7)} />
            <circle cx={53.5} cy={36.5} r={1.8 + level('scepter') * 0.6} {...paint(accent, 0.7)} />
          </g>
        )}
        <g transform={`translate(32 57) scale(${grow}) translate(-32 -57)`}>
          {cape > 0 && <path d={poly([[15 - cape * 2, 57], [20, 36], [44, 36], [49 + cape * 2, 57]])} {...paint(CAPE)} />}
          {cape > 1 && <path d="M18 38.5H46" {...line(WHITE, 3)} />}
          <path
            d={crystal ? 'M12 57L16 42L25 32L39 32L48 42L52 57z' : 'M12 57V52A20 20 0 0 1 52 52V57z'}
            {...paint(body, 1.6)}
            fillOpacity={crystal ? 0.95 : 0.92}
          />
          {facets.slice(0, level('facets')).map((d) => (
            <path key={d} d={d} {...line(body.light, 1)} opacity={0.8} />
          ))}
          {shards.slice(0, level('crystals')).map(([x, y, angle]) => (
            <path
              key={x}
              d={`M${x - 2} ${y + 1.5}L${x} ${y - 5}L${x + 2} ${y + 1.5}z`}
              transform={`rotate(${angle} ${x} ${y})`}
              {...paint(accent, 0.8)}
            />
          ))}
          {(level('shine') > 0 || crystal) && <path d={capsule(21.5, 44, 24.5, 38.5, 4.4)} fill={WHITE} opacity={0.6} />}
          {level('shine') > 1 && <circle cx={27.5} cy={35.5} r={1.3} fill={WHITE} opacity={0.7} />}
          <Eye x={27} y={46} r={2} />
          <Eye x={37} y={46} r={2} />
          <Smile x={32} y={49.6} w={1.8} />
          <Blush x={22.5} y={50} />
          <Blush x={41.5} y={50} />
          {crown > 0 && (
            <Crown x={32} y={crystal ? 33 : 32} width={6 + crown * 2.2} gem={level('gem') > 0 ? accent.fill : undefined} />
          )}
        </g>
        {orbit > 0 &&
          spread(orbit * 2, 30, 330).map((angle) => {
            const [x, y] = polar(32, 42, angle, 23)
            return (
              <path key={angle} d={poly([[x, y - 2.4], [x + 1.6, y], [x, y + 2.4], [x - 1.6, y]])} {...paint(accent, 0.6)} />
            )
          })}
        {(level('sparkle') > 0 || level('gem') > 1) && <Sparkle x={51} y={20} size={2.4} />}
        {level('sparkle') > 1 && <Sparkle x={12} y={28} size={2} />}
      </>
    )
  },
)
