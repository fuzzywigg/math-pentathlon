# Engine coverage round 12 — post-r11 residual characterization (`q-mp-372`)

Task id: `q-mp-372`

Base: `cursor/mp-tip-post830`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

After rounds 9–10 (and parallel r11), add `engine-coverage-round-12-*.test.ts`
for the next-coldest **non-rules** core helpers — prefer
`src/core/attributes/` + `src/core/dice/` leftovers (**not** `*/rules.ts` and
**not** scoring logic). No AI / scoring / difficulty / timing / copy /
`rules.ts` logic changes. Hex Hard assert remains **450ms**. Stars & Bars
history cap untouched.

## Parallel split with `q-mp-349` (engine r11)

| Round | Task | Preferred modules |
| --- | --- | --- |
| **r11** | `q-mp-349` | `src/core/polyomino/**`, `src/core/fractions/**`, `src/core/graph/**` |
| **r12** (this) | `q-mp-372` | `src/core/attributes/**`, `src/core/dice/**` (+ tutorial `exitTutorialIfActive` leftover) |

No shared test-file edits with `#833` (r10, already on tip) or undrafted r11.

## Overlap check

| PR / topic | Action |
| --- | --- |
| Open drafts into `cursor/mp-tip-post830` | **None** at start |
| `#852` `q-mp-359` (queens-guards AI harness) | Orthogonal (AI harness only); no engine-helper overlap |
| `#833` `q-mp-324` (r10) | Already on tip via fold `#830`; leave open with `contained` |
| `#824` / `#779` (r9 / r8) | Already on tip; no shared-file edits |
| Undrafted `q-mp-349` (r11) | Disjoint modules (polyomino/fractions/graph) |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  97487de6  (cursor/mp-tip-post830)

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ npm run test:unit -- --project unit-shared --project unit-node \
    --exclude='**/ai-move-time*.test.ts' \
    --exclude='**/ai-calibration*.test.ts' \
    --exclude='**/ai-determinism*.test.ts' \
    --exclude='**/*bench*.test.ts' \
    --coverage --coverage.reportsDirectory=coverage-engine-r12-detail \
    --coverage.include='src/core/attributes/attribute-ui.ts' \
    --coverage.include='src/core/dice/dice-ui.ts' \
    --coverage.include='src/core/tutorial.ts'

Coldest PREFERRED non-rules helpers by branch % (post-r10 tip):
  1 attributes/attribute-ui.ts  92.85% (65/70)  uncovered lines 50,403
  2 dice/dice-ui.ts             94.82% (55/58)  uncovered lines 360,424
  # attributes/logic + dice/roller + dice-selector at 100%
  # graph/* left for r11 (q-mp-349)
```

## Round-12 disposition

| Module / arm | Disposition | How |
| --- | --- | --- |
| `attribute-ui` missing-attr `continue` (L50) | **Pinned** | Piece omits a definition name while others color-map |
| `attribute-ui` shading switch `default` (L403) | **Pinned** | Forge `shading: 'glossy'` on SET card |
| `attribute-ui` shape switch `custom` → card | **Pinned** | Public `'custom'` union member has no case |
| `attribute-ui` grid hover unselected border | **Pinned** | `mouseenter` / `mouseleave` on non-selected wrapper |
| `dice-ui` `animate()` cancelled guard (L424) | **Pinned** | Cancel during tumble `replaceChildren` so queued timeout hits guard |
| `dice-ui` `finish()` cancelled guard (L360) | **Documented unreachable** | Public `cancel()` clears timer before `finish`; duration≤0 path enters with `cancelled===false` |
| `tutorial` `exitTutorialIfActive` active arm | **Pinned** | Start singleton tutorial then exit helper |
| `graph/*` / `polyomino/*` / `fractions/*` | **Deferred to r11** | Owned by `q-mp-349` |

## Aggregate (preferred attribute-ui + dice-ui, full unit suite excl. AI/bench)

| Module | Before branch | After branch | Before line | After line | Δb / Δl |
| --- | ---: | ---: | ---: | ---: | --- |
| attributes/attribute-ui | 92.85% (65/70) | **95.71%** | 99.14% (233/235) | **100%** | +2 / +2 |
| dice/dice-ui | 94.82% (55/58) | **96.55%** | 98.63% (144/146) | **99.31%** | +1 / +1 |
| tutorial (leftover) | 74.86% | **75.97%** | 91.13% | **91.62%** | +exit arm |

Remaining dice-ui line **360** is the documented unreachable `finish()` cancelled guard.

## Files changed

- `tests/unit/engine-coverage-round-12-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-12.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
rg -n 'hard:\s*450' src/games/hex/ai.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run verify
npm run test:unit
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.
