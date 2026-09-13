// Body silhouettes on a 64x64 grid standing on y=56, with the anchors traits attach to.
export type Body = {
  path: string
  top: number
  hornY: number
  hornSpread: number
  earY: number
  earSpread: number
  armY: number
  side: number
  eyeY: number
  mouthY: number
}

export type BodyShape = 'round' | 'bean' | 'blob' | 'pear' | 'box' | 'ghost' | 'drop' | 'cloud'

export const BOTTOM = 56
export const CENTER = 32

// prettier-ignore
export const bodies: Record<BodyShape, Body> = {
  round: {
    path: 'M15 41a17 15 0 1 0 34 0a17 15 0 1 0-34 0z',
    top: 26, hornY: 29, hornSpread: 8, earY: 31, earSpread: 12, armY: 44, side: 17, eyeY: 38, mouthY: 45,
  },
  bean: {
    path: 'M18 40a14 16 0 1 0 28 0a14 16 0 1 0-28 0z',
    top: 24, hornY: 27, hornSpread: 7, earY: 29, earSpread: 10, armY: 43, side: 14, eyeY: 36, mouthY: 43,
  },
  blob: {
    path: 'M15 50C15 30 22 25 32 25S49 30 49 50C49 55 45 56 32 56S15 55 15 50z',
    top: 25, hornY: 28, hornSpread: 8, earY: 30, earSpread: 12, armY: 44, side: 17, eyeY: 38, mouthY: 45,
  },
  pear: {
    path: 'M32 24C39 24 41 31 43 38C48 44 50 48 50 51C50 55 45 56 32 56S14 55 14 51C14 48 16 44 21 38C23 31 25 24 32 24z',
    top: 24, hornY: 27, hornSpread: 5, earY: 29, earSpread: 7, armY: 46, side: 17, eyeY: 35, mouthY: 42,
  },
  box: {
    path: 'M26 26h12a10 10 0 0 1 10 10v10a10 10 0 0 1-10 10h-12a10 10 0 0 1-10-10v-10a10 10 0 0 1 10-10z',
    top: 26, hornY: 28, hornSpread: 9, earY: 29, earSpread: 13, armY: 44, side: 16, eyeY: 38, mouthY: 45,
  },
  ghost: {
    path: 'M16 42C16 31 23 25 32 25S48 31 48 42V56Q44 52 40 56Q36 52 32 56Q28 52 24 56Q20 52 16 56z',
    top: 25, hornY: 28, hornSpread: 8, earY: 30, earSpread: 12, armY: 42, side: 16, eyeY: 37, mouthY: 44,
  },
  drop: {
    path: 'M32 21C38 29 49 37 49 46C49 53 42 56 32 56S15 53 15 46C15 37 26 29 32 21z',
    top: 21, hornY: 29, hornSpread: 5, earY: 34, earSpread: 11, armY: 46, side: 17, eyeY: 41, mouthY: 47,
  },
  cloud: {
    path: 'M19 56C13 56 12 49 16 46C13 41 17 35 22 36C23 29 30 26 35 30C40 27 47 31 46 37C51 38 52 45 48 47C51 51 49 56 45 56z',
    top: 29, hornY: 32, hornSpread: 7, earY: 36, earSpread: 14, armY: 48, side: 17, eyeY: 42, mouthY: 49,
  },
}
