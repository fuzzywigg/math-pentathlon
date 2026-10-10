# UI coverage round 59 (`q-mp-595`)

Characterization tests for residual arms under `src/games/calla`
(board-ui + controller + tutorial skeleton). Prefer UI rendering / event
wiring / state-display chrome over `rules.ts` / `ai.ts` product logic.
No AI move-choice / timing / scoring / legal-move outcome asserts; no
player-facing copy / aria-label / label text pins. Stub the AI. Hex Hard
450ms untouched.

**Base:** `cursor/mp-tip-post1012` @ `aa049fc2` (remeasured; backlog named
tip post977 / r42 baseline — board-ui already **100%** lines/branches on
post1012; controller **100%** lines / **98.21%** branches with one
intentional dead OR residual). Draft only — tip owner folds.

## Scope

Included: empty-history last-move omission + `.calla-pit-hit` targets;
winner class precedence over thinking flag; p2 score `.active` class;
non-activate key early-return on pit keyboard bind; tutorial id / step-id
skeleton (no title/message pins); HvAI free-turn stay skips AI consult
(stubbed `makeMove` / `getAIMove`); thinking disarms `.calla-pit-valid`;
destroy mid-think invalidates AI generation gate; `#app` opponent chrome
toggle AI ↔ human.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy / aria-label /
label text pins, product `src/` edits, ratchet JSON. Leave prior calla
rounds / `#1009`/`566`–`567` / r42 `#934`/`471` open with **contained**
(no comments).

## Overlap with open drafts

| Draft                                                              | Action                                      |
| ------------------------------------------------------------------ | ------------------------------------------- |
| `#1024`–`#1034` into `cursor/mp-tip-post1012` (orthogonal hosts)   | Leave open — none own calla UI cov r59      |
| Prior calla UI cov r19 / r42 + overnight wave50–62 hosts           | Prior rounds — leave open (**contained**)   |
| No open draft into `cursor/mp-tip-post1012` owns calla UI cov r59  | —                                           |

## Spec staleness

Backlog stamp (“Last dedicated ui-cov **r42**; board-ui **451** LOC;
controller **280** LOC”) — LOC still holds on post1012. Live tip already
has broad overnight/burn/r19/r42 calla suites; board-ui lines/branches
were already **100%** on the focused `*calla*` host set. Controller keeps
one intentional binary-expr OR residual (see below).

## Per-file / directory before → after

Focused calla unit suite (`tests/unit/*calla*`; not full-repo map).
Remeasured on tip post1012 @ `aa049fc2`:

| File                                 | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/calla/board-ui.ts`        |   100% (207) |      100% (70) |    **100%** |       **100%** |         0.00 |            0.00 |
| `src/games/calla/game-controller.ts` |   100% (114) |  98.21% (55/56) |  **100.00** |     **98.21** |         0.00 |            0.00 |
| `src/games/calla` (directory)        | 98.19% (650) | 94.59% (332/351) |  **98.19%** |     **94.59%** |         0.00 |            0.00 |

Residual arm left intentional: controller binary-expr OR arm at `:134`
(`currentPlayer === 'player2'` right-hand of free-turn trigger guard) is
dead once the preceding `currentPlayer === 'player2'` conjunct holds.
Focused directory still includes colder `ai.ts` residuals (out of scope
for this UI round). Round 59 adds structural chrome characterization
without product edits — coverage ceiling already reached for UI hosts.

LOC (post1012 head): board-ui **451**; controller **280**.

## Tests added

- `tests/unit/burn-1010-ui-cov-r59-calla.test.ts` (8 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r59-calla.test.ts
# Test Files  1 passed; Tests  8 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*calla*
# board-ui 100/100; controller 100/98.21 (intentional OR residual)

npm run test:unit:coverage
# (full map; calla UI hosts unchanged at ceiling)

npm run check:copy-pins
# report-only EXIT 0 (no new findings from this round)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard / product `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy / aria-label / label text pins (classes /
  element presence / dataset / step ids only)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
