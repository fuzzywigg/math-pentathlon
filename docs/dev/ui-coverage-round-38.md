# UI coverage round 38 (`q-mp-467`)

Characterization tests for residual arms under `src/games/remainder-islands`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post914` (remeasured; backlog wrote against tip
post898 — live tip already includes r20 `#845` fold). Draft only — tip owner
folds.

## Scope

Included: selection-visual null-preview + detached-hit `!hex` return; deselect
stroke restore; `syncBoard` missing-hex / valueText `??` fallback / chip
append without hit; empty-valid `skipNotice` status class path; `fillActiveChrome`
selected preview `board.before` + controls-missing append; stubbed
`performRoll` pre-selected rebuild preview; status recreate without dice;
detached Roll wrong-phase + computer-turn guards; stubbed non-null AI choice
chrome transition (structure only); computer-seat Enter/hover guards;
`destroyGame` render / `patchDivisionPreview` no-ops; `aiSelectIsland` stale
phase early return; tutorial `exited` path; bare root mount.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, board-3d layout product edits.

## Overlap with open drafts

| Draft                                                                | Action                                      |
| -------------------------------------------------------------------- | ------------------------------------------- |
| `#845` UI cov r20 remainder (base post785; already on tip)           | Prior round — leave open (`contained`)      |
| `#915`–`#919` / `#921` stars/pent/fiar/prime + backlog               | Orthogonal hosts — leave open (`contained`) |
| `#935` engine cov r15 (base post898)                                 | Orthogonal series — leave open              |
| `#939`/`#940` post914 emit-identity / dead-CSS                       | Orthogonal docs — leave open                |
| No open draft into `cursor/mp-tip-post914` owns remainder UI cov r38 | —                                           |

## Per-file / directory before → after

Focused remainder unit suite (`tests/unit/*remainder*` ± this round; not
full-repo map). Remeasured on tip post914 @ `753052a6`:

| File                                             | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/remainder-islands/board-ui.ts`        |       99.67% |          93.79% |    **100%** |     **96.89%** |    **+0.33** |       **+3.10** |
| `src/games/remainder-islands/game-controller.ts` |       94.41% |          85.96% |  **98.98%** |     **92.98%** |    **+4.57** |       **+7.02** |
| `src/games/remainder-islands` (directory)        |       97.31% |          91.01% |  **98.89%** |     **94.38%** |    **+1.58** |       **+3.37** |

Acceptance (measured coverage gain on focused suite) **met** via directory
**+1.58 pp** lines / **+3.37 pp** branches (controller **+4.57 / +7.02**).

Residual arms left intentional: score `p1El`/`p2El` null after
`replaceWithSafeHtml` (unreachable with current markup); controller
`wrapper.appendChild(preview)` when board is null inside the reuse path
(`:201`); computer-seat hit callback when listeners were already unbound
(`:330`). Focused directory still includes colder `ai.ts` residuals (out of
scope for this UI round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r38-remainder-islands.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r38-remainder-islands.test.ts
# Test Files  1 passed; Tests  5 passed; EXIT 0

npx vitest run --coverage --project unit-shared tests/unit/*remainder*
# (coverage gain documented above)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI + select/roll; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
