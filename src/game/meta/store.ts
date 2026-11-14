import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Screen = 'hub' | 'run'

type MetaState = {
  suyDien: number
  thanThu: boolean
  screen: Screen
  addSuyDien: (n: number) => void
  setScreen: (s: Screen) => void
  ascendThanThu: () => void
  resetMeta: () => void
}

const SUY_DIEN_TO_RUN = 3

export const canStartRun = (suyDien: number) => suyDien >= SUY_DIEN_TO_RUN
export const RUN_COST = SUY_DIEN_TO_RUN

export const useMetaStore = create<MetaState>()(
  persist(
    (set) => ({
      suyDien: 5,
      thanThu: false,
      screen: 'hub',
      addSuyDien: (n) => set((s) => ({ suyDien: Math.max(0, s.suyDien + n) })),
      setScreen: (screen) => set({ screen }),
      ascendThanThu: () => set({ thanThu: true }),
      resetMeta: () => set({ suyDien: 5, thanThu: false, screen: 'hub' }),
    }),
    { name: 'than-thu:meta' },
  ),
)
