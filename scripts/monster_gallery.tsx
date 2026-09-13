import { writeFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { drawMonster } from '../src/monsters/draw'
import { setFaceStyle, type FaceStyle } from '../src/monsters/faces'
import { species } from '../src/monsters/species'

// Renders every species at five stages into dist/gallery.html; pass species indexes to narrow it.
// With a second argument "faces" the columns become the five face designs at one stage instead.
const faces = process.argv[3] === 'faces'
const stages = faces ? [9, 9, 9, 9, 9] : [0, 4, 9, 14, 19]
const picked = process.argv[2] ? process.argv[2].split(',').map(Number) : species.map((_, index) => index)
const style =
  'body{font-family:sans-serif;background:#fffdf8}table{border-collapse:collapse}td{padding:4px;border:1px solid #eee;text-align:center;font-size:11px}svg{width:150px;height:150px;background:#fff}'
let html = `<meta charset="utf-8"><style>${style}</style><table>`
for (const index of picked) {
  html += `<tr><td>${index} ${species[index].name}</td>`
  stages.forEach((stage, column) => {
    if (faces) setFaceStyle((column + 1) as FaceStyle)
    html += `<td><svg viewBox="0 0 64 64">${renderToStaticMarkup(drawMonster(index, stage))}</svg><br>${faces ? `cara ${column + 1}` : stage}</td>`
  })
  html += '</tr>'
}
writeFileSync('dist/gallery.html', html + '</table>')
