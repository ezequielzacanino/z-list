import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { drawMonster } from '../monsters/draw'

// Smallest square a drawing is framed in, so a baby still reads smaller than its final form.
const MIN_FRAME = 52
const PADDING = 4

// A list's monster, bouncing once whenever it reaches a new stage on screen.
export function Monster({
  index,
  stage,
  size = 3.6,
}: {
  index: number
  stage: number
  size?: number
}) {
  const svg = useRef<SVGSVGElement>(null)
  const previous = useRef(stage)
  const [grew, setGrew] = useState(false)
  const [frame, setFrame] = useState('0 0 64 64')

  useEffect(() => {
    if (stage > previous.current) setGrew(true)
    previous.current = stage
  }, [stage])

  // Centers the frame on the drawing itself, since every creature leans its own way.
  useLayoutEffect(() => {
    const bounds = svg.current!.getBBox()
    const side = Math.max(MIN_FRAME, bounds.width + PADDING, bounds.height + PADDING)
    const x = bounds.x + bounds.width / 2 - side / 2
    const y = bounds.y + bounds.height / 2 - side / 2
    setFrame(`${x} ${y} ${side} ${side}`)
  }, [index, stage])

  return (
    <svg
      ref={svg}
      className={grew ? 'monster grew' : 'monster'}
      viewBox={frame}
      width={`${size}rem`}
      height={`${size}rem`}
      aria-hidden="true"
      onAnimationEnd={(event) => event.target === event.currentTarget && setGrew(false)}
    >
      {drawMonster(index, stage)}
    </svg>
  )
}
