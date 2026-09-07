import { describe, expect, it } from 'vitest'
import { listAsText } from './shareText'
import type { Item } from './types'

const item = (name: string, quantity: string | null = null) => ({ name, quantity }) as Item

describe('listAsText', () => {
  it('puts the name on top and one item per line, with its quantity', () => {
    expect(listAsText('Compras', [item('Leche', '2'), item('Pan')])).toBe(
      'Compras\n- Leche (2)\n- Pan',
    )
  })
})
