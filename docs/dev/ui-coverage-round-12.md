# UI coverage round 12 (`q-mp-249`)

Characterization tests for residual arms under `src/games/fiar`
(prefer board-ui / controller). No AI move-choice / timing asserts; no
player-facing copy body pins; no `rules.ts` / `ai.ts` product edits.

**Base:** `cursor/mp-tip-post748` @ `23926935`. Draft only — tip owner folds.

## Scope

Included: dangling-edge skip + hyphen synthetic a11y coords; AI-seat
`announceTargets` omission; hover brightness filter; chip-kind picker
disabled / `aria-pressed` / bogus kind ignore; starter-banner dataset;
winner `winningPathColor` pathNote structure; AI-thinking / AI-seat
click guards (via 3D `onNodeClick`); worker throw → sync fallback; sync
throw unlock; null-null re-render; stale generation / seat-flip abort;
tutorial complete remount; board3d fail / success / context-lost /
destroy-during-load.

Excluded: AI workers / move-choice / timing asserts (Hex Hard 450ms
untouched), `rules.ts` / scoring edits, player-facing copy body asserts,
product `src/` edits. Did **not** edit `#745` mutation suite
(`mutation-ui6-fiar-board-ui.test.ts`).

## Overlap with open drafts

| Draft                         | Action                                         |
| ----------------------------- | ---------------------------------------------- |
| #745 mutation-ui6 fiar        | Orthogonal (separate new test file; left open) |
| #754 void board-ui            | Orthogonal (lint brace hygiene) — not edited   |
| #749–#753 tip batch / backlog | Orthogonal — not edited                        |
| #727 nullish HOLD             | Untouched                                      |
| Prior fiar overnight / r4     | Already on tip; r12 is residual-only           |

## Per-file before → after

Tip directory stamp from live `docs/dev/coverage-map.md` @ `23926935`:
**92.62% lines / 82.55% branches** (`src/games/fiar`, 10 files).

Focused fiar UI suite (prior residual controller/board tests ± this
round’s suite; not full-repo):

| File                                | Before lines | Before branches | After lines | After branches | Δ lines (pp) | Δ branches (pp) |
| ----------------------------------- | -----------: | --------------: | ----------: | -------------: | -----------: | --------------: |
| `src/games/fiar/board-ui.ts`        |       97.45% |          84.62% |     100.00% |         92.31% |    **+2.55** |       **+7.69** |
| `src/games/fiar/game-controller.ts` |       82.48% |          70.14% |      98.54% |         93.06% |   **+16.06** |      **+22.92** |

Acceptance (documented focused gains; no AI/rules/copy product edits)
**met**.

## Lint / knip ceilings

Tests-only — no change to `docs/dev/lint-ratchet-ceilings.json` or knip
baselines. Live tip ceilings re-measured: curly 538, nnnull 254, void 118,
dup-imports 99, nullish 65 (HOLD `#727` untouched).

## Tests added

- `tests/unit/burn-1009-ui-cov-r12-fiar.test.ts`

## Verification

```text
npx vitest run --project unit-shared \
  tests/unit/burn-1009-ui-cov-r12-fiar.test.ts
# Test Files  1 passed; Tests  16 passed; EXIT 0

npm run lint
npm run typecheck
npm run verify
npm run lint:ratchet
```

## Constraints honored

- Tests-only (+ this note)
- No AI / rules / copy / Hex Hard changes
- Deterministic (fake timers / stubbed 3D loader; no network)
- No player-facing copy body asserts (classes / roles / phase / state /
  `aria-*` / dataset)
