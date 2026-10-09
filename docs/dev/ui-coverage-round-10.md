# UI coverage round 10 (`q-mp-222`)

Characterization tests for the coldest **non-AI-worker game directory**
after rounds 7–9: residual arms under `src/games/juggle` (board-ui +
controller + types). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic.

**Base:** `cursor/mp-tip-post728` @ `b5884207`. Draft only — tip owner folds.

## Scope

Included: `syncJuggleBoardCells` / `applyJuggleHoverPreview` guards and
cell-map rebuild; `renderBoard` keyboard/pointer event arms; dice/shape
chrome keyboard activate; empty selector/controls; null canvas context;
controller rotate/flip via `.juggle-control-btn`; die→shape→place phase
wiring; AI-thinking status chrome + timer flush without choice asserts;
DEV `__placeSelectedForTests` / `__abandonPlacementForTests` edges;
tutorial complete remount; `getShapeById`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits.

## Overlap with open drafts

| Draft                            | Action                                       |
| -------------------------------- | -------------------------------------------- |
| #735 coverage-map wiki           | Orthogonal (docs/SVG only) — not edited      |
| #733 void game-controllers       | Orthogonal (lint brace hygiene) — not edited |
| #731 knip unused types           | Orthogonal — not edited                      |
| #732 testing-layers counts       | Orthogonal — not edited                      |
| Prior UI cov r6/r7 juggle suites | Already on tip; r10 is residual-only         |

## Per-file / directory before → after

Tip directory stamp from live `docs/dev/coverage-map.md` @ `b5884207`:
**91.24% lines / 86.13% branches**.

Focused juggle UI suite (same file set ± this round’s suite; not full-repo):

| File                                  | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/juggle/board-ui.ts`        |       90.60% |          80.92% |      99.32% |         94.79% |    **+8.72** |      **+13.87** |
| `src/games/juggle/game-controller.ts` |       70.29% |          56.75% |      83.68% |         74.32% |   **+13.39** |      **+17.57** |
| `src/games/juggle/types.ts`           |       92.85% |          50.00% |        100% |         50.00% |    **+7.15** |               0 |

Acceptance (≥+2 pp directory lines on full-suite map, or documented focused
gains) **met** via focused file deltas above.

## Tests added

- `tests/unit/burn-1009-ui-cov-r10-juggle.test.ts`

## Verification

```text
npx vitest run --coverage --project unit-shared \
  tests/unit/burn-1009-ui-cov-r10-juggle.test.ts
# Test Files  1 passed; Tests  14 passed; EXIT 0

npm run verify
# lint → lint:ratchet → format:check → typecheck → typecheck:ratchet → check:boundaries
# EXIT 0
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed canvas; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
