export type EdictId =
  | 'khai_hoang'
  | 'thu_de_tu'
  | 'tranh_chien'
  | 'te_re'
  | 'do_tham'
  | 'an_tu'
  | 'ket_hon'
  | 'mo_rong'

export type EdictCost = {
  uy: number
  linh: number
}

export type EdictDef = {
  id: EdictId
  name: string
  desc: string
  cost: EdictCost
}

export const EDICTS: EdictDef[] = [
  {
    id: 'khai_hoang',
    name: 'Khai hoang',
    desc: 'Mở đất mới. Đất +2, có thể bị địch để ý.',
    cost: { uy: 2, linh: 1 },
  },
  {
    id: 'thu_de_tu',
    name: 'Thu đệ tử đất',
    desc: 'Dân số +3, Linh cúng +1.',
    cost: { uy: 1, linh: 2 },
  },
  {
    id: 'tranh_chien',
    name: 'Tránh chiến',
    desc: 'Giảm căng thẳng với địch mạnh nhất trong 1 kỳ.',
    cost: { uy: 2, linh: 0 },
  },
  {
    id: 'te_re',
    name: 'Tế rễ',
    desc: 'Cúng Thần Thụ: Uy +2, Linh +2.',
    cost: { uy: 0, linh: 1 },
  },
  {
    id: 'do_tham',
    name: 'Do thám địch',
    desc: 'Biết rõ uy/đất địch; địch yếu hơn bị lung lay.',
    cost: { uy: 1, linh: 1 },
  },
  {
    id: 'an_tu',
    name: 'Ẩn tu',
    desc: 'Giữ vững: Uy +1, giảm bị tấn công.',
    cost: { uy: 0, linh: 2 },
  },
  {
    id: 'ket_hon',
    name: 'Kết thông gia',
    desc: 'Liên minh tạm: dân +2, địch yếu không dám động.',
    cost: { uy: 3, linh: 1 },
  },
  {
    id: 'mo_rong',
    name: 'Mở rộng ảnh hưởng',
    desc: 'Uy +3, đất +1 — khiêu khích mọi địch.',
    cost: { uy: 2, linh: 2 },
  },
]

export function edictById(id: EdictId): EdictDef {
  return EDICTS.find((e) => e.id === id)!
}
