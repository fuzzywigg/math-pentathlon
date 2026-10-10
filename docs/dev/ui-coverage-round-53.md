# UI coverage round 53 (`q-mp-566`)

Characterization tests for residual arms under `src/games/ramrod`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts; no aria/label string pins. Stub AI only.

**Base:** `cursor/mp-tip-post977` @ `67cc7802` (remeasured; backlog “post949 /
0 dedicated ui-cov files / board-ui 379 LOC / controller 408 LOC” still holds
for dedicated `*ui-cov*ramrod*` basename count before this PR — live tip
already has broad overnight/burn ramrod hosts; this round closes remaining
board-ui soft-miss + controller lifecycle residuals). Draft only — tip owner
folds.

## Scope

Included: board-ui missing-box / ghost-rod continues; selectable hand click
wire; `ROD_COLORS` undefined legend skip; controller `newGame` + difficulty
keep; `#app` chrome miss; `destroyGame` / post-destroy paint drop; tutorial
no-mount / step soft-miss / exit / complete; human rod+slot wires; computer-
turn soft-miss on clear/pass/rod/box clicks; stubbed null `getAIMove` pass;
`makeAIMove` gameOver + cleared-`aiPlayer` soft-miss; capture history mount;
tie banner structure; player2 hand wire.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
aria/label string pins, product `src/` edits, ratchet JSON.

## Overlap with open drafts

| Draft                                                                 | Action                                  |
| --------------------------------------------------------------------- | --------------------------------------- |
| `#1002`–`#1011` into `cursor/mp-tip-post949` (orthogonal / prior tip) | Leave open — none own ramrod UI cov r53 |
| `#994`–`#991` UI r48–r51 (par-55 / hex-a-gone / sum-dominoes / frac)  | Other games — leave open (`contained`)  |
| Tip `#1012` `cursor/mp-tip-post977` → `alpha`                         | Tip fold marker — leave open            |
| No open draft into `cursor/mp-tip-post977` owns ramrod UI cov r53     | —                                       |

## Spec staleness

Backlog stamp (“**0** dedicated ui-cov files for ramrod; board-ui **379**
LOC; controller **408** LOC”) — LOC still holds; dedicated `*ui-cov*ramrod*`
count was **0** before this PR. Live tip already has many overnight/burn
ramrod suites; lines/branches below are the focused residual gaps this round
closes.

## Per-file / directory before → after

Focused ramrod unit-shared suite (`tests/unit/*ramrod*` under `unit-shared`).
Remeasured on tip `cursor/mp-tip-post977` @ `67cc7802`:

| File                                  | Before lines | Before branches | After lines |     After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------- | -----------: | --------------: | ----------: | -----------------: | -----------: | --------------: |
| `src/games/ramrod/board-ui.ts`        |       97.43% |             95% |    **100%** |           **100%** |    **+2.57** |          **+5** |
| `src/games/ramrod/game-controller.ts` |       71.33% |          62.02% |    **100%** | **98.73%** (78/79) |   **+28.67** |      **+36.71** |
| focused board-ui + controller         |       ~84.4% |          ~78.5% |    **100%** |         **~99.4%** |   **~+15.6** |      **~+20.9** |

Residual arms left intentional: controller status else-if alternate after
`placingRod` (`:166`) — unreachable without a new phase; placeholder
`update`/`newGame` stubs before assignment (`:110`/`:111`) — unreachable
without product changes. `ai.ts` / `rules.ts` colder residuals remain out of
scope for this UI round. No move-choice asserts. Hex Hard `hard: 450`
untouched.

## Tests added

- `tests/unit/burn-1010-ui-cov-r53-ramrod.test.ts` (18 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r53-ramrod.test.ts
# Test Files  1 passed; Tests  18 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*ramrod*
# board-ui → 100% lines / 100% branches
# game-controller → 100% lines / 98.73% branches

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run check:copy-pins
npm run check:dev-docs
npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / phase / state fields)
- No aria/label string pins
- No lint-ceiling / knip / ratchet JSON edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
