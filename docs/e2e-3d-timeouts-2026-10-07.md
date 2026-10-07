# Chromium e2e 3D timeouts — 2026-10-07

## Summary

Full Chromium e2e (`npm run test:e2e -- --project=chromium`) was run repeatedly on this branch. Historical Playwright report artifacts and local stress runs point to **mp3d board3d specs** as the flaky surface—especially multi-viewport screenshot / play-through tests—under **software WebGL**, **missing scene-ready waits**, and **parallel worker GL load**. Fixes landed in **test config + e2e helpers + a test-only LQ render flag** (no rules/scoring changes).

## Reproduction (this agent)

| Run | Conditions | Result |
| --- | --- | --- |
| 1 | `CI=1`, workers=1, full suite | 76 passed (~1.6m) |
| 2 | workers=4, full suite | 76 passed (~29s wall) |
| 3–5 | mp3d specs only, workers=4, repeated | 30/30 × 3 passed |
| Post-fix | `CI=1` full suite after ready/LQ changes | Star Track heavy spec failed 3×: hard `expect(draw)` after chain click when game-over/transition omitted draw — fixed by soft wait on draw **or** winner |
| Post-fix 2 | Star Track spec alone | 4/4 passed |

Historical CI artifacts and the post-fix Star Track failure confirm the fragile surface is real; ready-waits + soft turn helpers + timeouts address it.

## Specs that have timed out / failed in CI artifacts

Evidence from uploaded `playwright-report` artifacts (repo Actions):

| Spec | Failure mode | Likely cause |
| --- | --- | --- |
| `mp3d-star-track-board3d.spec.ts` — flag on, 3 viewports | Assertion / layout race after mount; long play-through under default 30s | Heavy scene + fixed `waitForTimeout`; no elevated `test.setTimeout`; chain-above-fold races before layout settle |
| `mp3d-kings-board3d.spec.ts` — canvas visible | `expect(canvas).toBeVisible` **Timeout 15000ms** (element not found) | WebGL/Three mount slower than canvas wait; wait started before ready paint |
| Other mp3d “flag on” screenshot suites (hex / prime / queens / pent / kwatro / fiar) | Same class of risk: canvas visible ≠ first paint; multi-viewport remounts | Software/ANGLE GL in GHA; parallel browsers thrashing shared GL; fixed sleeps |

Related (not 3D, same suite budget): smoke vs-AI `waitForFunction` **45s** timeouts under load (Oct 4 report)—shows the Chromium job is sensitive to CPU contention when many tabs/GL contexts run.

## Root causes (ranked)

1. **Software / low-end WebGL in CI** — GitHub `ubuntu-latest` uses software GL (SwiftShader/ANGLE). Three.js board init + `preserveDrawingBuffer` (forced under `navigator.webdriver`) is expensive; 15s canvas waits are tight.
2. **Missing ready-waits** — Specs waited on `canvas[data-mp3d]` visibility or fixed `waitForTimeout(350–500)`, not “first successful render.” Click helpers that need `__mp3d*` APIs sometimes raced mount.
3. **Heavy scene init × viewports** — Star Track / Hex / Prime / Queens / Pent remount or resize across phone + tablet orientations in one test without always raising the per-test timeout.
4. **Parallel worker load** — Config used `workers: undefined` locally (all CPUs). Several Chromium instances each creating WebGL contexts amplify software-GL cost and flake risk. CI already used `workers: 1`.

Not treated as a player-facing perf bug: tablet boards already use antialias off, low-power preference, and a 1.5 pixel-ratio cap. No scoring/rules changes.

## Fixes (tests / config first)

### Playwright config (`playwright.config.ts`)

- **Workers:** `CI → 1`, local **cap 2** (avoid default “all CPUs” GL thrash).
- **Default test timeout:** `60_000` (was 30s).
- **Expect timeout:** `15_000`.

### Shared e2e helpers (`tests/e2e/helpers/mp3d.ts`)

- `enableBoard3dLowQuality` / `board3dUrl` — turn on `board3d` + **`board3dLQ`**.
- `waitForMp3dReady(page, gameId)` — waits for `canvas[data-mp3d="…"][data-mp3d-ready="1"]` (30s).
- `MP3D_HEAVY_TEST_TIMEOUT_MS = 120_000` for multi-viewport / play-through specs.

### App (test-only, no scoring)

In `src/ui/three/tablet-gl.ts`:

- Opt-in **`?board3dLQ=1`** / `localStorage mp-board3d-lq=1` → pixel ratio cap **1** (`resolveBoard3dPixelRatio`).
- After first successful paint, boards set **`data-mp3d-ready="1"`** via `markBoard3dCanvasReady`.

All eight `*-board-3d.ts` mounts use these helpers. Default player path is unchanged unless LQ is opted in.

### Spec updates

All `tests/e2e/mp3d-*-board3d.spec.ts` files:

- Use helpers + LQ URL/storage for flag-on paths.
- Wait on ready attribute instead of short fixed sleeps after mount.
- Raise `test.setTimeout(MP3D_HEAVY_TEST_TIMEOUT_MS)` on heavy screenshot/play-through tests.
- Prefer event-driven waits (e.g. Star Track draw → chain visible) over blind `waitForTimeout(80)`.

## How to re-verify

```bash
# CI-shaped
CI=1 npm run test:e2e -- --project=chromium --reporter=list

# Stress parallel (local max workers=2 via config)
npm run test:e2e -- --project=chromium tests/e2e/mp3d-*.spec.ts --reporter=line

# Unit coverage for LQ / ready helpers
npx vitest run tests/unit/tablet-gl.test.ts
```

## Out of scope

- Rules, scoring, or student-facing record changes.
- Changing production default pixel-ratio / visual quality for non-test users.
- Merging this PR (draft only; base `cursor/overnight-polish-integration-0494`).
