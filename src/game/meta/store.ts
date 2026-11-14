import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TraitId } from '../data/traits'

export type Screen = 'hub' | 'run'

type MetaState = {
  suyDien: number
  thanThu: boolean
  screen: Screen
  permanentTraits: TraitId[]
  bestAge: number
  runsCompleted: number
  addSuyDien: (n: number) => void
  setScreen: (s: Screen) => void
  ascendThanThu: () => void
  absorbRun: (payload: {
    rewardSuyDien: number
    age: number
    traits: TraitId[]
  }) => TraitId[]
  resetMeta: () => void
}

const SUY_DIEN_TO_RUN = 3
/** Cần hoàn thành đủ kiếp + tuổi kỷ lục để thần thụ (Phase 3 sẽ thay Dev) */
export const THAN_THU_RUNS = 3
export const THAN_THU_BEST_AGE = 8

export const canStartRun = (suyDien: number) => suyDien >= SUY_DIEN_TO_RUN
export const RUN_COST = SUY_DIEN_TO_RUN

export const useMetaStore = create<MetaState>()(
  persist(
    (set, get) => ({
      suyDien: 5,
      thanThu: false,
      screen: 'hub',
      permanentTraits: [],
      bestAge: 0,
      runsCompleted: 0,
      addSuyDien: (n) => set((s) => ({ suyDien: Math.max(0, s.suyDien + n) })),
      setScreen: (screen) => set({ screen }),
      ascendThanThu: () => set({ thanThu: true }),
      absorbRun: ({ rewardSuyDien, age, traits }) => {
        const state = get()
        const newlyPermanent: TraitId[] = []
        for (const t of traits) {
          if (!state.permanentTraits.includes(t)) newlyPermanent.push(t)
        }
        const permanentTraits = [...state.permanentTraits, ...newlyPermanent]
        const bestAge = Math.max(state.bestAge, age)
        const runsCompleted = state.runsCompleted + 1
        const thanThu =
          state.thanThu ||
          (runsCompleted >= THAN_THU_RUNS && bestAge >= THAN_THU_BEST_AGE)

        set({
          suyDien: Math.max(0, state.suyDien + rewardSuyDien),
          permanentTraits,
          bestAge,
          runsCompleted,
          thanThu,
          screen: 'hub',
        })
        return newlyPermanent
      },
      resetMeta: () =>
        set({
          suyDien: 5,
          thanThu: false,
          screen: 'hub',
          permanentTraits: [],
          bestAge: 0,
          runsCompleted: 0,
        }),
    }),
    { name: 'than-thu:meta' },
  ),
)
