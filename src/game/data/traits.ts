import type { WorldTagId } from './worldTags'
import type { SeasonActionId } from '../run/types'

export type TraitId =
  | 'chiu_han'
  | 'linh_hap'
  | 'doc_nhua'
  | 'an_sau'
  | 'ket_duyen'
  | 're_sau'
  | 'song_dai'
  | 'phan_nhanh'
  | 'hut_mau_dat'
  | 'khoi_lua'
  | 'suong_vo'
  | 'thi_toc_biet'

export type TraitDef = {
  id: TraitId
  name: string
  desc: string
  /** Minimum kiếp age to unlock */
  minAge: number
  /** Prefer these world tags (any) */
  tagsAny?: WorldTagId[]
  /** Prefer these actions counted this run */
  actionsAny?: SeasonActionId[]
  minActionCount?: number
}

export const TRAITS: TraitDef[] = [
  {
    id: 'chiu_han',
    name: 'Chịu hạn',
    desc: 'Khô hạn không còn rút sinh lực mỗi mùa.',
    minAge: 2,
    tagsAny: ['kho_han'],
  },
  {
    id: 'linh_hap',
    name: 'Linh hấp',
    desc: 'Hút linh hao ít hơn; tuổi kiếp dễ tăng.',
    minAge: 2,
    actionsAny: ['hut_linh'],
    minActionCount: 2,
  },
  {
    id: 'doc_nhua',
    name: 'Độc nhựa',
    desc: 'Miễn độc khí; mở hành động Phun độc.',
    minAge: 3,
    tagsAny: ['doc_khi'],
  },
  {
    id: 'an_sau',
    name: 'Ẩn sâu',
    desc: 'Ẩn mình không hao sinh lực.',
    minAge: 2,
    actionsAny: ['an'],
    minActionCount: 2,
  },
  {
    id: 'ket_duyen',
    name: 'Kết duyên',
    desc: 'Kết giao người chỉ mất 1 sinh lực.',
    minAge: 3,
    actionsAny: ['ket_giao'],
    minActionCount: 2,
  },
  {
    id: 're_sau',
    name: 'Rễ sâu',
    desc: 'Bám đất hồi +3 sinh lực.',
    minAge: 3,
    actionsAny: ['bam_dat'],
    minActionCount: 2,
  },
  {
    id: 'hut_mau_dat',
    name: 'Hút máu đất',
    desc: 'Trong linh điền: hút linh còn hồi máu nhẹ.',
    minAge: 3,
    tagsAny: ['linh_dien'],
  },
  {
    id: 'khoi_lua',
    name: 'Khói lửa',
    desc: 'Chiến tranh: ẩn hoàn toàn an toàn, tranh sáng ít rủi ro.',
    minAge: 3,
    tagsAny: ['chien_tranh'],
  },
  {
    id: 'suong_vo',
    name: 'Sương vỏ',
    desc: 'Sương cổ: phát triển chậm nhưng khó bị hao.',
    minAge: 2,
    tagsAny: ['suong_co'],
  },
  {
    id: 'thi_toc_biet',
    name: 'Thị tộc biết tên',
    desc: 'Gần thị tộc: kết giao có thể nhận Suy diễn phụ.',
    minAge: 4,
    tagsAny: ['thi_toc'],
    actionsAny: ['ket_giao'],
    minActionCount: 1,
  },
  {
    id: 'song_dai',
    name: 'Sống dài',
    desc: 'Sinh lực tối đa +4.',
    minAge: 5,
  },
  {
    id: 'phan_nhanh',
    name: 'Phân nhánh',
    desc: 'Cuối kiếp nhận thêm điểm Suy diễn.',
    minAge: 6,
  },
]

export function traitById(id: TraitId): TraitDef {
  return TRAITS.find((t) => t.id === id)!
}
