import { writeFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { drawPlant } from '../src/plants/draw'
import { species } from '../src/plants/species'

// Renders every species at seven stages into dist/gallery.html; pass species indexes to narrow it.
const stages = [0, 3, 6, 9, 12, 15, 19]
const picked = process.argv[2] ? process.argv[2].split(',').map(Number) : species.map((_, index) => index)
const style =
  'body{font-family:sans-serif;background:#f7f1e6}table{border-collapse:collapse}td{padding:4px;text-align:center;font-size:11px;color:#6b5d50}svg{width:120px;height:120px;background:#fbf7ef;border-radius:12px}'
let html = `<meta charset="utf-8"><style>${style}</style><table>`
for (const index of picked) {
  html += `<tr><td>${index} ${species[index].name}</td>`
  for (const stage of stages) {
    const markup = renderToStaticMarkup(drawPlant(index, stage, `p${index}s${stage}`))
    html += `<td><svg viewBox="0 0 64 64">${markup}</svg><br>${stage}</td>`
  }
  html += '</tr>'
}
writeFileSync('dist/gallery.html', html + '</table>')
