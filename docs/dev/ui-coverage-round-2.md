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

| File | Before lines | Before branches | After lines | After branches |
|------|-------------:|----------------:|------------:|---------------:|
| `src/ui/game-prefetch.ts` | 46.26% | 45.94% | _pending_ | _pending_ |
| `src/main.ts` | 72.37% | 41.07% | _pending_ | _pending_ |
| `src/ui/three/load-three.ts` | 0.00% | n/a | _pending_ | _pending_ |
| `src/ui/owl/owl-component.ts` | 78.81% | 55.70% | _pending_ | _pending_ |
| `src/ui/game-error-boundary.ts` | 100% | 66.66% | _pending_ | _pending_ |
| `src/ui/coord-map.ts` | 100% | 77.41% | _pending_ | _pending_ |
| `src/pwa/idle-warm.ts` | 81.57% | 77.41% | _pending_ | _pending_ |
| `src/core/settings-flags.ts` | 88.88% | 87.50% | _pending_ | _pending_ |
| `src/ui/offline.ts` | 94.11% | 81.81% | _pending_ | _pending_ |
| `src/ui/pointer-hygiene.ts` | 94.01% | 81.66% | _pending_ | _pending_ |
| `src/demos/dice-demo.ts` | 87.50% | 50.00% | _pending_ | _pending_ |
| `src/core/alignment/highlight-ui.ts` | 100% | 70.73% | _pending_ | _pending_ |
| `src/core/dom-security.ts` | 97.72% | 77.27% | _pending_ | _pending_ |
| `src/core/storage/sanitize.ts` | 100% | 80.55% | _pending_ | _pending_ |
| `src/core/feature-flags.ts` | 100% | 71.42% | _pending_ | _pending_ |

## Overall (non-engine aggregate)

UI aggregate excluding `src/ui/three/*board*` (shell/helpers/owl/prefetch/pointer/offline +
`load-three` + `main` + listed core helpers) — filled after post-change coverage run.

| Scope | Before | After |
|-------|--------|-------|
| Target-file line coverage (sum covered/total) | _see table_ | _pending_ |
| Target-file branch coverage (sum covered/total) | _see table_ | _pending_ |

## Tests added

- `tests/unit/burn-1008-ui-cov-r2-prefetch.test.ts`
- `tests/unit/burn-1008-ui-cov-r2-shell-helpers.test.ts`
- `tests/unit/burn-1008-ui-cov-r2-owl-idle.test.ts`
- `tests/unit/burn-1008-ui-cov-r2-demos-highlight.test.ts`
- Extensions in `tests/unit/burn-1007-main-shell-routes.test.ts` (demo errors, retry, resolveAIDifficulty, missing `#app`)

## Constraints honored

- No non-test source changes
- No `ai/` or rules/engine files touched
- Deterministic (fake timers / stubbed MODE / mocked dynamic imports; no real network)
- Player-facing copy asserted only to locate elements (`data-testid`, roles)
- Hex Hard 450ms assert untouched
