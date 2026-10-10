# UI coverage round 22 (`q-mp-368`)

Characterization tests for residual arms under `src/games/fab-a-diffy`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. **Do not** edit `cancelFabAiRequests`
(owned by `q-mp-253`).

**Base:** `cursor/mp-tip-post830`. Draft only — tip owner folds.

## Scope

Included: `allowInput:false` bar/op/answer chrome suppression; history
missing-id continue; answer-board null-result matchable arm; bar-pool
defensive denom `Map.get` continue; style inject idempotence; post-destroy
paint drop; `startTutorial` without mount; tutorial exit unsubscribe;
answer click wrong-phase guard with forged matchable chrome; confirmingMove
`scrollIntoView` rAF arm; `newGame` difficulty `||` preserve; stubbed
`getAIMoveAsync` winner early return / reject→pass / stale state / generation
bump ignore / non-null apply (structure only). Bare mount without `#app`.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, `cancelFabAiRequests`, AI-path file edits.

## Overlap with open drafts

| Draft                            | Action                                      |
| -------------------------------- | ------------------------------------------- |
| #852 queens-guards harness       | Orthogonal (calibration flake) — leave open |
| #851 Oct 10b backlog (lists 368) | Spec inventory only — leave open            |
| No open draft into post830 tip   | This ticket owns fab UI cov r22             |
| Older fab burn/overnight waves   | Residual arms only; no file collision       |

## Per-file / directory before → after

Focused fab unit suite (`tests/unit/*fab*` + `*diffy*` ± this round’s suite;
not full-repo map):

| File                                       | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ------------------------------------------ | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/fab-a-diffy/board-ui.ts`        |       98.92% |          97.19% |  **99.46%** |     **99.06%** |    **+0.54** |       **+1.87** |
| `src/games/fab-a-diffy/game-controller.ts` |       90.47% |          82.14% |    **100%** |     **97.61%** |    **+9.53** |      **+15.47** |

Residual: board-ui defensive denom `Map.get` continue (line 86) still
unattributed under v8 even with a prototype spy; controller branch residuals
are `handleBarClick` non-bar2 fall-through and tutorial event `||` short-circuit.
Coverage-map tip stamp still pre-dates this round; focused residual gain
documented here (no AI/rules product asserts).

## Tests added

- `tests/unit/burn-1010-ui-cov-r22-fab-a-diffy.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r22-fab-a-diffy.test.ts
# Test Files  1 passed; Tests  7 passed; EXIT 0

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed `getAIMoveAsync`; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
- `cancelFabAiRequests` untouched
