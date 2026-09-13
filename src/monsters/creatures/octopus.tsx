import { creature } from '../creature'
import {
  Brow,
  Crown,
  Glow,
  Grin,
  INK,
  line,
  paint,
  Peeper,
  ribbon,
  Silhouette,
  smooth,
  Sparkle,
  trace,
  WATER,
  Waves,
  WHITE,
  type Point,
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

const roots = [20, 25, 30, 34, 39, 44]
const spots = [
  [26, 22, 1.6],
  [37, 20, 1.2],
  [41, 28, 1.4],
  [23, 31, 1],
  [33, 17, 1],
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
    const length = 6 + level('tentacles') * 3
    const suckers = level('suckers')
    const shimenawa = level('shimenawa')
    const glow = level('glow')
    const arms = roots.map((x, index) => {
      const dir = (x - 32) / 12
      const curl = index % 2 ? 1 : -1
      const end: Point = [x + dir * length * 0.7 + dir * 3, 40 + length * 0.8]
      const path: Point[] = [
        [x, 38],
        [x + dir * length * 0.1 - curl * 1.5, 40 + length * 0.4],
        end,
        [end[0] + dir * 3, end[1] - 3 - Math.abs(dir) * 2],
      ]
      return { path, end, dir }
    })
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {glow > 1 && <Glow x={32} y={34} r={26} color={accent.fill} />}
        {level('wave') > 0 && <Waves y={58} count={level('wave')} />}
        <Silhouette color={body.fill}>
          {arms.map(({ path }, index) => (
            <path key={index} d={ribbon(path, [4.6, 4, 2.8, 1.6])} />
          ))}
          <path d={smooth([[32, 14], [40.5, 16.5], [44.5, 27], [43, 40], [21, 40], [19.5, 27], [23.5, 16.5]], true)} />
        </Silhouette>
        {arms.map(({ path, dir }, index) => {
          const along = trace(path, 4)
          return (
            <g key={index}>
              {suckers > 0 && <circle cx={along[7][0] - dir * 0.6} cy={along[7][1]} r={0.9} fill={body.light} />}
              {suckers > 1 && <circle cx={along[4][0] - dir * 0.6} cy={along[4][1]} r={0.9} fill={body.light} />}
            </g>
          )
        })}
        <path d={smooth([[32, 33], [38, 34.5], [39.5, 40], [24.5, 40], [26, 34.5]], true)} fill={body.light} />
        {spots.slice(0, [0, 3, 5][level('spots')]).map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={body.shade} opacity={0.25} />
        ))}
        {shimenawa > 0 && (
          <Silhouette color="#e2bf86" width={1.6}>
            <path d={ribbon([[19.5, 25], [32, 23.5], [44.5, 25]], [3, 3.4, 3])} />
          </Silhouette>
        )}
        {shimenawa > 1 &&
          [26, 38].map((x) => <path key={x} d={`M${x} 26.5l1.6 2.2l-2.2 1.6l1.6 2.4`} {...line(WHITE, 1.4)} />)}
        {shimenawa > 2 && <circle cx={32} cy={24.2} r={1.6} fill="#d94f5c" />}
        <Peeper x={26} y={29} r={2.7} look={0.4} />
        <Peeper x={38} y={29} r={2.7} look={0.4} />
        {level('crown') > 1 && (
          <>
            <Brow x={26} y={26} w={4} tilt={-12} />
            <Brow x={38} y={26} w={4} tilt={12} />
          </>
        )}
        <Grin x={32} y={34.5} w={4.4} />
        {level('crown') > 0 && (
          <Crown
            x={32}
            y={15}
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
            <circle key={y} cx={x} cy={y} r={r} fill={WATER.light} stroke={WATER.shade} strokeWidth={0.6} />
          ))}
        {level('ship') > 0 && (
          <g transform={`translate(${arms[5].end[0] - 1} ${arms[5].end[1] - 9})`}>
            <path d="M-4 3H5L3 6H-2z" fill={WHITE} stroke={INK} strokeWidth={0.6} />
            <path d="M0.5 3V-3L4 2z" fill="#ff9fb3" stroke={INK} strokeWidth={0.5} />
          </g>
        )}
        {level('pearl') > 0 && (
          <>
            <Glow x={arms[0].end[0] + 1} y={arms[0].end[1] - 7} r={4 + level('pearl')} color="#dff4ff" />
            <circle
              cx={arms[0].end[0] + 1}
              cy={arms[0].end[1] - 7}
              r={2 + level('pearl') * 0.7}
              {...paint({ fill: WHITE, shade: '#9fd3ff', light: WHITE }, 0.8)}
            />
          </>
        )}
        {glow > 0 && <Sparkle x={52} y={18} size={2.4} />}
        {glow > 2 && <Sparkle x={11} y={22} size={2} />}
      </g>
    )
  },
)
