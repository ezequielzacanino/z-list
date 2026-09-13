import { useSwipe } from '../hooks/useSwipe'
import { categorize } from '../lib/categorize'
import { dueLabel } from '../lib/due'
import { formatMoney } from '../lib/money'
import type { DragHandle, Item, ItemOption } from '../lib/types'
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
  checkerName,
  onToggle,
  onDelete,
  onOpen,
  handle,
}: {
  item: Item
  options?: ItemOption[]
  authorName?: string
  checkerName?: string
  onToggle?: () => void
  onDelete: () => void
  onOpen: () => void
  handle?: DragHandle
}) {
  const swipe = useSwipe(onToggle, onDelete)
  const extra = item.notes || options.length > 0
  const due = !item.done_at && item.due_on ? dueLabel(item.due_on, new Date()) : null
  const className = ['item', item.source_item_id && 'generated', handle?.dragging && 'dragging']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={className} data-item-id={item.id}>
      {swipe.offset !== 0 && (
        <span
          className={swipe.offset > 0 ? 'swipe-hint check' : 'swipe-hint delete'}
          aria-hidden="true"
        >
          {swipe.offset > 0 ? (item.done_at ? '↺' : '✓') : 'Borrar'}
        </span>
      )}
      <div
        className="item-main"
        style={swipe.offset ? { transform: `translateX(${swipe.offset}px)` } : undefined}
        {...swipe.handlers}
        onClickCapture={(event) => {
          if (!swipe.consumeSwipe()) return
          event.preventDefault()
          event.stopPropagation()
        }}
      >
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
          {item.amount !== null && <span className="tag">{formatMoney(item.amount)}</span>}
          {item.priority && (
            <span className={`tag priority-${item.priority}`}>{priorityLabels[item.priority]}</span>
          )}
          {due && <span className={due.urgent ? 'tag due urgent' : 'tag due'}>{due.text}</span>}
          {item.recurrence_days && <span className="tag">cada {item.recurrence_days} d</span>}
          {authorName && <span className="tag author">{authorName}</span>}
          {checkerName && <span className="tag author">✓ {checkerName}</span>}
          {item.done_at && <span className="tag date">{formatDay(item.done_at)}</span>}
        </button>
        {handle && (
          <span className="handle" onPointerDown={handle.onPointerDown} aria-hidden="true">
            ⠿
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
