import { create } from 'zustand'
import { TRAITS, type TraitId } from '../data/traits'
import { type WorldTag, rollWorldTags } from '../data/worldTags'
import type { SeasonActionId } from './types'

export type { SeasonActionId } from './types'

export type RunEndKind = 'alive' | 'dead' | 'recall'

type ActionCounts = Partial<Record<SeasonActionId, number>>

type RunState = {
  active: boolean
  season: number
  hp: number
  hpMax: number
  age: number
  tags: WorldTag[]
  traits: TraitId[]
  actionCounts: ActionCounts
  log: string[]
  lastReward: number
  lastEnd: RunEndKind | null
  startRun: (permanentTraits?: TraitId[]) => void
  endRun: () => void
  doAction: (id: SeasonActionId) => { ended: boolean; rewardSuyDien: number; end: RunEndKind | null; newTraits: TraitId[] }
  recall: () => { rewardSuyDien: number; end: RunEndKind }
}

const BASE_HP = 14
/** Sống đến tuổi này = lĩnh ngộ rút về (thắng kiếp) */
export const LONGEVITY_AGE = 8

function hasTrait(traits: TraitId[], id: TraitId) {
  return traits.includes(id)
}

function hasTag(tags: WorldTag[], id: WorldTag['id']) {
  return tags.some((t) => t.id === id)
}

function bumpCount(counts: ActionCounts, id: SeasonActionId): ActionCounts {
  return { ...counts, [id]: (counts[id] ?? 0) + 1 }
}

function evaluateNewTraits(
  age: number,
  tags: WorldTag[],
  counts: ActionCounts,
  owned: TraitId[],
): TraitId[] {
  const tagIds = new Set(tags.map((t) => t.id))
  const unlocked: TraitId[] = []

  for (const def of TRAITS) {
    if (owned.includes(def.id) || unlocked.includes(def.id)) continue
    if (age < def.minAge) continue
    if (def.tagsAny && !def.tagsAny.some((t) => tagIds.has(t))) continue
    if (def.actionsAny) {
      const need = def.minActionCount ?? 1
      const total = def.actionsAny.reduce((sum, a) => sum + (counts[a] ?? 0), 0)
      if (total < need) continue
    }
    unlocked.push(def.id)
  }
  return unlocked
}

function computeReward(age: number, traits: TraitId[], end: RunEndKind): number {
  const traitBonus = traits.length
  const branchBonus = hasTrait(traits, 'phan_nhanh') ? 2 : 0

  if (end === 'dead') {
    // Chết vẫn giữ một phần lĩnh ngộ — không về tay trắng
    return Math.max(1, Math.floor(age / 2) + Math.floor(traitBonus / 2) + branchBonus)
  }
  if (end === 'recall') {
    // Về sớm: an toàn nhưng ít hơn sống dài
    return Math.max(0, Math.floor(age / 2) + Math.floor(traitBonus / 2))
  }
  // Lĩnh ngộ đủ tuổi
  return 4 + Math.floor(age / 2) + traitBonus + branchBonus
}

type ActionDef = {
  id: SeasonActionId
  label: string
  hint: string
  available: (s: RunState) => boolean
  apply: (s: RunState) => { hp: number; age: number; note: string; bonusSuyDien?: number }
}

