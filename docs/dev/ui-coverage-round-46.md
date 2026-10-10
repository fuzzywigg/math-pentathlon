# UI coverage round 46 (`q-mp-501`)

Characterization tests for residual arms under `src/games/contig-60`
(board-ui + controller). Prefer UI rendering / event wiring / state-display
over `rules.ts` / `ai.ts` product logic. No AI move-choice / timing asserts;
no player-facing copy body asserts. Do not edit `contig-60/ai.ts` / `rules.ts`.

**Base:** `cursor/mp-tip-post914` (remeasured; backlog “7 dedicated” + board-ui
618 LOC match live tip). Draft only — tip owner folds.

## Scope

Included: `formatEndBanner` forged-winner exhaustiveness default; status-phase
switch forged default + placing chrome; `makeAIMove` gameOver / wrong-seat
guards via in-place state poke on stubbed same-ref rules; tutorial `exited` +
`completed` listener arms; AI-seat `allowInput:false` (no expr / valid chrome);
bare-root `syncOpponentChrome` early return; `#app` opponent chrome toggle.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits, AI-path file edits. Intentional residual:
`updateStatus` null-container defensive return (`:156`) — unreachable after
`updateUI`’s container guard without a public status poke.

## Overlap with open drafts

| Draft                                                             | Action                                                                                                            |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `#894` contig UI cov r27 (`q-mp-397`, tip post865)                | Prior round (already on tip as `burn-1010-ui-cov-r27-*`) — leave open (`contained`; no comment per worker prompt) |
| `#948`–`#954` other UI/engine cov rounds into post914             | Orthogonal hosts — leave open                                                                                     |
| `#955` backlog 10g (`q-mp-090p`)                                  | Spec inventory only — leave open                                                                                  |
| No open draft into `cursor/mp-tip-post914` owns contig UI cov r46 | —                                                                                                                 |

## Per-file / directory before → after

Focused contig UI suite (`tests/unit/*contig*` ± r5/r11/r27/mutation-ui7 ±
this round; not full-repo map). Tip `cursor/mp-tip-post914` @ `e43a25d2`:

| File                                     | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ---------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/contig-60/board-ui.ts`        |         100% |            100% |    **100%** |       **100%** |            0 |               0 |
| `src/games/contig-60/game-controller.ts` |       96.20% |          95.61% |  **99.36%** |     **98.24%** |    **+3.16** |       **+2.63** |
| `src/games/contig-60` (directory)        |       98.26% |          93.85% |  **99.13%** |     **94.65%** |    **+0.87** |       **+0.80** |

Acceptance (measured coverage gain on focused suite) **met** via controller
**+3.16 pp** lines / **+2.63 pp** branches (directory **+0.87 / +0.80**).
Dedicated `*contig-60*` unit files on tip before this round: **7** (matches
backlog); this round adds `burn-1010-ui-cov-r46-contig-60.test.ts`.

## Tests added

- `tests/unit/burn-1010-ui-cov-r46-contig-60.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1010-ui-cov-r46-contig-60.test.ts
# Test Files  1 passed; Tests  5 passed; EXIT 0

npx vitest run --project unit-shared --coverage tests/unit/*contig*
# controller 99.36% lines / 98.24% branches (see table)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# 21:  hard: 450,

npm run verify
npm run test:unit
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI placement + rules; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields / dataset)
- No lint-ceiling / knip baseline / bundle-budget edits
- `vitest.config.ts` unchanged (file matches existing `unit-shared` include)
- Zero `src/` edits
