import { creature } from '../creature'
import { FaceFront } from '../faces'
import {
  bumps,
  Flower,
  Glow,
  GOLD,
  INK,
  line,
  paint,
  ribbon,
  Silhouette,
  smooth,
  Sparkle,
  tri,
  WHITE,
  WOOD,
  type Point,
} from '../kit'

type Step =
  | 'ears'
  | 'fluff'
  | 'moon'
  | 'mochi'
  | 'size'
  | 'mallet'
  | 'stars'
  | 'antlers'
  | 'flowers'
  | 'scarf'
  | 'feet'

const PINK = '#ffb3c1'

// Crescent whose back faces the left.
function crescent(x: number, y: number, r: number) {
  return `M${x} ${y - r}A${r} ${r} 0 1 0 ${x} ${y + r}A${r * 0.72} ${r} 0 1 1 ${x} ${y - r}z`
}

// A bunny that pounds mochi under a growing moon, or sprouts the antlers of a jackalope.
export const bunny = creature<Step>(
  [
    [
      'ears',
      'fluff',
      'moon',
      'ears',
      'mochi',
      'size',
      'moon',
      'mallet',
      'ears',
      'stars',
      'moon',
      'mallet',
      'fluff',
      'size',
      'mochi',
      'stars',
      'moon',
      'mallet',
      'stars',
    ],
    [
      'ears',
      'antlers',
      'fluff',
      'size',
      'antlers',
      'ears',
      'flowers',
      'antlers',
      'scarf',
      'size',
      'antlers',
      'flowers',
      'fluff',
      'ears',
      'antlers',
      'scarf',
      'size',
      'flowers',
      'feet',
    ],
  ],
  (level, { body, accent }) => {
    const grow = 0.9 + level('size') * 0.035
    const earHeight = 9 + level('ears') * 2.5
    const moon = level('moon')
    const antlers = level('antlers')
    const mallet = level('mallet')
    const tips: number[][] = []
    const earPaths = [-1, 1].map((side) => {
      const x = 32 + side * 4.2
      return [[x, 28], [x + side * 1.5, 30 - earHeight * 0.55], [x + side * 3.5, 30 - earHeight]] as Point[]
    })
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {moon > 3 && <circle cx={32} cy={27} r={16} fill="#fff3c4" stroke={GOLD.shade} strokeWidth={0.6} />}
        {moon > 3 && <circle cx={25} cy={20} r={2} fill="#f3e3a6" />}
        {moon > 2 && <circle cx={32} cy={33} r={13} fill={GOLD.light} opacity={0.6} />}
        {moon > 0 && moon < 4 && <path d={crescent(49, 15, 2 + moon * 2)} {...paint(GOLD, 0.7)} />}
        {antlers > 0 && (
          <Silhouette color={WOOD.fill} width={1.6}>
            {[-1, 1].map((side) => {
              const x = 32 + side * 6
              const endX = x + side * (3 + antlers * 2.2)
              const endY = 29 - antlers * 2.6
              const middleX = (x + endX) / 2
              const middleY = (29 + endY) / 2
              tips.push([endX, endY])
              return (
                <g key={side}>
                  <path d={ribbon([[x, 29], [middleX - side * 1, middleY], [endX, endY]], [2.8, 2.4, 1.8])} />
                  {antlers > 1 && <path d={ribbon([[middleX, middleY], [middleX - side * 1, middleY - 4.5]], [2, 1.4])} />}
                  {antlers > 3 && (
                    <path d={ribbon([[middleX + side * 2, middleY - 2], [middleX + side * 5.5, middleY - 2.5]], [2, 1.4])} />
                  )}
                </g>
              )
            })}
          </Silhouette>
        )}
        {tips.slice(0, level('flowers')).map(([x, y]) => (
          <Flower key={x} x={x} y={y} size={1.3} color={{ fill: PINK, shade: '#b0566a', light: WHITE }} />
        ))}
        {level('flowers') > 2 && <Flower x={32} y={25} size={1.2} color={accent} />}
        <Silhouette color={WHITE} width={1.8}>
          <path d={bumps([[41, 49], [44.5, 50.5], [44.5, 54], [41, 55], [39.5, 52]], 0.8)} />
        </Silhouette>
        {mallet > 0 && (
          <Silhouette color={WOOD.fill} width={1.6}>
            <path d={ribbon([[41, 49], [48, 38]], [2, 1.8])} />
          </Silhouette>
        )}
        <Silhouette color={body.fill}>
          {earPaths.map((path, index) => (
            <path key={index} d={ribbon(path, [5.4, 5.6, 4.2])} />
          ))}
          <path d={smooth([[32, 40], [40, 43], [42.5, 51], [40.5, 57.5], [23.5, 57.5], [21.5, 51], [24, 43]], true)} />
          {[26.5, 37.5].map((x) => {
            const w = level('feet') ? 5 : 4
            return (
              <path
                key={x}
                d={smooth([[x - w, 56], [x, 54.4], [x + w, 56], [x + w - 0.6, 58.5], [x - w + 0.6, 58.5]], true)}
              />
            )
          })}
          <path
            d={smooth([[32, 26.5], [38.5, 28.5], [41, 34], [39, 40.5], [32, 43.5], [25, 40.5], [23, 34], [25.5, 28.5]], true)}
          />
        </Silhouette>
        {earPaths.map((path, index) => (
          <path
            key={index}
            d={ribbon([[path[0][0], 27], path[1], [path[2][0] - (index ? 0.5 : -0.5), path[2][1] + 0.5]], [2.4, 2.6, 1.6])}
            fill={PINK}
          />
        ))}
        <path d={smooth([[32, 45.5], [37, 47.5], [37.5, 55], [26.5, 55], [27, 47.5]], true)} fill={body.light} />
        {level('mochi') > 0 && level('mochi') < 2 && (
          <path d={smooth([[11, 55], [14.5, 51.5], [18, 55], [16.5, 57.5], [12.5, 57.5]], true)} fill={WHITE} stroke={INK} strokeWidth={1} />
        )}
        {level('mochi') > 1 && (
          <g>
            <path d="M14 58V41" {...line(WOOD.fill, 1)} />
            {[
              [54, WHITE],
              [49, PINK],
              [44, '#a8d8a0'],
            ].map(([y, color]) => (
              <circle key={y} cx={14} cy={y as number} r={2.6} fill={color as string} stroke={INK} strokeWidth={0.8} />
            ))}
          </g>
        )}
        {mallet > 0 && (
          <rect
            x={43.5}
            y={31.5}
            width={6 + mallet * 1.5}
            height={4 + mallet * 0.6}
            rx={1.4}
            transform="rotate(-33 47 35)"
            {...paint(mallet > 2 ? GOLD : WOOD, 1.2)}
          />
        )}
        {level('fluff') > 0 && (
          <path d="M24.2 36.5A1.5 1.5 0 0 0 24.2 39.5M39.8 36.5A1.5 1.5 0 0 1 39.8 39.5" {...line(body.shade, 1)} />
        )}
        {level('fluff') > 1 && <path d={bumps([[28, 41], [36, 41], [34.5, 44], [29.5, 44]], 1)} fill={body.light} />}
        <FaceFront x={32} y={35} gap={3.2} />
        <path d={tri(32, 37.4, 2, 1.2, 180)} fill="#ff8fa3" />
        {level('scarf') > 0 && (
          <Silhouette color={accent.fill} width={1.6}>
            <path d={ribbon([[25.5, 43], [32, 45], [38.5, 43]], [3.4, 3.8, 3.4])} />
            {level('scarf') > 1 && <path d={ribbon([[35.5, 45], [37.5, 50.5]], [2.6, 2.2])} />}
          </Silhouette>
        )}
        {level('stars') > 0 && <Sparkle x={10} y={20} size={2.2} />}
        {level('stars') > 1 && <Sparkle x={55} y={34} size={1.8} />}
        {level('stars') > 2 && <Glow x={32} y={40} r={26} color={GOLD.light} />}
      </g>
    )
  },
)