const ACTION_DEFS: ActionDef[] = [
  {
    id: 'bam_dat',
    label: 'Bám đất',
    hint: 'Hồi sinh lực, ít rủi ro',
    available: () => true,
    apply: (s) => {
      const heal = hasTrait(s.traits, 're_sau') ? 3 : 2
      return {
        hp: Math.min(s.hpMax, s.hp + heal),
        age: s.age,
        note: `Rễ bám sâu. Sinh lực +${heal}.`,
      }
    },
  },
  {
    id: 'hut_linh',
    label: 'Hút linh',
    hint: 'Tăng tuổi kiếp, hao máu',
    available: () => true,
    apply: (s) => {
      const linhDien = hasTag(s.tags, 'linh_dien')
      const soft = hasTrait(s.traits, 'linh_hap')
      let cost = linhDien ? 1 : 3
      if (soft) cost = Math.max(0, cost - 1)
      let hp = Math.max(0, s.hp - cost)
      const mistSlow = hasTag(s.tags, 'suong_co') && !hasTrait(s.traits, 'suong_vo')
      const ageGain = mistSlow ? 0 : 1
      let note = linhDien
        ? `Linh điền nuôi rễ. Tuổi +${ageGain}, sinh lực −${cost}.`
        : `Linh khí mỏng. Tuổi +${ageGain}, sinh lực −${cost}.`
      if (linhDien && hasTrait(s.traits, 'hut_mau_dat')) {
        hp = Math.min(s.hpMax, hp + 2)
        note += ' Hút máu đất +2.'
      }
      if (mistSlow) note += ' Sương cổ làm chậm tuổi.'
      if (hasTrait(s.traits, 'suong_vo') && hasTag(s.tags, 'suong_co')) {
        note += ' Sương vỏ giữ nhịp.'
      }
      return { hp, age: s.age + ageGain, note }
    },
  },
  {
    id: 'an',
    label: 'Ẩn mình',
    hint: 'Giảm rủi ro mùa',
    available: () => true,
    apply: (s) => {
      const war = hasTag(s.tags, 'chien_tranh')
      const deep = hasTrait(s.traits, 'an_sau') || (war && hasTrait(s.traits, 'khoi_lua'))
      const cost = deep ? 0 : war ? 0 : 1
      return {
        hp: Math.max(0, s.hp - cost),
        age: s.age,
        note: deep || war ? 'Ẩn vững qua mùa.' : 'Ẩn hơi hao sức. Sinh lực −1.',
      }
    },
  },
  {
    id: 'ket_giao',
    label: 'Kết giao người',
    hint: 'Tăng tuổi, mở duyên',
    available: () => true,
    apply: (s) => {
      const cost = hasTrait(s.traits, 'ket_duyen') ? 1 : 2
      const bonus =
        hasTag(s.tags, 'thi_toc') && hasTrait(s.traits, 'thi_toc_biet') ? 1 : 0
      return {
        hp: Math.max(0, s.hp - cost),
        age: s.age + 1,
        note:
          bonus > 0
            ? `Thị tộc nhớ tên đằng. Tuổi +1, −${cost} HP, +${bonus} Suy diễn.`
            : `Có người biết đến đằng. Tuổi +1, sinh lực −${cost}.`,
        bonusSuyDien: bonus,
      }
    },
  },
  {
    id: 'tranh_sang',
    label: 'Tranh ánh sáng',
    hint: 'Mạo hiểm lấy tuổi',
    available: () => true,
    apply: (s) => {
      const war = hasTag(s.tags, 'chien_tranh')
      const safe = hasTrait(s.traits, 'khoi_lua')
      const cost = war && !safe ? 4 : 2
      return {
        hp: Math.max(0, s.hp - cost),
        age: s.age + 2,
        note: `Vươn lên tranh sáng. Tuổi +2, sinh lực −${cost}.`,
      }
    },
  },
  {
    id: 'phun_doc',
    label: 'Phun độc',
    hint: 'Cần Độc nhựa',
    available: (s) => hasTrait(s.traits, 'doc_nhua'),
    apply: (s) => ({
      hp: Math.min(s.hpMax, s.hp + 1),
      age: s.age + 1,
      note: 'Nhựa độc xua sinh vật. Tuổi +1, hồi +1.',
    }),
  },
]

export const SEASON_ACTIONS = ACTION_DEFS.map(({ id, label, hint }) => ({ id, label, hint }))

export function availableActions(s: RunState) {
  return ACTION_DEFS.filter((a) => a.available(s))
}

