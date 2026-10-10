# Engine coverage round 21 — post-r20 residual characterization (`q-mp-586`)

Task id: `q-mp-586`

Base: `cursor/mp-tip-post1012` @ `dcdc0bf4` (remeasured live after tip-folded
r19 `#1002` / `q-mp-547` + r20 `#1021` / `q-mp-568`). Binding screen: avoid
`owl-messages` / `owl-events` / `reduced-motion` (wave-21 chars `588`–`590` +
mutation `587`) and skip `expressions/evaluator.ts` (`593`); no `rules.ts` /
scoring / AI. Adds **no duplicate** r19/r20 pins. **TEST-ONLY** — no `src/`
edits. Draft only; tip owner folds.

## Goal

After r20 pinned expression-ui drag/tray + owl-system missing `gameStats`, add
`engine-coverage-round-21-*.test.ts` for the next-coldest **non-rules** leftovers
**not** claimed by wave-21 owl/motion/evaluator chars — `feature-flags` SSR
default arms and `dom-security` missing-slot continue. No AI / scoring /
difficulty / timing / copy / `rules.ts` logic changes. Hex Hard assert remains
**450ms**. Stars & Bars history cap untouched.

## Overlap check

| PR / topic                                               | Action                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `#1002` `q-mp-547` (engine r19)                          | Tip-folded — **do not duplicate** r19 pins; leave open `contained` |
| `#1021` `q-mp-568` (engine r20)                          | Tip-folded — **do not duplicate** r20 pins; leave open `contained` |
| Undrafted `q-mp-588`–`590` (owl-messages/events/motion)  | **Deferred** — binding screen; chars + mutation `587` own hosts    |
| Undrafted `q-mp-591`–`593` (owl-component/tutorial/eval) | **Deferred** — keep hosts coordinated; skip evaluator              |
| Undrafted `q-mp-570`–`572` (expr/attr/ollie char)        | **Deferred** — soft-fail expansion stays with those chars          |
| `#1006` `q-mp-549` (game-route-mounts soft-fail)         | Orthogonal — r21 docs/smoke only on mounts                         |
| Open drafts into `cursor/mp-tip-post1012`                | None at start — no other draft owns engine coverage round 21       |

## Live tip re-measure (before)

```text
$ git rev-parse HEAD
  dcdc0bf47d102c480e2fff9ff2287886843f17be  (cursor/mp-tip-post1012)

$ find tests/unit -name '*.test.ts' | wc -l
  3288

$ git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts
(none)

$ rg -n 'hard:\s*450' src/games/hex/ai.ts
  21:  hard: 450,

$ # post-r20 preferred + candidate residual view (tip-native r19/r20 + suites)
$ npx vitest run --project unit-shared --maxWorkers=2 \
    tests/unit/engine-coverage-round-19-burn-1008.test.ts \
    tests/unit/engine-coverage-round-20-burn-1008.test.ts \
    tests/unit/burn-wave40-owl-*.test.ts \
    tests/unit/burn-wave23-owl-system.test.ts \
    tests/unit/mp3d-feature-flags.test.ts \
    tests/unit/mutation-ui-feature-flags.test.ts \
    tests/unit/q-mp-455-safe-web-storage-feature-flags-residuals.test.ts \
    tests/unit/dom-security.test.ts \
    tests/unit/mutation-ui-dom-security.test.ts \
    tests/unit/mutation-ui15-dom-security.test.ts \
    --coverage \
    --coverage.include='src/core/feature-flags.ts' \
    --coverage.include='src/core/dom-security.ts' \
    --coverage.include='src/core/expressions/expression-ui.ts' \
    --coverage.include='src/core/attributes/attribute-ui.ts' \
    --coverage.include='src/core/owl/owl-system.ts' \
    --coverage.include='src/core/owl/ollie-inspect-map.ts'
```

Coldest allowed non-rules helpers by branch % (post-r20 residual view; excluding
binding-screen hosts owl-messages / owl-events / reduced-motion / evaluator):

