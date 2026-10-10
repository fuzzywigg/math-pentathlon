# UI coverage round 23 (`q-mp-369`)

Characterization tests for residual arms under `src/games/fraction-pinball`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post830`. Draft only — tip owner folds.

## Scope

Included: `renderChallenge` no-challenge + `allowInput: false` disabled
choices; `renderGameOver` player2 / draw chrome; `renderScores` player2
active seat; `getPlayerName` seat-key inequality; style inject idempotence;
bare mount without `#app`; stale choice/continue phase guards; post-destroy
paint drop; computer-answering input guard; AI think gen cancel; null AI →
`choices[0]` / `correctAnswer` fallbacks; empty-choice soft return; `aiTurn`
phase / null-challenge guards; continue when phase ≠ `showResult`; continue
gen cancel via `newGame` bump; stacked continue clear via re-entered think
callback; tutorial exit + complete lifecycle.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, AI-path file edits.

## Overlap with open drafts

| Draft                            | Action                                        |
| -------------------------------- | --------------------------------------------- |
| #852 queens-guards AI harness    | Orthogonal (test-harness) — leave open        |
| #851 backlog 10b (includes 369)  | Spec only — leave open                        |
| #845 remainder UI cov r20        | Orthogonal host — leave open                  |
| #848 par-55 UI cov r21           | Orthogonal host — leave open                  |
| #846 game-route-mounts soft-fail | Orthogonal host — leave open                  |
| No open draft into post830       | Owns fraction-pinball board-ui/controller r23 |

## Per-file / directory before → after

Focused pinball UI suite (prior UI/handshake/controller tests ± this
round’s suite; not full-repo map):

| File                                            | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/fraction-pinball/board-ui.ts`        |       99.24% |          93.54% |    **100%** |       **100%** |    **+0.76** |       **+6.46** |
| `src/games/fraction-pinball/game-controller.ts` |       87.82% |          70.17% |    **100%** |     **96.49%** |   **+12.18** |      **+26.32** |
| UI pair (`board-ui` + `game-controller`)        |       93.95% |           78.4% |    **100%** |     **97.72%** |    **+6.05** |      **+19.32** |
| `src/games/fraction-pinball` (directory)        |       91.81% |          79.26% |  **95.28%** |     **88.41%** |    **+3.47** |       **+9.15** |

Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round). Two defensive controller branch arms at
lines 177/246 remain under V8 (`??` chain / tutorial event compound).

## Tests added

- `tests/unit/burn-1010-ui-cov-r23-fraction-pinball.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r23-fraction-pinball.test.ts
# Test Files  1 passed; Tests  4 passed; EXIT 0

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
