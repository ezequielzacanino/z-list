import type { ReactNode } from 'react'
import type { Tone } from './kit'

export type Look = {
  body: Tone
  accent: Tone
  hue: number
  accentHue: number
  stage: number
}

// A creature line: two evolution scripts, one per variant, and how to draw any point of them.
// Each script lists the step that grows at every stage after the first.
export type Creature = {
  scripts: [string[], string[]]
  draw: (level: (step: string) => number, look: Look, variant: boolean) => ReactNode
}

export function creature<Step extends string>(
  scripts: [Step[], Step[]],
  draw: (level: (step: Step) => number, look: Look, variant: boolean) => ReactNode,
): Creature {
  return { scripts, draw }
}

// How many times each step already grew once a stage is reached.
export function levelsAt(script: string[], stage: number) {
  const levels: Record<string, number> = {}
  for (const step of script.slice(0, stage)) levels[step] = (levels[step] ?? 0) + 1
  return (step: string) => levels[step] ?? 0
}
