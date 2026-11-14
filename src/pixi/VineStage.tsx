import { useEffect, useRef } from 'react'
import { Application, Graphics } from 'pixi.js'

type Props = {
  age: number
  thanThu: boolean
}

/** Paper + ink vine silhouette. Pure view — no game rules. */
export function VineStage({ age, thanThu }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let destroyed = false
    let app: Application | null = null

    const boot = async () => {
      const next = new Application()
      await next.init({
        background: '#f3ebd8',
        antialias: true,
        resizeTo: host,
        preference: 'webgl',
      })
      if (destroyed) {
        next.destroy(true)
        return
      }
      app = next
      host.appendChild(next.canvas)

      const paper = new Graphics()
      const vine = new Graphics()
      next.stage.addChild(paper)
      next.stage.addChild(vine)

      const draw = () => {
        const w = next.screen.width
        const h = next.screen.height
        paper.clear()
        paper.rect(0, 0, w, h)
        paper.fill({ color: 0xf3ebd8 })
        // soft wash
        paper.ellipse(w * 0.5, h * 0.42, w * 0.42, h * 0.28)
        paper.fill({ color: 0xe2d2b0, alpha: 0.45 })

        vine.clear()
        const baseX = w * 0.5
        const baseY = h * 0.82
        const growth = Math.min(1, 0.25 + age * 0.1)
        const trunkH = h * 0.35 * growth * (thanThu ? 1.25 : 1)

        vine.moveTo(baseX, baseY)
        vine.bezierCurveTo(
          baseX - 18,
          baseY - trunkH * 0.35,
          baseX + 12,
          baseY - trunkH * 0.7,
          baseX,
          baseY - trunkH,
        )
        vine.stroke({ width: thanThu ? 5 : 3, color: 0x1a1a1a, cap: 'round' })

        const branches = thanThu ? 5 : 2 + Math.min(3, age)
        for (let i = 0; i < branches; i += 1) {
          const t = (i + 1) / (branches + 1)
          const y = baseY - trunkH * t
          const dir = i % 2 === 0 ? -1 : 1
          const len = 28 + i * 10 * growth
          vine.moveTo(baseX, y)
          vine.quadraticCurveTo(
            baseX + dir * len * 0.6,
            y - 16,
            baseX + dir * len,
            y - 8,
          )
          vine.stroke({ width: 1.6, color: 0x1a1a1a, cap: 'round' })
        }

        if (thanThu) {
          vine.circle(baseX, baseY - trunkH - 8, 10)
          vine.fill({ color: 0xa31d1d, alpha: 0.85 })
        }
      }

      draw()
      next.ticker.add(draw)
    }

    void boot()

    return () => {
      destroyed = true
      if (app) {
        app.destroy(true)
        app = null
      }
      host.replaceChildren()
    }
  }, [age, thanThu])

  return <div ref={hostRef} className="vine-stage" aria-label="Đồ đằng trên giấy tuyên" />
}
