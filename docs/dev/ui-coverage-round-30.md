# UI coverage round 30 (`q-mp-400`)

Characterization tests for residual arms under `src/games/sum-dominoes`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post865` (remeasured; backlog wrote against tip
post830). Draft only — tip owner folds.

## Scope

Included: sparse-board row skip; unknown pip-face fallback; inject
idempotence; disabled/enabled roll chrome; empty non-current hand; post-destroy
paint drop; `startTutorial` without mount; player2 hand select; stale human
Roll/hand/cell/Pass handlers under computer seat; tutorial roll
`handleAction` + `refreshHighlight`; stubbed AI controller arms (winner /
null-seat early returns, roll recurse, placing consult, pass seat flip);
`newGame` difficulty retain without `#app`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, `bundle-budgets.json`, AI-path file edits.

## Overlap with open drafts

| Draft                                                         | Action                                  |
| ------------------------------------------------------------- | --------------------------------------- |
| #877 owl void-brace (`q-mp-366`, base post830)                | Orthogonal — leave open                 |
| #878 hex UI cov r25 (`q-mp-371`, base post830)                | Orthogonal host — leave open            |
| #879 backlog 10c (`q-mp-090l`, includes this ticket)          | Spec only — leave open                  |
| #854 bundle headroom (sum-dominoes −77 B)                     | Orthogonal docs — leave open            |
| No open draft into `cursor/mp-tip-post865` owns sum-dominoes UI cov r30 | —                              |

## Per-file / directory before → after

Focused sum-dominoes unit suite (prior overnight/burn/playability/controller
tests ± this round’s suite; not full-repo map). Remeasured on tip post865:

| File                                         | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| -------------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/sum-dominoes/board-ui.ts`         |       99.35% |          94.33% |    **100%** |     **98.11%** |    **+0.65** |       **+3.78** |
| `src/games/sum-dominoes/game-controller.ts`  |       89.37% |          80.89% |    **100%** |     **96.62%** |   **+10.63** |      **+15.73** |
| `src/games/sum-dominoes` (directory)         |       96.08% |          89.96% |  **99.44%** |     **95.14%** |    **+3.36** |       **+5.18** |

Residual arms left intentional: board-ui V8 `if` arm without stable line;
controller stub `update`/`newGame` placeholders before assignment (`:109`/
`:110`); a few compound branches under V8.

Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r30-sum-dominoes.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r30-sum-dominoes.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npm run verify
# EXIT 0 (lint → lint:ratchet → format:check → typecheck →
#         typecheck:ratchet → check:boundaries)

npm run test:unit
# Test Files  3211 passed; Tests  12774 passed | 36 skipped; EXIT 0
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
