import { budgetSummary, formatMoney, parseAmount } from '../lib/money'
import type { Item } from '../lib/types'
import { DraftInput } from './DraftInput'

// Share of the cap at which the meter warns before going over.
const NEAR_LIMIT = 0.8

export function BudgetSummary({
  items,
  limit,
  onLimit,
}: {
  items: Item[]
  limit: number | null
  onLimit: (limit: number | null) => void
}) {
  const summary = budgetSummary(items, new Date())
  const ratio = limit ? summary.total / limit : 0
  const level = ratio >= 1 ? 'over' : ratio >= NEAR_LIMIT ? 'near' : 'ok'

  return (
    <section className="budget">
      <div className="budget-row">
        <span>Acumulado</span>
        <strong>{formatMoney(summary.total)}</strong>
      </div>
      {limit !== null && (
        <div className={`meter ${level}`}>
          <span style={{ width: `${Math.min(100, ratio * 100)}%` }} />
        </div>
      )}
      <div className="budget-row">
        <span>Gastado {formatMoney(summary.spent)}</span>
        <span>Falta {formatMoney(summary.pending)}</span>
      </div>
      {(summary.thisMonth > 0 || summary.lastMonth > 0) && (
        <div className="budget-row">
          <span>Este mes {formatMoney(summary.thisMonth)}</span>
          <span>Mes pasado {formatMoney(summary.lastMonth)}</span>
        </div>
      )}
      <label>
        Tope
        <DraftInput
          value={limit === null ? '' : String(limit)}
          onCommit={(text) => onLimit(parseAmount(text))}
        />
      </label>
    </section>
  )
}
