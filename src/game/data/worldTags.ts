export type WorldTagId =
  | 'kho_han'
  | 'chien_tranh'
  | 'linh_dien'
  | 'doc_khi'
  | 'suong_co'
  | 'thi_toc'

export type WorldTag = {
  id: WorldTagId
  name: string
  harsh: string
  chance: string
}

export const WORLD_TAGS: WorldTag[] = [
  {
    id: 'kho_han',
    name: 'Khô hạn',
    harsh: 'Sinh lực hao theo mùa',
    chance: 'Dễ mở trait chịu hạn',
  },
  {
    id: 'chien_tranh',
    name: 'Chiến tranh',
    harsh: 'Nguy bị đốn / cháy',
    chance: 'Ẩn và kết giao có giá trị',
  },
  {
    id: 'linh_dien',
    name: 'Linh điền',
    harsh: 'Tranh hút linh',
    chance: 'Linh hấp tăng nhanh',
  },
  {
    id: 'doc_khi',
    name: 'Độc khí',
    harsh: 'Sinh lực bị mòn',
    chance: 'Mở độc nhựa',
  },
  {
    id: 'suong_co',
    name: 'Sương cổ',
    harsh: 'Phát triển chậm',
    chance: 'Ẩn mạnh hơn',
  },
  {
    id: 'thi_toc',
    name: 'Thị tộc gần',
    harsh: 'Có thể bị chặt thờ',
    chance: 'Cơ hội cúng tế sớm (hiếm)',
  },
]

export function rollWorldTags(count = 2): WorldTag[] {
  const pool = [...WORLD_TAGS]
  const picked: WorldTag[] = []
  const n = Math.min(count, pool.length)
  for (let i = 0; i < n; i += 1) {
    const idx = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(idx, 1)[0]!)
  }
  return picked
}
