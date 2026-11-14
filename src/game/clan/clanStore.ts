import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type EdictId, edictById } from '../data/edicts'

export type ClanId = 'player' | 'bach_ho' | 'huyen_xa'

export type ClanState = {
  id: ClanId
  name: string
  uy: number
  linh: number
  dat: number
  dan: number
  tension: number
  revealed: boolean
}

type ClanWorld = {
  ready: boolean
  turn: number
  log: string[]
  clans: Record<ClanId, ClanState>
  truceUntil: number
  hiddenUntil: number
  ensureClanWorld: () => void
  offerRitual: () => string
  issueEdict: (id: EdictId) => { ok: boolean; message: string }
  resetClan: () => void
}

const initialClans = (): Record<ClanId, ClanState> => ({
  player: {
    id: 'player',
    name: 'Gia tộc Đằng',
    uy: 5,
    linh: 4,
    dat: 3,
    dan: 12,
    tension: 0,
    revealed: true,
  },
  bach_ho: {
    id: 'bach_ho',
    name: 'Bạch Hổ đường',
    uy: 6,
    linh: 3,
    dat: 4,
    dan: 14,
    tension: 2,
    revealed: false,
  },
  huyen_xa: {
    id: 'huyen_xa',
    name: 'Huyền Xà các',
    uy: 4,
    linh: 5,
    dat: 2,
    dan: 10,
    tension: 1,
    revealed: false,
  },
})

function strongestRival(clans: Record<ClanId, ClanState>): ClanState {
  return [clans.bach_ho, clans.huyen_xa].sort((a, b) => b.uy - a.uy)[0]!
}

function weakestRival(clans: Record<ClanId, ClanState>): ClanState {
  return [clans.bach_ho, clans.huyen_xa].sort((a, b) => a.uy - b.uy)[0]!
}

function tickRivals(
  clans: Record<ClanId, ClanState>,
  turn: number,
  truceUntil: number,
  hiddenUntil: number,
): { clans: Record<ClanId, ClanState>; notes: string[] } {
  const next = {
    player: { ...clans.player },
    bach_ho: { ...clans.bach_ho },
    huyen_xa: { ...clans.huyen_xa },
  }
  const notes: string[] = []

  for (const id of ['bach_ho', 'huyen_xa'] as const) {
    const rival = next[id]
    rival.dat += Math.random() < 0.45 ? 1 : 0
    rival.uy += Math.random() < 0.35 ? 1 : 0
    rival.tension = Math.min(10, rival.tension + (Math.random() < 0.5 ? 1 : 0))

    const canAttack = turn >= truceUntil && turn >= hiddenUntil
    const aggressive = rival.tension >= 4 && rival.uy >= next.player.uy - 1
    if (canAttack && aggressive && Math.random() < 0.55) {
      const loss = 1 + Math.floor(Math.random() * 2)
      next.player.dat = Math.max(0, next.player.dat - loss)
      next.player.uy = Math.max(0, next.player.uy - 1)
      rival.tension = Math.max(0, rival.tension - 2)
      notes.push(`${rival.name} gây áp lực biên ải (−${loss} đất, −1 uy).`)
    } else {
      notes.push(`${rival.name} âm thầm tích lực.`)
    }
  }

  return { clans: next, notes }
}

