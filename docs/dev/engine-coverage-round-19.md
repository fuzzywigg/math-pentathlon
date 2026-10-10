# Engine coverage round 19 — post-r18 residual characterization (`q-mp-547`)

Task id: `q-mp-547`

Base: `cursor/mp-tip-post949` @ `68f1548f` (remeasured live after tip-folded
r18 `#988` / `q-mp-526` + UI cov r49 prettier). **TEST-ONLY** — no `src/`
edits. Draft only; tip owner folds.

## Goal

After tip-folded r18 pinned storage `createProfile` `?? ''` + tutorial/graph
smoke, add `engine-coverage-round-19-*.test.ts` for the next-coldest
**non-rules** leftovers preferred by the round-18 backlog — `expression-ui`,
`attribute-ui`, `ollie-inspect-map`, and `game-route-mounts` (**not** claimed
by r11–r18 product pins; **not** `*/rules.ts` / scoring / AI). Soft-fail
residuals on mounts stay with char `q-mp-549`; mutation scores on the same
hosts stay with `q-mp-548`. No AI / scoring / difficulty / timing / copy /
`rules.ts` logic changes. Hex Hard assert remains **450ms**. Stars & Bars
history cap untouched.

## Overlap check

| PR / topic                                         | Action                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| `#988` `q-mp-526` (engine r18)                     | Tip-folded — **do not duplicate**; leave open `contained`        |
| `#976` `q-mp-506` (engine r17)                     | Tip-folded — leave open `contained`                              |
| Undrafted `q-mp-549` (game-route-mounts soft-fail) | **Deferred** — r19 hot-smoke / docs only on mounts               |
| Undrafted `q-mp-548` (mutation UI w19)             | **Deferred** — keep hosts coordinated; no mutation first-20 pins |
| `#990` `q-mp-525` (polyomino/transform)            | Orthogonal — no transform pins                                   |
| `#981`/`#986`/`#984` soft-fail chars               | Orthogonal — skip dice-selector / board-a11y / pointer-hygiene   |
| Open drafts into `cursor/mp-tip-post949`           | No other draft owns engine coverage round 19                     |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  68f1548fd3c011f9cea2c418ca3dab8879246b17  (cursor/mp-tip-post949)

$ find tests/unit -name '*.test.ts' | wc -l
  3280

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ # preferred-host residual view (explicit suites + r12 attribute pins + mounts)
$ npx vitest run --project unit-shared --project unit-isolated \
    tests/unit/engine-coverage-round-12-burn-1008.test.ts \
    tests/unit/burn-wave21-attribute-ui.test.ts \
    tests/unit/burn-wave40-attr-ui-setcard-matrix.test.ts \
    tests/unit/q-mp-403-attribute-ui-residuals.test.ts \
    tests/unit/overnight-wave54-attr-setcard-striped-pattern-4.test.ts \
    tests/unit/ollie-inspect-map.test.ts \
    tests/unit/burn-wave40-ollie-inspect-*.test.ts \
    tests/unit/burn-wave22-expression-ui.test.ts \
    tests/unit/burn-wave35-expr-ui-card-matrix.test.ts \
    tests/unit/q-mp-326-expression-ui-residuals.test.ts \
    tests/unit/q-mp-406-expression-ui-residuals.test.ts \
    tests/unit/mutation-ui8-expression-ui.test.ts \
    tests/unit/burn-1007-game-route-mounts.test.ts \
    tests/unit/q-mp-353-game-route-mounts-soft-fail.test.ts \
    --coverage \
    --coverage.include='src/core/owl/ollie-inspect-map.ts' \
    --coverage.include='src/core/expressions/expression-ui.ts' \
    --coverage.include='src/core/attributes/attribute-ui.ts' \
    --coverage.include='src/ui/game-route-mounts.ts'
```

Coldest preferred non-rules helpers by branch % (post-r18 residual view):

```text
  1 game-route-mounts.ts       75.57% (164/217)  ← soft-fail → 549 / mutation 548
  2 attribute-ui.ts            95.71% (67/70)    ← r19 SET || defaults + leave
  3 ollie-inspect-map.ts       95.58% (65/68)    ← r19 fallthrough pins
  4 expression-ui.ts           96.87% (93/96)    ← r19 interactive remove/clear
  # storage createProfile pinned in r18; algorithms L110/131/184 → 524
```

## Round-19 disposition

| Module / arm                                                           | Disposition                | How                                              |
| ---------------------------------------------------------------------- | -------------------------- | ------------------------------------------------ |
| `expression-ui` filled-slot remove (L675–677)                          | **Pinned**                 | Click filled unlocked slot → tray restores card  |
| `expression-ui` Clear All reset+render (L725–726)                      | **Pinned**                 | Structural single `<button>` click               |
| `attribute-ui` SET `shape \|\| 'oval'` / `color \|\| 'red'` (L267/269) | **Pinned**                 | Forge empty-string attrs through `renderSetCard` |
| `attribute-ui` selected mouseleave guard (L453)                        | **Pinned**                 | Selected wrapper leave keeps border              |
| `ollie-inspect-map` empty `data-shape` fallthrough                     | **Pinned**                 | Structural `kind: 'unknown'`                     |
| `ollie-inspect-map` star-space missing player → `unknown`              | **Pinned**                 | Finite space, omit `data-player`                 |
| `ollie-inspect-map` unknown-chrome stub prefix                         | **Pinned**                 | Structural prefix/length only (no copy body pin) |
| `ollie-inspect-map` never defaults (L148–149 / L171–172)               | **Documented unreachable** | Exhaustive `never` arms                          |
| `game-route-mounts` uninitialized deps throw                           | **Hot smoke**              | Soft-fail matrix stays with `549`                |
| `game-route-mounts` stale-gen / clobber / null-shell                   | **Deferred**               | Soft-fail → `549`; mutation → `548`              |
| `storage` getToday/Yesterday `??` / algorithms L110/131/184            | **Documented / deferred**  | Carry-forward from r18; algorithms → `524`       |

## Aggregate (preferred hosts)

Focused preferred-host suites (before → after this PR's new file overlaid):

| Module            |    Before branch |       After branch |      Before line |           After line | Δb / Δl     |
| ----------------- | ---------------: | -----------------: | ---------------: | -------------------: | ----------- |
| expression-ui     |   96.87% (93/96) | **98.95%** (95/96) | 96.15% (225/234) | **98.29%** (230/234) | **+2 / +5** |
| attribute-ui      |   95.71% (67/70) |   **100%** (70/70) |             100% |                 100% | **+3 / 0**  |
| ollie-inspect-map |   95.58% (65/68) | **97.05%** (66/68) |           94.73% |               94.73% | **+1 / 0**  |
| game-route-mounts | 75.57% (164/217) |             75.57% |           90.16% |               90.16% | 0 (smoke)   |

Remaining after pins:

- `expression-ui` L391–396 dragover/leave + L531 tray `draggable !== undefined` true arm (orthogonal to remove/clear)
- `ollie-inspect-map` never-default lines L148–149 / L171–172 (documented unreachable)
- `game-route-mounts` soft-fail matrix → `549` / mutation → `548`

## Files changed

- `tests/unit/engine-coverage-round-19-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-19.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
# → (none active)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# → 21:  hard: 450,

npx vitest run --project unit-shared tests/unit/engine-coverage-round-19*.test.ts
# → Test Files 1 passed | Tests N passed

npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
# → prior rounds + r19 green

npm run verify
# → lint + lint:ratchet + format:check + typecheck + typecheck:ratchet + check:boundaries OK

npm run test:unit
# → full unit suite green
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

**Next action: fold into tip by the tip owner.**
