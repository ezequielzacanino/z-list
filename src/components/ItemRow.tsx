import { categorize } from '../lib/categorize'
import type { Item, ItemOption } from '../lib/types'
import { CategoryIcon } from './CategoryIcon'

// Day an occurrence was checked, shown in the history.
function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })
}

const priorityLabels: Record<number, string> = {
  1: 'Alta',
  2: 'Media',
  3: 'Baja',
}

export function ItemRow({
  item,
  options = [],
  authorName,
  onToggle,
  onOpen,
  onMoveUp,
  onMoveDown,
}: {
  item: Item
  options?: ItemOption[]
  authorName?: string
  onToggle?: () => void
  onOpen: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}) {
  const extra = item.notes || options.length > 0
  return (
    <li className={item.source_item_id ? 'item generated' : 'item'}>
      <div className="item-main">
        {onToggle ? (
          <input type="checkbox" checked={Boolean(item.done_at)} onChange={onToggle} />
        ) : (
          <span className="checked" aria-hidden="true">
            ✓
          </span>
        )}
        <CategoryIcon category={categorize(item.name)} />
        <button className="item-name" onClick={onOpen}>
          <span className="name">{item.name}</span>
          {item.quantity && <span className="tag">{item.quantity}</span>}
          {item.priority && (
            <span className={`tag priority-${item.priority}`}>{priorityLabels[item.priority]}</span>
          )}
          {item.recurrence_days && <span className="tag">cada {item.recurrence_days} d</span>}
          {authorName && <span className="tag author">{authorName}</span>}
          {item.done_at && <span className="tag date">{formatDay(item.done_at)}</span>}
        </button>
        {(onMoveUp || onMoveDown) && (
          <span className="move">
            <button className="ghost" onClick={onMoveUp} disabled={!onMoveUp} aria-label="Subir">
              ↑
            </button>
            <button
              className="ghost"
              onClick={onMoveDown}
              disabled={!onMoveDown}
              aria-label="Bajar"
            >
              ↓
            </button>
          </span>
        )}
      </div>
      {extra && (
        <div className="item-extra">
          {item.notes && <p className="notes">{item.notes}</p>}
          {options.length > 0 && (
            <span className="links">
              {options.map((option) =>
                option.url ? (
                  <a key={option.id} href={option.url} target="_blank" rel="noreferrer">
                    {option.label}
                  </a>
                ) : (
                  <span key={option.id}>{option.label}</span>
                ),
              )}
            </span>
          )}
        </div>
      )}
    </li>
  )
}
