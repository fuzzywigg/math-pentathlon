# UI coverage round 14 (`q-mp-269`)

Characterization tests for residual arms under `src/games/juggle`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post748` @ `1fba62bb`. Draft only — tip owner folds.

## Scope

Included: sync/hover `preview-invalid` (OOB domino); mouseleave non-cell;
sparse/out-of-range dice face arms; styles idempotent; phase/seat guards via
detached listeners (roll / die / shape / rotate / flip / cell); hover/leave
without boards (updateUI rebuild) + post-destroy null-container; fresh p2
board create callbacks; vsAI `makeAIMove` null-choice + stubbed
rotation/flip place path (structure only); selectingShape chrome;
`__placeSelectedForTests` non-rotate + jammed-board false.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits.

## Overlap with open drafts

| Draft                                     | Action                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| #744 juggle UI cov r10                    | Already on tip; r14 is residual-only — leave open (`contained`)                |
| #745 mutation UI wave 6 (juggle board-ui) | Orthogonal separate file — did not edit `mutation-ui6-juggle-board-ui.test.ts` |
| #770–#772 contig/fiar/kwatro UI cov       | Orthogonal hosts                                                               |

## Per-file / directory before → after

Tip directory stamp from live `docs/dev/coverage-map.md` @ tip:
**91.17% lines / 86.08% branches** (`src/games/juggle`).

Focused juggle unit suite (all `*juggle*` tests ± this round’s suite; not
full-repo map):

| File                                  | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/juggle/board-ui.ts`        |       99.33% |          95.37% |    **100%** |     **98.26%** |    **+0.67** |       **+2.89** |
| `src/games/juggle/game-controller.ts` |       85.89% |          76.35% |  **92.94%** |     **86.48%** |    **+7.05** |      **+10.13** |
| `src/games/juggle` (directory)        |       94.63% |          88.66% |  **96.95%** |     **92.10%** |    **+2.32** |       **+3.44** |

Acceptance (≥+2 pp directory lines on focused suite, or documented focused
gains) **met** via directory **+2.32 pp** lines.

## Tests added

- `tests/unit/burn-1009-ui-cov-r14-juggle.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1009-ui-cov-r14-juggle.test.ts
# Test Files  1 passed; Tests  8 passed; EXIT 0

npm run lint
npm run typecheck
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed canvas + AI returns; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
