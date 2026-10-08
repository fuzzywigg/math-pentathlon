# Flake-rate measurement — wave5 tip (2026-10-08)

**Task id:** `burn-1008-mp-flake-rate`  
**Base tip:** `cursor/integration-fold-wave5-tip-4af0` (PR #477)  
**Draft only** — do not merge; next action is fold into tip by the tip owner.

## Prior flake hunts (do not redo)

| PR | Scope | Status on tip |
| --- | --- | --- |
| #442 | Unit RAF/timer isolation, Kwatro seed, Calla hint, selector isolate, bench afterAll | Folded (`sequence.hooks: 'stack'`, setup unstub/now restore, isolatedFiles) |
| #481 | Selector navigate + owl `gameStartTime` + FIAR timer cleanup | Folded (`setup.ts` clears timers / gameStartTime / Math.random) |
| #474 | Chromium e2e waits, seeds, reduced-motion, offline-pwa cleanup | Folded (`playwright.config` reducedMotion, `helpers/stability.ts`) |
| #490 | mp3d canvas-ready under SwiftShader | Folded (SwiftShader launch args, `waitForMp3dReady`, ready/fallback signals) |

No open draft on this tip already owned the flake-rate measurement topic (#526 is fixture consolidation only).

## Method

```bash
# Unit — 7× default + 3× shuffle (10 total)
npm run test:unit
npx vitest run --sequence.shuffle --sequence.seed=<N>

# Isolate:false stress (unit-shared, maxWorkers=1)
npx vitest run --project=unit-shared --maxWorkers=1 --sequence.shuffle --sequence.seed=<N>

# Chromium e2e — 3×, no retries
CI=1 npm run test:e2e:chromium -- --retries=0 --workers=2
```

Artifacts: `/opt/cursor/artifacts/flake-rate/`.

## Before (tip as shipped)

### Full suite (`npm run test:unit` / vitest JSON)

| Run | Mode | Result |
| --- | --- | --- |
| default-1…7 | default | **6/7 green** (default-1 failed) |
| shuffle-1…3 | shuffle seeds 2000/2111/2222 | **3/3 green** |
| **Total** | | **9/10 green** |

### unit-shared `--maxWorkers=1` shuffle stress

| Seed | Result |
| --- | --- |
| 404 | green |
| 606 | **fail** (same victim) |
| 909 | **fail** (same victim) |

### Chromium e2e

Blocked initially by missing `rollup-plugin-visualizer` (dev `webServer` / vite config). After `npm install`, measured separately in the after pass (no product change).

## Flake found (new on tip)

| Test | Runs (full) | Failures | Cause | Fix |
| --- | --- | --- | --- | --- |
| `burn-1007-pwa-shell-ui` — skips prefetch when `navigator.connection.saveData` is true | 10 | 1 (plus 2/3 mw1 stress) | `renderGameSelector` idle-prefetch marks Division I games `started` under `MODE=test`; under `isolate:false` a later saveData assert sees leftover `started` and fails `isGamePrefetchStarted === false` | Reset `resetGamePrefetchForTests()` in `tests/unit/setup.ts` afterEach; `beforeEach` reset in the saveData describe + `game-prefetch.test.ts` |
| Graph animate / owl / FIAR / selector navigate / Kwatro seed / Calla hint | — | 0 on tip | Already covered | already-covered-by-#442 / #481 |
| Star Track waits / reduced-motion / offline-pwa | — | — | Already covered | already-covered-by-#474 |
| mp3d canvas-ready SwiftShader | — | — | Already covered | already-covered-by-#490 |

**Causal repro (before fix):**  
`unit-shared --maxWorkers=1` + selector files + saveData file, `--sequence.seed=1` → AssertionError `expected true to be false` at saveData assert.

**Not fixed by raising timeouts / retries / skips** — isolation only.

## After

See PR verification section / `unit-after-summary.json` + e2e summaries under artifacts.
