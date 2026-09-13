// Colors, geometric cuts and small parts every creature is assembled from, on a 64x64 grid.
// Creatures are cut from circles, sectors, rings, capsules and triangles, flat-filled and outlined.
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

export function poly(points: Point[]) {
  return `M${points.map((point) => point.join(' ')).join('L')}z`
}

// Circular sector between two angles, clockwise from straight up; 180 degrees apart is a half disc.
export function fan(x: number, y: number, r: number, from: number, to: number) {
  const [x1, y1] = polar(x, y, from, r)
  const [x2, y2] = polar(x, y, to, r)
  return `M${x} ${y}L${x1} ${y1}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}z`
}

// Ring segment between two angles, for tails, curls and arched necks.
export function band(x: number, y: number, r: number, width: number, from: number, to: number) {
  const outer = r + width / 2
  const inner = r - width / 2
  const large = to - from > 180 ? 1 : 0
  const [ax, ay] = polar(x, y, from, outer)
  const [bx, by] = polar(x, y, to, outer)
  const [cx, cy] = polar(x, y, to, inner)
  const [dx, dy] = polar(x, y, from, inner)
  return `M${ax} ${ay}A${outer} ${outer} 0 ${large} 1 ${bx} ${by}L${cx} ${cy}A${inner} ${inner} 0 ${large} 0 ${dx} ${dy}z`
}

// Stadium between two centers, for limbs, necks, snouts and tails.
export function capsule(x1: number, y1: number, x2: number, y2: number, width: number) {
  const r = width / 2
  const angle = (Math.atan2(x2 - x1, y1 - y2) * 180) / Math.PI
  const a = polar(x1, y1, angle - 90, r)
  const b = polar(x2, y2, angle - 90, r)
  const c = polar(x2, y2, angle + 90, r)
  const d = polar(x1, y1, angle + 90, r)
  return `M${a.join(' ')}L${b.join(' ')}A${r} ${r} 0 0 1 ${c.join(' ')}L${d.join(' ')}A${r} ${r} 0 0 1 ${a.join(' ')}z`
}

// Isosceles triangle standing on its base center, pointing toward an angle.
export function tri(x: number, y: number, width: number, height: number, angle = 0) {
  return poly([
    polar(x, y, angle - 90, width / 2),
    polar(x, y, angle, height),
    polar(x, y, angle + 90, width / 2),
  ])
}

// Teardrop cut from a circle and its tangent triangle: pointed at the base, round at the far end.
export function drop(x: number, y: number, length: number, r: number, angle = 0) {
  const [cx, cy] = polar(x, y, angle, length - r)
  const offset = (Math.acos(r / (length - r)) * 180) / Math.PI
  const start = polar(cx, cy, angle + 180 + offset, r)
  const end = polar(cx, cy, angle + 180 - offset, r)
  return `M${x} ${y}L${start.join(' ')}A${r} ${r} 0 1 1 ${end.join(' ')}z`
}

// Evenly spaced points along a polyline, from its first point to its last.
export function beads(points: Point[], count: number): Point[] {
  const lengths = points.slice(1).map(([x, y], index) => Math.hypot(x - points[index][0], y - points[index][1]))
  const total = lengths.reduce((sum, length) => sum + length, 0)
  return spread(count, 0, total).map((distance) => {
    let index = 0
    while (index < lengths.length - 1 && distance > lengths[index]) distance -= lengths[index++]
    const share = Math.min(1, distance / lengths[index])
    const [x1, y1] = points[index]
    const [x2, y2] = points[index + 1]
    return [round(x1 + (x2 - x1) * share), round(y1 + (y2 - y1) * share)]
  })
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
  return <path d={`M${x - w} ${y}A${w} ${w} 0 0 0 ${x + w} ${y}`} {...line(INK, 1.3)} />
}

export function Blush({ x, y, r = 1.9 }: { x: number; y: number; r?: number }) {
  return <ellipse cx={x} cy={y} rx={r} ry={r * 0.6} fill={CHEEK} opacity={0.7} />
}

export function Smile({ x, y, w = 2 }: { x: number; y: number; w?: number }) {
  return <path d={`M${x - w} ${y}A${w * 1.4} ${w * 1.4} 0 0 0 ${x + w} ${y}`} {...line(INK, 1.2)} />
}

// Four-pointed star cut from two thin diamonds.
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
  const points = Array.from({ length: 8 }, (_, index) =>
    polar(x, y, index * 45, index % 2 ? size * 0.28 : size),
  )
  return <path d={poly(points)} fill={color.fill} stroke={color.shade} strokeWidth={0.5} />
}

export function Glow({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return <circle cx={x} cy={y} r={r} fill={color} opacity={0.22} />
}

// Teardrop flame standing on its base point, warm or cold, tilted by an angle.
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
  const [tx, ty] = polar(x, y + size * 0.8, angle, size * 2.6)
  const [ix, iy] = polar(x, y + size * 0.6, angle, size * 1.7)
  return (
    <g>
      <path
        d={drop(tx, ty, size * 2.6, size, angle + 180)}
        fill={cold ? '#7cc8ff' : '#ff7a3d'}
        stroke={cold ? '#2f6f9e' : '#b4401a'}
        strokeWidth={0.7}
        strokeLinejoin="round"
      />
      <path d={drop(ix, iy, size * 1.45, size * 0.52, angle + 180)} fill={cold ? '#e6f7ff' : '#ffd166'} />
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

// Leaf or feather: a teardrop growing from its base point toward an angle.
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
  const [vx, vy] = polar(x, y, angle, size * 1.15)
  return (
    <g>
      <path d={drop(x, y, size * 1.6, size * 0.5, angle)} {...paint(color, 0.8)} />
      {vein && <path d={`M${x} ${y}L${vx} ${vy}`} {...line(color.shade, 0.6)} opacity={0.5} />}
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
  return <path d={poly(points)} {...paint(color, 0.6)} />
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

// Row of half-circle waves across the ground.
export function Waves({ y, count = 1 }: { y: number; count?: number }) {
  return (
    <g>
      {Array.from({ length: count }, (_, index) => (
        <path
          key={index}
          d={`M6 ${y - index * 4}${'a4 4 0 0 1 8 0'.repeat(7)}`}
          {...line(WATER.shade, 1.3)}
          opacity={0.7 - index * 0.2}
        />
      ))}
    </g>
  )
}

