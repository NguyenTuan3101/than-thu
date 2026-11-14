import { HubPanel } from '../hud/HubPanel'
import { RunPanel } from '../hud/RunPanel'
import { useMetaStore } from '../game/meta/store'
import { useRunStore } from '../game/run/runStore'
import { VineStage } from '../pixi/VineStage'
import './app.css'

export function App() {
  const screen = useMetaStore((s) => s.screen)
  const thanThu = useMetaStore((s) => s.thanThu)
  const age = useRunStore((s) => s.age)

  return (
    <div className="shell">
      <aside className="shell-side">
        {screen === 'hub' ? <HubPanel /> : <RunPanel />}
      </aside>
      <main className="shell-stage">
        <VineStage age={screen === 'run' ? age : thanThu ? 8 : 2} thanThu={thanThu} />
        <div className="stage-caption">
          <span className="dao">藤</span>
          <span>{thanThu ? 'Thần Thụ' : 'Đồ Đằng'} · mực trên giấy tuyên</span>
        </div>
      </main>
    </div>
  )
}
