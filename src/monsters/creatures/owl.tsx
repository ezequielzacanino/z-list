import { creature } from '../creature'
import { Eye, Flame, Glow, GOLD, INK, line, paint, Sparkle, Star, tone, WHITE } from '../kit'

type Step =
  | 'feathers'
  | 'tufts'
  | 'wings'
  | 'glasses'
  | 'book'
  | 'hat'
  | 'stars'
  | 'candle'
  | 'moon'
  | 'eyes'
  | 'veil'

const HAT = tone(255, 45, 55)
const NIGHT = tone(240, 35, 35)

// An owlet that becomes a wizard scholar, or a moon owl wrapped in the night sky.
export const owl = creature<Step>(
  [
    [
      'feathers',
      'tufts',
      'wings',
      'glasses',
      'book',
      'feathers',
      'wings',
      'hat',
      'book',
      'tufts',
      'stars',
      'hat',
      'feathers',
      'wings',
      'book',
      'candle',
      'hat',
      'stars',
      'stars',
    ],
    [
      'feathers',
      'tufts',
      'moon',
      'wings',
      'feathers',
      'eyes',
      'moon',
      'stars',
      'wings',
      'veil',
      'moon',
      'feathers',
      'tufts',
      'stars',
      'wings',
      'moon',
      'eyes',
      'veil',
      'stars',
    ],
  ],
  (level, { body, accent }) => {
    const wings = level('wings')
    const tufts = level('tufts')
    const moon = level('moon')
    const hat = level('hat')
    const book = level('book')
    const glow = level('eyes') > 0 ? accent.fill : undefined
    const hatHeight = 5 + hat * 3
    return (
      <>
        {moon > 3 && (
          <circle cx={32} cy={28} r={17} fill="#fff3c4" stroke={GOLD.shade} strokeWidth={0.6} />
        )}
        {moon > 2 && <circle cx={32} cy={33} r={14} fill={GOLD.light} opacity={0.6} />}
        {moon > 0 && moon < 4 && (
          <path
            d={`M49 ${14 - moon * 2}A${2 + moon * 1.6} ${2 + moon * 1.6} 0 1 0 49 ${14 + moon * 2}A${1.5 + moon} ${2 + moon * 1.6} 0 1 1 49 ${14 - moon * 2}z`}
            {...paint(GOLD, 0.7)}
          />
        )}
        {level('veil') > 0 && (
          <path
            d={`M18 40Q${12 - level('veil') * 2} 58 20 58.5H44Q${52 + level('veil') * 2} 58 46 40z`}
            fill={NIGHT.fill}
            stroke={NIGHT.shade}
            strokeWidth={1}
          />
        )}
        {level('veil') > 1 && <Star x={16} y={52} size={1.8} />}
        {wings > 2 && (
          <ellipse cx={47} cy={33} rx={4} ry={9.5} transform="rotate(40 47 33)" {...paint(body)} />
        )}
        {wings > 0 &&
          (wings > 2 ? [-1] : [-1, 1]).map((side) => (
            <ellipse
              key={side}
              cx={32 + side * 12.5}
              cy={44}
              rx={3 + wings * 0.5}
              ry={7 + wings}
              {...paint(body)}
            />
          ))}
        {tufts > 0 &&
          [-1, 1].map((side) => (
            <path
              key={side}
              d={`M${32 + side * 7} 27L${32 + side * 11} ${26 - tufts * 3}L${32 + side * 12.5} 30z`}
              {...paint(body)}
            />
          ))}
        <ellipse cx={32} cy={41} rx={13.5} ry={16} {...paint(body)} />
        <ellipse cx={32} cy={48.5} rx={8} ry={8} fill={body.light} />
        {Array.from({ length: level('feathers') }, (_, row) => (
          <path
            key={row}
            d={`M27.5 ${45 + row * 4}l1.5 1.2l1.5-1.2M33 ${45 + row * 4}l1.5 1.2l1.5-1.2`}
            {...line(body.shade, 0.8)}
            opacity={0.5}
          />
        ))}
        <path
          d="M32 30C28 24 18 26 20 36C21 42 28 44 32 42C36 44 43 42 44 36C46 26 36 24 32 30z"
          fill={body.light}
        />
        {[26.5, 37.5].map((x) => (
          <circle
            key={x}
            cx={x}
            cy={35}
            r={4.2}
            fill={WHITE}
            stroke={body.shade}
            strokeWidth={0.9}
          />
        ))}
        <Eye x={26.5} y={35} r={2.2} glow={glow} />
        <Eye x={37.5} y={35} r={2.2} glow={level('eyes') > 1 ? glow : undefined} />
        {level('glasses') > 0 && (
          <path
            d="M21.5 35a5 5 0 1 0 10 0a5 5 0 1 0-10 0M32.5 35a5 5 0 1 0 10 0a5 5 0 1 0-10 0M31.5 34.2h1"
            {...line(INK, 0.9)}
          />
        )}
        <path d="M30.8 38.5h2.4l-1.2 2.6z" {...paint(GOLD, 0.6)} />
        <path d="M28 56.5v2M29.5 56.5v2M34.5 56.5v2M36 56.5v2" {...line(GOLD.shade, 1.2)} />
        {book === 1 && (
          <rect x={26.5} y={49} width={11} height={7} rx={1} {...paint(tone(355, 55, 60), 0.8)} />
        )}
        {book > 1 && (
          <g>
            <path
              d="M32 51Q28 49 24 50V56Q28 55 32 57Q36 55 40 56V50Q36 49 32 51z"
              fill={WHITE}
              stroke={INK}
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
            <path d="M32 51V57M26 52.5h4M34 52.5h4M26 54.5h4" {...line('#b9ab9a', 0.6)} />
          </g>
        )}
        {book > 2 && <Sparkle x={36} y={46} size={2} />}
        {hat > 0 && (
          <g>
            <path d={`M24.5 25L${33 + hat} ${25 - hatHeight}L39.5 25z`} {...paint(HAT)} />
            <ellipse cx={32} cy={25.5} rx={9.5} ry={1.9} {...paint(HAT)} />
            {hat > 1 && <Star x={32.5} y={25 - hatHeight * 0.45} size={1.6} />}
          </g>
        )}
        {level('candle') > 0 && (
          <g>
            <rect
              x={9.5}
              y={48}
              width={3}
              height={8}
              fill={WHITE}
              stroke="#b9ab9a"
              strokeWidth={0.6}
            />
            <Flame x={11} y={47.5} size={1.3} />
          </g>
        )}
        {level('stars') > 0 && <Sparkle x={9} y={22} size={2.2} />}
        {level('stars') > 1 && <Sparkle x={55} y={40} size={1.8} />}
        {level('stars') > 2 && <Glow x={32} y={40} r={26} color={accent.light} />}
      </>
    )
  },
)
