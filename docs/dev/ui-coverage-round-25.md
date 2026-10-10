# UI coverage round 25 (`q-mp-371`)

Characterization tests for residual arms under `src/games/hex`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post830`. Draft only — tip owner folds.

## Scope

Included: sparse-board undefined row/cell continue arms; winner status chrome
for HvH + HvA (class presence only); AI-thinking status class; `aiSeat=player1`
placement lock; controller click guards (thinking / winner / computer seat);
human vertical-win owl notify + HvH reset; AI reject catch; generation bump
mid-flight drop; AI-win owl notify; tutorial exited unsubscribe.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Skip `ai*.ts` / `rules.ts`.

## Overlap with open drafts

| Draft                         | Action                                      |
| ----------------------------- | ------------------------------------------- |
| #870 frac-fact UI cov r26     | Orthogonal host — leave open                |
| #868 pinball UI cov r23       | Orthogonal host — leave open                |
| #867 fab-a-diffy UI cov r22   | Orthogonal host — leave open                |
| #876 engine cov r12           | Orthogonal series — leave open              |
| #875/#872 mutation UI w11/w12 | Orthogonal hosts — leave open               |
| Other post830 tip drafts      | No hex board-ui/controller UI cov r25 draft |

## Per-file / directory before → after

Focused hex board-ui + controller unit suite (prior hex UI/handshake/
controller tests ± this round’s suite; not full-repo map):

| File                                  | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/hex/board-ui.ts`           |       97.01% |          80.88% |    **100%** |     **98.52%** |    **+2.99** |      **+17.64** |
| `src/games/hex/game-controller.ts`    |       91.58% |          77.08% |    **100%** |     **95.83%** |    **+8.42** |      **+18.75** |
| focused board-ui + controller         |       95.12% |          79.31% |    **100%** |     **97.41%** |    **+4.88** |      **+18.10** |

Coverage-map tip stamp had directory lines **92.83%** under an older full
unit suite (includes colder `ai.ts` / `rules.ts` out of scope here). This
round documents focused UI residual gain only.

## Tests added

- `tests/unit/burn-1010-ui-cov-r25-hex.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r25-hex.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI client; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
