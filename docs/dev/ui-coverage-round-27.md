# UI coverage round 27 (`q-mp-397`)

Characterization tests for residual arms under `src/games/contig-60`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Leave `contig-60/types.ts` no-shadow HOLD
to undrafted `q-mp-319`.

**Base:** `cursor/mp-tip-post865` (remeasured; backlog spec was written against
post830). Draft only — tip owner folds.

## Scope

Included: `renderBoard` undefined `BOARD_NUMBERS` row/cell continue arms;
post-destroy `newGame` / `updateUI` early-return + double destroy; AI-seat
disabled roll click guard; `makeAIMove` non-calculating early return via
stubbed `doRollDice`; stale expr/pass/cell wrong-phase guards; forged
pointer cell with non-placement value; AI null-placement → human handoff;
AI `placeChip` stay-calculating → wrong-phase `fromAI` roll; stale pass on
AI calculating seat; AI place → human handoff (no continue schedule); stale
expr/cell on AI calculating seat.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, AI-path file edits, `types.ts` no-shadow HOLD
(`q-mp-319`).

## Overlap with open drafts

| Draft                                                              | Action                                      |
| ------------------------------------------------------------------ | ------------------------------------------- |
| #770 contig UI cov r11 (`q-mp-248`, tip post748)                   | Already on tip as `burn-1009-ui-cov-r11-*` — leave open; comment contained |
| #774 mutation UI wave 7 contig (`q-mp-251`, tip post748)           | Already on tip — orthogonal survivors; leave open |
| #877 owl void brace (`q-mp-366`, tip post830)                      | Orthogonal host — leave open                |
| #878 hex UI cov r25 (`q-mp-371`, tip post830)                      | Orthogonal host (hex, not contig) — leave open |
| #879 backlog 10c (`q-mp-090l`, tip post830; lists 397)             | Spec inventory only — leave open            |
| No open draft into `cursor/mp-tip-post865` owns contig UI cov r27  | —                                           |

## Per-file / directory before → after

Focused contig UI suite (prior r5/r11/mutation-ui7/overnight contig UI tests ±
this round’s suite; not full-repo map). Tip `3908809d` (post865):

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/contig-60/board-ui.ts`         |       98.75% |          97.29% |    **100%** |       **100%** |    **+1.25** |       **+2.71** |
| `src/games/contig-60/game-controller.ts`  |       89.24% |          84.21% |  **96.20%** |     **95.61%** |    **+6.96** |      **+11.40** |
| UI pair (`board-ui` + `game-controller`)  |       94.03% |          89.36% |  **98.11%** |     **97.34%** |    **+4.09** |       **+7.98** |

Residual controller statements left intentional / unreachable without invalid
typed state or a public `__setStateForTests` hook: `formatEndBanner` /
phase-switch `never` arms (`:148–149`, `:192–193`), `updateStatus` null-container
defensive return (`:156`), and `makeAIMove` gameOver/wrong-seat early return
(`:310`) which is generation-gated before any public state poke can land.

Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round). Dedicated `*contig-60*` unit files on tip:
**6** (spec’s “8” was post830-stale).

## Tests added

- `tests/unit/burn-1010-ui-cov-r27-contig-60.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r27-contig-60.test.ts
# Test Files  1 passed; Tests  8 passed; EXIT 0

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI placement + rules; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
- Zero `src/` edits
