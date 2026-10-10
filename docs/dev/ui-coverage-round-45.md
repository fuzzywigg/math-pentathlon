# UI coverage round 45 (`q-mp-500`)

Characterization tests for residual arms under `src/games/fraction-pinball`
(board-ui soft edges + controller). Prefer UI rendering / event wiring /
state-display over `rules.ts` / `ai.ts` product logic. No AI move-choice /
timing asserts; no player-facing copy body asserts.

**Base:** `cursor/mp-tip-post914` @ `f5d3d04a` (remeasured @ `b3f00cc9`; tip then folded `#943`). Draft only — tip owner folds.

## Scope

Included: `decimalToFraction` challenge chrome; `renderResult` early-return;
SVG board structural pins; player1 gameOver / active seat scores; vs-AI
`#app` chrome; nullish `?? null` AI fallback soft-return (controller L177);
idle / idempotent `destroyGame`; tutorial `step-changed` soft-miss on the
`completed||exited` compound (L246 — `start()` does not emit `step-changed`);
exit / complete lifecycle; forged player1 seat guard during computer think.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, AI-path file edits.

## Overlap with open drafts

| Draft                                                                  | Action                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------ |
| #868 / `q-mp-369` r23 (post830)                                        | Prior fraction-pinball UI round — leave open (**contained**) |
| #915–#919 / #921 / #934 series                                         | Orthogonal hosts / backlog — leave open                      |
| #948 juggle r43 / #952 calla r42 / #951 remainder r38 / #953 three r41 | Orthogonal hosts — leave open                                |
| No open draft into post914                                             | Owns fraction-pinball board-ui/controller r45                |

## Spec staleness

Backlog stamp (“**6** dedicated `*fraction-pinball*` unit-file matches;
board-ui **650** LOC”) still holds on tip before this PR. Live remeasure
showed board-ui / tutorial / types already **100%**; sole UI residual was
`game-controller.ts` branches **55/57** (L177 `??` → null, L246
`step-changed` soft-miss).

## Per-file / directory before → after

Focused pinball UI suite (prior UI/handshake/controller tests ± this
round’s suite; not full-repo map):

| File                                            | Before lines | Before branches | After lines |   After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------------- | -----------: | --------------: | ----------: | ---------------: | -----------: | --------------: |
| `src/games/fraction-pinball/board-ui.ts`        |         100% |            100% |    **100%** |         **100%** |            0 |               0 |
| `src/games/fraction-pinball/game-controller.ts` |         100% |  96.49% (55/57) |    **100%** | **100%** (57/57) |            0 |       **+3.51** |
| UI pair (`board-ui` + `game-controller`)        |         100% |          ~97.7% |    **100%** |         **100%** |            0 |       **+~2.3** |

Focused directory still includes colder `ai.ts` / `rules.ts` residuals
(out of scope for this UI round). Controller branch residuals from r23
(L177 / L246) are closed.

## Tests added

- `tests/unit/burn-1010-ui-cov-r45-fraction-pinball.test.ts` (4 tests)

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r45-fraction-pinball.test.ts
# Test Files  1 passed; Tests  4 passed; EXIT 0

npx vitest run --project unit-shared \
  tests/unit/*fraction-pinball* tests/unit/*pinball*
# (see PR body for full counts)

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
