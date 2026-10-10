# Engine coverage round 20 — post-r19 residual characterization (`q-mp-568`)

Task id: `q-mp-568`

Base: `cursor/mp-tip-post977` @ `d7be05ec` (remeasured live after tip-folded
r19 `#1002` / `q-mp-547` + mounts soft-fail `#1006` / mutation w19 `#1010` with
ollie dup pins dropped). Adds **no duplicate** r19 pins. **TEST-ONLY** — no
`src/` edits. Draft only; tip owner folds.

## Goal

After r19 pinned expression remove/Clear-All + attribute SET soft defaults +
ollie fallthrough (+ mounts hot-smoke), add `engine-coverage-round-20-*.test.ts`
for the next-coldest **non-rules** leftovers preferred by the round-19 backlog —
`expression-ui` drag/tray arms **not** claimed by r19, plus the densest safe
broad residual outside soft-fail ownership (`owl-system` missing `gameStats`).
No AI / scoring / difficulty / timing / copy / `rules.ts` logic changes. Hex
Hard assert remains **450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                                        | Action                                                             |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `#1002` `q-mp-547` (engine r19)                   | Tip-folded — **do not duplicate** r19 pins; leave open `contained` |
| `#1006` `q-mp-549` (game-route-mounts soft-fail)  | Tip-folded — r20 docs/smoke only on mounts                         |
| `#1010` `q-mp-548` (mutation UI w19)              | Tip-folded (ollie dup pins dropped) — no mutation first-20 pins    |
| Undrafted `q-mp-570`–`572` (expr/attr/ollie char) | **Deferred** — soft-fail expansion stays with those chars          |
| Undrafted `q-mp-569` (mutation UI w20)            | Orthogonal mutation scores on expression/attribute/ollie           |
| `#988`/`526` r18 + tip-folded r9–r18              | Tip-contained — leave open `contained`                             |
| Open drafts into `cursor/mp-tip-post977`          | Docs/UI/knip inventories only — none own engine coverage round 20  |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  d7be05ecd10c3ab64f372f657fd185cc703d78de  (cursor/mp-tip-post977)

$ find tests/unit -name '*.test.ts' | wc -l
  3285

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ # post-r19 preferred-host residual view (tip-native r19 + preferred suites)
$ npx vitest run --project unit-shared --project unit-isolated \
    tests/unit/engine-coverage-round-12-burn-1008.test.ts \
    tests/unit/engine-coverage-round-19-burn-1008.test.ts \
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

Coldest preferred non-rules helpers by branch % (post-r19 residual view):

```text
  1 game-route-mounts.ts       84.79% (184/217)  ← tip-folded 549 soft-fail; residual → char/mutation
  2 expression-ui.ts           98.95% (95/96)    ← r20 dragover/leave + tray draggable
  3 ollie-inspect-map.ts       97.05% (66/68)    ← never defaults (documented)
  4 attribute-ui.ts            100% (70/70)      ← saturated after r19
  # broad: owl-system L182 else; owl-messages L435 unreachable
```

## Round-20 disposition

| Module / arm                                                | Disposition                | How                                               |
| ----------------------------------------------------------- | -------------------------- | ------------------------------------------------- |
| `expression-ui` dragover / dragleave (L391–396)             | **Pinned**                 | Unlocked `onDrop` slot highlight / clear          |
| `expression-ui` tray `draggable !== undefined` (L530–531)   | **Pinned**                 | Non-empty tray with `draggable: true` / `false`   |
| `owl-system` missing `gameStats` else (L182)                | **Pinned**                 | Raw `game:start` bus emit without `getGameStats`  |
| `owl-messages` fallback `selectAndFormat` (L435)            | **Documented unreachable** | Contradicts `matchesConditions` always-true empty |
| `attribute-ui`                                              | **Documented saturated**   | 100% branches after r19                           |
| `ollie-inspect-map` never defaults (L148–149 / L171–172)    | **Documented unreachable** | Carry-forward from r19                            |
| `game-route-mounts` soft-fail / stale-gen / null-shell      | **Deferred**               | Soft-fail → `549`; mutation → `548`               |
| expression / attribute / ollie soft-fail char expansion     | **Deferred**               | → `570` / `571` / `572`                           |
| `storage` getToday/Yesterday `??` / algorithms L110/131/184 | **Documented / deferred**  | Carry-forward from r18; algorithms → `524`        |

## Aggregate (preferred hosts + owl-system)

Focused preferred-host suites (tip-native r19 + this PR's new file):

| Module            |    Before branch |     After branch |      Before line |         After line | Δb / Δl     |
| ----------------- | ---------------: | ---------------: | ---------------: | -----------------: | ----------- |
| expression-ui     |   98.95% (95/96) | **100%** (96/96) | 98.29% (230/234) | **100%** (234/234) | **+1 / +4** |
| attribute-ui      |             100% |             100% |             100% |               100% | 0 (sat.)    |
| ollie-inspect-map |   97.05% (66/68) |           97.05% |           94.73% |             94.73% | 0 (doc)     |
| game-route-mounts | 84.79% (184/217) | 84.79% (184/217) |           90.98% |             90.98% | 0 (smoke)   |
| owl-system L182   |  else **0** hits |   else **1** hit |                — |                  — | **+1 arm**  |

`owl-system` L182 else verified with focused suites (`r20` + `burn-wave23` +
`q-mp-375` + wave55): branch counts `[9, 1]` (then / else).

Remaining after pins:

- `ollie-inspect-map` never-default lines (documented unreachable)
- `owl-messages` L435 (documented unreachable)
- `game-route-mounts` soft-fail matrix → `549` / mutation → `548`
- soft-fail chars on expression/attribute/ollie → `570`–`572`

## Files changed

- `tests/unit/engine-coverage-round-20-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-20.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
# → (none active)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# → 21:  hard: 450,

npx vitest run --project unit-shared tests/unit/engine-coverage-round-20*.test.ts
# → Test Files 1 passed | Tests N passed

npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
# → prior rounds + r20 green

npm run verify
# → lint + lint:ratchet + format:check + typecheck + typecheck:ratchet + check:boundaries OK

npm run test:unit
# → full unit suite green
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

**Next action: fold into tip by the tip owner.**
