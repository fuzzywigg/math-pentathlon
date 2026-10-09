# Engine coverage round 4 — clear round-3 `it.todo` arms (`q-mp-143`)

Task id: `q-mp-143`

Base: `cursor/mp-tip-post477`. **TEST-ONLY** — no `src/` edits. Draft only;
tip owner folds.

## Goal

Convert the six `it.todo` placeholders left by round 3 in
`tests/unit/engine-coverage-round-3-burn-1008.test.ts` into real characterization
pins **or** documented unreachable/dead arms. No AI / scoring / difficulty /
timing / copy / rules.ts logic changes. Hex Hard assert remains **450ms**.
Stars & Bars history cap untouched.

## Overlap check

| PR / topic | Action |
| --- | --- |
| Open tip drafts #601–#663 | No `q-mp-143` / engine-coverage-round-4 draft; UI cov r6 (#648) unrelated |
| Round 3 suite / #578 | Extended in place; helpers not cloned |
| Round 1–2 todos in other suites | Out of scope |

## Round-4 disposition table

| # | Prior `it.todo` (round 3) | Disposition | How |
| ---: | --- | --- | --- |
| 1 | fab `hasAnyValidMove` left/right `=== undefined` continue | **Pinned** | Forge `Array.from` → `.filter()` returns length-2 hole array |
| 2 | star-track private `shuffleArray` a/b undefined continue | **Documented unreachable** | Invariant `it`: `createChainBucket` always dense 24; no public inject |
| 3 | prime-gold `createBoard` `val>0` false | **Pinned** | Forge `Array.from` grid Proxy swallows write to `(0,0)` → skipped cell |
| 4 | `isGoldbachNumber` loop-exhaust `return false` | **Documented unreachable** | Invariant `it`: every even `n` in 4..200 is true under `isPrime`; same-module binding not spyable |
| 5 | calla sow `position < PITS*2+1` false arm | **Documented unreachable** | Invariant `it`: long sow wraps after position 10 before next iter; cube total conserved |
| 6 | juggle `orientSelectedShapeToFit` early return | **Pinned** | Forge `selectShape(..., null)` with `selectingShape` + category |

**`it.todo` count in this suite: 0.** No tip-owner HOLD leftovers (none of the
unreachable arms require a product/rules fix to stay correct; they are
defensive / total-function arms).

## Files changed

- `tests/unit/engine-coverage-round-3-burn-1008.test.ts`
- `docs/dev/engine-coverage-round-4.md` (this file)

## Verification

```bash
npx vitest run tests/unit/engine-coverage-round-3-burn-1008.test.ts
npm run test:unit
```

Results filled in the PR body after the run.
