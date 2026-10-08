# UI coverage round 4 (`burn-1008-mp-ui-coverage-round-4`)

Characterization tests for the next lowest-covered **non-engine, non-AI** modules
after round 3 (#571), stacked on tip `cursor/integration-fold-wave5-tip-4af0`.

**Stacks on #571; fold after #571.**

## Scope

Included: shell / controllers (juggle, kwatro-sinko, pent-em-in, kings-quadraphages,
stars-bars, contig-60, fiar, star-track, calla), renderers (`juggle/board-ui`,
`fiar/board-ui`, `fiar/layout`, `kings-quadraphages/board-renderer`), storage-adjacent
helpers (`polyomino/placement`), owl message select residuals, PWA/offline/reduced-motion
glue, demo residual mounts.

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
| `src/games/juggle/game-controller.ts` | 74.44% | 60.48% | TBD | TBD | TBD | TBD |
| `src/games/juggle/board-ui.ts` | 80.42% | 74.21% | TBD | TBD | TBD | TBD |
| `src/games/kwatro-sinko/game-controller.ts` | 75.28% | 67.10% | TBD | TBD | TBD | TBD |
| `src/games/pent-em-in/game-controller.ts` | 79.16% | 59.50% | TBD | TBD | TBD | TBD |
| `src/games/kings-quadraphages/game-controller.ts` | 78.07% | 66.94% | TBD | TBD | TBD | TBD |
| `src/games/kings-quadraphages/board-renderer.ts` | 94.87% | 83.33% | TBD | TBD | TBD | TBD |
| `src/games/stars-bars/game-controller.ts` | 80.62% | 68.05% | TBD | TBD | TBD | TBD |
| `src/games/contig-60/game-controller.ts` | 84.13% | 64.70% | TBD | TBD | TBD | TBD |
| `src/games/fiar/game-controller.ts` | 86.04% | 73.61% | TBD | TBD | TBD | TBD |
| `src/games/fiar/board-ui.ts` | 90.90% | 84.33% | TBD | TBD | TBD | TBD |
| `src/games/fiar/layout.ts` | 98.00% | 86.95% | TBD | TBD | TBD | TBD |
| `src/games/star-track/game-controller.ts` | 86.87% | 76.08% | TBD | TBD | TBD | TBD |
| `src/games/calla/game-controller.ts` | 88.33% | 79.68% | TBD | TBD | TBD | TBD |
| `src/core/owl/owl-messages.ts` | 95.34% | 95.74% | TBD | TBD | TBD | TBD |
| `src/core/polyomino/placement.ts` | 100% | 90.09% | TBD | TBD | TBD | TBD |
| `src/ui/offline.ts` | 94.11% | 81.81% | TBD | TBD | TBD | TBD |
| `src/ui/reduced-motion.ts` | 90.00% | 92.85% | TBD | TBD | TBD | TBD |
| `src/pwa/bootstrap.ts` | 100% | 75.00% | TBD | TBD | TBD | TBD |
| `src/demos/fraction-demo.ts` | 100% | 78.84% | TBD | TBD | TBD | TBD |
| `src/demos/polyomino-demo.ts` | 96.60% | 88.00% | TBD | TBD | TBD | TBD |

\* TBD cells filled after post-change `npm run test:unit:coverage`.

## Overall (target-file aggregate)

| Metric | Before | After | Δ |
|--------|--------|-------|---|
| **Lines** | *(pending after coverage)* | | |
| **Branches** | *(pending after coverage)* | | |

Repo-wide unit coverage (all `src/**`) before (tip+#571): statements 92.65%, branches 85.39%, lines 94.37%.

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
# filled after full suite — see PR body
npm run lint
npx tsc --noEmit
npm run test:unit
npm run test:unit:coverage
```

`git diff --name-only` vs tip+#571 merge: tests + this doc only.

## Constraints honored

- No non-test product source changes
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed APIs; no real network)
- No player-facing copy assertions (structural selectors / classes only)
- Hex Hard 450ms assert untouched
- Tip-owner AI/tutorial/status restore work left alone
