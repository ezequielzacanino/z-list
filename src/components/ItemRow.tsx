import { categorize } from '../lib/categorize'
import type { Item } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

// Day an occurrence was checked, shown in the history.
function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

const priorityLabels: Record<number, string> = { 1: 'Alta', 2: 'Media', 3: 'Baja' }

export function ItemRow({
  item,
  authorName,
  onToggle,
  onOpen,
  onMoveUp,
  onMoveDown,
}: {
  item: Item
  authorName?: string
  onToggle?: () => void
  onOpen: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}) {
  return (
    <li className={item.source_item_id ? 'item generated' : 'item'}>
      {onToggle ? (
        <input type="checkbox" checked={Boolean(item.done_at)} onChange={onToggle} />
      ) : (
        <span className="checked" aria-hidden="true">
          ✓
        </span>
      )}
      <CategoryIcon category={categorize(item.name)} />
      <button className="item-name" onClick={onOpen}>
        {item.name}
        {item.quantity && <span className="tag">{item.quantity}</span>}
        {item.priority && <span className="tag">{priorityLabels[item.priority]}</span>}
        {item.recurrence_days && <span className="tag">cada {item.recurrence_days} d</span>}
        {authorName && <span className="tag author">{authorName}</span>}
        {item.done_at && <span className="tag date">{formatDay(item.done_at)}</span>}
      </button>
      {(onMoveUp || onMoveDown) && (
        <span className="move">
          <button className="ghost" onClick={onMoveUp} disabled={!onMoveUp} aria-label="Subir">
            ↑
          </button>
          <button className="ghost" onClick={onMoveDown} disabled={!onMoveDown} aria-label="Bajar">
            ↓
          </button>
        </span>
      )}
    </li>
  )
}
