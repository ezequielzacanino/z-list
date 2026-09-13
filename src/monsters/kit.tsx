// Shared colors, path helpers and small parts every creature is drawn from, on a 64x64 grid.
export type Tone = { fill: string; shade: string; light: string }
export type Point = [number, number]

export const INK = '#3a2c2b'
export const WHITE = '#fffdf8'
export const CHEEK = '#ff9fb3'
export const GOLD: Tone = { fill: '#ffd166', shade: '#a8781f', light: '#fff1c2' }
export const LEAF: Tone = {
  fill: 'hsl(110 45% 62%)',
  shade: 'hsl(110 35% 30%)',
  light: 'hsl(110 55% 85%)',
}
export const WOOD: Tone = {
  fill: 'hsl(30 40% 55%)',
  shade: 'hsl(30 35% 28%)',
  light: 'hsl(30 45% 75%)',
}
export const WATER: Tone = {
  fill: 'hsl(200 75% 72%)',
  shade: 'hsl(205 50% 38%)',
  light: 'hsl(200 90% 90%)',
}

export function tone(hue: number, saturation = 55, lightness = 74): Tone {
  return {
    fill: `hsl(${hue} ${saturation}% ${lightness}%)`,
    shade: `hsl(${hue} ${Math.round(saturation * 0.55)}% 30%)`,
    light: `hsl(${hue} ${Math.min(90, saturation + 20)}% ${Math.min(94, lightness + 16)}%)`,
  }
}

// Hue a share of the way from one hue to another.
export function mixHue(from: number, to: number, share: number) {
  return Math.round(from + (to - from) * share)
}

export function paint(color: Tone, width = 1.4) {
  return {
    fill: color.fill,
    stroke: color.shade,
    strokeWidth: width,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  }
}

export function line(color: string, width = 1.4) {
  return {
    fill: 'none',
    stroke: color,
    strokeWidth: width,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  }
}

const round = (value: number) => Math.round(value * 100) / 100

