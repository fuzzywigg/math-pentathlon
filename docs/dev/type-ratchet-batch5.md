# Type ratchet Batch 5 — UI / shell / types (non-rules)

**Task:** `burn-1008-mp-type-ratchet-batch5-nonrules`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0` (post-#551 / #544 fold)  
**Policy:** Behavior-neutral fixes only — explicit types, NUI non-null asserts after definite bounds, EOPT conditional spreads. Soft undefined-guards kept where tip already soft-returned (no new throw paths). **No** `??` / `?.` / default-value rewrites that could change a runtime value. No AI / rules / engine / copy.

## Stacking

- [#551](https://github.com/fuzzywigg/math-pentathlon/pull/551) Batch 4 and [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) product surfaces were already on tip.
- Open draft **#544** used early-`continue` / `??` / `?.` patterns that violate Batch-5 hard rules. **Batch 5 is the compliant re-cut** of that surface (same supersede pattern as #546 vs #537).
- Tip fold replaces residual #544 runtime-semantic guards with `#553` `!` / EOPT / soft-narrow forms; throw-guards from #553 that would throw where tip soft-returned were dropped in favor of `!` (dense grids) or tip soft-returns (exported click handlers).
- **#546** product paths are left untouched (Batch 2 recut ownership, includes rules).

## Cleared / recut in this batch

| Path | Change |
| --- | --- |
| `src/games/stars-bars/board-ui.ts` | `#544` `continue` / `?.` → dense-grid `!` |
| `src/games/kings-quadraphages/board-ui.ts` | `#544` `??` / `?.` → `!` on sync; soft-return kept on click |
| `src/games/kings-quadraphages/board-renderer.ts` | `#544` `continue` → dense-grid `!` |
| `src/games/contig-60/board-ui.ts` | `#544` `continue` → dense-grid `!` |
| `src/games/contig-60/types.ts` | comment align (already `!`) |
| `src/games/hex/board-ui.ts` | `#544` early-return / `?? null` → dense-grid `!` (no throw) |
| `src/games/juggle/board-ui.ts` | `#544` `continue` → dense-grid / dice `!` |
| `src/games/pent-em-in/board-ui.ts` | `#544` `continue` → `"r,c"` key `!` |
| `src/games/kwatro-sinko/board-ui.ts` | `#544` `match?.[n] ?? '0'` → `match ? match[n]! : '0'` |

Phase-2 out-of-scope ceiling: re-baselined **DOWN** to the live combined count after this fold (never up; tip was **286** pre-fold).

## Fix style

| Pattern | Use |
| --- | --- |
| NUI dense board / config grids | `rowCells = board[row]!` + `cell = rowCells[col]!` |
| NUI tuple / regex captures | `dice[i]!`, `match[1]!` after truthy match |
| EOPT optional aria/callback fields | `...(x !== undefined ? { x } : {})`; widen `prop?: T \| undefined` |
| Exported click soft-paths | Keep tip soft-return / invalid-click; do **not** throw |

## Deferred (untouched) — with reason

| File / area | Reason |
| --- | --- |
| All `ai.ts` / `ai-client.ts` / `ai.worker.ts` | AI search / scoring / difficulty — Batch A + Andrew; Hex Hard 450ms stays |
| All remaining `rules.ts` | Legal-move / scoring / win-path — AGENTS.md escalate |
| `src/games/kings-quadraphages/game-state.ts` / `board.ts` | Engine — deferred with Batch 4 |
| `#546` paths | Owned by Batch 2 recut |
| Help / tutorial / player-facing copy | Deliberately skipped |
| Stars & Bars history cap | Hard rule — not touched |

## Reproduce

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 | rg -c "error TS"
npm run typecheck:ratchet
node docs/dev/type-ratchet-phase2-export.mjs --check
```
