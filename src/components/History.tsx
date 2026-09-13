import { useState, type ReactNode } from 'react'
import type { Item } from '../lib/types'

// Checked items shown before the history asks to unfold further.
const PAGE = 20
// Older checks stay folded until asked for, unless a search is looking through them.
const RECENT_DAYS = 90

export function History({
  items,
  searching,
  renderRow,
}: {
  items: Item[]
  searching: boolean
  renderRow: (item: Item) => ReactNode
}) {
  const [limit, setLimit] = useState(PAGE)
  const [showingOld, setShowingOld] = useState(false)

  const cutoff = new Date(Date.now() - RECENT_DAYS * 86_400_000).toISOString()
  const recent = items.filter((item) => item.done_at! >= cutoff)
  const shown = showingOld || searching ? items : recent
  const old = items.length - recent.length

  return (
    <section className="history">
      <h2>Historial</h2>
      <ul className="items">{shown.slice(0, limit).map((item) => renderRow(item))}</ul>
      {shown.length > limit && (
        <button className="ghost history-more" onClick={() => setLimit(limit + PAGE)}>
          Ver {Math.min(PAGE, shown.length - limit)} más
        </button>
      )}
      {!showingOld && !searching && old > 0 && (
        <button className="ghost history-more" onClick={() => setShowingOld(true)}>
          Ver {old} de hace más de 3 meses
        </button>
      )}
    </section>
  )
}
