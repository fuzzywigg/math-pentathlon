# UI coverage round 8 (`q-mp-167`)

Characterization tests for the coldest **non-AI board-3d / tablet-gl** arms under
`src/ui/three`, stacked on tip `cursor/mp-tip-post598`.

**Primary measurement base:** tip @ `7922f9af` (pre-fold). Rebased onto tip
@ `baccd195` before merge readiness (includes #686 r7 + #683 three/ nnnull).

**Base:** `cursor/mp-tip-post598`. Draft only — tip owner folds.

## Scope

Included: residual a11y activate, pointer/raycast tap, hover, update material
arms, wood/number texture 2d paths, tablet-gl residual flags, pure layout helpers
(`axialToWorld`, `ringPosToWorld`, `parseKwatroNodeId`, `nodeToWorld`,
`collectPathwayEdgeKeys`).

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms untouched),
`rules.ts` / scoring, player-facing copy, Hex Hard, product `src/` edits.
Avoids overlap with open #686 (r7 controllers) and #648 (r6 controllers/owl/pwa).

## Per-file before → after

Measured with `npm run test:unit:coverage` on tip `7922f9af` (before) and this
branch (after). Same suite both times; EXIT 1 from pre-existing
`ai-move-time-midgame.bench.test.ts` (writes `docs/ai-move-time-2026-10-07.md`)
— coverage summary still emitted (`reportOnFailure`).

| File | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
|------|-------------:|----------------:|------------:|---------------:|-------------:|----------------:|
| `src/ui/three/hex-a-gone-board-3d.ts` | 74.47% | 40.90% | 89.48% | 68.93% | +15.01 | +28.03 |
| `src/ui/three/prime-gold-board-3d.ts` | 80.43% | 53.38% | 89.13% | 67.79% | +8.70 | +14.41 |
| `src/ui/three/queens-guards-board-3d.ts` | 76.47% | 62.92% | 85.16% | 69.10% | +8.69 | +6.18 |
| `src/ui/three/kwatro-sinko-board-3d.ts` | 76.72% | 67.97% | 85.27% | 72.47% | +8.55 | +4.50 |
| `src/ui/three/fiar-board-3d.ts` | 86.81% | 59.00% | 94.13% | 74.00% | +7.32 | +15.00 |
| `src/ui/three/pent-em-in-board-3d.ts` | 83.22% | 45.37% | 90.26% | 57.40% | +7.04 | +12.03 |
| `src/ui/three/kings-quadraphages-board-3d.ts` | 81.41% | 48.64% | 88.05% | 54.95% | +6.64 | +6.31 |
| `src/ui/three/star-track-board-3d.ts` | 92.00% | 62.80% | 96.72% | 84.29% | +4.72 | +21.49 |
| `src/ui/three/tablet-gl.ts` | 88.79% | 77.14% | 91.37% | 80.00% | +2.58 | +2.86 |

**9 files show ≥1 pp lines gains** (acceptance: directory ≥+2 pp **or** ≥6 files).

Unchanged at 100%: `load-three.ts`, `kings-quadraphages-pieces.ts`,
`queens-guards-pieces.ts`. `hex-a-gone-pieces.ts` unchanged at 93.33%.

## Directory / repo-wide

| Metric | Before (tip `7922f9af`) | After | Δ |
|--------|-------------:|------:|--:|
| **`src/ui/three` lines** | **81.61%** | **89.66%** | **+8.05 pp** |
| **`src/ui/three` branches** | **57.70%** | **69.81%** | **+12.11 pp** |
| Repo lines | 93.60% (21738/23224) | 94.58% (21966/23224) | +0.98 pp |
| Repo branches | 86.15% (10695/12413) | 87.27% (10833/12413) | +1.12 pp |

Post-rebase on tip `baccd195` (with this PR’s tests): `src/ui/three` **89.00%**
lines / **68.98%** branches (totals shifted by tip #683 three/ edits); map
regenerated from that run.

## Tests added

- `tests/unit/helpers/mp3d-three-mock.ts`
- `tests/unit/mp3d-ui-cov-r8-layout-helpers.test.ts`
- `tests/unit/mp3d-ui-cov-r8-tablet-gl-residuals.test.ts`
- `tests/unit/mp3d-ui-cov-r8-board-a11y-pointer.test.ts`
- `tests/unit/mp3d-ui-cov-r8-board-update-arms.test.ts`

## Verification

```text
npx vitest run --project unit-isolated tests/unit/mp3d-ui-cov-r8-*.test.ts
# Test Files  4 passed; Tests  23 passed; EXIT 0

npm run test:unit:coverage
# EXIT 1 — pre-existing ai-move-time-midgame.bench.test.ts failure only
# src/ui/three lines 81.61% → 89.66%; see table above

npm run report:coverage-map
# EXIT 0; rewrote docs/dev/coverage-map.md + .svg
```

## Constraints honored

- Tests-only (+ regenerated coverage-map)
- No AI / rules / copy / Hex Hard changes
- Deterministic (mocked three.js, stubbed canvas 2d, no network)
