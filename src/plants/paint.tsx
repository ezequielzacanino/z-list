// Colors and gradient fills; plants have no outlines, only soft gradients.
export type Tint = { h: number; s: number; l: number }

export function hsl({ h, s, l }: Tint, lighten = 0, alpha = 1) {
  return `hsl(${h} ${s}% ${Math.max(0, Math.min(100, l + lighten))}% / ${alpha})`
}

// Tint a share of the way from one tint to another.
export function mix(from: Tint, to: Tint, share: number): Tint {
  const at = (a: number, b: number) => Math.round(a + (b - a) * share)
  return { h: at(from.h, to.h), s: at(from.s, to.s), l: at(from.l, to.l) }
}

// Reference to a gradient declared under a drawing's id prefix.
export function url(id: string, name: string) {
  return `url(#${id}-${name})`
}

function stops(colors: string[]) {
  return colors.map((color, index) => (
    <stop key={index} offset={colors.length > 1 ? index / (colors.length - 1) : 0} stopColor={color} />
  ))
}

// Linear gradient along an angle, clockwise from straight up, through evenly spaced colors.
export function Linear({ id, colors, angle = 180 }: { id: string; colors: string[]; angle?: number }) {
  const radians = (angle * Math.PI) / 180
  const dx = Math.round(Math.sin(radians) * 50) / 100
  const dy = Math.round(-Math.cos(radians) * 50) / 100
  return (
    <linearGradient id={id} x1={0.5 - dx} y1={0.5 - dy} x2={0.5 + dx} y2={0.5 + dy}>
      {stops(colors)}
    </linearGradient>
  )
}

// Radial gradient lit from a point inside the shape's box.
export function Radial({
  id,
  colors,
  x = 0.35,
  y = 0.3,
  r = 0.85,
}: {
  id: string
  colors: string[]
  x?: number
  y?: number
  r?: number
}) {
  return (
    <radialGradient id={id} cx={x} cy={y} fx={x} fy={y} r={r}>
      {stops(colors)}
    </radialGradient>
  )
}
