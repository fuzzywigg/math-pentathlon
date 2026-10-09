# Offline & Slow-3G resilience — 2026-10-07

Chromium Playwright probes against a production `vite preview` build (Workbox
service worker active) and a plain `vite` dev server (no SW). Artifacts:
`/opt/cursor/artifacts/offline-resilience-probe.json`,
`offline-resilience-probe-dev.json`.

No rules or scoring changes. Existing PWA registration
(`vite-plugin-pwa` + `src/pwa/register.ts`) was left in place; no new service
worker was added.

## Method

| Profile | How |
| --- | --- |
| Offline after first load | `browser.newContext()` → online visit → `context.setOffline(true)` → navigate |
| Slow 3G | CDP `Network.emulateNetworkConditions` — 500 kbps down/up, 400 ms RTT |
| Chunk failure | `page.route(...).abort('failed')` on a lazy game chunk (prod probe: `game-calla-*.js` with `serviceWorkers: 'block'`; e2e: Calla `game-controller` on vite dev) |

## What breaks (and what does not)

### Lazy game chunks

| Scenario | Result |
| --- | --- |
| **Production + SW, offline after first online visit** | **Works.** Workbox precaches shell + every `game-*` / worker / vendor chunk (`globPatterns` in `vite.config.ts`). Menu, Hex, and never-opened Pent-em-in all mounted offline with zero `requestfailed` events. |
| **Vite dev (no SW), offline after menu load** | **Breaks for unwarmed games.** Opening Calla (not in idle-warm / Div-I prefetch) fails with `net::ERR_INTERNET_DISCONNECTED` on `/src/games/calla/game-controller.ts`. Friendly error UI appears (`data-testid="game-load-error"`) with offline hint + **Try again** / **Back to games**. Idle-warmed games (Hex, Kings) can still mount from the in-memory module graph until a full reload. |
| **Cold offline (never visited)** | **Breaks hard.** `net::ERR_INTERNET_DISCONNECTED` — no shell, no SW cache yet. |
| **Flaky fetch of one game chunk (online)** | **Breaks until retry.** Aborting `**/games/calla/game-controller*` shows the load-error UI. Soft re-`import()` does **not** recover (browser module map keeps the rejected fetch). **Try again** reloads the page (keeps the hash route) so the chunk can download. Covered by `tests/e2e/chunk-load-retry.spec.ts`. |

### Fonts (`/fonts/*.woff2`, Inter)

| Scenario | Result |
| --- | --- |
| **Production + SW, offline after first visit** | **Works.** All four Inter weights report `status: "loaded"` from precache (`includeAssets` + `globPatterns`). |
| **Font requests aborted on cold load** | **Degrades, does not block UI.** `@font-face` entries go to `error`; computed `font-family` still lists `Inter, system-ui, …` so the browser falls back to system UI fonts. Menu remains usable. Self-hosted fonts (no Google Fonts round-trip) already avoid a common offline failure mode. |

### 3D assets (Three.js / `ui/three` / `vendor/three-*`)

| Scenario | Result |
| --- | --- |
| **Default play (board3d flag off)** | **No Three.js fetch.** Games mount their 2D boards. Aborting `three` / `ui/three` while opening Hex-a-Gone still showed the 2D board; no game-load error. |
| **Production Slow 3G** | Menu ~1.9 s to first cards; Hex and Hex-a-Gone mounted. SW precache during the first visit absorbs later chunk cost. |
| **Vite-dev Slow 3G (no precache)** | Menu ~12 s, Calla ~16 s — slow but successful; no failed requests. 3D vendor chunk (~hundreds of kB) is the main risk when `?board3d=1` / feature flag enables MP3D: first open pays the Three.js download on a weak radio. Controllers already fall back to 2D when the 3D module throws (see `ensureBoard3d` catch paths). |

## UI already in place / fixed this pass

- **Load error + retry:** `src/ui/game-loading.ts` (`Try again`, `Back to games`, offline-aware hint via `src/ui/offline.ts`).
- **Offline chrome:** `html[data-offline="true"]` sticky banner in `src/style.css`.
- **Retry recovery fix:** `retryLazyChunkLoad()` in `src/main.ts` uses `location.reload()` so a failed dynamic import is not stuck in the module map.
- **Service worker:** unchanged existing Workbox setup — full precache after first visit is what makes airplane mode work for kids.

## Residual risks (not fixed here)

1. **First visit on Slow 3G** still feels heavy before SW finishes precaching (especially if a kid opens a 3D-enabled game immediately).
2. **Storage eviction** (iOS) can drop the SW cache; next online visit re-precaches.
3. **Dev / preview without SW** is not an offline product path — use the production build for offline QA.

## Probe commands (repro)

```bash
node scripts/probe-offline-resilience.mjs      # production preview + SW
node scripts/probe-offline-resilience-dev.mjs  # vite dev, no SW
npx playwright test --project=chromium tests/e2e/chunk-load-retry.spec.ts
```
