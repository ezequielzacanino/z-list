import { describe, expect, it } from 'vitest'
import { categorize } from './categorize'

describe('categorize', () => {
  it('matches a plain term', () => {
    expect(categorize('manzana')).toBe('fruta')
  })

  it('ignores accents, case and punctuation', () => {
    expect(categorize('LIMÓN!')).toBe('fruta')
  })

  it('drops quantities and filler words', () => {
    expect(categorize('2 kg de papa')).toBe('verdura')
  })

  it('reads plurals as their singular', () => {
    expect(categorize('bananas')).toBe('fruta')
  })

  it('prefers the phrase over a single word inside it', () => {
    expect(categorize('carne picada')).toBe('carne')
  })

  it('tolerates a typo', () => {
    expect(categorize('zanaoria')).toBe('verdura')
  })

  it('falls back to the generic icon', () => {
    expect(categorize('cosa rara')).toBe('generico')
  })
})
