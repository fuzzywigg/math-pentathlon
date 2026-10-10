# UI coverage round 15 (`q-mp-270`)

Characterization tests for residual **non-AI board-3d / tablet-gl** arms under
`src/ui/three` (prefer shared host lifecycle + coldest Kings / Hex / Pent /
Queens / Kwatro residuals after round 8).

**Base:** `cursor/mp-tip-post755` @ `74a1596f`. Draft only — tip owner folds.

## Scope

Included: tablet-gl paint/no-rAF + explicit-false flags + onHidden-only /
`mp3d-ready` event; Kings mount-fail / material+sync / pointer parent-walk /
dispose races; Hex `onWebglLost` / hover+focus+win mats / touch filter;
Pent ghost/win/last + Enter/Space activate; Queens nearest pick + material
matrix; Kwatro chip-prefer tap + nearest pick + win/scale.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms untouched),
`rules.ts` / scoring edits, player-facing copy body asserts, product `src/`
edits, `#764` canvas DPR layout binder file.

## Overlap with open drafts

| Draft | Action |
| --- | --- |
| #699 q-mp-167 UI cov r8 three | Contained on tip (r8 tests already folded); leave open with `contained` |
| #764 q-mp-258 canvas DPR/resize | Orthogonal — did not edit `canvas-dpr-resize-regression.test.ts` |
| #760 q-mp-244 dup-imports three | Orthogonal lint brace hygiene |

## Metrics

Measured with `npm run test:unit:coverage` then `npm run report:coverage-map`.
EXIT 1 from pre-existing `ai-move-time-midgame.bench.test.ts` only —
coverage summary still emitted (`reportOnFailure`).

| Metric | Before (tip `74a1596f` map) | After | Δ |
| --- | ---: | ---: | ---: |
| **`src/ui/three` lines** | **89.00%** | **93.90%** | **+4.90 pp** |
| **`src/ui/three` branches** | **68.98%** | **79.20%** | **+10.22 pp** |

Coldest residual after this round: `prime-gold-board-3d.ts` (88% lines /
65.28% branches) — left for a later round.

## Tests added

- `tests/unit/mp3d-ui-cov-r15-tablet-gl-residuals.test.ts`
- `tests/unit/mp3d-ui-cov-r15-kings-residuals.test.ts`
- `tests/unit/mp3d-ui-cov-r15-hex-pent-residuals.test.ts`
- `tests/unit/mp3d-ui-cov-r15-queens-kwatro-residuals.test.ts`

## Constraints honored

- Tests-only (+ short round doc; coverage-map regenerated after measure)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (mocked three.js, stubbed canvas 2d, no network)
