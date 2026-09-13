import { useRef, useState } from 'react'

// Reorders rows live while a grip is dragged, and reports the final index on release.
export function useDragOrder(ids: string[], onDrop: (id: string, index: number) => void) {
  const [order, setOrder] = useState<string[] | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const latest = useRef<string[]>([])

  function start(id: string, event: React.PointerEvent) {
    event.preventDefault()
    latest.current = ids
    setOrder(ids)
    setDragging(id)

    // The dragged row takes the place above or below the row under the pointer.
    function move(pointer: PointerEvent) {
      const row = document
        .elementsFromPoint(pointer.clientX, pointer.clientY)
        .map((element) => element.closest<HTMLElement>('[data-item-id]'))
        .find((element) => element && element.dataset.itemId !== id)
      if (!row) return
      const next = latest.current.filter((current) => current !== id)
      const target = next.indexOf(row.dataset.itemId!)
      if (target < 0) return
      const rect = row.getBoundingClientRect()
      next.splice(target + (pointer.clientY > rect.top + rect.height / 2 ? 1 : 0), 0, id)
      latest.current = next
      setOrder(next)
    }

    function release() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      onDrop(id, latest.current.indexOf(id))
      setOrder(null)
      setDragging(null)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }

  return { order, dragging, start }
}
