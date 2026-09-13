import { creature } from '../creature'
import {
  Blush,
  Crown,
  Eye,
  Glow,
  INK,
  line,
  paint,
  Smile,
  Sparkle,
  Tube,
  Waves,
  WATER,
  WHITE,
} from '../kit'

type Step =
  | 'tentacles'
  | 'spots'
  | 'bubbles'
  | 'suckers'
  | 'size'
  | 'crown'
  | 'ship'
  | 'wave'
  | 'glow'
  | 'shimenawa'
  | 'pearl'

const roots = [21, 25.5, 30, 34, 38.5, 43]
const spots = [
  [26, 24, 1.6],
  [38, 23, 1.3],
  [33, 20, 1.1],
  [22, 30, 1],
  [42, 30, 1.2],
]

// A little octopus whose arms lengthen into the crowned Kraken, or the glowing Akkorokamui.
export const octopus = creature<Step>(
  [
    [
      'tentacles',
      'spots',
      'bubbles',
      'tentacles',
      'suckers',
      'size',
      'tentacles',
      'crown',
      'spots',
      'size',
      'tentacles',
      'suckers',
      'crown',
      'bubbles',
      'size',
      'crown',
      'ship',
      'wave',
      'wave',
    ],
    [
      'tentacles',
      'spots',
      'glow',
      'tentacles',
      'suckers',
      'size',
      'tentacles',
      'shimenawa',
      'spots',
      'size',
      'tentacles',
      'suckers',
      'shimenawa',
      'glow',
      'size',
      'shimenawa',
      'glow',
      'pearl',
      'pearl',
    ],
  ],
  (level, { body, accent }) => {
    const grow = 0.88 + level('size') * 0.04
    const length = 5 + level('tentacles') * 3
    const suckers = level('suckers')
    const shimenawa = level('shimenawa')
    const glow = level('glow')
    const ends = roots.map((x) => {
      const dir = (x - 32) / 11
      return [x + dir * length * 0.6 + dir * 2, 41 + length * 0.75, dir]
    })
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {glow > 1 && <Glow x={32} y={34} r={26} color={accent.fill} />}
        {level('wave') > 0 && <Waves y={58} count={level('wave')} />}
        {roots.map((x, index) => {
          const [ex, ey, dir] = ends[index]
          return (
            <g key={x}>
              <Tube
                d={`M${x} 41Q${x + dir * 2} ${41 + length} ${ex} ${ey}q${dir * 3} -2 ${dir * 1.5} -4`}
                color={body}
                width={3.4}
              />
              {suckers > 0 && (
                <circle
                  cx={x + dir * length * 0.4}
                  cy={41 + length * 0.62}
                  r={0.8}
                  fill={body.light}
                />
              )}
              {suckers > 1 && (
                <circle
                  cx={x + dir * length * 0.2}
                  cy={41 + length * 0.4}
                  r={0.8}
                  fill={body.light}
                />
              )}
            </g>
          )
        })}
        <path d="M19 38Q18 17 32 17Q46 17 45 38Q45 44 32 44Q19 44 19 38z" {...paint(body)} />
        <ellipse cx={27} cy={23} rx={3} ry={2} fill={body.light} opacity={0.7} />
        {spots.slice(0, [0, 3, 5][level('spots')]).map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={body.shade} opacity={0.3} />
        ))}
        {shimenawa > 0 && (
          <>
            <path d="M19.3 28.5Q32 33 44.7 28.5" {...line('#8a6a3d', 2.8)} />
            <path
              d="M19.3 28.5Q32 33 44.7 28.5"
              {...line('#e2bf86', 1.4)}
              strokeDasharray="1.6 1.2"
            />
          </>
        )}
        {shimenawa > 1 &&
          [26, 38].map((x) => (
            <path
              key={x}
              d={`M${x} 31l1.6 2.2l-2.2 1.6l1.6 2.4`}
              {...line(WHITE, 1.4)}
              stroke={WHITE}
            />
          ))}
        {shimenawa > 2 && <circle cx={32} cy={31.5} r={1.6} fill="#d94f5c" />}
        <Eye x={27} y={35} r={2} />
        <Eye x={37} y={35} r={2} />
        <Blush x={23.5} y={39} />
        <Blush x={40.5} y={39} />
        <Smile x={32} y={39.5} w={1.8} />
        {level('crown') > 0 && (
          <Crown
            x={32}
            y={18.5}
            width={5 + level('crown') * 2}
            gem={level('crown') > 2 ? accent.fill : undefined}
          />
        )}
        {[
          [52, 22, 2],
          [55, 15, 1.4],
          [49, 11, 1],
        ]
          .slice(0, level('bubbles') ? level('bubbles') + 1 : 0)
          .map(([x, y, r]) => (
            <circle
              key={y}
              cx={x}
              cy={y}
              r={r}
              fill={WATER.light}
              stroke={WATER.shade}
              strokeWidth={0.6}
            />
          ))}
        {level('ship') > 0 && (
          <g transform={`translate(${ends[5][0] - 1} ${ends[5][1] - 9})`}>
            <path d="M-4 3H5L3 6H-2z" fill={WHITE} stroke={INK} strokeWidth={0.6} />
            <path d="M0.5 3V-3L4 2z" fill="#ff9fb3" stroke={INK} strokeWidth={0.5} />
          </g>
        )}
        {level('pearl') > 0 && (
          <>
            <Glow x={ends[0][0] + 1} y={ends[0][1] - 6} r={4 + level('pearl')} color="#dff4ff" />
            <circle
              cx={ends[0][0] + 1}
              cy={ends[0][1] - 6}
              r={2 + level('pearl') * 0.7}
              fill={WHITE}
              stroke="#9fd3ff"
              strokeWidth={0.8}
            />
          </>
        )}
        {glow > 0 && <Sparkle x={52} y={18} size={2.4} />}
        {glow > 2 && <Sparkle x={11} y={22} size={2} />}
      </g>
    )
  },
)
