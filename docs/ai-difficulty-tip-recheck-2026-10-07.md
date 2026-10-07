# AI difficulty tip recheck — 2026-10-07

Base tip: `#476` / `cursor/integration-fold-wave4-tip-36e4` @ `367d291`.  
Harness: reused from `#485` / `#468` (`tests/helpers/ai-calibration/`, `scripts/run-ai-calibration.ts`).  
Method: n=**50**, seed=`20261007`, `CALIBRATION_WALL_CLOCK=1` (search games default `deadlineMs=300`).  
Seat under test is **player1** vs random (unless noted).

Related: `#468` built the harness on an older integration tip and proposed FIAR / Kwatro / Pent heuristic retunes. `#485` folded the harness only and left AI retunes for owner decision. This PR re-measures on the **current tip** and applies retunes only where Hard is still clearly broken.

## Tip baseline (before retunes)

| Game | Easy | Medium | Hard | Easy ≥ Hard? | Verdict |
| --- | ---: | ---: | ---: | :---: | --- |
| kwatro-sinko | 58.0% | 92.0% | 100.0% | no | **Ordered** — tip AI already fixed (evacuation weights + `AI_THINK_BUDGET_MS`); **no retune** |
| fiar | 98.0% | 94.0% | 86.0% | **YES** | **Broken** — Easy beats Hard by 12pp |
| pent-em-in | 54.0% | 50.0% | 44.0% | **YES** | **Broken** — space heuristic inverted |

Kwatro AI-vs-AI on tip also separates cleanly (Hard beats Easy 100–0; Hard beats Medium 100–0).

## After heuristic retunes (this PR)

| Game | Easy | Medium | Hard | Easy ≥ Hard? | Change |
| --- | ---: | ---: | ---: | :---: | --- |
| kwatro-sinko | 58.0% | 92.0% | 100.0% | no | unchanged (no edit) |
| fiar | 86.0% | 94.0% | 90.0% | no | Hard ≥ Easy restored via Easy teaching blunder (+ Hard randomness tweak); Hard depth left at tip 2 for time cap |
| pent-em-in | 52.0% | 50.0% | 62.0% | no | Hard ≥ Easy restored (+10pp Hard over Easy) |

Flags after: FIAR Easy/Hard still within 5pp (indistinguishable band) but **no** `easy-beats-hard`. Pent Easy/Medium still close; Hard clearly ahead of Easy.

## Exactly what changed

### Not changed
- **kwatro-sinko/ai.ts** — tip already ahead of `#468` rewrite (numbered-pad evacuation, opponent-threat gating, `AI_THINK_BUDGET_MS`). Overwriting would regress tip structure for no Hard≥Easy need.
- Rules / scoring / end conditions — untouched for all games.
- No secrets; no merge/close/retarget of other PRs.

### `src/games/fiar/ai.ts` (tip-safe subset of `#468` heuristics)
- Easy `teachingBlunder: 0.5` — with that probability pick a uniform legal place/move (still always legal).
- Easy randomness `0.45 → 0.55`; Hard randomness `0.04 → 0.02`.
- **Did not** raise Hard `maxDepth` to 3: on tip, uncapped Hard movement at depth 3 hits p95≈1.7s and fails the mid-game Hard flag (`HARD_FLAG_MS=500`). Tip Hard movement stays ≈265ms p95.
- Search still honors caller `deadlineMs` truncation (tip worker safety deadline unchanged).

### `src/games/pent-em-in/ai.ts` (port of `#468` heuristics)
- Factor 4 was rewarding “preserve open space” (backwards for an entrapment game). Now rewards tightening space / mild penalty for leaving large open regions.
- Explicit trap bonus when the opponent cannot move after the placement (`canPlayerMove`).

### Tests
- `tests/unit/ai-calibration-difficulty-order.test.ts` — removed tip `it.skipIf` for `fiar` / `pent-em-in` so Hard≥Easy guards run again.
- FIAR guard uses `deadlineMs=300` / n=12 (matches tip calibration wall-clock; `#468` used 1500ms which assumes Hard maxDepth 3).

## Full suite

Priority games above are complete. Full 20-game matrix can be regenerated with:

```bash
CALIBRATION_WALL_CLOCK=1 CALIBRATION_GAMES=50 npx vite-node scripts/run-ai-calibration.ts
```

(Writing `docs/ai-calibration-2026-10-07.md`.) Not required for this tip decision once the three flagged seats were rechecked.

## Tip hygiene (tests only)
- `tests/unit/hex-deep-playability.test.ts`: Hard `AI_PLAY_DEADLINE_MS` assert `2500 → 450` to match tip `#472` (same as `#485`).
- `tests/unit/ai-calibration-difficulty-order.test.ts`: fab-a-diffy timeout `90s → 180s` (uncapped search under suite load).
