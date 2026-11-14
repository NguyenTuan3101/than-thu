import { useEffect, useState } from 'react'
import { subscribeJuice, type JuiceKind } from './bus'
import './juice.css'

type Flash = {
  id: number
  kind: JuiceKind
  label?: string
}

let seq = 0

export function JuiceOverlay() {
  const [flashes, setFlashes] = useState<Flash[]>([])

  useEffect(() => {
    const unsubscribe = subscribeJuice((e) => {
      const id = ++seq
      setFlashes((prev) => [...prev, { id, kind: e.kind, label: e.label }])
      window.setTimeout(() => {
        setFlashes((prev) => prev.filter((f) => f.id !== id))
      }, e.kind === 'wipe' ? 520 : 780)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="juice-layer" aria-hidden>
      {flashes.map((f) => (
        <div key={f.id} className={`juice juice-${f.kind}`}>
          {f.kind === 'seal' && <span className="juice-seal">印</span>}
          {f.kind === 'bloom' && <span className="juice-bloom" />}
          {f.kind === 'wipe' && <span className="juice-wipe" />}
          {f.label ? <span className="juice-label">{f.label}</span> : null}
        </div>
      ))}
    </div>
  )
}
