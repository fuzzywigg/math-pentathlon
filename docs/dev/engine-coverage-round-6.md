# Engine coverage round 6 — clear residual `it.todo` after r5 (`q-mp-223`)

Task id: `q-mp-223`

Base: `cursor/mp-tip-post728`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

Convert the residual `it.todo` in `tests/unit/engine-coverage-round*.test.ts`
into a real characterization pin where live behavior is determined. Leave any
todo whose expected behavior is ambiguous. No AI / scoring / difficulty /
timing / copy / `rules.ts` logic changes. Hex Hard assert remains **450ms**.
Stars & Bars history cap untouched.

## Overlap check

| PR / topic                            | Action                                                                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| #724 `q-mp-201` (round-5)             | **Already on tip** via fold `#728`; residual geometric `it.todo` is this round's target                                                         |
| #667 `q-mp-143` (round-4)             | Contained on tip; round-3 suite has comment-only `it.todo` count                                                                                |
| Open tip-post728 drafts `#731`–`#735` | No engine-coverage / `it.todo` overlap (`#731` knip types, `#732` testing-layers, `#733` void controllers, `#734` backlog, `#735` coverage-map) |

## Live tip re-measure (before → after)

```text
# BEFORE (tip b5884207)
$ git grep -c 'it\.todo' -- tests/unit/engine-coverage-round*.test.ts
tests/unit/engine-coverage-round-2-burn-1008.test.ts:1   # header comment only
tests/unit/engine-coverage-round-3-burn-1008.test.ts:1   # header comment only
tests/unit/engine-coverage-round-burn-1008.test.ts:2     # header + 1 it.todo call-site

$ git grep -n '^\s*it\.todo' -- tests/
tests/unit/engine-coverage-round-burn-1008.test.ts:404:  it.todo(   ← sole call-site

# AFTER (this PR)
$ git grep -c 'it\.todo' -- tests/unit/engine-coverage-round*.test.ts
tests/unit/engine-coverage-round-2-burn-1008.test.ts:1   # header comment only
tests/unit/engine-coverage-round-3-burn-1008.test.ts:1   # header comment only
tests/unit/engine-coverage-round-burn-1008.test.ts:2     # header comments only (no call-site)

$ git grep -n '^\s*it\.todo' -- tests/
(none)
```

Repo-wide `^\s*it\.todo` call-sites: **1 → 0**.

## Round-6 disposition

| Prior `it.todo`                                                                           | Disposition             | How                                                                                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isDrawCondition` board-full-both-kings-mobile (`rules.ts` emptyCount===0 && both-mobile) | **Pinned + documented** | (1) Public full-board invariant: `emptyCount===0` ⇒ both kings immobile; draw via both-trapped arm. (2) Forge `board.isEmpty` phase split so king-move scans see one shared empty while the placement scan reports none → arm returns `true`. |

## Ambiguous todos left

None. The sole residual call-site had determined live behavior (`return true`) and was pinned via forge; the public-path geometric impossibility is documented as an invariant `it` (same pattern as round-5 "Documented unreachable").

## Files changed

- `tests/unit/engine-coverage-round-burn-1008.test.ts`
- `docs/dev/engine-coverage-round-6.md` (this file)

## Verification

```bash
git grep -c 'it\.todo' -- tests/unit/engine-coverage-round*.test.ts
npx vitest run --project unit-shared tests/unit/engine-coverage-round*.test.ts
npm run verify
```
