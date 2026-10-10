# UI coverage round 29 (`q-mp-399`)

Characterization tests for residual arms under `src/games/hex-a-gone`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Stub the AI client. Hex Hard 450ms
untouched (different game: `src/games/hex`).

**Base:** `cursor/mp-tip-post865` (remeasured; backlog written against post830).
Draft only — tip owner folds.

## Scope

Included: confirm `scrollIntoView` microtask arm; filled-cell block color;
p2 winner banner / status chrome; placing-info `interactive=false`; empty
select status; controller deselect + place-phase bank switch; stale
confirm/cell phase guards; stubbed AI multi-block place continue; null
selection leftover placeBlocks settle; null placement boardFull settle;
stale handlers while AI thinking; `aiPlaceBlocks` wrong-phase early exit;
`setAIDifficulty` / `resetGame` mode keep; tutorial completed + exited;
human-win owl notify once; post-destroy paint leave-as-is; structural
imports of knip `unusedTypes` (`PlacedBlock` / `TurnSelection` /
`MoveRecord`).

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Board-3D host paths remain with `mp3d-hex-a-gone-*`
(`unit-isolated`); do not duplicate `#878` (`src/games/hex` r25).

## Overlap with open drafts

| Draft                                                             | Action                               |
| ----------------------------------------------------------------- | ------------------------------------ |
| #878 hex UI cov r25 (`q-mp-371`)                                  | Orthogonal host (`hex`) — leave open |
| #877 owl void brace (`q-mp-366`)                                  | Orthogonal — leave open              |
| #879 backlog 10c (`q-mp-090l`)                                    | Spec source — leave open             |
| #870 / #868 / #867 UI cov r26/r23/r22                             | Orthogonal hosts — leave open        |
| No open draft into `cursor/mp-tip-post865` owns hex-a-gone UI r29 | —                                    |

## Per-file / directory before → after

Focused hex-a-gone unit-shared suite (prior overnight/burn/controller hosts
± this round; excludes `mp3d-*` `unit-isolated`):

| File                                      | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/hex-a-gone/board-ui.ts`        |       98.94% |          93.93% |  **99.47%** |     **95.95%** |    **+0.53** |       **+2.02** |
| `src/games/hex-a-gone/game-controller.ts` |       66.15% |          49.52% |  **82.05%** |     **75.23%** |   **+15.90** |      **+25.71** |
| focused board-ui + controller             |       82.33% |          71.07% |  **90.64%** |     **85.29%** |    **+8.31** |      **+14.22** |

Residual left intentional: board-ui `getShapeIcon` default exhaustiveness
(`:372`); controller board-3D ensure/unmount/fallback/ready arms (covered
by `mp3d-hex-a-gone-*` in `unit-isolated`, out of this unit-shared round).

## Tests added

- `tests/unit/burn-1010-ui-cov-r29-hex-a-gone.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r29-hex-a-gone.test.ts
# Test Files  1 passed; Tests  9 passed; EXIT 0

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes; zero `src/` edits
- Deterministic (fake timers / stubbed AI; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only task)
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
