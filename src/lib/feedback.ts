// Short tones and vibrations acknowledging an action taken on this device.
export type Cue = 'add' | 'check' | 'uncheck' | 'done'

const notes: Record<Cue, number[]> = {
  add: [880],
  check: [660, 990],
  uncheck: [587, 440],
  done: [660, 830, 990, 1320],
}

const pulses: Record<Cue, number[]> = {
  add: [8],
  check: [14],
  uncheck: [8],
  done: [18, 60, 18, 60, 40],
}

const NOTE_GAP = 0.07
const NOTE_LENGTH = 0.18
const VOLUME = 0.07

let audio: AudioContext | undefined

// Plays each note as a soft sine blip, one after the other.
function play(frequencies: number[]) {
  const context = (audio ??= new AudioContext())
  frequencies.forEach((frequency, index) => {
    const start = context.currentTime + index * NOTE_GAP
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(VOLUME, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + NOTE_LENGTH)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + NOTE_LENGTH)
  })
}

export function feedback(cue: Cue) {
  navigator.vibrate?.(pulses[cue])
  play(notes[cue])
}
