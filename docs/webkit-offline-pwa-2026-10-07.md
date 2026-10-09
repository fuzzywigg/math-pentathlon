# WebKit offline PWA — investigation 2026-10-07

Branch: `cursor/webkit-offline-pwa-2f20`  
Base: `cursor/cross-browser-pass-6818` (#471)  
Keeper: `tests/e2e/offline-pwa.spec.ts` → `menu + Hex computer move offline after first online visit`

## Verdict

Playwright WebKit under `context.setOffline(true)` **cannot load precached module scripts through the service worker**, even when Cache Storage already holds them. An explicit Workbox `CacheFirst` route for `/assets/*.js` does **not** help (precache already owns those URLs; controlled-page `fetch()` still fails).  

**Product mitigation (this PR):** expand menu idle-warm to also import `game-route-mounts` + `game-play.css` (same paths as `renderGame`), then on WebKit e2e use SPA soft-nav after warm completes. Chromium/Firefox keep full offline `page.goto` (SW path). No rules/scoring changes.

## Probe (minimal reproduction)

```bash
npm run build
PROBE_BROWSERS=webkit,firefox,chromium node scripts/webkit-offline-probe.mjs
```

Artifact from this run: `/opt/cursor/artifacts/webkit-offline-probe.json`.

**Tip re-run (q-mp-059 on `cursor/mp-tip-post477`):** Vite hashes may include `_`
(e.g. `game-hex-DWW_girN.js`). The probe URL matcher must accept `[A-Za-z0-9_-]+`
and exclude `game-hex-a-gone-*`. On this tip, WebKit/Firefox/Chromium all found
the Hex precache entry and mounted Hex offline via soft-nav and `page.goto`.

### WebKit (failing shape)

| Check | Result |
| --- | --- |
| Precache entry count | ~68 (same ballpark as Chromium) |
| `caches.match(game-hex-*.js)` | **ok** |
| `caches.match(game-routes-*.js)` | **ok** |
| `caches.match(ai.worker-*.js)` | **ok** |
| Offline `fetch(game-hex-*.js)` while SW-controlled | **Load failed** |
| Offline `import(game-hex-*.js)` after idle-warm of Hex | **ok** (module map) |
| Offline `import(game-routes-*.js)` (not warmed) | **Importing a module script failed** |
| Offline `new Worker(ai.worker-*.js)` | **worker error** |
| Soft hash nav `#/game/hex` without route-mount warm | `game-load-error` |
| Offline `page.goto(#/game/hex)` | **WebKit encountered an internal error** |

### Firefox / Chromium

Same precache hits; offline `fetch` / `import` / soft-nav / `page.goto` all succeed.

## Why CacheFirst for `/assets/*.js` was rejected

1. `vite-plugin-pwa` `precacheAndRoute` already intercepts hashed JS/CSS from `globPatterns`.
2. The failure is not “missed cache key” — `caches.match` returns the body.
3. Under Playwright WebKit `setOffline`, **controlled-page network requests fail before a useful SW response** (`fetch` → `Load failed`, console: `WebKit encountered an internal error`). A second runtime route cannot fix a broken client↔SW fetch bridge in that environment.
4. Adding a redundant assets `CacheFirst` risks route-order confusion with precache updates without improving Chromium/Firefox (already green).

## Why idle-warm of route mounts helps

`renderGame()` always dynamic-imports:

1. `./ui/game-route-mounts`
2. `./ui/styles/game-play.css`

then the per-game controller. Prior idle-warm only pulled Hex / Kings controllers, so Hex could sit in the module map while **route-mount still needed a network/SW fetch** — which WebKit offline rejects.

Warming shell + games while online lets SPA soft-nav (hash change / game-card tap) remount without a fetch. Hex AI still has a **sync main-thread fallback** if the worker script cannot spawn offline (`AiWorkerClient` + watchdog in `src/games/hex/ai-client.ts`).

## Limits (still open)

- Playwright WebKit **full document navigation / reload** while offline remains broken (`page.goto` internal error). Not fixed here.
- Real iPad Safari airplane-mode after first visit is still the product QA signal; this may be Playwright-WebKit-only.
- Unwarmed games (e.g. Calla) still depend on SW fetch offline — fine on Chromium/Firefox; WebKit soft-nav for those remains limited until Playwright/WebKit improves.

## Follow-ups

- Re-check on device Safari airplane mode.
- Re-run `scripts/webkit-offline-probe.mjs` after Playwright/WebKit upgrades; restore WebKit `page.goto` in the keeper if controlled fetch starts succeeding.
