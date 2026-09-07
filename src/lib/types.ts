export type QuickAddField = 'quantity' | 'priority' | 'notes' | 'recurrence' | 'options'

// Icon buckets derived from the item name, never stored.
export type Category =
  | 'fruta'
  | 'verdura'
  | 'carne'
  | 'pescado'
  | 'lacteos'
  | 'panaderia'
  | 'bebidas'
  | 'almacen'
  | 'limpieza'
  | 'higiene'
  | 'hogar'
  | 'ropa'
  | 'mascota'
  | 'tecnologia'
  | 'papeleria'
  | 'generico'

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

// The single option a quick-add form can carry, saved once the item exists.
export type OptionDraft = { label: string; url: string }

export type ItemDraft = Pick<Item, 'name'> &
  Partial<Pick<Item, 'quantity' | 'priority' | 'notes' | 'recurrence_days'>>

export type ListInvite = {
  token: string
  list_id: string
  created_by: string
  created_at: string
  expires_at: string
  revoked_at: string | null
}

// A write that could not leave the device, kept until the network takes it.
export type PendingWrite =
  | { op: 'insert'; table: 'items'; row: Item }
  | { op: 'insert'; table: 'item_options'; row: ItemOption }
  | { op: 'update'; table: 'items'; id: string; patch: Partial<Item> }
  | { op: 'delete'; table: 'items'; id: string }
  | { op: 'delete'; table: 'item_options'; id: string }
