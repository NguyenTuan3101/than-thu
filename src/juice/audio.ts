/** Tiny Web Audio tones — no asset files needed. */

let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function beep(freq: number, duration: number, type: OscillatorType, gain = 0.04) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.value = gain
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(g)
    g.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
  } catch {
    // Autoplay / unsupported — ignore
  }
}

export type ToneKind = 'ink' | 'seal' | 'wipe' | 'page'

export function playTone(kind: ToneKind) {
  switch (kind) {
    case 'ink':
      beep(180, 0.18, 'sine', 0.05)
      beep(90, 0.22, 'triangle', 0.03)
      break
    case 'seal':
      beep(140, 0.08, 'square', 0.035)
      beep(70, 0.16, 'sine', 0.045)
      break
    case 'wipe':
      beep(420, 0.12, 'sawtooth', 0.02)
      break
    case 'page':
      beep(520, 0.06, 'triangle', 0.025)
      beep(380, 0.1, 'sine', 0.02)
      break
  }
}
