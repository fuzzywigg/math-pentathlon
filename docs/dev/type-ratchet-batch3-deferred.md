# Type ratchet Batch 3 — deferred errors (rules / AI / engine)

**Task:** `burn-1008-mp-type-ratchet-batch3-nonrules`  
**Tip / base:** `cursor/integration-fold-wave5-tip-4af0`  
**Policy:** Per compliance review [#538](https://github.com/fuzzywigg/math-pentathlon/pull/538), Batch 3 does **not** rewrite `rules.ts` / engine / AI modules (outcome risk). Only UI, rendering, input, state/persistence, and shell modules were cleared under ratchet flags.

## Cleared in this batch (UI / shell)

| Path | Errors cleared |
| --- | ---: |
| `src/games/stars-bars/board-ui.ts` | 23 |
| `src/games/kings-quadraphages/board-ui.ts` | 13 |
| `src/games/contig-60/types.ts` | 11 |
| `src/games/contig-60/board-ui.ts` | 9 |
| `src/games/hex/board-ui.ts` | 5 |
| `src/games/kings-quadraphages/board-renderer.ts` | 4 |
| `src/games/juggle/board-ui.ts` | 4 |
| `src/games/pent-em-in/board-ui.ts` | 3 |
| `src/games/kwatro-sinko/board-ui.ts` | 3 |
| `src/games/pent-em-in/types.ts` | 1 |
| `src/games/juggle/game-controller.ts` | 1 |
| **Total cleared** | **77** |

Phase-2 out-of-scope ceiling: **520 → 443**.

## Deferred (left untouched) — counts per file

These remain out-of-scope until a future batch with an explicit rules/AI gate (Batch A for AI; rules/engine only with Andrew approval after #538).

| File | Count | Bucket |
| --- | ---: | --- |
| `src/games/contig-60/ai.ts` | 19 | AI |
| `src/games/stars-bars/ai.ts` | 18 | AI |
| `src/games/juggle/ai.ts` | 18 | AI |
| `src/games/kwatro-sinko/ai.ts` | 15 | AI |
| `src/games/hex/ai.ts` | 13 | AI |
| `src/games/stars-bars/rules.ts` | 12 | rules |
| `src/games/pent-em-in/ai.ts` | 12 | AI |
| `src/games/kings-quadraphages/ai.ts` | 11 | AI |
| `src/games/hex/rules.ts` | 11 | rules |
| `src/games/kwatro-sinko/rules.ts` | 9 | rules |
| `src/games/pent-em-in/rules.ts` | 7 | rules |
| `src/games/kings-quadraphages/game-state.ts` | 6 | engine / state |
| `src/games/kings-quadraphages/board.ts` | 5 | engine |
| `src/games/contig-60/rules.ts` | 4 | rules |
| `src/games/hex/ai-client.ts` | 3 | AI |
| `src/games/juggle/rules.ts` | 2 | rules |
| `src/games/kings-quadraphages/rules.ts` | 1 | rules |
| `src/games/hex/ai.worker.ts` | 1 | AI |
| **Deferred total (Batch 3 games)** | **167** | |

### Deferred by game

| Game | AI | Rules / engine | Total deferred |
| --- | ---: | ---: | ---: |
| contig-60 | 19 | 4 | 23 |
| stars-bars | 18 | 12 | 30 |
| juggle | 18 | 2 | 20 |
| kwatro-sinko | 15 | 9 | 24 |
| hex | 17 | 11 | 28 |
| pent-em-in | 12 | 7 | 19 |
| kings-quadraphages | 11 | 12 | 23 |
| **Sum** | **110** | **57** | **167** |

## Reproduce deferred list

```bash
npx tsc --noEmit -p tsconfig.ratchet.json --pretty false 2>&1 \
  | rg "error TS" \
  | rg "src/games/(juggle|pent-em-in|kwatro-sinko|hex|contig-60|kings-quadraphages|stars-bars)/(ai|ai-client|ai\\.worker|rules|game-state|board)\\.ts" \
  | sed 's/(.*//' | sort | uniq -c | sort -rn
```

## Deliberately not touched

- All `ai*` / search / scoring / difficulty / timing (Hex Hard assert stays 450ms)
- `rules.ts`, `game-state.ts`, `board.ts` (engine) in Batch 3 games
- Tutorial / help / player-facing copy
- Stars & Bars history cap
- Files owned by draft [#537](https://github.com/fuzzywigg/math-pentathlon/pull/537) (Batch 2 games)
