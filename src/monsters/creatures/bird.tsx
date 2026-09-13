import { creature } from '../creature'
import {
  Blush,
  Bolt,
  Eye,
  Flame,
  Glow,
  Leaf,
  line,
  mixHue,
  paint,
  polar,
  Sparkle,
  spread,
  tone,
} from '../kit'

type Step = 'beak' | 'wings' | 'tail' | 'color' | 'crest' | 'element'

const BEAK = { fill: '#f5a142', shade: '#9a5418', light: '#ffd9a8' }

// A chick whose feathers slowly take the final color: red into a phoenix, blue into a thunderbird.
export const bird = creature<Step>(
  [
    [
      'beak',
      'wings',
      'tail',
      'color',
      'crest',
      'beak',
      'tail',
      'wings',
      'color',
      'crest',
      'tail',
      'color',
      'wings',
      'crest',
      'tail',
      'color',
      'element',
      'element',
      'element',
    ],
    [
      'wings',
      'beak',
      'crest',
      'color',
      'tail',
      'wings',
      'color',
      'beak',
      'tail',
      'crest',
      'wings',
      'color',
      'tail',
      'crest',
      'color',
      'tail',
      'element',
      'element',
      'element',
    ],
  ],
  (level, { hue, accentHue }, thunder) => {
    const share = level('color') / 4
    const body = tone(mixHue(hue, accentHue, share), 62 + share * 18, 76 - share * 12)
    const feather = tone(mixHue(hue + 10, accentHue + 15, share), 75, 66)
    const tail = level('tail')
    const wings = level('wings')
    const crest = level('crest')
    const element = level('element')
    const tailAngles = spread([0, 2, 3, 4, 5][tail], 45, 105)
    const tailLength = [0, 5, 7, 9, 11][tail]
    const tips = tailAngles.map((angle) => polar(41, 49, angle, tailLength * 1.5))
    const wing = (side: number) => (
      <ellipse
        key={side}
        cx={32 + side * 11}
        cy={45}
        rx={3 + wings}
        ry={5 + wings}
        transform={`rotate(${side * 25} ${32 + side * 11} 45)`}
        {...paint(feather)}
      />
    )
    return (
      <>
        {element > 2 && <Glow x={32} y={40} r={26} color={thunder ? '#8fd3ff' : '#ff9a5a'} />}
        {wings > 2 &&
          [-1, 1].map((side) =>
            spread(4, 25, 100).map((angle) => (
              <Leaf
                key={`${side}${angle}`}
                x={32 + side * 8}
                y={40}
                size={6}
                angle={side * angle}
                color={feather}
                vein={false}
              />
            )),
          )}
        {tailAngles.map((angle) => (
          <Leaf key={angle} x={41} y={49} size={tailLength} angle={angle} color={feather} />
        ))}
        {tail > 3 &&
          tips.map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={1.3} fill={thunder ? '#ffd166' : '#ffe08a'} />
          ))}
        {element > 0 &&
          tips.map(([x, y]) =>
            thunder ? (
              <Bolt key={x} x={x} y={y} size={2.4} />
            ) : (
              <Flame key={x} x={x} y={y + 1.5} size={1.8} />
            ),
          )}
        <path
          d="M29 55L29 58.5M27.5 58.5H30.5M35 55L35 58.5M33.5 58.5H36.5"
          {...line(BEAK.shade, 1.3)}
        />
        {crest > 0 &&
          spread(crest * 2 - 1, -30, 30).map((angle) => (
            <Leaf
              key={angle}
              x={32}
              y={32}
              size={2.5 + crest * 1.5}
              angle={angle}
              color={feather}
              vein={false}
            />
          ))}
        {element > 1 &&
          (thunder ? (
            <Bolt x={32} y={22 - crest} size={3} />
          ) : (
            <Flame x={32} y={28 - crest * 1.5} size={2.6} />
          ))}
        <circle cx={32} cy={43} r={12.5} {...paint(body)} />
        <ellipse cx={32.5} cy={47.5} rx={7} ry={6} fill={body.light} />
        {wings > 0 && wings < 3 && [-1, 1].slice(wings > 1 ? 0 : 1).map(wing)}
        <Eye x={27.5} y={40} r={1.8} />
        <Eye x={36.5} y={40} r={1.8} />
        <Blush x={24.5} y={44} />
        <Blush x={39.5} y={44} />
        {level('beak') < 2 ? (
          <path
            d={`M${30 - level('beak')} 43L${34 + level('beak')} 43L32 ${46 + level('beak')}z`}
            {...paint(BEAK, 0.8)}
          />
        ) : (
          <path d="M29 42.5Q32 41.5 35 42.5Q35 46 32 48.5Q31.5 46 29 42.5z" {...paint(BEAK, 0.8)} />
        )}
        {element > 2 && (
          <>
            <Sparkle x={10} y={20} size={2.4} />
            <Sparkle x={54} y={18} size={2.8} />
          </>
        )}
      </>
    )
  },
)
