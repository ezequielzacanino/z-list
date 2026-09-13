import { useEffect, useRef, useState } from 'react'
import { drawMonster } from '../monsters/draw'

// A list's monster, bouncing once whenever it reaches a new stage on screen.
export function Monster({
  index,
  stage,
  size = 3,
}: {
  index: number
  stage: number
  size?: number
}) {
  const previous = useRef(stage)
  const [grew, setGrew] = useState(false)

  useEffect(() => {
    if (stage > previous.current) setGrew(true)
    previous.current = stage
  }, [stage])

  return (
    <svg
      className={grew ? 'monster grew' : 'monster'}
      viewBox="0 0 64 64"
      width={`${size}rem`}
      height={`${size}rem`}
      aria-hidden="true"
      onAnimationEnd={(event) => event.target === event.currentTarget && setGrew(false)}
    >
      {drawMonster(index, stage)}
    </svg>
  )
}
