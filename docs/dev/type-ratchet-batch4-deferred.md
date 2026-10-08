# Type ratchet Batch 4 — deferred errors (rules / AI / engine)

**Task:** `burn-1008-mp-type-ratchet-batch4-nonrules`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0`  
**Policy:** Batch 4 clears **prime-gold** `types.ts` + `board-ui.ts` only (UI / types helpers). No `rules.ts`, AI, or move-application engine modules. Files owned by open drafts [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) (Batch 3) and [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) (Batch 2 recut) were not retouched.

## Cleared in this batch (UI / types)

| Path | Errors cleared |
| --- | ---: |
| `src/games/prime-gold/types.ts` | 65 |
| `src/games/prime-gold/board-ui.ts` | 5 |
| **Total cleared** | **70** |

Phase-2 out-of-scope ceiling: **520 → 450**.

Fix style (behavior-preserving):

- NUI: non-null assertions after definite loop / history bounds (same pattern as Batch 2 compliant recut).
- EOPT: conditional object spreads for optional `CellLabelParts` fields (same pattern as Batch 3 board-ui).

## Deferred (left untouched)

### Prime Gold (this batch’s game)

| File | Count | Bucket | Reason |
| --- | ---: | --- | --- |
| `src/games/prime-gold/rules.ts` | 10 | rules | Legal-move / placement / win-path; AGENTS.md escalate; no Batch-4 gate |
| `src/games/prime-gold/ai.ts` | 7 | AI | Search / scoring / difficulty — Batch A + Andrew |

### Kings engine leftovers (not owned by #544 board-ui pass)

Batch 3 deferred these as engine/state. They are still the only non-AI / non-rules / non-#544 / non-#546 out-of-scope files after Batch 4. Left alone because `moveKing` / `placeQuadraphage` / `getPiece` sit on move-application paths — a guard rewrite could change control flow; pure `!` would clear types but this batch stays off engine apply helpers.

| File | Count | Bucket | Reason |
| --- | ---: | --- | --- |
| `src/games/kings-quadraphages/game-state.ts` | 6 | engine / state | Move apply + init indexing; deferred pending owner engine gate |
| `src/games/kings-quadraphages/board.ts` | 5 | engine | Board accessors used by rules; deferred with game-state |

### Owned by open drafts (do not duplicate)

| Draft | Paths (non-exhaustive) |
| --- | --- |
| [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) Batch 3 | `juggle|pent-em-in|kwatro-sinko|hex|contig-60|kings-quadraphages|stars-bars` board-ui / types shells |
| [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546) Batch 2 recut | `frac-fact|fraction-pinball|queens-guards|ramrod|sum-dominoes|calla` rules/types/board-ui |

All remaining `ai*` / `ai-client` / `ai.worker` errors across games stay for **Batch A**.

## Reproduce deferred list (prime-gold + kings engine)

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 \
  | rg "error TS" \
  | rg "src/games/(prime-gold/(ai|rules)|kings-quadraphages/(game-state|board))\\.ts" \
  | sed 's/(.*//' | sort | uniq -c | sort -rn
```

## Deliberately not touched

- All `ai*` / search / scoring / difficulty / timing (Hex Hard assert stays 450ms)
- Any `rules.ts` / legal-move / scoring expressions
- Tutorial / help / player-facing copy
- Stars & Bars history cap
- Files in [#544](https://github.com/fuzzywigg/math-pentathlon/pull/544) / [#546](https://github.com/fuzzywigg/math-pentathlon/pull/546)
- Nullish / optional-chaining rewrites that could change game-logic control flow
