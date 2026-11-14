import { useEffect, useRef } from 'react'
import { ClanPanel } from '../hud/ClanPanel'
import { HubPanel } from '../hud/HubPanel'
import { RunPanel } from '../hud/RunPanel'
import { useMetaStore } from '../game/meta/store'
import { useRunStore } from '../game/run/runStore'
import { JuiceOverlay } from '../juice/JuiceOverlay'
import { triggerJuice, triggerPageTone } from '../juice/bus'
import { VineStage } from '../pixi/VineStage'
import './app.css'

export function App() {
  const screen = useMetaStore((s) => s.screen)
  const thanThu = useMetaStore((s) => s.thanThu)
  const bestAge = useMetaStore((s) => s.bestAge)
  const traitCount = useMetaStore((s) => s.permanentTraits.length)
  const age = useRunStore((s) => s.age)
  const runTraits = useRunStore((s) => s.traits.length)
  const wasThanThu = useRef(thanThu)

  const vineAge =
    screen === 'run' ? Math.max(age, runTraits) : thanThu ? 8 : Math.max(2, bestAge, traitCount)

  useEffect(() => {
    triggerPageTone()
    if (screen === 'clan') triggerJuice('seal', 'Ban chỉ')
    else if (screen === 'run') triggerJuice('wipe')
    else triggerJuice('bloom')
  }, [screen])

  useEffect(() => {
    if (thanThu && !wasThanThu.current) triggerJuice('seal', 'Thần Thụ')
    wasThanThu.current = thanThu
  }, [thanThu])

  return (
    <div className="shell">
      <JuiceOverlay />
      <aside className="shell-side panel-enter" key={screen}>
        {screen === 'hub' && <HubPanel />}
        {screen === 'run' && <RunPanel />}
        {screen === 'clan' && <ClanPanel />}
      </aside>
      <main className="shell-stage">
        <VineStage age={vineAge} thanThu={thanThu} />
        <div className="stage-caption">
          <span className="dao">藤</span>
          <span>
            {thanThu ? 'Thần Thụ' : 'Đồ Đằng'} ·{' '}
            {screen === 'clan' ? 'ban chỉ trên giấy tuyên' : 'mực trên giấy tuyên'}
          </span>
        </div>
      </main>
    </div>
  )
}
