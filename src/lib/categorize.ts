import { categoryTerms } from './categoryTerms'
import type { Category } from './types'

// Words and units that carry no category signal.
const noise = new Set([
  'de', 'del', 'la', 'el', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'con', 'sin',
  'para', 'por', 'en', 'al', 'a', 'mas', 'muy', 'x', 'kg', 'kilo', 'kilos', 'g', 'gr', 'gramo',
  'gramos', 'l', 'lt', 'litro', 'litros', 'ml', 'cc', 'cm', 'm', 'pack', 'paquete', 'paquetes',
  'unidad', 'unidades', 'docena', 'caja', 'botella', 'lata', 'bolsa', 'sachet', 'grande',
  'chico', 'mediano', 'comprar', 'traer', 'buscar', 'llevar',
])

const minSimilarity = 0.62
const cache = new Map<string, Category>()

// Lowercases, strips accents and punctuation, and collapses spaces.
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Trims common Spanish plural endings.
function singular(word: string): string {
  if (word.length > 4 && word.endsWith('es')) return word.slice(0, -2)
  if (word.length > 3 && word.endsWith('s')) return word.slice(0, -1)
  return word
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((word) => word.length > 1 && !noise.has(word))
    .map(singular)
}

const termIndex = buildIndex()

function buildIndex(): Map<string, Category> {
  const index = new Map<string, Category>()
  for (const [category, terms] of Object.entries(categoryTerms)) {
    for (const term of terms) {
      const key = tokenize(term).join(' ')
      if (key && !index.has(key)) index.set(key, category as Category)
    }
  }
  return index
}

function trigrams(word: string): string[] {
  const padded = `  ${word} `
  const grams: string[] = []
  for (let i = 0; i < padded.length - 2; i += 1) grams.push(padded.slice(i, i + 3))
  return grams
}

// Dice coefficient over trigrams, tolerant of typos and letter swaps.
function similarity(a: string, b: string): number {
  const left = trigrams(a)
  const right = new Set(trigrams(b))
  let shared = 0
  for (const gram of left) if (right.has(gram)) shared += 1
  return (2 * shared) / (left.length + right.size)
}

// First candidate the lookup resolves to a category.
function firstMatch(
  candidates: string[],
  lookup: (candidate: string) => Category | null | undefined,
): Category | null {
  for (const candidate of candidates) {
    const found = lookup(candidate)
    if (found) return found
  }
  return null
}

// Closest indexed term above the threshold, or null when nothing is near enough.
function nearestTerm(token: string): Category | null {
  if (token.length < 4) return null
  let best: Category | null = null
  let bestScore = minSimilarity
  for (const [term, category] of termIndex) {
    if (Math.abs(term.length - token.length) > 4) continue
    const score = similarity(token, term)
    if (score > bestScore) {
      bestScore = score
      best = category
    }
  }
  return best
}

// Maps an item name to its icon category, matching whole phrases before single words.
export function categorize(name: string): Category {
  const cached = cache.get(name)
  if (cached) return cached

  const tokens = tokenize(name)
  const pairs: string[] = []
  for (let i = 0; i < tokens.length - 1; i += 1) pairs.push(`${tokens[i]} ${tokens[i + 1]}`)

  const result =
    termIndex.get(tokens.join(' ')) ??
    firstMatch(pairs, (pair) => termIndex.get(pair)) ??
    firstMatch(pairs, nearestTerm) ??
    firstMatch(tokens, (token) => termIndex.get(token)) ??
    firstMatch(tokens, nearestTerm) ??
    'generico'

  cache.set(name, result)
  return result
}
