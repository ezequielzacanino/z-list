// Geometry every plant is built from, on a 64x64 grid.
export type Point = [number, number]

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

// Teardrop cut from a circle and its tangent triangle: pointed at the base, round at the far end.
export function drop(x: number, y: number, length: number, r: number, angle = 0) {
  const [cx, cy] = polar(x, y, angle, length - r)
  const offset = (Math.acos(r / (length - r)) * 180) / Math.PI
  const start = polar(cx, cy, angle + 180 + offset, r)
  const end = polar(cx, cy, angle + 180 - offset, r)
  return `M${x} ${y}L${start.join(' ')}A${r} ${r} 0 1 1 ${end.join(' ')}z`
}

// Cubic spline through anchor points, closed into a silhouette or left open as a line.
export function smooth(points: Point[], closed = false) {
  const n = points.length
  const at = (index: number) =>
    closed ? points[(index + n) % n] : points[Math.max(0, Math.min(n - 1, index))]
  let d = `M${points[0].join(' ')}`
  for (let index = 0; index < (closed ? n : n - 1); index++) {
    const [x0, y0] = at(index - 1)
    const [x1, y1] = at(index)
    const [x2, y2] = at(index + 1)
    const [x3, y3] = at(index + 2)
    d += `C${round(x1 + (x2 - x0) / 6)} ${round(y1 + (y2 - y0) / 6)} ${round(x2 - (x3 - x1) / 6)} ${round(y2 - (y3 - y1) / 6)} ${x2} ${y2}`
  }
  return closed ? d + 'z' : d
}

// Closed outline whose every edge bulges outward by a depth, for fluff, fleece and foliage.
export function bumps(points: Point[], depth: number) {
  const n = points.length
  let d = `M${points[0].join(' ')}`
  for (let index = 0; index < n; index++) {
    const [x1, y1] = points[index]
    const [x2, y2] = points[(index + 1) % n]
    const length = Math.hypot(x2 - x1, y2 - y1) || 1
    const cx = (x1 + x2) / 2 + ((y2 - y1) / length) * depth * 2
    const cy = (y1 + y2) / 2 - ((x2 - x1) / length) * depth * 2
    d += `Q${round(cx)} ${round(cy)} ${x2} ${y2}`
  }
  return d + 'z'
}

// Points sampled along the open spline through the anchors, several per segment.
export function trace(points: Point[], perSegment = 8): Point[] {
  const n = points.length
  const at = (index: number) => points[Math.max(0, Math.min(n - 1, index))]
  const out: Point[] = [points[0]]
  for (let index = 0; index < n - 1; index++) {
    const [x0, y0] = at(index - 1)
    const [x1, y1] = at(index)
    const [x2, y2] = at(index + 1)
    const [x3, y3] = at(index + 2)
    const c1: Point = [x1 + (x2 - x0) / 6, y1 + (y2 - y0) / 6]
    const c2: Point = [x2 - (x3 - x1) / 6, y2 - (y3 - y1) / 6]
    for (let step = 1; step <= perSegment; step++) {
      const t = step / perSegment
      const u = 1 - t
      out.push([
        round(u * u * u * x1 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x2),
        round(u * u * u * y1 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y2),
      ])
    }
  }
  return out
}

// Value a share of the way along a list of widths.
function along(widths: number[], share: number) {
  const position = share * (widths.length - 1)
  const index = Math.min(widths.length - 2, Math.floor(position))
  return widths[index] + (widths[index + 1] - widths[index]) * (position - index)
}

// Band along a spline whose width follows the given profile, rounded at both ends.
export function ribbon(points: Point[], widths: number[]) {
  const path = trace(points)
  const last = path.length - 1
  const left: Point[] = []
  const right: Point[] = []
  path.forEach(([x, y], index) => {
    const [px, py] = path[Math.max(0, index - 1)]
    const [nx, ny] = path[Math.min(last, index + 1)]
    const length = Math.hypot(nx - px, ny - py) || 1
    const half = along(widths, index / last) / 2
    const ox = (-(ny - py) / length) * half
    const oy = ((nx - px) / length) * half
    left.push([round(x + ox), round(y + oy)])
    right.push([round(x - ox), round(y - oy)])
  })
  const cap = (index: number, toward: number, half: number): Point => {
    const [x, y] = path[index]
    const [tx, ty] = path[toward]
    const length = Math.hypot(x - tx, y - ty) || 1
    return [round(x + ((x - tx) / length) * half), round(y + ((y - ty) / length) * half)]
  }
  const tip = cap(last, last - 1, widths[widths.length - 1] / 2)
  const root = cap(0, 1, widths[0] / 2)
  return smooth([...left, tip, ...right.reverse(), root], true)
}

// Pointed leaf blade growing from its base point toward an angle, widest a third of the way up.
export function blade(x: number, y: number, length: number, width: number, angle = 0) {
  const radians = (angle * Math.PI) / 180
  const cos = Math.cos(radians)
  const sin = Math.sin(radians)
  const local: Point[] = [
    [0, 0],
    [width * 0.5, -length * 0.3],
    [width * 0.28, -length * 0.75],
    [0, -length],
    [-width * 0.28, -length * 0.75],
    [-width * 0.5, -length * 0.3],
  ]
  return smooth(
    local.map(([lx, ly]) => [round(x + lx * cos - ly * sin), round(y + lx * sin + ly * cos)] as Point),
    true,
  )
}