```text
  1 feature-flags.ts           71.42% (5/7)      ← r21 SSR window-false defaults
  2 dom-security.ts            86.36% (19/22)    ← r21 !slot continue
  3 ollie-inspect-map.ts       97.05% (66/68)    ← never defaults (documented)
  4 expression-ui.ts           100% (96/96)      ← saturated after r20
  5 attribute-ui.ts            100% (70/70)      ← saturated after r19
  6 owl-system.ts              100% lines        ← saturated (r20 + wave40)
  # deferred: storage soft-fail → #909; algorithms → 524; mounts → 549
```

## Round-21 disposition

| Module / arm                                              | Disposition                | How                                                    |
| --------------------------------------------------------- | -------------------------- | ------------------------------------------------------ |
| `feature-flags` SSR `typeof window` false (L24 / L26)     | **Pinned**                 | Delete `window`, no-arg `isBoard3dEnabled()` → OFF     |
| `dom-security` missing `data-mp-safe` slot continue (L58) | **Pinned**                 | Spy `querySelector` miss once; later Node still adopts |
| `expression-ui` / `attribute-ui`                          | **Documented saturated**   | 100% branches after r19/r20                            |
| `owl-system` (incl. wave40 moods / draw)                  | **Documented saturated**   | Preferred suite 100% lines after r20 + wave40          |
| `ollie-inspect-map` never defaults (L148–149 / L171–172)  | **Documented unreachable** | Carry-forward from r19                                 |
| `owl-messages` / `owl-events` / `reduced-motion`          | **Deferred**               | Binding screen → `588`–`590` / mutation `587`          |
| `owl-component` / `tutorial` / `evaluator`                | **Deferred**               | → `591` / `592` / `593`                                |
| `game-route-mounts` soft-fail / stale-gen / null-shell    | **Deferred**               | Soft-fail → `549`; mutation → `548`                    |
| `storage` load/save catch / getToday `??`                 | **Documented / deferred**  | Soft-fail `#909`; `??` unreachable (r18)               |
| `graph/algorithms` L110/131/184                           | **Deferred**               | Soft-fail char → `524`                                 |

## Aggregate (candidate hosts)

Focused candidate suites (before → after this PR's new file overlaid):

| Module        |  Before branch |       After branch |    Before line |       After line | Δb / Δl     |
| ------------- | -------------: | -----------------: | -------------: | ---------------: | ----------- |
| feature-flags |   71.42% (5/7) |     **100%** (7/7) |           100% |             100% | **+2 / 0**  |
| dom-security  | 86.36% (19/22) | **90.90%** (20/22) | 97.91% (47/48) | **100%** (48/48) | **+1 / +1** |
| expression-ui |           100% |               100% |           100% |             100% | 0 (sat.)    |
| attribute-ui  |           100% |               100% |           100% |             100% | 0 (sat.)    |
| owl-system    |           100% |               100% |           100% |             100% | 0 (sat.)    |
| ollie-inspect | 97.05% (66/68) |             97.05% |         94.73% |           94.73% | 0 (doc)     |

`dom-security` remaining branch holes (L19 `?? ch` / L119) stay with prior
mutation ownership — not claimed here.

Remaining after pins:

- `ollie-inspect-map` never-default lines (documented unreachable)
- wave-21 owl/motion/evaluator chars → `588`–`593` (+ mutation `587`)
- `game-route-mounts` soft-fail matrix → `549` / mutation → `548`
- soft-fail chars on expression/attribute/ollie → `570`–`572`
- storage / algorithms carry-forward → `#909` / `524`

## Files changed

- `tests/unit/engine-coverage-round-21-burn-1008.test.ts` (new)
- `docs/dev/engine-coverage-round-21.md` (this file)

## Verification

```bash
rg -c 'it\.todo' tests/unit/engine-coverage-round*.test.ts
git grep -n '^\s*it\.todo' -- tests/unit/engine-coverage-round*.test.ts || true
# → (none active)

rg -n 'hard:\s*450' src/games/hex/ai.ts
# → 21:  hard: 450,

npx vitest run --project unit-shared tests/unit/engine-coverage-round-21*.test.ts
# → Test Files 1 passed | Tests N passed

npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
# → prior rounds + r21 green

npm run verify
# → lint + lint:ratchet + format:check + typecheck + typecheck:ratchet + check:boundaries OK

npm run test:unit
# → full unit suite green
```

No engine product edits. No lint-ceiling / knip-baseline changes in this PR.

**Next action: fold into tip by the tip owner.**
