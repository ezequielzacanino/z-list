import { creature } from '../creature'
import { Blush, capsule, Eye, fan, Glow, INK, Leaf, line, paint, Smile, Sparkle, tone, tri, WHITE } from '../kit'

type Step =
  | 'mask'
  | 'tail'
  | 'leaf'
  | 'belly'
  | 'size'
  | 'hat'
  | 'lantern'
  | 'sparkle'
  | 'stripe'
  | 'claws'
  | 'mushrooms'
  | 'scarf'
  | 'glow'

const STRAW = tone(45, 55, 70)
const mushrooms = [
  [11, 58],
  [53, 58],
  [6, 58],
]

// A raccoon dog with a shapeshifting leaf and a drum belly, or a badger that lights the forest path.
export const tanuki = creature<Step>(
  [
    [
      'mask',
      'tail',
      'leaf',
      'belly',
      'size',
      'tail',
      'hat',
      'leaf',
      'mask',
      'size',
      'hat',
      'belly',
      'tail',
      'lantern',
      'leaf',
      'size',
      'hat',
      'lantern',
      'sparkle',
    ],
    [
      'stripe',
      'claws',
      'size',
      'mushrooms',
      'stripe',
      'scarf',
      'lantern',
      'size',
      'mushrooms',
      'claws',
      'stripe',
      'lantern',
      'glow',
      'scarf',
      'mushrooms',
      'size',
      'lantern',
      'glow',
      'glow',
    ],
  ],
  (level, { body, accent }, badger) => {
    const grow = 0.88 + level('size') * 0.04
    const tail = level('tail')
    const hat = level('hat')
    const lantern = level('lantern')
    const stripe = level('stripe')
    const glow = level('glow')
    return (
      <g transform={`translate(32 58) scale(${grow}) translate(-32 -58)`}>
        {glow > 1 && <Glow x={32} y={40} r={26} color="#ffe9a8" />}
        {!badger && tail > 0 && (
          <g transform="rotate(35 45 48)">
            <path d={capsule(45, 45, 45, 51, 7 + tail * 2)} {...paint(body)} />
            {Array.from({ length: tail }, (_, index) => (
              <path
                key={index}
                d={`M${41.5 - tail * 0.6} ${50 - index * 3.2}h${7 + tail * 1.2}`}
                {...line(body.shade, 1.4)}
                opacity={0.7}
              />
            ))}
          </g>
        )}
        {mushrooms.slice(0, level('mushrooms')).map(([x, y]) => (
          <g key={x}>
            <rect x={x - 0.9} y={y - 3.5} width={1.8} height={3.5} fill="#f3ead8" />
            <path d={fan(x, y - 3.2, 3, -90, 90)} fill="#e85d5d" stroke="#8c2f25" strokeWidth={0.6} />
          </g>
        ))}
        {[26, 38].map((x) => (
          <g key={x}>
            <path d={fan(x, 58, 4, -90, 90)} fill={body.shade} />
            {level('claws') > 0 && (
              <path d={`M${x - 2} 58.2v1.2M${x} 58.5v1.2M${x + 2} 58.2v1.2`} {...line(WHITE, 0.8)} />
            )}
          </g>
        ))}
        <circle cx={32} cy={46} r={11.5} {...paint(body)} />
        <circle cx={32} cy={49} r={badger ? 6 : 7 + level('belly')} fill={body.light} />
        {level('belly') > 0 && (
          <circle cx={32} cy={49} r={4 + level('belly')} {...line(body.shade, 0.8)} opacity={0.35} />
        )}
        {[-1, 1].map((side) => (
          <circle key={side} cx={32 + side * 11} cy={45} r={3} fill={body.shade} />
        ))}
        {lantern > 0 && (
          <g>
            {lantern > 1 && <Glow x={48} y={49} r={6 + lantern} color="#ffb36b" />}
            <path d="M43.5 45L48 43.5V45" {...line(INK, 0.8)} />
            <circle cx={48} cy={49} r={3.8} fill={lantern > 1 ? '#ffb36b' : '#f2e3c6'} stroke="#8c5a25" strokeWidth={0.8} />
            <path d="M44.6 47.5h6.8M44.6 50.5h6.8" {...line('#8c5a25', 0.5)} />
          </g>
        )}
        {[-1, 1].map((side) => (
          <g key={side}>
            <circle cx={32 + side * 7.5} cy={23.5} r={3} {...paint(body)} />
            <circle cx={32 + side * 7.5} cy={23.5} r={1.5} fill={body.shade} />
          </g>
        ))}
        <circle cx={32} cy={31} r={9.5} {...paint(body)} />
        {!badger &&
          level('mask') > 0 &&
          [-1, 1].map((side) => (
            <circle
              key={side}
              cx={32 + side * 4}
              cy={31.5}
              r={2.6 + level('mask') * 0.45}
              fill={body.shade}
              opacity={0.8}
            />
          ))}
        {badger && stripe > 0 && <path d={tri(32, 36, 3.6, 12.5 + stripe)} fill={WHITE} />}
        {badger &&
          stripe > 2 &&
          [-1, 1].map((side) => (
            <path key={side} d={`M${32 + side * 6} 36L${32 + side * 7.5} 30L${32 + side * 5.5} 24`} {...line(WHITE, 1.6)} />
          ))}
        <Eye x={28} y={31} r={1.6} />
        <Eye x={36} y={31} r={1.6} />
        <circle cx={32} cy={35} r={3} fill={body.light} />
        <circle cx={32} cy={34} r={1.1} fill={INK} />
        <Smile x={32} y={35.8} w={1.2} />
        <Blush x={25.5} y={35} r={1.5} />
        <Blush x={38.5} y={35} r={1.5} />
        {hat > 0 && (
          <g>
            <path d={tri(32, 25.5, 16 + hat * 4, 6 + hat)} {...paint(STRAW)} />
            {hat > 2 && <path d={`M${27 - hat} 24H${37 + hat}`} {...line('#d64550', 1.4)} />}
          </g>
        )}
        {!badger && level('leaf') > 0 && (
          <Leaf x={32} y={hat ? 19 - hat : 22} size={2.2 + level('leaf')} angle={-15} />
        )}
        {level('scarf') > 0 && <path d={capsule(25, 40.5, 39, 40.5, 3.4)} {...paint(accent, 0.9)} />}
        {level('scarf') > 1 && <path d={capsule(36, 42, 37.3, 47, 2.4)} {...paint(accent, 0.8)} />}
        {(level('sparkle') > 0 || level('leaf') > 2) && <Sparkle x={42} y={16} size={2.2} />}
        {glow > 0 && (
          <>
            <Sparkle x={10} y={30} size={1.6} color={{ fill: '#e6ff9a', shade: '#8a9a3a', light: WHITE }} />
            <Sparkle x={55} y={26} size={1.4} color={{ fill: '#e6ff9a', shade: '#8a9a3a', light: WHITE }} />
          </>
        )}
        {glow > 2 && <Sparkle x={50} y={10} size={2} />}
      </g>
    )
  },
)
