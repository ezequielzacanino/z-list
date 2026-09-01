export type QuickAddField = 'quantity' | 'priority' | 'notes' | 'recurrence' | 'options'

export type Profile = {
  id: string
  display_name: string
  created_at: string
}

export type List = {
  id: string
  name: string
  preset: string
  quick_add_fields: QuickAddField[]
  sort_by_priority: boolean
  created_by: string
  created_at: string
}

export type Item = {
  id: string
  list_id: string
  name: string
  quantity: string | null
  priority: number | null
  notes: string | null
  recurrence_days: number | null
  position: number
  done_at: string | null
  created_by: string | null
  source_item_id: string | null
  created_at: string
}

export type ItemOption = {
  id: string
  item_id: string
  label: string
  url: string | null
  notes: string | null
  position: number
  created_at: string
}

export type ItemDraft = Pick<Item, 'name'> &
  Partial<Pick<Item, 'quantity' | 'priority' | 'notes' | 'recurrence_days'>>
