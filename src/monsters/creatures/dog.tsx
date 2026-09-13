import { creature } from '../creature'
import { FaceFront } from '../faces'
import {
  Flame,
  Glow,
  INK,
  paint,
  ribbon,
  Silhouette,
  smooth,
  Sparkle,
  tone,
  tri,
  type Point,
} from '../kit'

type Step = 'heads' | 'ears' | 'size' | 'tail' | 'paws' | 'collar' | 'mane' | 'spots'

// Head positions and tilts for one, two and three heads.
const layouts = [
  [[32, 31, 0]],
  [
    [25, 32, -10],
    [39, 30, 10],
  ],
  [
    [19.5, 35, -16],
    [44.5, 35, 16],
    [32, 27.5, 0],
  ],
]

// Dog head with a rounded muzzle, centered on its origin.
const skull: Point[] = [
  [-7.5, -1],
  [-5, -6.5],
  [0, -8],
  [5, -6.5],
  [7.5, -1],
  [6.5, 5],
  [0, 7.8],
  [-6.5, 5],
]

// A puppy that sprouts a second head, grows, then a third, with burning paws: Cerberus.
// Orthrus stays with two heads and icy paws.
export const dog = creature<Step>(
  [
    [
      'heads',
      'ears',
      'size',
      'heads',
      'tail',
      'size',
      'paws',
      'collar',
      'size',
      'ears',
      'paws',
      'collar',
      'size',
      'tail',
      'paws',
      'mane',
      'collar',
      'mane',
      'mane',
    ],
    [
      'heads',
      'ears',
      'size',
      'spots',
      'tail',
      'size',
      'paws',
      'collar',
      'size',
      'ears',
      'paws',
      'collar',
      'size',
      'tail',
      'paws',
      'mane',
      'collar',
      'mane',
      'mane',
    ],
  ],
  (level, { body, hue }, orthrus) => {
    const heads = layouts[level('heads')]
    const k = [1, 0.88, 0.82][heads.length - 1]
    const grow = 0.86 + level('size') * 0.045
    const ear = tone(hue, 40, 56)
    const ears = level('ears')
    const paws = level('paws')
    const collar = level('collar')
    const mane = level('mane')
    const tail = level('tail')
    const place = ([x, y, tilt]: number[]) => `translate(${x} ${y}) rotate(${tilt}) scale(${k})`
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {mane > 2 && <Glow x={32} y={40} r={27} color={orthrus ? '#8fd3ff' : '#ff9a5a'} />}
        {mane > 1 &&
          heads.map((head, index) => (
            <g key={index} transform={place(head)}>
              <Flame x={0} y={-6.5} size={3.2} cold={orthrus} />
            </g>
          ))}
        {tail > 1 && <Flame x={50} y={37 - tail} size={paws > 2 ? 2.4 : 0} cold={orthrus} />}
        <Silhouette color={ear.fill} width={1.8}>
          {heads.map((head, index) => (
            <g key={index} transform={place(head)}>
              {[-1, 1].map((side) =>
                ears > 1 ? (
                  <path
                    key={side}
                    d={smooth([[side * 3, -6], [side * (6 + ears * 0.6), -12 - ears], [side * 8, -3.5]], true)}
                  />
                ) : (
                  <path
                    key={side}
                    d={ribbon([[side * 6, -4], [side * (8.5 + ears * 0.5), 1 + ears * 1.5]], [5, 4.6 + ears])}
                  />
                ),
              )}
            </g>
          ))}
        </Silhouette>
        <Silhouette color={body.fill}>
          {tail === 0 ? (
            <path d={ribbon([[42, 50], [46, 47]], [3.5, 2.5])} />
          ) : (
            <path d={ribbon([[42, 51], [48, 47], [50, 40 - tail]], [4.5, 4 + tail * 0.6, 2.5])} />
          )}
          {[-1, 1].map((side) => (
            <path
              key={side}
              d={smooth(
                [[32 + side * 7, 46], [32 + side * 13, 47], [32 + side * 14.5, 54], [32 + side * 11, 58], [32 + side * 6, 56]],
                true,
              )}
            />
          ))}
          <path d={smooth([[32, 36.5], [40, 39], [43, 47], [42, 57], [22, 57], [21, 47], [24, 39]], true)} />
          {[27, 37].map((x) => (
            <path key={x} d={ribbon([[x, 48], [x, 56.5]], [5.5, 6])} />
          ))}
          {heads.map((head, index) => (
            <g key={index} transform={place(head)}>
              <path d={smooth(skull, true)} />
            </g>
          ))}
        </Silhouette>
        <path d={smooth([[32, 42], [37, 45], [37.5, 55], [26.5, 55], [27, 45]], true)} fill={body.light} />
        {mane > 0 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={smooth([[32 + side * 3, 40], [32 + side * 8, 38.5], [32 + side * 10, 44], [32 + side * 6, 45]], true)}
              fill={body.light}
            />
          ))}
        {tail > 1 && <circle cx={50} cy={39 - tail} r={2.2} fill={body.light} />}
        {heads.map((head, index) => (
          <g key={index} transform={place(head)}>
            <path d={smooth([[-4, 2], [0, 0.5], [4, 2], [3, 6.5], [-3, 6.5]], true)} fill={body.light} />
            {orthrus && index === 0 && level('spots') > 0 && (
              <circle cx={3} cy={-2.2} r={2.8} fill={ear.fill} opacity={0.8} />
            )}
            <FaceFront x={0} y={-2.2} gap={3} />
            <path d={smooth([[-1.4, 0.4], [1.4, 0.4], [0, 2]], true)} fill={INK} />
            {index === heads.length - 1 && (
              <path d={smooth([[0.4, 3.2], [2, 3.2], [1.4, 5.2]], true)} fill="#ff8fa3" />
            )}
            {collar > 0 && (
              <Silhouette color={tone(0, 65, 62).fill} width={1.4}>
                <path d={ribbon([[-5.5, 6.2], [0, 7.4], [5.5, 6.2]], [2.2, 2.4, 2.2])} />
              </Silhouette>
            )}
            {collar > 1 && <circle cx={0} cy={9.4} r={1.3} {...paint(tone(45, 90, 65), 0.6)} />}
            {collar > 2 &&
              [-3.2, 3.2].map((offset) => (
                <path key={offset} d={tri(offset, 7.6, 1.8, 2.2, offset * 8)} fill="#c8c8d0" />
              ))}
          </g>
        ))}
        {paws > 1 && [20, 44].map((x) => <Flame key={x} x={x} y={57} size={2.6} cold={orthrus} />)}
        {paws > 0 && [27, 37].map((x) => <Flame key={x} x={x} y={58} size={1.6 + paws * 0.5} cold={orthrus} />)}
        {mane > 2 && (
          <>
            <Sparkle x={8} y={22} size={2.2} />
            <Sparkle x={56} y={20} size={2.6} />
          </>
        )}
      </g>
    )
  },
)
