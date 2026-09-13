import type { ReactNode } from 'react'
import type { Tint } from './paint'

export type PotShape = 'bowl' | 'tray' | 'tall' | 'basin' | 'plate'

// Everything a plant needs to draw itself: a gradient id prefix, its two tints and its stage.
export type Look = { id: string; leaf: Tint; bloom: Tint; stage: number }

// A plant kind: its pot, the step that grows at every stage after the first, and how to draw it.
export type Plant = {
  pot: PotShape
  steps: string[]
  draw: (level: (step: string) => number, look: Look) => ReactNode
}

export function plant<Step extends string>(
  pot: PotShape,
  steps: Step[],
  draw: (level: (step: Step) => number, look: Look) => ReactNode,
): Plant {
  return { pot, steps, draw: draw as Plant['draw'] }
}

// How many times each step already grew once a stage is reached.
export function levelsAt(steps: string[], stage: number) {
  const levels: Record<string, number> = {}
  for (const step of steps.slice(0, stage)) levels[step] = (levels[step] ?? 0) + 1
  return (step: string) => levels[step] ?? 0
}
