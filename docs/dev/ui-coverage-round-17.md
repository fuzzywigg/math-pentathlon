# UI coverage round 17 (`q-mp-296`)

Characterization tests for residual arms under `src/games/stars-bars`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. No Stars & Bars history cap.

**Base:** `cursor/mp-tip-post755` @ `02af5c56`. Draft only — tip owner folds.

## Scope

Included: shape SVG arms (circle/square/rectangle/triangle/hexagon + default
fallback); star/owner/last-move cell classes; `allowInput: false` board/hand
locks; placingCard valid-cell preview titles (incl. star adjacency); hand
selected/disabled/gameOver + Enter activate; uncapped history sparse-hole
continue; sparse board row/cell continue; human card→clear→place→pass→winner
banner; vsAI null-move pass + stubbed place (structure only); mid-timer
gameOver early return; `startTutorial` without activeContainer; stale
clear/pass/card/cell computer-turn guards; `newGame` difficulty without `#app`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / `ai.ts` / scoring edits, player-facing copy body
asserts, product `src/` edits, Stars & Bars history cap.

## Overlap with open drafts

| Draft                                                          | Action                                  |
| -------------------------------------------------------------- | --------------------------------------- |
| #770–#772 / #777 / #795 contig/fiar/kwatro/juggle/three UI cov | Orthogonal hosts — leave open           |
| #801 backlog `q-mp-296`                                        | Spec source; this PR implements         |
| Prior tip r4/r6/r7 stars-bars shells                           | Residual-only; did not edit those files |

## Per-file / directory before → after

Focused stars-bars unit suite (existing `*stars*` secondary/controller/a11y
suites ± this round’s suite; not full-repo map):

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/stars-bars/board-ui.ts`        |       95.05% |           90.9% |  **99.45%** |      **97.4%** |    **+4.40** |        **+6.5** |
| `src/games/stars-bars/game-controller.ts` |        85.4% |          81.01% |  **97.81%** |     **94.93%** |   **+12.41** |      **+13.92** |
| `src/games/stars-bars` (directory)        |       87.29% |           77.3% |  **91.47%** |     **82.89%** |    **+4.18** |       **+5.59** |

Acceptance (≥+2 pp directory lines on focused suite, or documented focused
gains) **met** via directory **+4.18 pp** lines.

## Tests added

- `tests/unit/burn-1009-ui-cov-r17-stars-bars.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1009-ui-cov-r17-stars-bars.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npm run lint
npm run typecheck
npm run lint:ratchet
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / history-cap changes
- Deterministic (fake timers / stubbed `getAIMove`; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
