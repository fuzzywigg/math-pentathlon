# UI coverage round 3 (`burn-1008-mp-ui-coverage-round-3`)

Characterization tests for the next lowest-covered **non-engine, non-AI** modules
after round 2 (#566), stacked on tip `cursor/integration-fold-wave5-tip-4af0`.

**Stacks on #566; fold after #566.**

## Scope

Included: shell / menu (`game-shell`, `game-selector`, `stats-dashboard`), storage /
settings (`safe-web-storage`, `storage`, `url-flags`, `router`), a11y helpers
(`board-a11y`, player-color chrome), renderers’ pure helpers (`tablet-gl`,
`board-3d-loader` gates, `hex-a-gone-pieces`, `polyomino-ui`, `graph-ui`,
`dice-ui`, `fraction-bar-ui`, `alignment/compat`), owl inspect/events, tutorial
Escape edge, demo residual mounts.

Excluded: game `rules.ts` / `ai.ts`, heavy `*-board-3d.ts` implementations (only
loader gates + `tablet-gl` / pieces helpers), modules already owned by #510 /
#566 unless still under-covered, and source files touched by #567 / #568.

## Overlap with prior drafts

| Draft | Action |
|-------|--------|
| #510 | Skipped (route mounts / PWA bootstrap already high) |
| #566 | Merged into this branch first; not re-targeted |
| #567 | Avoided `prime-gold-board-3d` / controller source |
| #568 | Avoided `bootstrap-owl` / `register` / `game-route-mounts` source |

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip+#566 (before) and this branch (after).

| File | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/ui/three/tablet-gl.ts` | 81.89% | 65.71% | 88.79% | 77.14% | +6.90 | +11.43 |
| `src/games/fiar/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/hex-a-gone/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/kings-quadraphages/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/kwatro-sinko/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/pent-em-in/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/prime-gold/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/queens-guards/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/games/star-track/board-3d-loader.ts` | 0.00% | n/a | 100% | n/a | +100 | — |
| `src/core/safe-web-storage.ts` | 94.23% | 81.25% | 100% | 100% | +5.77 | +18.75 |
| `src/ui/game-selector.ts` | 96.46% | 78.57% | 99.11% | 90.47% | +2.65 | +11.90 |
| `src/core/owl/owl-events.ts` | 100% | 83.33% | 100% | 100% | 0 | +16.67 |
| `src/core/polyomino/polyomino-ui.ts` | 100% | 83.63% | 100% | 90.90% | 0 | +7.27 |
| `src/core/url-flags.ts` | 100% | 88.88% | 100% | 94.44% | 0 | +5.56 |
| `src/core/graph/graph-ui.ts` | 95.07% | 90.12% | 95.83% | 93.82% | +0.76 | +3.70 |
| `src/ui/components/game-shell.ts` | 96.42% | 82.82% | 96.87% | 85.85% | +0.45 | +3.03 |
| `src/core/storage/storage.ts` | 96.38% | 90.00% | 97.59% | 92.85% | +1.21 | +2.85 |
| `src/core/alignment/compat.ts` | 100% | 89.52% | 100% | 90.47% | 0 | +0.95 |
| `src/ui/stats-dashboard.ts` | 99.34% | 100% | 100% | 100% | +0.66 | 0 |
| `src/ui/board-a11y.ts` | 100% | 92.35% | 100% | 92.35% | 0* | 0* |
| `src/ui/player-colors.ts` | 100% | 94.11% | 100% | 94.11% | 0* | 0* |
| `src/ui/three/hex-a-gone-pieces.ts` | 93.33% | 85.71% | 93.33% | 85.71% | 0† | 0† |
| `src/core/owl/ollie-inspect-map.ts` | 94.36% | 97.05% | 94.36% | 97.05% | 0† | 0† |
| `src/core/router.ts` | 96.87% | 90.00% | 96.87% | 90.00% | 0* | 0* |
| `src/core/tutorial.ts` | 96.75% | 82.89% | 96.75% | 82.89% | 0* | 0* |
| `src/core/dice/dice-ui.ts` | 99.29% | 93.10% | 99.29% | 93.10% | 0* | 0* |
| `src/core/fractions/fraction-bar-ui.ts` | 100% | 85.71% | 100% | 85.71% | 0* | 0* |
| demos (expression/graph/polyomino/fraction/attribute) | already high | | exercised | | 0* | 0* |

\* Exercised in suite; remaining miss is `typeof document/window === 'undefined'`
(non-jsdom), already-covered callback bodies, or private method paths hard to
reach without deeper DOM fixtures.

† Exhaustive `default: never` only reachable via invalid cast — pinned as
skipped (see Bugs).

**19 files show meaningful % gains** (acceptance: 10+).

## Overall (target-file aggregate)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| **Lines** | **97.11%** (3294/3392) | **98.02%** (3325/3392) | **+0.91 pp** |
| **Branches** | **86.32%** (1388/1608) | **88.68%** (1426/1608) | **+2.36 pp** |

Repo-wide unit coverage (all `src/**`): lines 94.21%→94.32%, branches 85.01%→85.26%.

## Bugs pinned (skipped)

| Pin | File | Note |
|-----|------|------|
| `geometryForShape` exhaustive `default` | `hex-a-gone-pieces.ts` | Invalid `BlockShape` cast throws via `never`; skipped until soft-fail is intentional |
| `stubNarrationFor` exhaustive `default` | `ollie-inspect-map.ts` | Same pattern for invalid `InspectTarget` cast |

## Tests added

- `tests/unit/burn-1008-ui-cov-r3-tablet-gl-loaders.test.ts`
- `tests/unit/burn-1008-ui-cov-r3-shell-menu.test.ts`
- `tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts` (unit-isolated)
- `tests/unit/burn-1008-ui-cov-r3-storage-settings.test.ts`
- `tests/unit/burn-1008-ui-cov-r3-a11y-render-helpers.test.ts`
- `tests/unit/burn-1008-ui-cov-r3-tutorial-demos.test.ts`
- `vitest.config.ts` — isolate selector mock file

## Verification

```text
npm run lint                          # exit 0
npx tsc --noEmit                      # exit 0

npx vitest run --project unit-isolated tests/unit/burn-1008-ui-cov-r3-game-selector.test.ts
# Test Files  1 passed; Tests  1 passed

npx vitest run --project unit-shared tests/unit/burn-1008-ui-cov-r3-*.test.ts
# Test Files  5 passed; Tests  49 passed | 2 skipped

npm run test:unit                     # run 1
# Test Files  3114 passed (3114)
# Tests  11809 passed | 15 skipped (11824)
# Duration  ~365s

npm run test:unit                     # run 2 (flake check)
# Test Files  3114 passed (3114)
# Tests  11809 passed | 15 skipped (11824)
# Duration  ~359s  — identical counts, no flake

npm run test:unit:coverage
# exit 0; metrics above
# Repo-wide lines 94.21%→94.32%, branches 85.01%→85.26%
```

`git diff --name-only` vs tip+#566 merge: tests + this doc + vitest isolate list only.

## Constraints honored

- No non-test product source changes
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed APIs; no real network)
- Player-facing copy asserted only via selectors / structural prefixes already in code
- Hex Hard 450ms assert untouched
