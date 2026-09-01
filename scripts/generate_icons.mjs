// Writes the PWA icons: a check mark in the accent ink on the accent background.
import { deflateSync } from 'node:zlib'
import { writeFileSync } from 'node:fs'

const BACKGROUND = [244, 146, 111]
const FOREGROUND = [85, 51, 42]
const STROKE = 0.085
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

function renderIcon(size) {
  const raw = Buffer.alloc(size * (size * 3 + 1))
  for (let y = 0; y < size; y++) {
    const row = y * (size * 3 + 1)
    for (let x = 0; x < size; x++) {
      const inside = CHECK.some(
        (segment) => distanceToSegment((x + 0.5) / size, (y + 0.5) / size, segment) < STROKE / 2,
      )
      const [r, g, b] = inside ? FOREGROUND : BACKGROUND
      raw.set([r, g, b], row + 1 + x * 3)
    }
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
