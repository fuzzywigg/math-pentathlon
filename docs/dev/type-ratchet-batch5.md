# Type ratchet Batch 5 — UI / shell / types (non-rules)

**Task:** `burn-1008-mp-type-ratchet-batch5-nonrules`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0` + [#551](https://github.com/fuzzywigg/math-pentathlon/pull/551) Batch 4  
**Policy:** Behavior-neutral fixes only — explicit types, NUI non-null asserts after definite bounds, EOPT conditional spreads, throw-guards in already-impossible board-hole branches. **No** `??` / `?.` / default-value rewrites that could change a runtime value. No AI / rules / engine / copy.

## Stacking

- Starts from tip, cherry-picks [#551](https://github.com/fuzzywigg/math-pentathlon/pull/551) (Batch 4).
- [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) / [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) are **not** merge dependencies of #551.
- Open draft **#544** targets the same UI/types slice but uses early-`continue` / `??` / `?.` patterns that violate this task’s hard rules and is 24 commits behind tip. **Batch 5 is the compliant re-cut** of that surface on tip+#551 (same supersede pattern as #546 vs #537). Tip owner should fold Batch 5 after #551 and treat overlapping #544 product hunks as superseded.
- **#546** product paths are left untouched (Batch 2 recut ownership, includes rules).

## Cleared in this batch (per-file before → after)

| Path | Before | After | Cleared |
| --- | ---: | ---: | ---: |
| `src/games/stars-bars/board-ui.ts` | 23 | 0 | 23 |
| `src/games/kings-quadraphages/board-ui.ts` | 13 | 0 | 13 |
| `src/games/contig-60/types.ts` | 11 | 0 | 11 |
| `src/games/contig-60/board-ui.ts` | 9 | 0 | 9 |
| `src/games/hex/board-ui.ts` | 5 | 0 | 5 |
| `src/games/kings-quadraphages/board-renderer.ts` | 4 | 0 | 4 |
| `src/games/juggle/board-ui.ts` | 4 | 0 | 4 |
| `src/games/pent-em-in/board-ui.ts` | 3 | 0 | 3 |
| `src/games/kwatro-sinko/board-ui.ts` | 3 | 0 | 3 |
| `src/games/pent-em-in/types.ts` | 1 | 0 | 1 |
| `src/games/juggle/game-controller.ts` | 1 | 0 | 1 |
| **Total** | **77** | **0** | **77** |

Phase-2 out-of-scope ceiling: **450 → 373**.

## Fix style

| Pattern | Use |
| --- | --- |
| NUI dense board / config grids | `rowCells = board[row]!` + `cell = rowCells[col]!` (or throw-guard when cell may be `null`) |
| NUI tuple / regex captures | `dice[i]!`, `match[1]!` after truthy match |
| EOPT optional aria/callback fields | `...(x !== undefined ? { x } : {})`; widen `prop?: T \| undefined` |
| Impossible hole | `if (x === undefined) throw new Error('unreachable: …')` |

## Deferred (untouched) — with reason

| File / area | Count (approx) | Reason |
| --- | ---: | --- |
| All `ai.ts` / `ai-client.ts` / `ai.worker.ts` | ~219 | AI search / scoring / difficulty — Batch A + Andrew; Hex Hard 450ms stays |
| All remaining `rules.ts` | ~130 | Legal-move / scoring / win-path — AGENTS.md escalate |
| `src/games/kings-quadraphages/game-state.ts` | 6 | Engine move-apply / init indexing — deferred (Batch 4 + this batch) |
| `src/games/kings-quadraphages/board.ts` | 5 | Engine board accessors used by rules — deferred with game-state |
| `#546` paths (`calla` / `frac-fact` / `fraction-pinball` / `queens-guards` / `ramrod` / `sum-dominoes` non-AI modules) | ~87 on tip | Owned by open draft #546; do not duplicate |
| Help / tutorial / player-facing copy | 0 errors | Deliberately skipped |
| Stars & Bars history cap | — | Hard rule — not touched |

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
# expect 373 after this batch (was 450 after #551)
npm run typecheck:ratchet
```
