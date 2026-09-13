import type { BodyShape } from './bodies'
import type { EyeStyle, MouthStyle } from './faces'
import type { Trait } from './traits'

export type Species = {
  name: string
  hue: number
  body: BodyShape
  eyes: EyeStyle
  mouth: MouthStyle
  // Traits in the order they first appear as the monster grows.
  traits: Trait[]
}

type Entry = [string, BodyShape, EyeStyle, MouthStyle, Trait[]]

// prettier-ignore
const entries: Entry[] = [
  ['Mochi', 'round', 'shiny', 'smile', ['blush', 'feet', 'ears', 'arms', 'belly', 'tail', 'aura', 'spots']],
  ['Tofu', 'box', 'dots', 'cat', ['feet', 'stripes', 'arms', 'horns', 'scarf', 'belly', 'aura', 'brows', 'teeth']],
  ['Pipo', 'bean', 'wide', 'o', ['blush', 'antenna', 'feet', 'arms', 'spots', 'wings', 'belly', 'scarf']],
  ['Nube', 'cloud', 'sleepy', 'tiny', ['blush', 'feet', 'sprout', 'arms', 'wings', 'aura', 'belly', 'scarf']],
  ['Frijol', 'bean', 'dots', 'smile', ['spots', 'feet', 'arms', 'ears', 'tail', 'crown', 'belly', 'blush']],
  ['Bruma', 'ghost', 'cyclops', 'o', ['blush', 'arms', 'antenna', 'aura', 'cape', 'spots', 'brows', 'belly', 'stripes']],
  ['Chispa', 'drop', 'shiny', 'grin', ['blush', 'arms', 'feet', 'tail', 'wings', 'aura', 'teeth', 'spots']],
  ['Coco', 'round', 'wide', 'cat', ['ears', 'feet', 'blush', 'arms', 'tail', 'belly', 'scarf', 'crown']],
  ['Lulo', 'pear', 'dots', 'fang', ['feet', 'arms', 'horns', 'tail', 'spots', 'belly', 'cape', 'brows']],
  ['Mango', 'blob', 'shiny', 'smile', ['sprout', 'blush', 'feet', 'arms', 'belly', 'spots', 'wings', 'teeth', 'brows']],
  ['Pelusa', 'cloud', 'dots', 'cat', ['ears', 'blush', 'feet', 'arms', 'tail', 'aura', 'scarf', 'belly']],
  ['Rulo', 'box', 'sleepy', 'smile', ['antenna', 'feet', 'arms', 'stripes', 'spots', 'cape', 'blush', 'belly', 'teeth']],
  ['Tito', 'bean', 'tri', 'grin', ['horns', 'feet', 'arms', 'tail', 'spots', 'wings', 'teeth', 'blush']],
  ['Uma', 'ghost', 'shiny', 'tiny', ['blush', 'arms', 'ears', 'aura', 'crown', 'belly', 'spots', 'scarf']],
  ['Yuyo', 'drop', 'dots', 'o', ['sprout', 'feet', 'arms', 'blush', 'spots', 'tail', 'aura', 'belly']],
  ['Zuri', 'round', 'cyclops', 'fang', ['horns', 'arms', 'feet', 'wings', 'tail', 'spots', 'brows', 'belly']],
  ['Bizcocho', 'box', 'wide', 'smile', ['ears', 'feet', 'arms', 'belly', 'tail', 'crown', 'blush', 'scarf']],
  ['Canela', 'pear', 'shiny', 'cat', ['ears', 'blush', 'feet', 'arms', 'tail', 'belly', 'aura', 'scarf']],
  ['Dulce', 'blob', 'sleepy', 'cat', ['blush', 'sprout', 'feet', 'arms', 'wings', 'belly', 'spots', 'scarf']],
  ['Fideo', 'bean', 'dots', 'tiny', ['antenna', 'feet', 'arms', 'stripes', 'tail', 'wings', 'blush', 'belly']],
  ['Gomita', 'drop', 'wide', 'smile', ['blush', 'feet', 'arms', 'ears', 'spots', 'aura', 'belly', 'teeth', 'brows']],
  ['Hojita', 'cloud', 'shiny', 'o', ['sprout', 'blush', 'feet', 'arms', 'wings', 'spots', 'scarf', 'belly']],
  ['Kiwi', 'round', 'tri', 'cat', ['antenna', 'feet', 'spots', 'arms', 'tail', 'cape', 'belly', 'blush']],
  ['Lima', 'ghost', 'dots', 'smile', ['blush', 'arms', 'spots', 'wings', 'sprout', 'aura', 'belly', 'brows']],
  ['Miga', 'box', 'shiny', 'tiny', ['feet', 'ears', 'blush', 'arms', 'spots', 'tail', 'belly', 'aura']],
  ['Nino', 'pear', 'wide', 'grin', ['horns', 'feet', 'arms', 'tail', 'wings', 'teeth', 'belly', 'blush', 'brows']],
  ['Oli', 'blob', 'cyclops', 'smile', ['antenna', 'arms', 'feet', 'spots', 'tail', 'belly', 'cape', 'blush']],
  ['Poroto', 'bean', 'sleepy', 'fang', ['feet', 'ears', 'arms', 'tail', 'crown', 'spots', 'teeth', 'belly']],
  ['Quesito', 'box', 'dots', 'grin', ['spots', 'feet', 'arms', 'ears', 'wings', 'belly', 'teeth', 'blush', 'brows']],
  ['Ramón', 'round', 'sleepy', 'fang', ['horns', 'feet', 'arms', 'stripes', 'tail', 'cape', 'brows', 'belly', 'teeth']],
  ['Suri', 'drop', 'shiny', 'cat', ['ears', 'feet', 'blush', 'arms', 'wings', 'aura', 'spots', 'belly']],
  ['Trufa', 'cloud', 'cyclops', 'fang', ['horns', 'feet', 'arms', 'spots', 'tail', 'aura', 'belly']],
  ['Uva', 'ghost', 'tri', 'o', ['antenna', 'blush', 'arms', 'spots', 'aura', 'cape', 'belly', 'teeth', 'brows']],
  ['Vainilla', 'pear', 'sleepy', 'smile', ['sprout', 'blush', 'feet', 'arms', 'tail', 'wings', 'belly', 'scarf']],
  ['Wawa', 'blob', 'wide', 'tiny', ['ears', 'blush', 'feet', 'arms', 'spots', 'tail', 'aura', 'belly']],
  ['Yuca', 'bean', 'shiny', 'fang', ['horns', 'feet', 'arms', 'wings', 'belly', 'spots', 'brows', 'tail']],
  ['Zapallo', 'round', 'dots', 'grin', ['stripes', 'feet', 'arms', 'sprout', 'tail', 'belly', 'spots', 'teeth', 'blush']],
  ['Almendra', 'drop', 'sleepy', 'tiny', ['blush', 'feet', 'arms', 'ears', 'tail', 'cape', 'spots', 'belly']],
  ['Batata', 'box', 'cyclops', 'cat', ['antenna', 'feet', 'arms', 'stripes', 'wings', 'spots', 'belly', 'blush']],
  ['Cebollín', 'pear', 'tri', 'smile', ['sprout', 'feet', 'arms', 'spots', 'tail', 'cape', 'blush', 'belly']],
  ['Durazno', 'blob', 'dots', 'cat', ['blush', 'feet', 'ears', 'arms', 'belly', 'crown', 'spots', 'scarf']],
  ['Pochoclo', 'cloud', 'wide', 'grin', ['feet', 'arms', 'spots', 'antenna', 'wings', 'teeth', 'belly', 'blush', 'brows']],
  ['Pompón', 'round', 'sleepy', 'o', ['ears', 'blush', 'feet', 'arms', 'tail', 'aura', 'scarf', 'belly']],
  ['Grisín', 'bean', 'cyclops', 'tiny', ['antenna', 'feet', 'arms', 'spots', 'cape', 'tail', 'belly', 'blush']],
  ['Humito', 'ghost', 'wide', 'cat', ['blush', 'arms', 'horns', 'aura', 'wings', 'spots', 'brows', 'belly']],
  ['Isla', 'drop', 'tri', 'smile', ['sprout', 'blush', 'feet', 'arms', 'spots', 'tail', 'wings', 'belly']],
  ['Jazmín', 'pear', 'dots', 'cat', ['sprout', 'blush', 'feet', 'arms', 'wings', 'aura', 'belly', 'scarf']],
  ['Kuki', 'box', 'sleepy', 'grin', ['horns', 'feet', 'arms', 'tail', 'spots', 'wings', 'teeth', 'brows']],
  ['Luna', 'ghost', 'shiny', 'smile', ['blush', 'arms', 'crown', 'aura', 'wings', 'spots', 'belly', 'scarf']],
  ['Bombi', 'blob', 'tri', 'fang', ['ears', 'horns', 'feet', 'arms', 'tail', 'spots', 'teeth', 'brows']],
]

// Hues spread by the golden angle, so neighbours in the list never look alike.
export const species: Species[] = entries.map(([name, body, eyes, mouth, traits], index) => ({
  name,
  hue: Math.round((index * 137.508) % 360),
  body,
  eyes,
  mouth,
  traits,
}))
