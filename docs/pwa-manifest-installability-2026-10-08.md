# PWA installability audit (2026-10-08)

Task: `burn-1008-mp-pwa-manifest`

## Scope

Web app manifest fields, icon set, iOS meta tags, theme-color light/dark, SW
registration scope vs base path, and update flow (autoUpdate + reload). Does
**not** redo offline/chunk retry (#458), WebKit idle-warm (#479), build
repro/precache overlap (#524), or CI workflow hardening (#527). Tablet PNG
icons were already on tip (#399 / overnight polish).

## Checklist

| Item | Before | After |
| --- | --- | --- |
| `name` / `short_name` | Math Pentathlon / Math Pentathlon | unchanged (no player-facing rename) |
| `id` | missing | `/` (stable Chrome install identity) |
| `start_url` / `scope` | `/` / `/` | unchanged; plugin `scope` + `base` also `/` |
| `display` | `standalone` | unchanged |
| `orientation` | missing | `any` (tablet rotate) |
| `theme_color` / `background_color` | `#102a43` / `#102a43` | unchanged in manifest |
| Icons 192/512 `any` + 512 `maskable` | present under `public/icons/` | unchanged; contract asserts |
| Maskable safe zone | content inside center ~80% | verified; no asset change |
| `apple-touch-icon` + iOS meta | 180 PNG + capable/title | unchanged |
| `theme-color` meta light/dark | single `#102a43` | light `#f8fafc`, dark `#102a43`, fallback `#102a43` |
| SW register scope vs base | default from base | explicit `scope: '/'`, `base: '/'` |
| Update flow (new SW / stale shell) | `autoUpdate` + `onNeedRefresh` reload | + explicit `cleanupOutdatedCaches: true` |
| Hermetic / built checks | icon path unit only | contract unit + e2e + `check:pwa-manifest` (report-only CI) |

## Commands

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build
npm run check:pwa-manifest   # report-only (REPORT_ONLY=0 to fail)
```
