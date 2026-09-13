import { creature, type Look } from '../creature'
import {
  Blush,
  capsule,
  drop,
  Eye,
  fan,
  Flower,
  Glow,
  INK,
  Leaf,
  LEAF,
  line,
  paint,
  poly,
  Smile,
  Sparkle,
  spread,
  tone,
  tri,
  WOOD,
} from '../kit'

type Step =
  | 'leaves'
  | 'roots'
  | 'trunk'
  | 'branches'
  | 'fruit'
  | 'nest'
  | 'face'
  | 'body'
  | 'arms'
  | 'flower'
  | 'crown'
  | 'sparkle'
  | 'mouth'

// A seedling that grows into a walking Ent, or a mandrake that learns to sing.
export const sprout = creature<Step>(
  [
    [
      'leaves',
      'roots',
      'trunk',
      'leaves',
      'branches',
      'roots',
      'fruit',
      'trunk',
      'leaves',
      'branches',
      'nest',
      'fruit',
      'trunk',
      'roots',
      'leaves',
      'branches',
      'fruit',
      'nest',
      'face',
    ],
    [
      'leaves',
      'body',
      'arms',
      'leaves',
      'flower',
      'body',
      'mouth',
      'leaves',
      'flower',
      'arms',
      'crown',
      'body',
      'flower',
      'sparkle',
      'leaves',
      'mouth',
      'flower',
      'crown',
      'sparkle',
    ],
  ],
  (level, look, mandrake) =>
    mandrake ? <Mandrake level={level} look={look} /> : <Ent level={level} />,
)

type Props = { level: (step: Step) => number }

function Ent({ level }: Props) {
  const trunk = level('trunk')
  const height = 11 + trunk * 4
  const top = 57 - height
  const width = 8 + trunk * 1.5
  const leaves = level('leaves')
  const branches = level('branches')
  const armY = top + height * 0.4
  const faceY = top + height * 0.58
  const canopyY = top - 2 - leaves
  const nestX = 32 + width * 0.4 + 7
  const fruits = [
    [28, canopyY - 2],
    [37, canopyY + 1],
    [33, canopyY - 6],
    [23, canopyY + 3],
    [41, canopyY - 3],
    [30, canopyY + 4],
  ]
  return (
    <>
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={`M${32 + side * width * 0.3} 56l${side * (3 + level('roots') * 1.6)} 2.5`}
          {...line(WOOD.shade, 2)}
        />
      ))}
      {level('roots') > 2 && <path d="M32 57v1.8" {...line(WOOD.shade, 2)} />}
      {branches > 0 &&
        [1, -1].slice(0, branches > 1 ? 2 : 1).map((side) => {
          const endY = armY - (branches > 2 ? 9 : 5)
          const endX = 32 + side * (width * 0.4 + 8)
          return (
            <g key={side}>
              <path d={capsule(32 + side * width * 0.4, armY, endX, endY, 2)} {...paint(WOOD, 1)} />
              <Leaf x={endX} y={endY} size={2.4} angle={side * 30} />
            </g>
          )
        })}
      <path
        d={poly([
          [32 - width / 2, 57.5],
          [32 - width * 0.35, top],
          [32 + width * 0.35, top],
          [32 + width / 2, 57.5],
        ])}
        {...paint(WOOD)}
      />
      <path d={`M${32 - width * 0.25} ${top + 4}v4M${32 + width * 0.2} 51v3`} {...line(WOOD.shade, 0.8)} opacity={0.5} />
      {leaves === 1 && (
        <>
          <Leaf x={32} y={top + 1} size={3} angle={-35} />
          <Leaf x={32} y={top + 1} size={3} angle={35} />
        </>
      )}
      {leaves > 1 && <circle cx={32} cy={canopyY} r={3 + leaves * 1.8} {...paint(LEAF, 1)} />}
      {leaves > 2 &&
        [-1, 1].map((side) => (
          <circle key={side} cx={32 + side * (4 + leaves)} cy={canopyY + 3} r={2 + leaves} {...paint(LEAF, 1)} />
        ))}
      {leaves > 1 && <circle cx={29} cy={canopyY - 2} r={2.5} fill={LEAF.light} opacity={0.6} />}
      {fruits.slice(0, level('fruit') * 2).map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={1.4} fill="#e85d5d" stroke="#8c2f25" strokeWidth={0.5} />
      ))}
      {level('nest') > 0 && branches > 0 && (
        <g>
          <path d={fan(nestX, armY - 8.5, 3.4, 90, 270)} fill={WOOD.fill} stroke={WOOD.shade} strokeWidth={0.7} />
          {level('nest') > 1 && (
            <>
              <circle cx={nestX} cy={armY - 10.5} r={1.8} fill="#8fc7ff" stroke="#2f6f9e" strokeWidth={0.6} />
              <path d={tri(nestX + 1.6, armY - 10.6, 0.9, 1.3, 90)} fill="#ffd166" />
            </>
          )}
        </g>
      )}
      <Eye x={29.4} y={faceY} r={1.4} />
      <Eye x={34.6} y={faceY} r={1.4} />
      <Blush x={28} y={faceY + 2.4} r={1.2} />
      <Blush x={36} y={faceY + 2.4} r={1.2} />
      <Smile x={32} y={faceY + 2.4} w={1.4} />
      {level('face') > 0 &&
        spread(4, 28.5, 35.5).map((x) => <circle key={x} cx={x} cy={faceY + 5.2} r={1.3} fill={LEAF.fill} />)}
    </>
  )
}

