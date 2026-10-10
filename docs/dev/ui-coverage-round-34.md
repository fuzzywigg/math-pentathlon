# UI coverage round 34 (`q-mp-419`)

Characterization tests for residual arms under `src/games/prime-gold`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post898` (remeasured; backlog wrote against tip
post865 — live tip still has only **11** dedicated `*prime-gold*` unit files
pre-round; layout batch stays with open `#826`). Draft only — tip owner folds.

## Scope

Included: sparse-board cell hole (`if (cell)` false); Space/click valid-cell
activate; locked rolling dice (no roll btn); empty move-history shell; 3D
mount + rolling/placing `board3d.update` arms; create-time + update-time
placement callbacks (incl. post-destroy no-op); host persist across chrome
rebuild; context-lost → 2D fallback; loader reject → 2D; mid-load abort;
DEV `__mpPrimeGoldTest` getState/setState; stale AI timer after destroy;
tutorial `exited` path; `newGame` difficulty retain; stubbed AI null-place
pass (structure only); `!aiPlayer` mid-timer guard; bare-root `#app`-less
paint.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, board-3d layout product edits (owned by `#826` /
`q-mp-329`).

## Overlap with open drafts

| Draft                                                             | Action                                    |
| ----------------------------------------------------------------- | ----------------------------------------- |
| `#816` UI cov r18 prime-gold (base post755; already on tip)       | Prior round — leave open                  |
| `#826` prime-gold board-3d layout reads (`q-mp-329`)              | Layout product — leave open (`contained`) |
| `#894`/`#890`/`#892` contig/kings/hex-a-gone UI r27–r29           | Orthogonal hosts — leave open             |
| `#900`–`#913` post865 drafts (not yet on post898)                 | Orthogonal / other series — leave open    |
| No open draft into `cursor/mp-tip-post898` owns prime-gold UI r34 | —                                         |

## Per-file / directory before → after

Focused prime-gold unit suite (`tests/unit/*prime-gold*` +
`tests/unit/*prime*`; not full-repo map). Remeasured on tip post898:

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/prime-gold/board-ui.ts`        |         100% |          97.87% |    **100%** |       **100%** |        +0.00 |       **+2.13** |
| `src/games/prime-gold/game-controller.ts` |       76.32% |          63.28% |  **97.58%** |     **89.06%** |   **+21.26** |      **+25.78** |
| focused board-ui + controller             |       85.80% |          72.57% |  **98.55%** |     **92.00%** |   **+12.75** |      **+19.43** |
| `src/games/prime-gold` (directory)        |       89.05% |          83.17% |  **96.03%** |     **91.71%** |    **+6.98** |       **+8.54** |

Residual arms left intentional: `ensureBoard3d` early returns when already
mounted / host missing (`:112`/`:120`/`:134`) — require non-exported re-entry
or host cleared without destroy. Focused directory still includes colder
`ai.ts` / `rules.ts` residuals (out of scope for this UI round).
`board-3d-loader.ts` stays at 0% under this focused glob (mocked; real import
owned by tablet-gl loader suites).

## Tests added

- `tests/unit/burn-1010-ui-cov-r34-prime-gold.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r34-prime-gold.test.ts
# Test Files  1 passed; Tests  6 passed; EXIT 0

npx vitest run --project unit-shared \
  tests/unit/*prime-gold* tests/unit/*prime*
# (coverage gain documented above)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI / stubbed 3D; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
