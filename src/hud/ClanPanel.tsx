import { useEffect } from 'react'
import { EDICTS } from '../game/data/edicts'
import { useClanStore, type ClanId } from '../game/clan/clanStore'
import { useMetaStore } from '../game/meta/store'

function ClanCard({ id }: { id: ClanId }) {
  const clan = useClanStore((s) => s.clans[id])
  const hidden = !clan.revealed && id !== 'player'
  return (
    <div className={`clan-card ${id === 'player' ? 'mine' : ''}`}>
      <b>{clan.name}</b>
      {hidden ? (
        <span className="muted">Chưa do thám</span>
      ) : (
        <span>
          Uy {clan.uy} · Đất {clan.dat} · Dân {clan.dan}
          {id !== 'player' ? ` · Căng ${clan.tension}` : ` · Linh ${clan.linh}`}
        </span>
      )}
    </div>
  )
}

export function ClanPanel() {
  const setScreen = useMetaStore((s) => s.setScreen)
  const turn = useClanStore((s) => s.turn)
  const log = useClanStore((s) => s.log)
  const player = useClanStore((s) => s.clans.player)
  const offerRitual = useClanStore((s) => s.offerRitual)
  const issueEdict = useClanStore((s) => s.issueEdict)
  const ensureClanWorld = useClanStore((s) => s.ensureClanWorld)

  useEffect(() => {
    ensureClanWorld()
  }, [ensureClanWorld])

  return (
    <section className="panel">
      <header className="panel-head">
        <h1>Ban chỉ · Kỳ {turn}</h1>
        <p className="muted">Thần Thụ ngồi trên giấy tuyên, ấn son dẫn tộc.</p>
      </header>

      <div className="stat-row">
        <span>Uy thụ</span>
        <strong>{player.uy}</strong>
      </div>
      <div className="stat-row">
        <span>Linh cúng</span>
        <strong>{player.linh}</strong>
      </div>
      <div className="stat-row">
        <span>Đất / Dân</span>
        <strong>
          {player.dat} / {player.dan}
        </strong>
      </div>

      <div className="clan-list">
        <ClanCard id="player" />
        <ClanCard id="bach_ho" />
        <ClanCard id="huyen_xa" />
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={() => {
            window.alert(offerRitual())
          }}
        >
          Cúng tế (+Linh, +Uy)
        </button>
        {EDICTS.map((e) => (
          <button
            key={e.id}
            type="button"
            className="primary"
            title={e.desc}
            disabled={player.uy < e.cost.uy || player.linh < e.cost.linh}
            onClick={() => {
              const result = issueEdict(e.id)
              window.alert(result.message)
            }}
          >
            <span className="action-label">{e.name}</span>
            <span className="action-hint">
              Uy {e.cost.uy} · Linh {e.cost.linh} — {e.desc}
            </span>
          </button>
        ))}
        <button type="button" onClick={() => setScreen('hub')}>
          Về gia từ
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
