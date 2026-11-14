import { traitById } from '../game/data/traits'
import { useMetaStore } from '../game/meta/store'
import {
  LONGEVITY_AGE,
  SEASON_ACTIONS,
  availableActions,
  useRunStore,
} from '../game/run/runStore'
import { triggerJuice } from '../juice/bus'

export function RunPanel() {
  const absorbRun = useMetaStore((s) => s.absorbRun)
  const setScreen = useMetaStore((s) => s.setScreen)
  const season = useRunStore((s) => s.season)
  const hp = useRunStore((s) => s.hp)
  const hpMax = useRunStore((s) => s.hpMax)
  const age = useRunStore((s) => s.age)
  const tags = useRunStore((s) => s.tags)
  const traits = useRunStore((s) => s.traits)
  const log = useRunStore((s) => s.log)
  const active = useRunStore((s) => s.active)
  const doAction = useRunStore((s) => s.doAction)
  const recall = useRunStore((s) => s.recall)
  const endRun = useRunStore((s) => s.endRun)
  const runState = useRunStore()
  const actions = availableActions(runState)

  const finish = (reward: number, reason: string) => {
    const run = useRunStore.getState()
    const newly = absorbRun({
      rewardSuyDien: reward,
      age: run.age,
      traits: run.traits,
    })
    endRun()
    setScreen('hub')
    const traitLine = newly.length
      ? `\nKhắc vào gia từ: ${newly.map((id) => traitById(id).name).join(', ')}`
      : ''
    window.alert(`${reason}\nNhận ${reward} điểm Suy diễn.${traitLine}`)
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <h1>Kỳ Suy diễn · Mùa {season}</h1>
        <p className="muted">
          {tags.map((t) => t.name).join(' · ') || '…'} · Đích tuổi {LONGEVITY_AGE}
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
        <strong>
          {age} / {LONGEVITY_AGE}
        </strong>
      </div>

      <div className="tag-list">
        {tags.map((t) => (
          <div key={t.id} className="tag">
            <b>{t.name}</b>
            <span>{t.harsh}</span>
          </div>
        ))}
      </div>

      {traits.length > 0 && (
        <div className="trait-wrap">
          <div className="trait-title">Năng lực kiếp này</div>
          <div className="trait-chips">
            {traits.map((id) => (
              <span key={id} className="chip" title={traitById(id).desc}>
                {traitById(id).name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="actions">
        {actions.map((a) => {
          const meta = SEASON_ACTIONS.find((x) => x.id === a.id)
          return (
            <button
              key={a.id}
              type="button"
              disabled={!active}
              title={meta?.hint}
              onClick={() => {
                const result = doAction(a.id)
                if (result.newTraits.length) {
                  triggerJuice('bloom', traitById(result.newTraits[0]!).name)
                }
                if (result.ended) {
                  triggerJuice(result.end === 'dead' ? 'wipe' : 'seal')
                  const reason =
                    result.end === 'dead'
                      ? 'Đằng gãy giữa kiếp — vẫn giữ được một phần lĩnh ngộ.'
                      : 'Đằng sống đủ lâu — lĩnh ngộ rút về.'
                  finish(result.rewardSuyDien, reason)
                }
              }}
            >
              <span className="action-label">{a.label}</span>
              {meta?.hint ? <span className="action-hint">{meta.hint}</span> : null}
            </button>
          )
        })}
        <button
          type="button"
          className="primary"
          disabled={!active}
          onClick={() => {
            const result = recall()
            finish(
              result.rewardSuyDien,
              age === 0
                ? 'Rút ngay — gần như không lĩnh ngộ.'
                : 'Rút rễ sớm: an toàn, thưởng vừa phải.',
            )
          }}
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
