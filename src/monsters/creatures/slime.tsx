import { creature } from '../creature'
import {
  Blush,
  Crown,
  Eye,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  polar,
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
  [10, 57, 3.6],
  [54.5, 57, 4],
  [4.5, 57, 2.8],
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
            <path
              d={`M${x - r} ${y}C${x - r} ${y - r * 1.3} ${x - r * 0.4} ${y - r * 1.8} ${x} ${y - r * 1.8}C${x + r * 0.4} ${y - r * 1.8} ${x + r} ${y - r * 1.3} ${x + r} ${y}z`}
              {...paint(body, 1)}
            />
            <circle cx={x - r * 0.35} cy={y - r * 0.7} r={0.55} fill={INK} />
            <circle cx={x + r * 0.35} cy={y - r * 0.7} r={0.55} fill={INK} />
          </g>
        ))}
        {level('scepter') > 0 && (
          <g>
            <path d="M47 57L53 38" {...line(GOLD.shade, 2)} />
            <path d="M47 57L53 38" {...line(GOLD.fill, 1)} />
            <circle cx={53.5} cy={36.5} r={1.8 + level('scepter') * 0.6} {...paint(accent, 0.7)} />
          </g>
        )}
        <g transform={`translate(32 57) scale(${grow}) translate(-32 -57)`}>
          {cape > 0 && (
            <path
              d={`M${15 - cape * 2} 57Q14 40 22 36H42Q50 40 ${49 + cape * 2} 57z`}
              {...paint(CAPE)}
            />
          )}
          {cape > 1 && <path d="M18 38.5Q32 33 46 38.5" {...line(WHITE, 3)} />}
          <path
            d={
              crystal
                ? 'M12 57L16 42L25 32L39 32L48 42L52 57z'
                : 'M12 57C12 43 20 31 32 31C44 31 52 43 52 57z'
            }
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
          {(level('shine') > 0 || crystal) && (
            <ellipse
              cx={23}
              cy={41}
              rx={2.6}
              ry={5}
              transform="rotate(30 23 41)"
              fill={WHITE}
              opacity={0.6}
            />
          )}
          {level('shine') > 1 && <circle cx={27.5} cy={35.5} r={1.3} fill={WHITE} opacity={0.7} />}
          <Eye x={27} y={46} r={2} />
          <Eye x={37} y={46} r={2} />
          <Smile x={32} y={50} w={1.8} />
          <Blush x={22.5} y={50} />
          <Blush x={41.5} y={50} />
          {crown > 0 && (
            <Crown
              x={32}
              y={crystal ? 33 : 32}
              width={6 + crown * 2.2}
              gem={level('gem') > 0 ? accent.fill : undefined}
            />
          )}
        </g>
        {orbit > 0 &&
          spread(orbit * 2, 30, 330).map((angle) => {
            const [x, y] = polar(32, 42, angle, 23)
            return (
              <path
                key={angle}
                d={`M${x} ${y - 2.4}L${x + 1.6} ${y}L${x} ${y + 2.4}L${x - 1.6} ${y}z`}
                {...paint(accent, 0.6)}
              />
            )
          })}
        {(level('sparkle') > 0 || level('gem') > 1) && <Sparkle x={51} y={20} size={2.4} />}
        {level('sparkle') > 1 && <Sparkle x={12} y={28} size={2} />}
      </>
    )
  },
)
