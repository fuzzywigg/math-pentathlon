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

Tip directory stamp from live `docs/dev/coverage-map.md` @ `b5884207`
(91.24% lines / 86.13% branches). File-level before/after from focused
juggle UI suites (same file set ± this round’s suite) and full
`npm run test:unit:coverage` after (see PR body for final table once CI /
local full coverage completes).

| Scope                             | Before lines | Before branches | Notes           |
| --------------------------------- | -----------: | --------------: | --------------- |
| `src/games/juggle` (dir, tip map) |       91.24% |          86.13% | tip `b5884207`  |
| `board-ui.ts` (focused UI suite)  |       90.60% |          80.92% | pre-r10 focused |
| `game-controller.ts` (focused)    |       70.29% |          56.75% | pre-r10 focused |

## Tests added

- `tests/unit/burn-1009-ui-cov-r10-juggle.test.ts`

## Verification

```text
npx vitest run --coverage --project unit-shared \
  tests/unit/burn-1009-ui-cov-r10-juggle.test.ts
# Test Files  1 passed; Tests  14 passed

npm run verify
# lint → lint:ratchet → format:check → typecheck → typecheck:ratchet → check:boundaries
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed canvas; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