export const useRunStore = create<RunState>((set, get) => ({
  active: false,
  season: 0,
  hp: BASE_HP,
  hpMax: BASE_HP,
  age: 0,
  tags: [],
  traits: [],
  actionCounts: {},
  log: [],
  lastReward: 0,
  lastEnd: null,

  startRun: (permanentTraits = []) => {
    const tags = rollWorldTags(2)
    let hpMax = BASE_HP
    const traits = [...permanentTraits]
    if (hasTrait(traits, 'song_dai')) hpMax += 4
    set({
      active: true,
      season: 1,
      hp: hpMax,
      hpMax,
      age: 0,
      tags,
      traits,
      actionCounts: {},
      lastReward: 0,
      lastEnd: null,
      log: [
        `Gieo xuống: ${tags.map((t) => t.name).join(' · ')}`,
        permanentTraits.length
          ? `Năng lực mang theo: ${permanentTraits.length}`
          : 'Đằng non — chưa mang năng lực vĩnh viễn.',
      ],
    })
  },

  endRun: () => set({ active: false }),

  recall: () => {
    const s = get()
    const end: RunEndKind = 'recall'
    const rewardSuyDien = computeReward(s.age, s.traits, end)
    set({
      active: false,
      lastReward: rewardSuyDien,
      lastEnd: end,
      log: [`Rút rễ về gia từ (tuổi ${s.age}).`, ...s.log].slice(0, 14),
    })
    return { rewardSuyDien, end }
  },

  doAction: (id) => {
    const s = get()
    if (!s.active) return { ended: true, rewardSuyDien: 0, end: s.lastEnd, newTraits: [] }

    const def = ACTION_DEFS.find((a) => a.id === id)
    if (!def || !def.available(s)) {
      return { ended: false, rewardSuyDien: 0, end: null, newTraits: [] }
    }

    const applied = def.apply(s)
    const counts = bumpCount(s.actionCounts, id)

    let hp = applied.hp
    const drought = hasTag(s.tags, 'kho_han') && !hasTrait(s.traits, 'chiu_han')
    const poison = hasTag(s.tags, 'doc_khi') && !hasTrait(s.traits, 'doc_nhua')
    const noteParts = [applied.note]
    if (drought) {
      hp -= 1
      noteParts.push('Khô hạn −1')
    }
    if (poison) {
      hp -= 1
      noteParts.push('Độc khí −1')
    }
    if (hasTrait(s.traits, 'suong_vo') && hasTag(s.tags, 'suong_co') && id !== 'hut_linh') {
      // nhẹ: sương vỏ giảm 1 sát thương môi trường còn lại
      if (drought || poison) {
        hp += 1
        noteParts.push('Sương vỏ đỡ 1')
      }
    }

    hp = Math.max(0, Math.min(s.hpMax, hp))
    const age = applied.age

    let traits = s.traits
    let hpMax = s.hpMax
    const gained = evaluateNewTraits(age, s.tags, counts, traits)
    if (gained.length) {
      traits = [...traits, ...gained]
      for (const g of gained) {
        const name = TRAITS.find((t) => t.id === g)?.name ?? g
        noteParts.push(`✦ Mở ${name}`)
      }
      if (gained.includes('song_dai')) {
        hpMax += 4
        hp = Math.min(hpMax, hp + 4)
      }
    }

    const season = s.season + 1
    const log = [`Mùa ${s.season}: ${noteParts.join(' · ')}`, ...s.log].slice(0, 14)
    const died = hp <= 0
    const longevity = age >= LONGEVITY_AGE

    let end: RunEndKind | null = null
    let rewardSuyDien = applied.bonusSuyDien ?? 0
    let active = true

    if (died) {
      end = 'dead'
      active = false
      rewardSuyDien += computeReward(age, traits, 'dead')
    } else if (longevity) {
      end = 'alive'
      active = false
      rewardSuyDien += computeReward(age, traits, 'alive')
    }

    set({
      hp,
      hpMax,
      season,
      age,
      traits,
      actionCounts: counts,
      log,
      active,
      lastReward: rewardSuyDien,
      lastEnd: end,
    })

    return { ended: !active, rewardSuyDien, end, newTraits: gained }
  },
}))
