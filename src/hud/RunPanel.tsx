import { useMetaStore } from '../game/meta/store'
import { SEASON_ACTIONS, useRunStore } from '../game/run/runStore'

export function RunPanel() {
  const setScreen = useMetaStore((s) => s.setScreen)
  const addSuyDien = useMetaStore((s) => s.addSuyDien)
  const season = useRunStore((s) => s.season)
  const hp = useRunStore((s) => s.hp)
  const hpMax = useRunStore((s) => s.hpMax)
  const age = useRunStore((s) => s.age)
  const tags = useRunStore((s) => s.tags)
  const log = useRunStore((s) => s.log)
  const active = useRunStore((s) => s.active)
  const doAction = useRunStore((s) => s.doAction)
  const endRun = useRunStore((s) => s.endRun)

  const finish = (reward: number, reason: string) => {
    addSuyDien(reward)
    endRun()
    setScreen('hub')
    window.alert(`${reason}\nNhận ${reward} điểm Suy diễn.`)
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h1>Kỳ Suy diễn · Mùa {season}</h1>
        <p className="muted">
          {tags.map((t) => t.name).join(' · ') || '…'}
        </p>
      </header>

      <div className="stat-row">
        <span>Sinh lực</span>
        <strong>
          {hp} / {hpMax}
        </strong>
      </div>
      <div className="stat-row">
        <span>Tuổi kiếp</span>
        <strong>{age}</strong>
      </div>

      <div className="tag-list">
        {tags.map((t) => (
          <div key={t.id} className="tag">
            <b>{t.name}</b>
            <span>{t.harsh}</span>
          </div>
        ))}
      </div>

      <div className="actions">
        {SEASON_ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={!active}
            onClick={() => {
              const result = doAction(a.id)
              if (result.ended) {
                const reason =
                  useRunStore.getState().hp <= 0
                    ? 'Đằng gãy giữa kiếp.'
                    : 'Đằng sống đủ lâu — lĩnh ngộ rút về.'
                finish(result.rewardSuyDien, reason)
              }
            }}
          >
            {a.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => finish(Math.max(1, Math.floor(age / 2)), 'Rút rễ về gia từ.')}
        >
          Về sớm
        </button>
      </div>

      <ul className="log">
        {log.map((line, i) => (
          <li key={`${i}-${line}`}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
