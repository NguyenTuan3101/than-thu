import { RUN_COST, canStartRun, useMetaStore } from '../game/meta/store'
import { useRunStore } from '../game/run/runStore'

export function HubPanel() {
  const suyDien = useMetaStore((s) => s.suyDien)
  const thanThu = useMetaStore((s) => s.thanThu)
  const addSuyDien = useMetaStore((s) => s.addSuyDien)
  const setScreen = useMetaStore((s) => s.setScreen)
  const ascendThanThu = useMetaStore((s) => s.ascendThanThu)
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
            startRun()
            setScreen('run')
          }}
        >
          Kỳ Suy diễn (−{RUN_COST})
        </button>
        {!thanThu && (
          <button type="button" onClick={ascendThanThu}>
            [Dev] Thăng Thần Thụ
          </button>
        )}
      </div>

      {thanThu && (
        <p className="seal-note">Ấn thần đã đóng. Ban chỉ trị tộc sẽ mở ở sprint sau.</p>
      )}
    </section>
  )
}
