# UI coverage round 6 (`q-mp-111` / burn-1009)

Characterization tests for the next lowest-covered **non-engine, non-AI** modules
after round 5 (already on tip), stacked on tip `cursor/mp-tip-post477` @ `7d59901c`.

**Base:** `cursor/mp-tip-post477`. Draft only — tip owner folds.

## Scope

Included: hex / fraction-pinball / contig-60 / juggle / kings-quadraphages /
kwatro-sinko / frac-fact / stars-bars / par-55 / queens-guards controller residual
shells; owl-component coast/drag residual; pwa bootstrap `enabled` default arm.
Also exercised (sub-1 pp): pent-em-in `__setStateForTests`, dice-demo poly roll flush.

Excluded: game `rules.ts` / `ai.ts`, heavy `*-board-3d.ts`, tutorials / help/status
**copy** assertions, AI move-choice / timing asserts (Hex Hard 450ms untouched),
`inject-styles.ts` (owned by open #632 / already on tip via `inject-styles-once.test.ts`).

## Overlap with open drafts

| Draft | Action |
|-------|--------|
| #632 inject-styles | Already on tip / separate suite — not re-targeted |
| #638 destroyGame juggle/fab/sum | Did not assume empty stubs; exercised tip’s existing juggle destroy + DEV place hooks |
| #640 layout reads | Orthogonal (board-ui sync) — not edited |
| Round 5 suites | Left untouched; residuals only |

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip `7d59901c` (before) and this branch (after).

| File | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/games/fraction-pinball/game-controller.ts` | 77.35% | 50.87% | 94.33% | 70.17% | +16.98 | +19.30 |
| `src/games/juggle/game-controller.ts` | 70.76% | 56.92% | 86.15% | 71.53% | +15.39 | +14.61 |
| `src/games/hex/game-controller.ts` | 81.37% | 64.58% | 94.11% | 77.08% | +12.74 | +12.50 |
| `src/pwa/bootstrap.ts` | 100% | 75.00% | 100% | 91.66% | 0 | +16.66 |
| `src/games/contig-60/game-controller.ts` | 81.14% | 58.18% | 88.52% | 75.45% | +7.38 | +17.27 |
| `src/ui/owl/owl-component.ts` | 84.88% | 67.11% | 92.28% | 75.16% | +7.40 | +8.05 |
| `src/games/queens-guards/game-controller.ts` | 83.61% | 81.87% | 89.07% | 83.22% | +5.46 | +1.35 |
| `src/games/kings-quadraphages/game-controller.ts` | 77.50% | 68.51% | 79.37% | 71.29% | +1.87 | +2.78 |
| `src/games/stars-bars/game-controller.ts` | 85.84% | 72.60% | 86.72% | 75.34% | +0.88 | +2.74 |
| `src/games/par-55/game-controller.ts` | 88.09% | 72.60% | 88.88% | 75.34% | +0.79 | +2.74 |
| `src/games/frac-fact/game-controller.ts` | 95.04% | 74.46% | 96.03% | 76.59% | +0.99 | +2.13 |
| `src/games/kwatro-sinko/game-controller.ts` | 77.18% | 69.07% | 77.56% | 70.39% | +0.38 | +1.32 |

**12 files show ≥1 pp lines or branches gains** (acceptance: 8+).

Also exercised (sub-1 pp / 0Δ): `pent-em-in/game-controller`, `demos/dice-demo`.

## Overall (repo-wide unit coverage)

| Metric | Before (tip) | After | Δ |
|--------|-------------:|------:|--:|
| **Lines** | **94.18%** (21423/22745) | **94.68%** (21536/22745) | **+0.50 pp** |
| **Branches** | **85.96%** (10516/12233) | **86.65%** (10601/12233) | **+0.69 pp** |
| Statements | 93.13% | 93.62% | +0.49 pp |
| Functions | 93.77% | 94.22% | +0.45 pp |

## Tests added

- `tests/unit/burn-1009-ui-cov-r6-hex-pinball.test.ts`
- `tests/unit/burn-1009-ui-cov-r6-contig-juggle.test.ts`
- `tests/unit/burn-1009-ui-cov-r6-controllers-shell.test.ts`
- `tests/unit/burn-1009-ui-cov-r6-demos-owl-pwa.test.ts`

## Verification

```text
npx vitest run --project unit-shared tests/unit/burn-1009-ui-cov-r6-*.test.ts
# Test Files  4 passed; Tests  21 passed

npm run lint
# (see PR / CI)

npm run test:unit
# (see PR / CI)

npm run test:unit:coverage
# exit 0; metrics above
# Repo-wide lines 94.18%→94.68%, branches 85.96%→86.65%
```

## Constraints honored

- No non-test product `src/` edits
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed AI client / stubbed canvas; no real network)
- No player-facing copy assertions (structural selectors / phase only)
- Hex Hard 450ms assert untouched
- No AI move-choice asserts (mocked `getBestMoveAsync` / flush without choice checks)
