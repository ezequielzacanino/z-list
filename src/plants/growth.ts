// Plant stages from a list's growth points, mirrored by monster_points() in the database.
export const STAGES = 20

const DAY_MS = 86_400_000
const GRACE_DAYS = 7
const DAYS_PER_LOST_STAGE = 7

// Points needed to reach a stage, each step a little longer than the one before.
export function threshold(stage: number) {
  return 2 * stage * stage + 6 * stage
}

export function stageOf(points: number) {
  let stage = 0
  while (stage < STAGES - 1 && threshold(stage + 1) <= points) stage += 1
  return stage
}

// After a week without use, the plant loses one stage per idle week.
export function currentPoints(points: number, since: string, now: Date) {
  const idleDays = (now.getTime() - Date.parse(since)) / DAY_MS
  const lost = Math.floor(Math.max(0, idleDays - GRACE_DAYS) / DAYS_PER_LOST_STAGE)
  return lost ? Math.min(points, threshold(Math.max(0, stageOf(points) - lost))) : points
}

export function currentStage(points: number, since: string, now: Date) {
  return stageOf(currentPoints(points, since, now))
}
