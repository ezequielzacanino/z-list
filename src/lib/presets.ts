import type { QuickAddField } from './types'

// Named starting points for a list's quick-add field set.
export const presets: Record<string, { label: string; fields: QuickAddField[] }> = {
  plain: { label: 'Simple', fields: [] },
  household: { label: 'Tareas del hogar', fields: ['recurrence'] },
  shopping: { label: 'Lista de compras', fields: ['quantity'] },
  purchases: { label: 'Compras pendientes', fields: ['notes', 'options'] },
  budget: { label: 'Presupuesto', fields: ['amount'] },
}

export const fieldLabels: Record<QuickAddField, string> = {
  quantity: 'Cantidad',
  amount: 'Monto',
  priority: 'Prioridad',
  notes: 'Especificaciones',
  recurrence: 'Repetición',
  options: 'Opciones con links',
}
