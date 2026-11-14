import { playTone, type ToneKind } from './audio'

export type JuiceKind = 'bloom' | 'seal' | 'wipe'

type JuiceEvent = {
  kind: JuiceKind
  label?: string
}

type Listener = (e: JuiceEvent) => void

const listeners = new Set<Listener>()

export function subscribeJuice(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function triggerJuice(kind: JuiceKind, label?: string) {
  const tone: ToneKind =
    kind === 'bloom' ? 'ink' : kind === 'seal' ? 'seal' : 'wipe'
  playTone(tone)
  const event = { kind, label }
  for (const l of listeners) l(event)
}

export function triggerPageTone() {
  playTone('page')
}
