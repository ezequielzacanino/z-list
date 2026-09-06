// Writes the PWA icons: an accent disc with a check mark, on the app background.
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const BACKGROUND = [253, 247, 243]
const DISC = [244, 146, 111]
const CHECK_INK = [85, 51, 42]
const DISC_RADIUS = 0.44
const STROKE = 0.085
const SAMPLES = 3
const CHECK = [
  [0.3, 0.53, 0.45, 0.67],
  [0.45, 0.67, 0.72, 0.34],
]

function distanceToSegment(x, y, [ax, ay, bx, by]) {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy))
}

function colorAt(x, y) {
  if (CHECK.some((segment) => distanceToSegment(x, y, segment) < STROKE / 2)) return CHECK_INK
  return Math.hypot(x - 0.5, y - 0.5) < DISC_RADIUS ? DISC : BACKGROUND
}

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

// Averages a grid of samples per pixel so the disc and the check keep smooth edges.
function pixelAt(x, y, size) {
  const total = [0, 0, 0]
  for (let sy = 0; sy < SAMPLES; sy++) {
    for (let sx = 0; sx < SAMPLES; sx++) {
      const color = colorAt(
        (x + (sx + 0.5) / SAMPLES) / size,
        (y + (sy + 0.5) / SAMPLES) / size,
      )
      for (let channel = 0; channel < 3; channel++) total[channel] += color[channel]
    }
  }
  return total.map((sum) => Math.round(sum / (SAMPLES * SAMPLES)))
}

function renderIcon(size) {
  const raw = Buffer.alloc(size * (size * 3 + 1))
  for (let y = 0; y < size; y++) {
    const row = y * (size * 3 + 1)
    for (let x = 0; x < size; x++) raw.set(pixelAt(x, y, size), row + 1 + x * 3)
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header.set([8, 2, 0, 0, 0], 8)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

for (const size of [192, 512]) {
  writeFileSync(new URL(`../public/icon-${size}.png`, import.meta.url), renderIcon(size))
  console.log(`public/icon-${size}.png`)
}
