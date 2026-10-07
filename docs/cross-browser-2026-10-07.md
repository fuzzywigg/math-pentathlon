# Cross-browser e2e pass — 2026-10-07

Branch: `cursor/cross-browser-pass-6818`  
Base: `cursor/overnight-fold-coverage-tip-460a` (#466)  
Suite: full `tests/e2e` on Playwright `firefox` + `webkit` (mobile viewport smoke stays Chromium-only).

## Scope

- **Engines:** Desktop Firefox, Desktop Safari (WebKit)
- **Allowed fixes:** clear CSS / JS compatibility bugs only (shared shell, PWA registration helpers)
- **Out of scope:** per-game rules, scoring, controllers, board logic; promoting cross-browser to required CI

## How to run

Required CI path stays Chromium (+ phone viewport projects):

```bash
npm run test:e2e -- --project=chromium --project=mobile-iphone-se --project=mobile-pixel-7
```

Full Firefox + WebKit suite (local or CI report-only job):

```bash
npx playwright install --with-deps firefox webkit
npm run test:e2e:firefox-webkit
```

Optional three-engine smoke (includes iPad WebKit device profile):

```bash
npm run test:e2e:cross -- tests/e2e/smoke.spec.ts
```

### CI (report-only)

Job `e2e-cross-browser` in `.github/workflows/ci.yml`:

- Runs after a successful `build` on every PR/push
- Installs Firefox + WebKit and runs `npm run test:e2e -- --project=firefox --project=webkit`
- `continue-on-error: true` so failures do **not** block merges
- Uploads `playwright-report-cross-browser` on every run (`if: always()`)

Required path remains Chromium e2e. Flip to blocking only after the unfixed WebKit offline item below is resolved or quarantined.

## Results (this run)

| Project   | Device / browser        | Full e2e suite                          |
| --------- | ----------------------- | --------------------------------------- |
| `firefox` | Desktop Firefox         | **All non-skipped tests passed**        |
| `webkit`  | Desktop Safari (WebKit) | **1 failed** (see below); rest passed   |
| **Total** |                         | **273 passed**, 38 skipped, **1 failed** (~5.3m, 2 workers) |

No rules/scoring/controller changes. No clear shared CSS/JS product fixes were required for the green cases — prior shell hardening (`dvh`/`vh`, safe-area, `touch-action`) remains in place from the earlier smoke pass.

### Skips

38 skips are intentional (viewport/project filters and existing `test.skip` / conditional skips). Mobile viewport smoke is Chromium-emulation only (`mobile-iphone-se` / `mobile-pixel-7`).

## WebKit offline PWA keeper (follow-up)

| Spec | Project | Status |
| ---- | ------- | ------ |
| `tests/e2e/offline-pwa.spec.ts` → `menu + Hex computer move offline after first online visit` | `webkit` | Mitigated in `cursor/webkit-offline-pwa-2f20` — see `docs/webkit-offline-pwa-2026-10-07.md` |

**Triage (still true for SW fetch):**

1. Workbox precache **does** include `game-hex-*.js` on WebKit (~65–68 entries).
2. `caches.match` succeeds offline; controlled-page `fetch()` / cold `import()` fail under Playwright `setOffline`.
3. Explicit `/assets/*.js` CacheFirst does **not** help (precache already serves those URLs).
4. Mitigation: idle-warm `game-route-mounts` + `game-play.css` + Hex/Kings; WebKit keeper uses SPA soft-nav after `data-mp-idle-warm=done`. Chromium/Firefox keep offline `page.goto`.

**Still open:** Playwright WebKit offline `page.goto` / reload can throw `WebKit encountered an internal error`. Device Safari airplane-mode QA still recommended.

## Shared shell / CSS (unchanged this pass)

Earlier smoke-pass hardening remains the baseline (see git history on tip):

| Change | Why |
| ------ | --- |
| `viewport-fit=cover` | `env(safe-area-inset-*)` on notched WebKit |
| `min-height: 100vh` + `100dvh` | Mobile Safari URL-bar jump; Firefox fallback |
| Modal/tutorial `100%` + `100dvh` | Dynamic viewport covers |
| `safe-area-inset-top` on play-shell | Notch clearance |
| `touch-action: manipulation` on shell controls | Legacy WebKit tap delay |

## Screenshots

Landing / Kings screenshots from the earlier smoke pass remain under `docs/screenshots/cross-browser-2026-10-07/` (not re-captured this full-suite pass).
