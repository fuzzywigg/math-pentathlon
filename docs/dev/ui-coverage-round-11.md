# UI coverage round 11 (`q-mp-248`)

Characterization tests for coldest non-AI-worker game directory residuals
under `src/games/contig-60` (board-ui + controller). Prefer UI rendering /
event wiring / state-display over `rules.ts` / `ai.ts` product logic.

**Base:** `cursor/mp-tip-post748` @ `ce673656`. Draft only — tip owner folds.

## Scope

Included: `syncContigBoard` cell-map rebuild + owner/valid sync; delegated
click/keydown guards (non-cell, non-pointer, non-finite value, wrong key);
expression formula chrome (×/÷ glyphs); draw / placing status structure;
tutorial roll refresh; vsAI AI-pass + same-seat continue via stubs without
choice asserts; destroy cancelling pending AI timers.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Nullish HOLD `#727` untouched.

## Overlap with open drafts

| Draft                            | Action                                       |
| -------------------------------- | -------------------------------------------- |
| #754 void board-ui               | Orthogonal (lint) — not edited               |
| #753 backlog round 6             | Spec source only — not edited                |
| #751/#750 demos void/dup-imports | Orthogonal — not edited                      |
| #749 emit-identity               | Orthogonal — not edited                      |
| #752 dismissOwl knip             | Orthogonal — not edited                      |
| #744 juggle UI cov r10           | Orthogonal (juggle) — not edited             |
| #745 mutation UI wave 6          | Orthogonal (juggle/fiar/kwatro) — not edited |
| Prior contig r5/r6/r7 suites     | Already on tip; r11 is residual-only         |

## Per-file / directory before → after

Tip directory stamp from live `docs/dev/coverage-map.md` @ `ce673656`:
**92.82% lines / 86.10% branches**.

Focused contig UI suite (same file set ± this round’s suite; not full-repo):

| File                                     | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ---------------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/contig-60/board-ui.ts`        |       91.82% |          85.13% |      98.74% |         95.94% |    **+6.92** |      **+10.81** |
| `src/games/contig-60/game-controller.ts` |       82.27% |          75.43% |      89.87% |         85.08% |    **+7.60** |       **+9.65** |
| Directory (`src/games/contig-60`)        |       92.17% |          84.76% |  **96.17%** |     **89.84%** |    **+4.00** |       **+5.08** |

Acceptance (≥+2 pp directory lines on focused suite, or documented focused
gains) **met**.

Residual board-ui lines 149/154 are `BOARD_NUMBERS` hole `continue` arms
(imported by value; not reachable without module reset). Controller residuals
are null-container early returns, `never` exhaustiveness defaults, and AI-seat
handlers hidden when `humanCanAct` is false.

## Tests added

- `tests/unit/burn-1009-ui-cov-r11-contig.test.ts`

## Verification

```text
npx vitest run --coverage --project unit-shared \
  tests/unit/burn-1009-ui-cov-r11-contig.test.ts
# plus focused contig suite listed above

npm run lint
npm run typecheck
npm run verify
npm run lint:ratchet
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed AI+rules; no network)
- No player-facing copy body asserts (classes / roles / phase / state fields)
- No lint-ceiling / knip baseline edits (tests-only; ceilings unchanged)
