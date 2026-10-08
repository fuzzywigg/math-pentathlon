# Type ratchet Batch 6 — remaining non-AI rules / engine

**Task:** `burn-1008-mp-type-ratchet-batch6-nonrules`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0` (already includes [#551](https://github.com/fuzzywigg/math-pentathlon/pull/551) Batch 4 and Batch 3 UI via [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544); [#553](https://github.com/fuzzywigg/math-pentathlon/pull/553) Batch 5 UI surface already reflected on tip)  
**Policy:** Behavior-neutral fixes only — NUI non-null asserts after definite dense-board / literal-tuple / regex-capture bounds, EOPT-safe object rebuilds that preserve field values. **No** `??` / `?.` / default-value rewrites that could change a runtime value. No AI. No help/tutorial/copy. No #546-owned paths.

## Stacking

- Starts from tip (ceiling **286** after tip folds of #546 / #544 / #551).
- [#551](https://github.com/fuzzywigg/math-pentathlon/pull/551) is already on tip (`merge(#551)`).
- [#553](https://github.com/fuzzywigg/math-pentathlon/pull/553) UI clearance is already present on tip via #544 + #551 folds; this PR brings `docs/dev/type-ratchet-batch5.md` for the trail and stacks **after** #553 for fold order.
- **PR body:** stacks on #553 (which stacks on #551); fold after #553.

## Remaining files ranked by error count (pre-batch, tip 286)

From `npm run typecheck:ratchet` / raw `tsc -p tsconfig.ratchet.json` on tip before Batch 6:

| Rank | Path | Count | Eligible? |
| ---: | --- | ---: | --- |
| 1 | `src/games/contig-60/ai.ts` | 19 | no — AI |
| 2 | `src/games/juggle/ai.ts` | 18 | no — AI |
| 3 | `src/games/stars-bars/ai.ts` | 18 | no — AI |
| 4 | `src/games/fab-a-diffy/ai.ts` | 17 | no — AI |
| 5 | `src/games/calla/ai.ts` | 15 | no — AI |
| 6 | `src/games/kwatro-sinko/ai.ts` | 15 | no — AI |
| 7 | `src/games/hex/ai.ts` | 13 | no — AI |
| 8 | `src/games/pent-em-in/ai.ts` | 12 | no — AI |
| 9 | `src/games/stars-bars/rules.ts` | 12 | **yes** |
| 10 | `src/games/hex/rules.ts` | 11 | **yes** |
| 11 | `src/games/kings-quadraphages/ai.ts` | 11 | no — AI |
| 12 | `src/games/prime-gold/rules.ts` | 10 | **yes** |
| 13 | `src/games/fiar/ai.ts` | 9 | no — AI |
| 14 | `src/games/hex-a-gone/ai.ts` | 9 | no — AI |
| 15 | `src/games/kwatro-sinko/rules.ts` | 9 | **yes** |
| 16 | `src/games/par-55/ai.ts` | 8 | no — AI |
| 17 | `src/games/ramrod/ai.ts` | 8 | no — AI |
| 18 | `src/games/sum-dominoes/ai.ts` | 8 | no — AI |
| 19 | `src/games/pent-em-in/rules.ts` | 7 | **yes** |
| 20 | `src/games/prime-gold/ai.ts` | 7 | no — AI |
| 21 | `src/games/kings-quadraphages/game-state.ts` | 6 | **yes** (engine; type-only `!`) |
| 22 | `src/games/star-track/ai.ts` | 6 | no — AI |
| 23 | `src/games/kings-quadraphages/board.ts` | 5 | **yes** (engine; type-only `!`) |
| 24 | `src/games/contig-60/rules.ts` | 4 | **yes** |
| 25 | `src/games/frac-fact/ai.ts` | 4 | no — AI |
| 26 | `src/games/remainder-islands/ai.ts` | 4 | no — AI |
| … | remaining AI clients/workers | ≤3 each | no — AI |
| — | `src/games/juggle/rules.ts` | 2 | **yes** |
| — | `src/games/kings-quadraphages/rules.ts` | 1 | **yes** |

**Eligible pool on tip:** 67 errors (all non-AI / non-#546 / non-copy). Cleared **all 67** (true eligible floor).

## Cleared in this batch (per-file before → after)

| Path | Before | After | Cleared |
| --- | ---: | ---: | ---: |
| `src/games/stars-bars/rules.ts` | 12 | 0 | 12 |
| `src/games/hex/rules.ts` | 11 | 0 | 11 |
| `src/games/prime-gold/rules.ts` | 10 | 0 | 10 |
| `src/games/kwatro-sinko/rules.ts` | 9 | 0 | 9 |
| `src/games/pent-em-in/rules.ts` | 7 | 0 | 7 |
| `src/games/kings-quadraphages/game-state.ts` | 6 | 0 | 6 |
| `src/games/kings-quadraphages/board.ts` | 5 | 0 | 5 |
| `src/games/contig-60/rules.ts` | 4 | 0 | 4 |
| `src/games/juggle/rules.ts` | 2 | 0 | 2 |
| `src/games/kings-quadraphages/rules.ts` | 1 | 0 | 1 |
| **Total** | **67** | **0** | **67** |

Phase-2 out-of-scope ceiling: **286 → 220**.

## Fix style

| Pattern | Use |
| --- | --- |
| NUI dense boards | `board[row]![col]!` after bounds / size loops |
| NUI literal direction tuples | `dr!` / `dc!` / `dx!` / `dy!` after indexing fixed literals |
| NUI regex captures | `match[1]!` after truthy `/n(\d+)-(\d+)/` match |
| NUI length-gated index | `shapes[0]!` when `length === 1`; `likes[0]!` when `length === 2` |
| NUI shuffle swap | temp locals + `!` (same as Batch 2 frac-fact) |
| EOPT board cell rewrite | rebuild `{ row, col, occupied, owner, pieceId }` from asserted prev (no value change) |

## Deferred (true remaining floor) — by category

| Category | Count | Reason |
| --- | ---: | --- |
| All `ai.ts` / `ai-client.ts` / `ai.worker.ts` | **220** | AI search / scoring / difficulty / timing — Batch A + Andrew; Hex Hard 450ms stays |
| Help / tutorial / player-facing copy | 0 errors | Deliberately skipped |
| `#546` non-AI paths | 0 remaining | Already cleared on tip; not retouched |
| Stars & Bars history cap | — | Hard rule — not touched |

No further **eligible** out-of-scope errors remain under this task’s hard rules (no AI, no copy, no value-changing rewrites).

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
# expect 220 after this batch (was 286 on tip)
npm run typecheck:ratchet
```
