import { useRef, useState } from 'react'

const THRESHOLD = 72
const LOCK_DISTANCE = 8

// Horizontal swipe on a row by touch: each direction fires its action past a threshold.
export function useSwipe(onRight?: () => void, onLeft?: () => void) {
  const [offset, setOffset] = useState(0)
  const gesture = useRef<{ x: number; y: number; horizontal: boolean | null } | null>(null)
  const swiped = useRef(false)

  function reset() {
    gesture.current = null
    setOffset(0)
  }

  return {
    offset,
    // True once right after a swipe, so the tap that ends it does not act too.
    consumeSwipe() {
      const was = swiped.current
      swiped.current = false
      return was
    },
    handlers: {
      onPointerDown(event: React.PointerEvent) {
        swiped.current = false
        if (event.pointerType === 'mouse') return
        gesture.current = { x: event.clientX, y: event.clientY, horizontal: null }
      },
      onPointerMove(event: React.PointerEvent) {
        const current = gesture.current
        if (!current) return
        const dx = event.clientX - current.x
        const dy = event.clientY - current.y
        if (current.horizontal === null && Math.hypot(dx, dy) > LOCK_DISTANCE) {
          current.horizontal = Math.abs(dx) > Math.abs(dy)
        }
        if (!current.horizontal) return
        swiped.current = true
        setOffset((dx > 0 && onRight) || (dx < 0 && onLeft) ? dx : 0)
      },
      onPointerUp() {
        if (offset > THRESHOLD) onRight?.()
        else if (offset < -THRESHOLD) onLeft?.()
        reset()
      },
      onPointerCancel: reset,
    },
  }
}
