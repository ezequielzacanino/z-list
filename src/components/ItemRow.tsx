import type { Item } from '../lib/types'

const priorityLabels: Record<number, string> = { 1: 'Alta', 2: 'Media', 3: 'Baja' }

export function ItemRow({
  item,
  authorName,
  onToggle,
  onOpen,
  onMoveUp,
}: {
  item: Item
  authorName?: string
  onToggle: () => void
  onOpen: () => void
  onMoveUp?: () => void
}) {
  return (
    <li className={item.source_item_id ? 'item generated' : 'item'}>
      <input type="checkbox" checked={Boolean(item.done_at)} onChange={onToggle} />
      <button className="item-name" onClick={onOpen}>
        {item.name}
        {item.quantity && <span className="tag">{item.quantity}</span>}
        {item.priority && <span className="tag">{priorityLabels[item.priority]}</span>}
        {item.recurrence_days && <span className="tag">cada {item.recurrence_days} d</span>}
        {authorName && <span className="tag author">{authorName}</span>}
      </button>
      {onMoveUp && (
        <button className="ghost" onClick={onMoveUp} aria-label="Subir">
          ↑
        </button>
      )}
    </li>
  )
}
