# Engine branch coverage — remaining modules (2026-10-07)

Hand-built-state unit tests for engine/rules modules still under **95% branch**
after excluding games already covered elsewhere:

**Excluded (already covered / in parallel):** kwatro-sinko, kings-quadraphages,
fiar, ramrod, queens-guards, par-55, calla, fraction-pinball.

**In scope this pass:** every other `src/games/*/rules.ts` (and companion
engine state modules) under 95% branch — only **hex-a-gone** qualified.

No engine code, rules, or scoring changes.

## Method

- Baseline and after: `vitest run --coverage` with `coverage.include` limited
  to `src/games/*/rules.ts` and `src/games/*/game-state.ts`.
- New suite (tests only):
  - `tests/unit/engine-coverage-hex-a-gone-targeted.test.ts`

## Baseline inventory (branch %, all rules engines)

| Module | Branches | Branch % | Notes |
| --- | ---: | ---: | --- |
| `kwatro-sinko/rules.ts` | 102/116 | 87.93% | excluded |
| `ramrod/rules.ts` | 74/83 | 89.15% | excluded |
| `par-55/rules.ts` | 74/82 | 90.24% | excluded |
| `kings-quadraphages/rules.ts` | 46/50 | 92.00% | excluded |
| `calla/rules.ts` | 85/92 | 92.39% | excluded |
| `fiar/rules.ts` | 100/107 | 93.45% | excluded |
| `fraction-pinball/rules.ts` | 50/53 | 94.33% | excluded |
| `kings-quadraphages/game-state.ts` | 52/55 | 94.54% | excluded |
| **`hex-a-gone/rules.ts`** | **70/74** | **94.59%** | **this PR** |
| `contig-60/rules.ts` | 59/62 | 95.16% | already ≥95% |
| `prime-gold/rules.ts` | 64/67 | 95.52% | already ≥95% |
| `sum-dominoes/rules.ts` | 107/111 | 96.39% | already ≥95% |
| `star-track/rules.ts` | 41/42 | 97.61% | already ≥95% |
| `pent-em-in/rules.ts` | 49/50 | 98.00% | already ≥95% |
| `remainder-islands/rules.ts` | 50/51 | 98.03% | already ≥95% |
| `queens-guards/rules.ts` | 101/103 | 98.05% | excluded (≥95%) |
| `stars-bars/rules.ts` | 59/60 | 98.33% | already ≥95% |
| `frac-fact/rules.ts` | 61/62 | 98.38% | already ≥95% |
| `fab-a-diffy/rules.ts` | 104/105 | 99.04% | already ≥95% |
| `hex/rules.ts` | 62/62 | 100% | already ≥95% |
| `juggle/rules.ts` | 51/51 | 100% | already ≥95% |

## Before / after (hex-a-gone)

| Module | Before branches | After branches | Δ covered arms |
| --- | --- | --- | --- |
| `src/games/hex-a-gone/rules.ts` | 70/74 (**94.59%**) | 73/74 (**98.64%**) | +3 |

## Branches newly covered (by theme)

### Hex-a-Gone

- `selectBlock` / `deselectBlock` identity when `turnSelection.committed` is
  true while `phase === 'selectBlocks'` (forged; public `commitSelection`
  always flips phase to `placeBlocks`, so the committed gate was unreachable
  through the normal API).
- `placeBlock` `remainingBlocks[0] \|\| null` falsy-head fallback when a forged
  empty selection entry remains after placing the selected shape.

## Unreachable branches (documented, not forced)

These arms remain uncovered under the current public API without changing
engine code. They are defensive / impossible given prior guards.

### `hex-a-gone/rules.ts`

| Line | Arm | Why unreachable |
| --- | --- | --- |
| 242–243 | `default` in `getPhaseMessage` switch | `GamePhase` is only `selectBlocks` \| `placeBlocks` \| `gameOver`; default is a compile-time exhaustiveness / future-proof return. |

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run test:unit:coverage -- \
  --coverage.include='src/games/hex-a-gone/rules.ts'
```