// Smooth path through the points, as Catmull-Rom curves.
export function smooth(points: Point[]) {
  let d = `M${points[0][0]} ${points[0][1]}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const [x1, y1] = points[index]
    const [x2, y2] = points[index + 1]
    const next = points[index + 2] ?? points[index + 1]
    d += `C${round(x1 + (x2 - previous[0]) / 6)} ${round(y1 + (y2 - previous[1]) / 6)} ${round(x2 - (next[0] - x1) / 6)} ${round(y2 - (next[1] - y1) / 6)} ${x2} ${y2}`
  }
  return d
}

// Point at a distance from another, the angle in degrees clockwise from straight up.
export function polar(x: number, y: number, angle: number, length: number): Point {
  const radians = (angle * Math.PI) / 180
  return [round(x + Math.sin(radians) * length), round(y - Math.cos(radians) * length)]
}

// Evenly spaced values between two ends, the middle one when there is a single value.
export function spread(count: number, from: number, to: number) {
  if (count === 1) return [(from + to) / 2]
  return Array.from({ length: count }, (_, index) => from + ((to - from) * index) / (count - 1))
}

// An outlined tube along a path, for necks, tails, limbs and tentacles.
export function Tube({ d, color, width }: { d: string; color: Tone; width: number }) {
  return (
    <g>
      <path d={d} {...line(color.shade, width + 2.6)} />
      <path d={d} {...line(color.fill, width)} />
    </g>
  )
}

export function Eye({ x, y, r = 1.8, glow }: { x: number; y: number; r?: number; glow?: string }) {
  return (
    <g>
      {glow && <circle cx={x} cy={y} r={r * 2.3} fill={glow} opacity={0.5} />}
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.38} fill={WHITE} />
    </g>
  )
}

export function ClosedEye({ x, y, w = 2.2 }: { x: number; y: number; w?: number }) {
  return <path d={`M${x - w} ${y}Q${x} ${y + w * 0.9} ${x + w} ${y}`} {...line(INK, 1.3)} />
}

export function Blush({ x, y, r = 1.9 }: { x: number; y: number; r?: number }) {
  return <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill={CHEEK} opacity={0.7} />
}

export function Smile({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  return <path d={`M${x - w} ${y}Q${x} ${y + w} ${x + w} ${y}`} {...line(INK, 1.2)} />
}

export function Sparkle({
  x,
  y,
  size,
  color = GOLD,
}: {
  x: number
  y: number
  size: number
  color?: Tone
}) {
  return (
    <path
      d={`M${x} ${y - size}Q${x} ${y} ${x + size} ${y}Q${x} ${y} ${x} ${y + size}Q${x} ${y} ${x - size} ${y}Q${x} ${y} ${x} ${y - size}z`}
      fill={color.fill}
      stroke={color.shade}
      strokeWidth={0.5}
    />
  )
}

export function Glow({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return <circle cx={x} cy={y} r={r} fill={color} opacity={0.22} />
}

// Flame standing on its base point, warm or cold, tilted by an angle.
export function Flame({
  x,
  y,
  size,
  cold = false,
  angle = 0,
}: {
  x: number
  y: number
  size: number
  cold?: boolean
  angle?: number
}) {
  const shape = (s: number, lift: number) =>
    `M${x} ${y - 1.8 * s - lift}C${x + 0.25 * s} ${y - 1.1 * s - lift} ${x + s} ${y - 0.9 * s - lift} ${x + s} ${y - 0.2 * s - lift}A${s} ${s} 0 0 1 ${x - s} ${y - 0.2 * s - lift}C${x - s} ${y - 0.8 * s - lift} ${x - 0.4 * s} ${y - 1 * s - lift} ${x} ${y - 1.8 * s - lift}z`
  return (
    <g transform={angle ? `rotate(${angle} ${x} ${y})` : undefined}>
      <path
        d={shape(size, 0)}
        fill={cold ? '#7cc8ff' : '#ff7a3d'}
        stroke={cold ? '#2f6f9e' : '#b4401a'}
        strokeWidth={0.7}
      />
      <path d={shape(size * 0.55, -size * 0.2)} fill={cold ? '#e6f7ff' : '#ffd166'} />
    </g>
  )
}

export function Bolt({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <path
      d={`M${x + 0.3 * size} ${y - size}L${x - 0.55 * size} ${y + 0.15 * size}H${x - 0.05 * size}L${x - 0.3 * size} ${y + size}L${x + 0.6 * size} ${y - 0.2 * size}H${x + 0.08 * size}z`}
      {...paint(GOLD, 0.7)}
    />
  )
}

// Leaf or feather growing from its base point toward an angle.
export function Leaf({
  x,
  y,
  size,
  angle = 0,
  color = LEAF,
  vein = true,
}: {
  x: number
  y: number
  size: number
  angle?: number
  color?: Tone
  vein?: boolean
}) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path
        d={`M${x} ${y}Q${x + 0.7 * size} ${y - 0.6 * size} ${x} ${y - 1.6 * size}Q${x - 0.7 * size} ${y - 0.6 * size} ${x} ${y}z`}
        {...paint(color, 0.8)}
      />
      {vein && (
        <path d={`M${x} ${y}L${x} ${y - 1.2 * size}`} {...line(color.shade, 0.6)} opacity={0.5} />
      )}
    </g>
  )
}

// Crown sitting on its base center.
export function Crown({ x, y, width, gem }: { x: number; y: number; width: number; gem?: string }) {
  const half = width / 2
  const height = width * 0.6
  return (
    <g>
      <path
        d={`M${x - half} ${y}V${y - height * 0.8}L${x - half / 2} ${y - height * 0.4}L${x} ${y - height}L${x + half / 2} ${y - height * 0.4}L${x + half} ${y - height * 0.8}V${y}z`}
        {...paint(GOLD, 0.9)}
      />
      {gem && <circle cx={x} cy={y - height * 0.35} r={width * 0.1} fill={gem} />}
    </g>
  )
}

export function Star({
  x,
  y,
  size,
  color = GOLD,
}: {
  x: number
  y: number
  size: number
  color?: Tone
}) {
  const points = Array.from({ length: 10 }, (_, index) =>
    polar(x, y, index * 36, index % 2 ? size * 0.45 : size),
  )
  return <path d={`M${points.map((point) => point.join(' ')).join('L')}z`} {...paint(color, 0.6)} />
}

export function Flower({ x, y, size, color }: { x: number; y: number; size: number; color: Tone }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => {
        const [px, py] = polar(x, y, angle, size)
        return <circle key={angle} cx={px} cy={py} r={size * 0.85} {...paint(color, 0.6)} />
      })}
      <circle cx={x} cy={y} r={size * 0.6} fill={GOLD.fill} />
    </g>
  )
}

export function Heart({
  x,
  y,
  size,
  color,
}: {
  x: number
  y: number
  size: number
  color: string
}) {
  return (
    <path
      d={`M${x} ${y + size}C${x - size * 1.4} ${y} ${x - size} ${y - size} ${x} ${y - size * 0.35}C${x + size} ${y - size} ${x + size * 1.4} ${y} ${x} ${y + size}z`}
      fill={color}
    />
  )
}

// Soft cloud made of overlapping puffs along a line.
export function Cloud({
  x,
  y,
  width,
  color = WHITE,
}: {
  x: number
  y: number
  width: number
  color?: string
}) {
  const puffs = Math.max(2, Math.round(width / 5))
  return (
    <g>
      {spread(puffs, x - width / 2, x + width / 2).map((px, index) => (
        <circle
          key={px}
          cx={px}
          cy={y - (index % 2 ? 1.5 : 0)}
          r={width / puffs + 1}
          fill={color}
          stroke="#c9d6e2"
          strokeWidth={0.6}
        />
      ))}
    </g>
  )
}

// Wavy water line across the ground.
export function Waves({ y, count = 1 }: { y: number; count?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, index) => (
        <path
          key={index}
          d={`M6 ${y - index * 4}q4-3 8 0t8 0t8 0t8 0t8 0t8 0t8 0`}
          {...line(WATER.shade, 1.3)}
          opacity={0.7 - index * 0.2}
        />
      ))}
    </g>
  )
}
