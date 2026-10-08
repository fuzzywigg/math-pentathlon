# UI coverage round 4 (`burn-1008-mp-ui-coverage-round-4`)

Characterization tests for the next lowest-covered **non-engine, non-AI** modules
after round 3 (#571), stacked on tip `cursor/integration-fold-wave5-tip-4af0`.

**Stacks on #571; fold after #571.**

## Scope

Included: shell / controllers (juggle, kwatro-sinko, pent-em-in, kings-quadraphages,
stars-bars, contig-60, fiar, star-track, calla, hex-a-gone), renderers
(`juggle/board-ui`, `fiar/board-ui`, `fiar/layout`, `kings-quadraphages/board-renderer`),
storage-adjacent helpers (`polyomino/placement`), owl message select residuals,
PWA/offline/reduced-motion glue, demo residual mounts.

Excluded: game `rules.ts` / `ai.ts`, heavy `*-board-3d.ts` implementations, tutorials /
help/status **copy** assertions, modules already owned by #510 / #566 / #571 unless
still under-covered with residual edges, and source files touched by #567 / #568.

## Overlap with prior drafts

| Draft | Action |
|-------|--------|
| #510 | Skipped (route mounts / PWA bootstrap already high; only residual `bootstrap` ric opts) |
| #566 | Already folded via #571 stack; not re-targeted |
| #571 | Merged into this branch first; not re-targeted |
| #567 | Avoided `prime-gold-board-3d` / controller source |
| #568 | Avoided `bootstrap-owl` / `register` / `game-route-mounts` source |
| #574 | Engine coverage round 2 — orthogonal (rules engines) |

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip+#571 (before) and this branch (after).

| File | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/games/juggle/board-ui.ts` | 80.42% | 74.21% | 94.30% | 88.05% | +13.88 | +13.84 |
| `src/games/juggle/game-controller.ts` | 74.44% | 60.48% | 83.88% | 66.93% | +9.44 | +6.45 |
| `src/games/fiar/board-ui.ts` | 90.90% | 84.33% | 100% | 92.77% | +9.10 | +8.44 |
| `src/games/stars-bars/game-controller.ts` | 80.62% | 68.05% | 87.59% | 73.61% | +6.97 | +5.56 |
| `src/ui/reduced-motion.ts` | 90.00% | 92.85% | 96.66% | 92.85% | +6.66 | 0 |
| `src/games/kings-quadraphages/board-renderer.ts` | 94.87% | 83.33% | 100% | 100% | +5.13 | +16.67 |
| `src/games/pent-em-in/game-controller.ts` | 79.16% | 59.50% | 82.73% | 61.15% | +3.57 | +1.65 |
| `src/games/fiar/game-controller.ts` | 86.04% | 73.61% | 88.37% | 75.69% | +2.33 | +2.08 |
| `src/core/owl/owl-messages.ts` | 95.34% | 95.74% | 97.67% | 97.87% | +2.33 | +2.13 |
| `src/games/kwatro-sinko/game-controller.ts` | 75.28% | 67.10% | 77.18% | 69.07% | +1.90 | +1.97 |
| `src/demos/polyomino-demo.ts` | 96.60% | 88.00% | 97.57% | 90.00% | +0.97 | +2.00 |
| `src/games/fiar/layout.ts` | 98.00% | 86.95% | 98.00% | 91.30% | 0 | +4.35 |
| `src/ui/offline.ts` | 94.11% | 81.81% | 94.11% | 90.90% | 0 | +9.09 |
| `src/games/contig-60/game-controller.ts` | 84.13% | 64.70% | 84.13% | 64.70% | 0* | 0* |
| `src/games/kings-quadraphages/game-controller.ts` | 78.07% | 66.94% | 78.07% | 66.94% | 0* | 0* |
| `src/games/star-track/game-controller.ts` | 86.87% | 76.08% | 86.87% | 76.08% | 0* | 0* |
| `src/games/hex-a-gone/game-controller.ts` | 88.94% | 72.07% | 88.94% | 72.07% | 0* | 0* |
| `src/games/calla/game-controller.ts` | 88.33% | 79.68% | 88.33% | 78.12% | 0* | 0† |
| `src/core/polyomino/placement.ts` | 100% | 90.09% | 100% | 90.09% | 0* | 0* |
| `src/pwa/bootstrap.ts` | 100% | 75.00% | 100% | 75.00% | 0* | 0* |
| `src/demos/fraction-demo.ts` | 100% | 78.84% | 100% | 78.84% | 0* | 0* |

\* Exercised in suite; remaining miss is AI/3D-loader paths, `typeof window/document`
non-jsdom arms, or already-covered bodies.

† Branch % noise vs full-suite merge; smoke only — not counted as a gainer.

**13 files show meaningful % gains** (acceptance: 10+).

## Overall (target-file aggregate)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| **Lines** | **86.18%** (2588/3003) | **89.71%** (2694/3003) | **+3.53 pp** |
| **Branches** | **73.49%** (1253/1705) | **76.66%** (1307/1705) | **+3.17 pp** |

Repo-wide unit coverage (all `src/**`): lines 94.37%→94.86%, branches 85.39%→85.84%,
statements 92.65%→93.12%.

## Bugs pinned (skipped)

| Pin | File | Note |
|-----|------|------|
| `formatEndBanner` exhaustive `default` | `contig-60/game-controller.ts` | Invalid `ContigWinner` cast only; skipped until soft-fail is intentional |

## Tests added

- `tests/unit/burn-1008-ui-cov-r4-juggle-board-controller.test.ts`
- `tests/unit/burn-1008-ui-cov-r4-fiar-layout-board.test.ts`
- `tests/unit/burn-1008-ui-cov-r4-owl-poly-helpers.test.ts`
- `tests/unit/burn-1008-ui-cov-r4-controllers-shell.test.ts`
- `tests/unit/burn-1008-ui-cov-r4-offline-motion-demos.test.ts`

## Verification

```text
npm run lint                          # exit 0
npx tsc --noEmit                      # exit 0

npx vitest run --project unit-shared tests/unit/burn-1008-ui-cov-r4-*.test.ts
# Test Files  5 passed; Tests  36 passed | 1 skipped

npm run test:unit                     # run 1 (pre-deepen commit)
# Test Files  3121 passed (3121)
# Tests  11895 passed | 24 skipped | 7 todo (11926)
# Duration  ~345s

npm run test:unit                     # run 2 (post-deepen; flake check)
# Test Files  3121 passed (3121)
# Tests  11898 passed | 24 skipped | 7 todo (11929)
# Duration  ~349s  — +3 from deepen; skipped identical, no flake

npm run test:unit:coverage
# exit 0; metrics above
# Repo-wide lines 94.37%→94.86%, branches 85.39%→85.84%
```

`git diff --name-only` vs tip+#571 merge: tests + this doc only.

## Constraints honored

- No non-test product source changes
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed APIs; no real network)
- No player-facing copy assertions (structural selectors / classes only)
- Hex Hard 450ms assert untouched
- Tip-owner AI/tutorial/status restore work left alone
