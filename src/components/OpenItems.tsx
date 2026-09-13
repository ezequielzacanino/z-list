import type { ReactNode } from 'react'
import { useDragOrder } from '../hooks/useDragOrder'
import { aisleLabels, groupByAisle } from '../lib/aisles'
import type { DragHandle, Item, SortMode } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

// The open zone: one list that drags to reorder, or one group per aisle.
export function OpenItems({
  items,
  mode,
  draggable,
  renderRow,
  onDrop,
}: {
  items: Item[]
  mode: SortMode
  draggable: boolean
  renderRow: (item: Item, handle?: DragHandle) => ReactNode
  onDrop: (id: string, index: number) => void
}) {
  const drag = useDragOrder(
    items.map((item) => item.id),
    onDrop,
  )

  if (mode === 'category') {
    return groupByAisle(items).map((group) => (
      <section key={group.category} className="aisle">
        <h2>
          <CategoryIcon category={group.category} />
          {aisleLabels[group.category]}
        </h2>
        <ul className="items">{group.items.map((item) => renderRow(item))}</ul>
      </section>
    ))
  }

  const byId = new Map(items.map((item) => [item.id, item]))
  const order = (drag.order ?? items.map((item) => item.id)).filter((id) => byId.has(id))

  return (
    <ul className={drag.dragging ? 'items sorting' : 'items'}>
      {order.map((id) =>
        renderRow(
          byId.get(id)!,
          draggable
            ? { onPointerDown: (event) => drag.start(id, event), dragging: drag.dragging === id }
            : undefined,
        ),
      )}
    </ul>
  )
}
