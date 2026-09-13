import type { Creature } from './creature'
import { axolotl } from './creatures/axolotl'
import { bat } from './creatures/bat'
import { bee } from './creatures/bee'
import { bird } from './creatures/bird'
import { bunny } from './creatures/bunny'
import { capybara } from './creatures/capybara'
import { cat } from './creatures/cat'
import { dog } from './creatures/dog'
import { fawn } from './creatures/fawn'
import { fox } from './creatures/fox'
import { frog } from './creatures/frog'
import { golem } from './creatures/golem'
import { hydra } from './creatures/hydra'
import { koi } from './creatures/koi'
import { lizard } from './creatures/lizard'
import { mushroom } from './creatures/mushroom'
import { octopus } from './creatures/octopus'
import { owl } from './creatures/owl'
import { pony } from './creatures/pony'
import { serpent } from './creatures/serpent'
import { sheep } from './creatures/sheep'
import { slime } from './creatures/slime'
import { sprout } from './creatures/sprout'
import { tanuki } from './creatures/tanuki'
import { turtle } from './creatures/turtle'

export type Species = {
  // Name of the creature it grows into.
  name: string
  creature: Creature
  variant: boolean
  hue: number
  accentHue: number
  saturation: number
  lightness: number
}

type Entry = [string, Creature, 0 | 1, number, number, number?, number?]

// prettier-ignore
const entries: Entry[] = [
  ['Quetzalcóatl', serpent, 0, 140, 45],
  ['Basilisco', serpent, 1, 270, 90],
  ['Fénix', bird, 0, 48, 6],
  ['Ave del trueno', bird, 1, 195, 225],
  ['Cerbero', dog, 0, 28, 10, 38, 64],
  ['Ortro', dog, 1, 215, 200, 18, 72],
  ['Kitsune', fox, 0, 24, 200, 82, 66],
  ['Kitsune de nieve', fox, 1, 205, 200, 35, 90],
  ['Dragón', lizard, 0, 355, 30, 62, 72],
  ['Ryū', lizard, 1, 165, 45, 45, 68],
  ['Tortuga isla', turtle, 0, 95, 30, 40, 66],
  ['Genbu', turtle, 1, 150, 190, 30, 60],
  ['Kraken', octopus, 0, 200, 280, 55, 70],
  ['Akkorokamui', octopus, 1, 355, 330, 60, 70],
  ['Esfinge', cat, 0, 40, 210, 55, 72],
  ['Nekomata', cat, 1, 270, 275, 15, 80],
  ['Conejo lunar', bunny, 0, 30, 45, 15, 92],
  ['Jackalope', bunny, 1, 28, 150, 40, 70],
  ['Espíritu del bosque', fawn, 0, 28, 120, 50, 66],
  ['Qilin', fawn, 1, 45, 15, 60, 72],
  ['Ent', sprout, 0, 30, 110, 40, 55],
  ['Mandrágora', sprout, 1, 35, 320],
  ['Dragón koi', koi, 0, 30, 8, 15, 94],
  ['Koi dorado', koi, 1, 45, 45, 85, 66],
  ['Búho sabio', owl, 0, 30, 260, 40, 62],
  ['Lechuza lunar', owl, 1, 230, 200, 25, 75],
  ['Oveja nube', sheep, 0, 20, 200, 25, 45],
  ['Carnero dorado', sheep, 1, 25, 45, 30, 50],
  ['Rana príncipe', frog, 0, 110, 355, 50, 62],
  ['Kappa', frog, 1, 150, 80, 45, 58],
  ['Unicornio', pony, 0, 280, 300, 20, 92],
  ['Pegaso', pony, 1, 210, 200, 25, 90],
  ['Tanuki', tanuki, 0, 30, 10, 35, 58],
  ['Mujina', tanuki, 1, 220, 350, 8, 55],
  ['Capibara del onsen', capybara, 0, 28, 200, 40, 62],
  ['Capibara zen', capybara, 1, 35, 160, 30, 66],
  ['Vampiro', bat, 0, 270, 355, 25, 62],
  ['Camazotz', bat, 1, 190, 45, 25, 55],
  ['Abeja reina', bee, 0, 48, 330, 90, 68],
  ['Abeja solar', bee, 1, 40, 20, 95, 64],
  ['Ajolote dragón', axolotl, 0, 340, 200, 70, 85],
  ['Salamandra', axolotl, 1, 15, 355, 70, 62],
  ['Golem de musgo', golem, 0, 210, 185, 8, 66],
  ['Golem de lava', golem, 1, 15, 20],
  ['Rey slime', slime, 0, 200, 330, 65, 72],
  ['Slime de cristal', slime, 1, 280, 190, 55, 78],
  ['Guardián hongo', mushroom, 0, 5, 100, 65, 62],
  ['Hongo lunar', mushroom, 1, 40, 250],
  ['Hidra', hydra, 0, 175, 200, 45, 62],
  ['Hidra de lava', hydra, 1, 5, 30, 45, 55],
]

export const species: Species[] = entries.map(
  ([name, creature, variant, hue, accentHue, saturation = 55, lightness = 74]) => ({
    name,
    creature,
    variant: variant === 1,
    hue,
    accentHue,
    saturation,
    lightness,
  }),
)
