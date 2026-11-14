# 03 — Tech Stack

**Quyết định:** Web app, không Unity.

| Layer | Choice | Why |
|-------|--------|-----|
| App / HUD | React + TypeScript | Panel gia tộc, ban chỉ, meta UI nhanh |
| Map / vine render | PixiJS | Canvas 2D mực, rễ, map node |
| Build | Vite | Dev nhanh, hash asset |
| State | Zustand hoặc Redux Toolkit (chọn 1) | Run state + meta save |
| Save | `localStorage` (+ export JSON sau) | Solo web |
| Deploy | Cloudflare Workers / Pages | `.workers.dev` ship nhanh |
| Content | JSON / TS data modules | Tag thế giới, năng lực, ban chỉ |

---

## Suggested folders (khi scaffold)

```
than-thu/
├── Documentation/
├── public/          # giấy texture, icons
├── src/
│   ├── app/         # React shell, routes
│   ├── hud/         # manuscript UI
│   ├── game/
│   │   ├── meta/    # suy diễn points, unlocks
│   │   ├── run/     # một kiếp thế giới
│   │   ├── clan/    # thần thụ / ban chỉ
│   │   └── data/    # tags, traits, edicts
│   ├── pixi/        # map + vine view
│   └── save/
└── package.json
```

---

## Architecture rules

1. **Run engine** (mùa, sinh lực, roll) thuần TS — không phụ thuộc React.  
2. React chỉ bind view + input.  
3. Pixi chỉ vẽ; không chứa luật game.  
4. Event nhỏ: `OnSeasonEnd`, `OnEdictIssued`, `OnRunEnded`.

---

## Related

- [04_MVP_Roadmap.md](04_MVP_Roadmap.md)
