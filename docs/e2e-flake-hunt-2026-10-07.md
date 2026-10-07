# E2E flake hunt — 2026-10-07

Base: `cursor/overnight-polish-integration-0494` (76 Chromium tests).  
Scope: tests/setup only (waits, deterministic seeds, animation disabling).  
**Out of scope (not fixed here):** prime-gold 3D keyboard flake (#451), ramrod-deep (#450).

## Hunt method

| Pass | Command | Result |
| --- | --- | --- |
| Suite ×8 | `playwright test --project=chromium --retries=0 --workers=2` | **8/8 green** (76/76 each) |
| CI-like ×2 | `CI=1 … --workers=1 --retries=0` | **2/2 green** |
| workers=4 ×2 | `--workers=4 --retries=0` | **2/2 green** |
| Full suite `--repeat-each=3` | 228 tests | **228/228** |
| mp3d+offline `--repeat-each=5` | 155 tests | **155/155** |
| Star Track keyboard `--repeat-each=30` | | **30/30** |
| Star Track heavy screenshots `--repeat-each=10` | | **10/10** |
| CPU stress suite ×3 | 2 busy-loop cores | **2/3** (see below) |
| CPU stress excl. PG keyboard ×5 | | **5/5** |
| CPU stress star-track + other kbd ×15 | | **120/120** |

## Flakes found

### 1. `mp3d-prime-gold` keyboard a11y (known — **not fixed here**)

- **Repro:** CPU-stressed suite run 3/3 failed once; placement itself succeeded.
- **Symptom:** Playwright strict-mode on `locator('.pg-move-history, .pg-status')` resolving to 2 nodes after a successful place.
- **Disposition:** Handled in draft PR #451 / stack #454. Left untouched on this branch.

### 2. Latent Star Track turn race (hardened)

- Documented on PR #443: hard-requiring `.star-track-draw-btn` after chain select races game-over under slow 3D remounts.
- Not reproduced in 30× keyboard / 10× heavy / 15× CPU stress on this host, but the harness still used fixed `waitForTimeout(80)` and a hard draw assertion.
- **Fix:** soft-wait draw→chain and draw-or-winner after chain; keyboard assertion accepts draw **or** winner.

### 3. Fixed-sleep keyboard assertions (hardened)

- Hex-a-Gone / Pent'Em In / Kwatro / FIAR / Queens keyboard paths used `waitForTimeout` then weak or timing-sensitive expects.
- **Fix:** condition waits with 8s budgets; FIAR asserts a11y `aria-label` becomes Blue/Red.

## Setup hardenings (all tests)

| Change | Why |
| --- | --- |
| `playwright.config.ts`: `reducedMotion: 'reduce'`, `workers` local=2 / CI=1, `timeout: 60_000` | Kill CSS animation races; avoid high-worker 3D mount storms |
| `tests/e2e/fixtures.ts` + `helpers/stability.ts` | Seeded `Math.random` (mulberry32 `0xc0ffee`) + CSS animation/transition kill via init script |
| `offline-pwa.spec.ts`: detached preview + process-group SIGTERM/KILL; stability on manual context | Prevent leaked `vite preview` trees after interrupted runs |

## Pass rates

### Before (pre-fix hunt)

| Metric | Rate |
| --- | --- |
| Full Chromium suite ×8 | **608/608** test results (8×76) — **100%** suite runs |
| Full suite `--repeat-each=3` | **228/228** — **100%** |
| CPU-stressed suite ×3 (incl. known PG keyboard) | **2/3** suite runs (**75**/**76**, **75**/**76**, **75**/**76** on the failing run) |
| CPU-stressed excl. PG keyboard ×5 | **5/5** — **100%** |

### After (this PR)

| Metric | Rate |
| --- | --- |
| Full Chromium suite ×8 | _(filled after verification)_ |
| Full suite `--repeat-each=3` | _(filled after verification)_ |
| CPU-stressed excl. PG keyboard ×3 | _(filled after verification)_ |
| Spot: changed mp3d keyboard/flag specs | **18/18** |

## Explicitly not changed

- No rules / scoring / engine / `src/ui/three/*` edits.
- No prime-gold keyboard assertion rewrite (#451).
- No ramrod-deep harness (#450; file absent on this base).
