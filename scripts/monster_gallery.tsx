import { writeFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { drawMonster } from '../src/monsters/draw'
import { species } from '../src/monsters/species'

// Renders every species at five stages into dist/gallery.html; pass species indexes to narrow it.
const stages = [0, 4, 9, 14, 19]
const picked = process.argv[2] ? process.argv[2].split(',').map(Number) : species.map((_, index) => index)
const style =
  'body{font-family:sans-serif;background:#fffdf8}table{border-collapse:collapse}td{padding:4px;border:1px solid #eee;text-align:center;font-size:11px}svg{width:150px;height:150px;background:#fff}'
let html = `<meta charset="utf-8"><style>${style}</style><table>`
for (const index of picked) {
  html += `<tr><td>${index} ${species[index].name}</td>`
  for (const stage of stages) {
    html += `<td><svg viewBox="0 0 64 64">${renderToStaticMarkup(drawMonster(index, stage))}</svg><br>${stage}</td>`
  }
  html += '</tr>'
}
writeFileSync('dist/gallery.html', html + '</table>')
