import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { drawPlant } from '../plants/draw'

// Smallest square a drawing is framed in, so a seedling still reads smaller than a grown plant.
const MIN_FRAME = 52
const PADDING = 4

// A list's plant, springing up once whenever it reaches a new stage on screen.
export function Plant({
  index,
  stage,
  size = 3.6,
}: {
  index: number
  stage: number
  size?: number
}) {
  const id = `plant${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const svg = useRef<SVGSVGElement>(null)
  const previous = useRef(stage)
  const [grew, setGrew] = useState(false)
  const [frame, setFrame] = useState('0 0 64 64')

  useEffect(() => {
    if (stage > previous.current) setGrew(true)
    previous.current = stage
  }, [stage])

  // Centers the frame on the drawing itself, since every plant spreads its own way.
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
      className={grew ? 'plant grew' : 'plant'}
      viewBox={frame}
      width={`${size}rem`}
      height={`${size}rem`}
      aria-hidden="true"
      onAnimationEnd={(event) => event.target === event.currentTarget && setGrew(false)}
    >
      {drawPlant(index, stage, id)}
    </svg>
  )
}
