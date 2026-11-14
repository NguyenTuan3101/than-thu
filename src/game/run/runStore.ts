import { create } from 'zustand'
import { type WorldTag, rollWorldTags } from '../data/worldTags'

export type SeasonActionId = 'bam_dat' | 'hut_linh' | 'an' | 'ket_giao'

type RunState = {
  active: boolean
  season: number
  hp: number
  hpMax: number
  age: number
  tags: WorldTag[]
  log: string[]
  startRun: () => void
  endRun: () => void
  doAction: (id: SeasonActionId) => { ended: boolean; rewardSuyDien: number }
}

const ACTIONS: Record<SeasonActionId, { label: string; apply: (s: RunState) => Partial<RunState> & { note: string } }> = {
  bam_dat: {
    label: 'Bám đất',
    apply: (s) => ({
      hp: Math.min(s.hpMax, s.hp + 2),
      note: 'Rễ bám sâu hơn. Sinh lực +2.',
    }),
  },
  hut_linh: {
    label: 'Hút linh',
    apply: (s) => {
      const hasLinh = s.tags.some((t) => t.id === 'linh_dien')
      return {
        hp: Math.max(0, s.hp - (hasLinh ? 1 : 3)),
        age: s.age + 1,
        note: hasLinh ? 'Linh điền nuôi rễ. Tuổi kiếp +1, mất ít máu.' : 'Linh khí mỏng. Tuổi +1, sinh lực −3.',
      }
    },
  },
  an: {
    label: 'Ẩn mình',
    apply: (s) => {
      const war = s.tags.some((t) => t.id === 'chien_tranh')
      return {
        hp: Math.max(0, s.hp - (war ? 0 : 1)),
        note: war ? 'Khói lửa che thân — qua mùa an toàn.' : 'Ẩn hơi hao sức. Sinh lực −1.',
      }
    },
  },
  ket_giao: {
    label: 'Kết giao người',
    apply: (s) => ({
      hp: Math.max(0, s.hp - 2),
      age: s.age + 1,
      note: 'Có người biết đến đằng. Tuổi +1, sinh lực −2.',
    }),
  },
}

export const SEASON_ACTIONS = (Object.keys(ACTIONS) as SeasonActionId[]).map((id) => ({
  id,
  label: ACTIONS[id].label,
}))

export const useRunStore = create<RunState>((set, get) => ({
  active: false,
  season: 0,
  hp: 12,
  hpMax: 12,
  age: 0,
  tags: [],
  log: [],
  startRun: () => {
    const tags = rollWorldTags(2)
    set({
      active: true,
      season: 1,
      hp: 12,
      hpMax: 12,
      age: 0,
      tags,
      log: [`Gieo xuống thế giới: ${tags.map((t) => t.name).join(' · ')}`],
    })
  },
  endRun: () => set({ active: false }),
  doAction: (id) => {
    const s = get()
    if (!s.active) return { ended: true, rewardSuyDien: 0 }

    const result = ACTIONS[id].apply(s)
    const drought = s.tags.some((t) => t.id === 'kho_han')
    const poison = s.tags.some((t) => t.id === 'doc_khi')
    let hp = result.hp ?? s.hp
    if (drought) hp -= 1
    if (poison) hp -= 1
    hp = Math.max(0, Math.min(s.hpMax, hp))

    const season = s.season + 1
    const age = result.age ?? s.age
    const noteParts = [result.note]
    if (drought) noteParts.push('Khô hạn −1')
    if (poison) noteParts.push('Độc khí −1')

    const log = [`Mùa ${s.season}: ${noteParts.join(' · ')}`, ...s.log].slice(0, 12)
    const died = hp <= 0
    const longLife = age >= 6

    set({
      hp,
      season,
      age,
      log,
      active: !(died || longLife),
    })

    if (died) {
      return { ended: true, rewardSuyDien: Math.max(1, Math.floor(age / 2)) }
    }
    if (longLife) {
      return { ended: true, rewardSuyDien: 3 + Math.floor(age / 2) }
    }
    return { ended: false, rewardSuyDien: 0 }
  },
}))
