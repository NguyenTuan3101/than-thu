import { traitById } from '../game/data/traits'
import { useClanStore } from '../game/clan/clanStore'
import {
  RUN_COST,
  THAN_THU_BEST_AGE,
  THAN_THU_RUNS,
  canStartRun,
  useMetaStore,
} from '../game/meta/store'
import { useRunStore } from '../game/run/runStore'

export function HubPanel() {
  const suyDien = useMetaStore((s) => s.suyDien)
  const thanThu = useMetaStore((s) => s.thanThu)
  const permanentTraits = useMetaStore((s) => s.permanentTraits)
  const bestAge = useMetaStore((s) => s.bestAge)
  const runsCompleted = useMetaStore((s) => s.runsCompleted)
  const addSuyDien = useMetaStore((s) => s.addSuyDien)
  const setScreen = useMetaStore((s) => s.setScreen)
  const startRun = useRunStore((s) => s.startRun)

  const ready = canStartRun(suyDien)

  return (
    <section className="panel">
      <header className="panel-head">
        <h1>Gia từ</h1>
        <p className="muted">Đồ đằng ngủ trên giấy tuyên. Tích Suy diễn rồi gieo kiếp.</p>
      </header>

      <div className="stat-row">
        <span>Điểm Suy diễn</span>
        <strong>{suyDien}</strong>
      </div>
      <div className="stat-row">
        <span>Cảnh giới</span>
        <strong>{thanThu ? 'Thần Thụ' : 'Đồ Đằng'}</strong>
      </div>
      <div className="stat-row">
        <span>Kiếp đã qua</span>
        <strong>
          {runsCompleted} / {THAN_THU_RUNS}
        </strong>
      </div>
      <div className="stat-row">
        <span>Tuổi kỷ lục</span>
        <strong>
          {bestAge} / {THAN_THU_BEST_AGE}
        </strong>
      </div>

      {permanentTraits.length > 0 && (
        <div className="trait-wrap">
          <div className="trait-title">Năng lực khắc gia từ</div>
          <div className="trait-chips">
            {permanentTraits.map((id) => (
              <span key={id} className="chip" title={traitById(id).desc}>
                {traitById(id).name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        <button type="button" onClick={() => addSuyDien(1)}>
          Thiền rễ (+1 Suy diễn)
        </button>
        <button
          type="button"
          className="primary"
          disabled={!ready}
          onClick={() => {
            useMetaStore.getState().addSuyDien(-RUN_COST)
            startRun(useMetaStore.getState().permanentTraits)
            setScreen('run')
          }}
        >
          Kỳ Suy diễn (−{RUN_COST})
        </button>
        {thanThu && (
          <button
            type="button"
            className="primary"
            onClick={() => {
              useClanStore.getState().ensureClanWorld()
              setScreen('clan')
            }}
          >
            Ban chỉ trị tộc
          </button>
        )}
      </div>

      {!thanThu && (
        <p className="muted tip">
          Thành Thần Thụ khi đủ {THAN_THU_RUNS} kiếp và tuổi kỷ lục ≥ {THAN_THU_BEST_AGE}.
        </p>
      )}
      {thanThu && (
        <p className="seal-note">Ấn thần đã đóng. Hãy ban chỉ, cạnh tranh Bạch Hổ / Huyền Xà.</p>
      )}
    </section>
  )
}
