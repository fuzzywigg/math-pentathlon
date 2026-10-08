# UI coverage round 2 (`burn-1008-mp-ui-coverage-round-2`)

Characterization tests for the lowest-covered **non-engine, non-AI** modules on tip
`cursor/integration-fold-wave5-tip-4af0`, without duplicating #510’s focus set unless
branch coverage was still under 50%.

## Scope

Included: `src/ui/` (incl. owl, shell helpers, pointer, offline, prefetch), `src/pwa/`,
`src/main.ts`, storage sanitize / settings flags, dom-security, demos/dice-demo,
alignment highlight-ui, `load-three`.

Excluded: `src/games/**/rules.ts`, `**/ai.ts`, `ai-worker`, and heavy Three board
implementations (left to existing mp3d suites). Parallel engine work is #562.

## #510 overlap

| #510 file | Tip before (lines / branches) | Round-2 action |
|-----------|-------------------------------|----------------|
| `src/ui/game-prefetch.ts` | 46.3% / 45.9% | **Added** — under 50% branch |
| `src/main.ts` | 72.4% / 41.1% | **Added** — under 50% branch |
| `src/ui/game-route-mounts.ts` | 100% / 70.5% | Skipped (≥50% branch) |
| `src/pwa/bootstrap.ts` | 100% / 75% | Skipped |
| `src/pwa/bootstrap-owl.ts` | 100% / 100% | Skipped |
| `src/ui/reduced-motion.ts` | 90% / 92.9% | Skipped |
| `src/pwa/idle-warm.ts` | 81.6% / 77.4% | Deepened default import paths |
| `src/pwa/register.ts` | 100% / 91.7% | Skipped |

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip (before) and this branch (after).

| File | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/ui/game-prefetch.ts` | 46.26% | 45.94% | 97.01% | 81.08% | +50.75 | +35.14 |
| `src/main.ts` | 72.37% | 41.07% | 85.63% | 57.14% | +13.26 | +16.07 |
| `src/ui/three/load-three.ts` | 0.00% | n/a | 100.00% | n/a | +100.00 | — |
| `src/ui/owl/owl-component.ts` | 78.81% | 55.70% | 89.23% | 67.78% | +10.42 | +12.08 |
| `src/ui/game-error-boundary.ts` | 100% | 66.66% | 100% | 83.33% | 0 | +16.67 |
| `src/ui/coord-map.ts` | 100% | 77.41% | 100% | 93.54% | 0 | +16.13 |
| `src/pwa/idle-warm.ts` | 81.57% | 77.41% | 94.73% | 90.32% | +13.16 | +12.91 |
| `src/core/settings-flags.ts` | 88.88% | 87.50% | 100% | 100% | +11.12 | +12.50 |
| `src/core/alignment/highlight-ui.ts` | 100% | 70.73% | 100% | 95.12% | 0 | +24.39 |
| `src/core/dom-security.ts` | 97.72% | 77.27% | 100% | 86.36% | +2.28 | +9.09 |
| `src/core/storage/sanitize.ts` | 100% | 80.55% | 100% | 90.27% | 0 | +9.72 |
| `src/ui/pointer-hygiene.ts` | 94.01% | 81.66% | 97.43% | 83.33% | +3.42 | +1.67 |
| `src/ui/offline.ts` | 94.11% | 81.81% | 94.11% | 81.81% | 0* | 0* |
| `src/demos/dice-demo.ts` | 87.50% | 50.00% | 87.50% | 50.00% | 0* | 0* |
| `src/core/feature-flags.ts` | 100% | 71.42% | 100% | 71.42% | 0* | 0* |

\* Exercised in suite; remaining miss is `typeof document/window === 'undefined'` (non-jsdom) or already-covered callback bodies. Counted toward the 15-file characterization set; **12 files show meaningful % gains**.

## Overall (target-file aggregate)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| **Lines** | **86.47%** (1170/1353) | **93.79%** (1269/1353) | **+7.32 pp** |
| **Branches** | **66.77%** (448/671) | **77.50%** (520/671) | **+10.73 pp** |

Repo-wide unit coverage (all `src/**`): statements 91.99%→92.44%, branches 84.4%→85.0%, lines 94.15%→94.60%.

## Tests added

- `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`
- `tests/unit/burn-1008-ui-cov-r2-shell-helpers.test.ts`
- `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`
- `tests/unit/burn-1008-ui-cov-r2-demos-highlight.test.ts`
- Extensions in `tests/unit/burn-1007-main-shell-routes.test.ts` (demo errors, retry, resolveAIDifficulty, missing `#app`)

## Verification

```text
npm run lint                          # exit 0
npx tsc --noEmit                      # exit 0
npm run build                         # exit 0
npm run test:unit                     # 3108 files; 11761 passed | 11 skipped
npm run test:unit                     # identical second run (no flake)
npm run test:unit:coverage            # exit 0; metrics above
```

`git diff --name-only` vs tip: tests + this doc only.

## Constraints honored

- No non-test source changes
- No `ai/` or rules/engine files touched
- Deterministic (fake timers / stubbed MODE / mocked dynamic imports; no real network)
- Player-facing copy asserted only to locate elements (`data-testid`, roles)
- Hex Hard 450ms assert untouched