function Mandrake({ level, look: { accent } }: Props & { look: Look }) {
  const root = tone(35, 45, 78)
  const size = level('body')
  const width = 9 + size * 1.6
  const height = 11 + size * 1.5
  const top = 56 - height
  const r = Math.min(width * 0.8, (57.5 - top) / 2.2)
  const centerY = top + r
  const flower = level('flower')
  const mouth = level('mouth')
  const leafCount = 2 + level('leaves')
  return (
    <>
      {level('sparkle') > 1 && <Glow x={32} y={40} r={24} color={accent.light} />}
      {spread(leafCount, -55, 55).map((angle) => (
        <Leaf key={angle} x={32} y={top + 1} size={4 + level('leaves') * 0.5} angle={angle} />
      ))}
      {flower > 0 && <path d={`M32 ${top}V${top - 9}`} {...line(LEAF.shade, 1.2)} />}
      {flower === 1 && <circle cx={32} cy={top - 9.5} r={2} {...paint(accent, 0.7)} />}
      {flower > 1 && <Flower x={32} y={top - 10} size={flower > 2 ? 2.4 : 1.8} color={accent} />}
      {flower > 3 && <Flower x={39} y={top - 5} size={1.5} color={accent} />}
      {[-1, 1].map((side) => (
        <path key={side} d={`M${32 + side * 2} 55.5l${side * 3} 3`} {...line(root.shade, 1.8)} />
      ))}
      {level('arms') > 0 &&
        [-1, 1].map((side) => {
          const raised = level('arms') > 1 && side > 0
          return (
            <path
              key={side}
              d={capsule(32 + side * r * 0.9, centerY, 32 + side * (r * 0.9 + 5), centerY + (raised ? -7 : 5), 1.8)}
              {...paint(root, 1)}
            />
          )
        })}
      <path d={drop(32, 57.5, 57.5 - top, r)} {...paint(root)} />
      <path
        d={`M${32 - r * 0.4} ${centerY + r * 0.6}h3M${32 + r * 0.2} ${centerY + r * 0.9}h3`}
        {...line(root.shade, 0.7)}
        opacity={0.5}
      />
      {level('crown') > 0 &&
        spread(level('crown') > 1 ? 5 : 3, -40, 40).map((angle) => (
          <Leaf
            key={angle}
            x={32}
            y={top + 3}
            size={1.8}
            angle={angle}
            color={level('crown') > 1 ? { ...LEAF, fill: '#ffd166' } : LEAF}
            vein={false}
          />
        ))}
      <Eye x={29.5} y={centerY - 1} r={1.5} />
      <Eye x={34.5} y={centerY - 1} r={1.5} />
      <Blush x={27} y={centerY + 1.8} r={1.3} />
      <Blush x={37} y={centerY + 1.8} r={1.3} />
      {mouth === 0 ? (
        <Smile x={32} y={centerY + 1.8} w={1.3} />
      ) : (
        <circle cx={32} cy={centerY + 2.6} r={1.2 + mouth * 0.3} fill={INK} />
      )}
      {mouth > 1 && (
        <path d="M44 30v-5l3-1v5M44 30a1.2 1 0 1 1-.1 0M47 29a1.2 1 0 1 1-.1 0" {...line(INK, 0.9)} />
      )}
      {level('sparkle') > 0 && <Sparkle x={14} y={30} size={2.2} />}
    </>
  )
}
