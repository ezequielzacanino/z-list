import { hsl, Radial, url } from '../paint'
import { plant } from '../plant'
import { soilY } from '../pot'
import { ribbon, smooth, type Point } from '../shapes'

type Step = 'trunk' | 'pads' | 'moss' | 'stone' | 'cones'

const base = soilY('tray')
const spine: Point[] = [
  [33, base],
  [36, 45],
  [30.5, 40],
  [27.5, 34],
  [31, 28],
  [35, 23],
]
// Foliage pads: center, horizontal and vertical radius, and the trunk point they grow from.
const pads = [
  { x: 35.5, y: 21, rx: 7.5, ry: 3.4, from: 5 },
  { x: 23, y: 31, rx: 6.5, ry: 3, from: 3 },
  { x: 41, y: 33, rx: 6, ry: 2.8, from: 4 },
  { x: 19, y: 40.5, rx: 5, ry: 2.4, from: 2 },
  { x: 44, y: 41, rx: 5, ry: 2.4, from: 1 },
  { x: 30, y: 15.5, rx: 5, ry: 2.6, from: 5 },
]
const MOSS = { h: 95, s: 42, l: 50 }
const STONE = { h: 30, s: 6, l: 62 }

// A pine sapling in a bonsai tray that twists its trunk and gathers flat clouds of needles.
export const matsu = plant<Step>(
  'tray',
  [
    'trunk',
    'pads',
    'trunk',
    'pads',
    'moss',
    'trunk',
    'pads',
    'stone',
    'trunk',
    'pads',
    'moss',
    'cones',
    'trunk',
    'pads',
    'stone',
    'cones',
    'pads',
    'moss',
    'cones',
  ],
  (level, { id }) => {
    const trunk = level('trunk')
    const shown = spine.slice(0, 1 + trunk)
    const visiblePads = pads.filter((pad, index) => index < level('pads') && pad.from < shown.length)
    return (
      <g>
        <defs>
          <Radial id={`${id}-moss`} colors={[hsl(MOSS, 14), hsl(MOSS), hsl(MOSS, -10)]} y={0.2} />
          <Radial id={`${id}-stone`} colors={[hsl(STONE, 14), hsl(STONE), hsl(STONE, -16)]} />
        </defs>
        {level('stone') > 0 && (
          <path d={smooth([[16, base + 0.4], [17.5, base - 3], [21, base - 3.6], [23.5, base - 1], [22, base + 0.6]], true)} fill={url(id, 'stone')} />
        )}
        {level('stone') > 1 && (
          <path d={smooth([[44, base + 0.4], [45, base - 2.2], [47.5, base - 2.4], [48.5, base + 0.5]], true)} fill={url(id, 'stone')} />
        )}
        {trunk === 0 ? (
          <g>
            <path d={ribbon([[33, base], [33.2, base - 3.5]], [1, 0.7])} fill={url(id, 'bark')} />
            <ellipse cx={33.2} cy={base - 4.2} rx={2.6} ry={1.4} fill={url(id, 'foliage')} />
          </g>
        ) : (
          <path
            d={ribbon(shown, shown.map((_, index) => 1.1 + (1.6 + trunk * 0.9) * (1 - index / (shown.length - 1))))}
            fill={url(id, 'bark')}
          />
        )}
        {visiblePads.map((pad, index) => (
          <path
            key={`b${index}`}
            d={ribbon([spine[pad.from], [(spine[pad.from][0] + pad.x) / 2, pad.y + 1.5], [pad.x, pad.y]], [1.4, 1, 0.8])}
            fill={url(id, 'bark')}
          />
        ))}
        {visiblePads.map((pad, index) => (
          <g key={index}>
            <ellipse cx={pad.x - pad.rx * 0.45} cy={pad.y + 0.4} rx={pad.rx * 0.6} ry={pad.ry * 0.85} fill={url(id, 'foliage')} />
            <ellipse cx={pad.x + pad.rx * 0.45} cy={pad.y + 0.5} rx={pad.rx * 0.6} ry={pad.ry * 0.8} fill={url(id, 'foliage')} />
            <ellipse cx={pad.x} cy={pad.y - pad.ry * 0.25} rx={pad.rx * 0.7} ry={pad.ry} fill={url(id, 'foliage')} />
          </g>
        ))}
        {visiblePads.slice(0, level('cones') * 2).map((pad, index) => (
          <ellipse key={index} cx={pad.x + (index % 2 ? 2 : -2)} cy={pad.y + pad.ry + 0.6} rx={0.9} ry={1.3} fill={url(id, 'bark')} />
        ))}
        {[
          [23, base + 0.2, 4.5],
          [40, base + 0.3, 5.5],
          [29, base + 0.5, 3],
        ]
          .slice(0, level('moss'))
          .map(([x, y, r]) => (
            <ellipse key={x} cx={x} cy={y} rx={r} ry={1.4} fill={url(id, 'moss')} />
          ))}
      </g>
    )
  },
)