export const useClanStore = create<ClanWorld>()(
  persist(
    (set, get) => ({
      ready: false,
      turn: 0,
      log: [],
      clans: initialClans(),
      truceUntil: 0,
      hiddenUntil: 0,

      ensureClanWorld: () => {
        const s = get()
        if (s.ready) return
        set({
          ready: true,
          turn: 1,
          log: ['Thần Thụ thức. Tộc nhân quỳ dưới rễ, chờ ban chỉ.'],
          clans: initialClans(),
          truceUntil: 0,
          hiddenUntil: 0,
        })
      },

      offerRitual: () => {
        const s = get()
        const clans = {
          ...s.clans,
          player: {
            ...s.clans.player,
            linh: s.clans.player.linh + 2,
            uy: s.clans.player.uy + 1,
            dan: Math.max(0, s.clans.player.dan - 1),
          },
        }
        const msg = 'Cúng tế: Linh +2, Uy +1 (hao 1 dân lễ).'
        set({
          clans,
          log: [msg, ...s.log].slice(0, 16),
        })
        return msg
      },

      issueEdict: (id) => {
        const s = get()
        if (!s.ready) return { ok: false, message: 'Chưa mở thế cục gia tộc.' }
        const edict = edictById(id)
        const p = s.clans.player
        if (p.uy < edict.cost.uy || p.linh < edict.cost.linh) {
          return { ok: false, message: 'Không đủ Uy thụ / Linh cúng.' }
        }

        let clans: Record<ClanId, ClanState> = {
          player: { ...p, uy: p.uy - edict.cost.uy, linh: p.linh - edict.cost.linh },
          bach_ho: { ...s.clans.bach_ho },
          huyen_xa: { ...s.clans.huyen_xa },
        }
        let truceUntil = s.truceUntil
        let hiddenUntil = s.hiddenUntil
        const notes: string[] = [`Ban chỉ «${edict.name}».`]

        switch (id) {
          case 'khai_hoang':
            clans.player.dat += 2
            strongestRival(clans).tension = Math.min(10, strongestRival(clans).tension + 1)
            notes.push('Đất +2. Địch để ý biên ải.')
            break
          case 'thu_de_tu':
            clans.player.dan += 3
            clans.player.linh += 1
            notes.push('Dân +3, Linh +1.')
            break
          case 'tranh_chien': {
            const foe = strongestRival(clans)
            foe.tension = Math.max(0, foe.tension - 3)
            truceUntil = s.turn + 1
            notes.push(`Tránh chiến với ${foe.name} trong 1 kỳ.`)
            break
          }
          case 'te_re':
            clans.player.uy += 2
            clans.player.linh += 2
            notes.push('Tế rễ: Uy +2, Linh +2.')
            break
          case 'do_tham': {
            clans.bach_ho.revealed = true
            clans.huyen_xa.revealed = true
            const weak = weakestRival(clans)
            weak.uy = Math.max(0, weak.uy - 1)
            weak.tension = Math.max(0, weak.tension - 1)
            notes.push(`Do thám xong. ${weak.name} lung lay (−1 uy).`)
            break
          }
          case 'an_tu':
            clans.player.uy += 1
            hiddenUntil = s.turn + 1
            notes.push('Ẩn tu: Uy +1, địch khó đánh trong 1 kỳ.')
            break
          case 'ket_hon':
            clans.player.dan += 2
            weakestRival(clans).tension = Math.max(0, weakestRival(clans).tension - 2)
            notes.push('Thông gia thành. Dân +2.')
            break
          case 'mo_rong':
            clans.player.uy += 3
            clans.player.dat += 1
            clans.bach_ho.tension = Math.min(10, clans.bach_ho.tension + 2)
            clans.huyen_xa.tension = Math.min(10, clans.huyen_xa.tension + 2)
            notes.push('Ảnh hưởng lan xa — mọi địch bị khiêu khích.')
            break
        }

        const turn = s.turn + 1
        const rivalTick = tickRivals(clans, turn, truceUntil, hiddenUntil)
        const log = [...notes, ...rivalTick.notes, ...s.log].slice(0, 16)

        set({
          clans: rivalTick.clans,
          turn,
          truceUntil,
          hiddenUntil,
          log,
        })

        const me = rivalTick.clans.player
        const win =
          me.uy >= 16 &&
          me.dat >= 10 &&
          me.uy > rivalTick.clans.bach_ho.uy &&
          me.uy > rivalTick.clans.huyen_xa.uy

        return {
          ok: true,
          message: win
            ? `${notes.join(' ')} Thiên hạ nghiêng về Đằng — MVP gia tộc hoàn thành.`
            : notes.join(' '),
        }
      },

      resetClan: () =>
        set({
          ready: false,
          turn: 0,
          log: [],
          clans: initialClans(),
          truceUntil: 0,
          hiddenUntil: 0,
        }),
    }),
    { name: 'than-thu:clan' },
  ),
)
