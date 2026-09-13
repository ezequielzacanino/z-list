import { ajisai } from './kinds/ajisai'
import { hasu } from './kinds/hasu'
import { icho } from './kinds/icho'
import { kokedama } from './kinds/kokedama'
import { matsu } from './kinds/matsu'
import { mikan } from './kinds/mikan'
import { momiji } from './kinds/momiji'
import { sakura } from './kinds/sakura'
import { take } from './kinds/take'
import { tsubaki } from './kinds/tsubaki'
import type { Tint } from './paint'
import type { Plant } from './plant'

export type Species = {
  name: string
  plant: Plant
  leaf: Tint
  bloom: Tint
  glaze: Tint
}

const glazes = {
  celadon: { h: 150, s: 22, l: 70 },
  indigo: { h: 220, s: 38, l: 46 },
  cream: { h: 40, s: 38, l: 86 },
  terracotta: { h: 18, s: 45, l: 60 },
  charcoal: { h: 225, s: 10, l: 34 },
}

type Triple = [number, number, number]
type Entry = [string, Plant, Triple, Triple, keyof typeof glazes]

// Ten plant kinds in five variants each; `lists.monster` stores the index into this list.
// prettier-ignore
const entries: Entry[] = [
  ['Sakura', sakura, [105, 42, 50], [345, 70, 82], 'indigo'],
  ['Sakura blanco', sakura, [105, 42, 50], [20, 40, 92], 'charcoal'],
  ['Sakura de noche', sakura, [120, 42, 50], [320, 55, 74], 'cream'],
  ['Sakura temprano', sakura, [95, 42, 50], [350, 80, 76], 'celadon'],
  ['Sakura del templo', sakura, [110, 42, 50], [335, 60, 86], 'terracotta'],
  ['Momiji', momiji, [100, 40, 48], [5, 75, 52], 'cream'],
  ['Momiji naranja', momiji, [95, 42, 50], [22, 85, 55], 'indigo'],
  ['Momiji carmesí', momiji, [105, 38, 46], [350, 65, 45], 'celadon'],
  ['Momiji dorado', momiji, [90, 40, 50], [42, 85, 55], 'charcoal'],
  ['Momiji de otoño', momiji, [100, 40, 48], [12, 80, 50], 'terracotta'],
  ['Pino bonsái', matsu, [140, 28, 36], [45, 60, 70], 'terracotta'],
  ['Pino negro', matsu, [155, 25, 30], [45, 60, 70], 'cream'],
  ['Pino blanco', matsu, [165, 20, 44], [45, 60, 70], 'indigo'],
  ['Pino de montaña', matsu, [125, 30, 38], [45, 60, 70], 'charcoal'],
  ['Pino del jardín', matsu, [135, 35, 34], [45, 60, 70], 'celadon'],
  ['Bambú', take, [95, 45, 52], [60, 50, 70], 'charcoal'],
  ['Bambú dorado', take, [70, 50, 56], [60, 50, 70], 'indigo'],
  ['Bambú de Kioto', take, [110, 40, 46], [60, 50, 70], 'cream'],
  ['Bambú enano', take, [85, 48, 55], [60, 50, 70], 'terracotta'],
  ['Bambú del bosque', take, [120, 35, 44], [60, 50, 70], 'celadon'],
  ['Hortensia azul', ajisai, [110, 35, 45], [215, 60, 68], 'cream'],
  ['Hortensia rosa', ajisai, [105, 35, 45], [340, 60, 74], 'charcoal'],
  ['Hortensia lila', ajisai, [115, 32, 44], [270, 45, 70], 'celadon'],
  ['Hortensia blanca', ajisai, [100, 35, 46], [60, 30, 90], 'indigo'],
  ['Hortensia de lluvia', ajisai, [120, 30, 44], [195, 55, 65], 'terracotta'],
  ['Camelia', tsubaki, [140, 35, 32], [355, 70, 52], 'cream'],
  ['Camelia rosa', tsubaki, [135, 35, 34], [340, 65, 72], 'indigo'],
  ['Camelia blanca', tsubaki, [145, 30, 32], [30, 40, 93], 'charcoal'],
  ['Camelia de invierno', tsubaki, [150, 30, 30], [350, 55, 45], 'celadon'],
  ['Camelia coral', tsubaki, [135, 35, 34], [8, 75, 62], 'terracotta'],
  ['Ginkgo', icho, [80, 45, 55], [48, 85, 58], 'charcoal'],
  ['Ginkgo dorado', icho, [75, 45, 52], [45, 90, 55], 'celadon'],
  ['Ginkgo del santuario', icho, [85, 40, 55], [52, 80, 62], 'terracotta'],
  ['Ginkgo de otoño', icho, [78, 45, 50], [40, 85, 52], 'indigo'],
  ['Ginkgo joven', icho, [90, 45, 56], [58, 70, 60], 'cream'],
  ['Loto', hasu, [115, 38, 45], [340, 55, 82], 'charcoal'],
  ['Loto blanco', hasu, [120, 35, 44], [40, 35, 94], 'indigo'],
  ['Loto rosado', hasu, [110, 38, 46], [330, 65, 76], 'celadon'],
  ['Loto del estanque', hasu, [125, 35, 42], [300, 40, 82], 'terracotta'],
  ['Loto dorado', hasu, [105, 40, 46], [45, 70, 80], 'cream'],
  ['Kokedama', kokedama, [95, 45, 45], [8, 65, 58], 'cream'],
  ['Kokedama de helecho', kokedama, [120, 40, 42], [25, 55, 60], 'charcoal'],
  ['Kokedama del bosque', kokedama, [85, 45, 40], [30, 50, 60], 'celadon'],
  ['Kokedama de rocío', kokedama, [140, 35, 48], [340, 50, 70], 'indigo'],
  ['Kokedama luciérnaga', kokedama, [100, 40, 40], [45, 70, 65], 'terracotta'],
  ['Mandarino', mikan, [120, 40, 38], [28, 95, 55], 'celadon'],
  ['Kumquat', mikan, [110, 42, 40], [35, 95, 55], 'charcoal'],
  ['Yuzu', mikan, [100, 40, 42], [50, 90, 58], 'indigo'],
  ['Naranjo del templo', mikan, [125, 38, 36], [22, 90, 52], 'cream'],
  ['Mandarino de invierno', mikan, [135, 35, 34], [30, 85, 55], 'terracotta'],
]

const tint = ([h, s, l]: Triple): Tint => ({ h, s, l })

export const species: Species[] = entries.map(([name, plant, leaf, bloom, glaze]) => ({
  name,
  plant,
  leaf: tint(leaf),
  bloom: tint(bloom),
  glaze: glazes[glaze],
}))
