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
| `src/ui/three/tablet-gl.ts` | 81.89% | 65.71% | _pending_ | _pending_ | | |
| `src/games/*/board-3d-loader.ts` (×8) | 0.00% | n/a | _pending_ | _pending_ | | |
| `src/ui/components/game-shell.ts` | 96.42% | 82.82% | _pending_ | _pending_ | | |
| `src/ui/game-selector.ts` | 96.46% | 78.57% | _pending_ | _pending_ | | |
| `src/ui/stats-dashboard.ts` | 99.34% | 100% | _pending_ | _pending_ | | |
| `src/core/safe-web-storage.ts` | 94.23% | 81.25% | _pending_ | _pending_ | | |
| `src/core/url-flags.ts` | 100% | 88.88% | _pending_ | _pending_ | | |
| `src/core/router.ts` | 96.87% | 90.00% | _pending_ | _pending_ | | |
| `src/core/storage/storage.ts` | 96.38% | 90.00% | _pending_ | _pending_ | | |
| `src/ui/board-a11y.ts` | 100% | 92.35% | _pending_ | _pending_ | | |
| `src/ui/player-colors.ts` | 100% | 94.11% | _pending_ | _pending_ | | |
| `src/ui/three/hex-a-gone-pieces.ts` | 93.33% | 85.71% | _pending_ | _pending_ | | |
| `src/core/polyomino/polyomino-ui.ts` | 100% | 83.63% | _pending_ | _pending_ | | |
| `src/core/owl/ollie-inspect-map.ts` | 94.36% | 97.05% | _pending_ | _pending_ | | |
| `src/core/owl/owl-events.ts` | 100% | 83.33% | _pending_ | _pending_ | | |
| `src/core/alignment/compat.ts` | 100% | 89.52% | _pending_ | _pending_ | | |
| `src/core/fractions/fraction-bar-ui.ts` | 100% | 85.71% | _pending_ | _pending_ | | |
| `src/core/graph/graph-ui.ts` | 95.07% | 90.12% | _pending_ | _pending_ | | |
| `src/core/dice/dice-ui.ts` | 99.29% | 93.10% | _pending_ | _pending_ | | |
| `src/core/tutorial.ts` | 96.75% | 82.89% | _pending_ | _pending_ | | |
| demos (expression/graph/polyomino/fraction/attribute) | see baseline | | _pending_ | _pending_ | | |

Before aggregate (target files above, excluding demos): lines **~86.5%** weighted by
uncovered statements concentrated in `tablet-gl` + eight `board-3d-loader`s at 0%.

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
# filled after full suite runs
```

## Constraints honored

- No non-test product source changes (vitest isolate list + tests + this doc only)
- No `ai/` or rules/engine behavior changes
- Deterministic (fake timers / stubbed APIs; no real network)
- Player-facing copy asserted only via selectors / structural prefixes already in code
- Hex Hard 450ms assert untouched
