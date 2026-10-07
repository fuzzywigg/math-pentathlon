# Engine unit branch coverage — 2026-10-07

Measured with `npm run test:unit:coverage` (Vitest + `@vitest/coverage-v8`).
Engines are each game’s `src/games/*/rules.ts` (Kings also reports `game-state.ts` separately; ranking uses `rules.ts`).

No `fast-check` dependency — invariant suite uses seeded mulberry32 loops
(`tests/unit/engine-invariants-helpers.ts`,
`tests/unit/engine-coverage-invariants-2026-10-07.test.ts`).

Rules/scoring were **not** changed.

## Before (baseline, pre-invariant suite)

| Rank | Engine | Branch % | Covered / Total |
| ---: | --- | ---: | --- |
| 1 (lowest) | kwatro-sinko | 87.93% | 102 / 116 |
| 2 | ramrod | 89.15% | 74 / 83 |
| 3 | par-55 | 90.24% | 74 / 82 |
| 4 | kings-quadraphages | 92.00% | 46 / 50 |
| 5 | calla | 92.39% | 85 / 92 |
| 6 | fiar | 93.45% | 100 / 107 |
| 7 | fraction-pinball | 94.33% | 50 / 53 |
| — | kings-quadraphages/game-state | 94.54% | 52 / 55 |
| 8 | hex-a-gone | 94.59% | 70 / 74 |
| 9 | contig-60 | 95.16% | 59 / 62 |
| 10 | prime-gold | 95.52% | 64 / 67 |
| 11 | sum-dominoes | 96.39% | 107 / 111 |
| 12 | star-track | 97.61% | 41 / 42 |
| 13 | pent-em-in | 98.00% | 49 / 50 |
| 14 | remainder-islands | 98.03% | 50 / 51 |
| 15 | queens-guards | 98.05% | 101 / 103 |
| 16 | stars-bars | 98.33% | 59 / 60 |
| 17 | frac-fact | 98.38% | 61 / 62 |
| 18 | fab-a-diffy | 99.04% | 104 / 105 |
| 19 | hex | 100.00% | 62 / 62 |
| 20 | juggle | 100.00% | 51 / 51 |

**Six lowest targeted for invariant tests:** kwatro-sinko, ramrod, par-55,
kings-quadraphages, calla, fiar.

## After (post-invariant suite)

_Filled after re-running coverage with the new tests._

| Engine | Branch % before | Branch % after | Δ branches covered |
| --- | ---: | ---: | ---: |
| kwatro-sinko | 87.93% | _pending_ | _pending_ |
| ramrod | 89.15% | _pending_ | _pending_ |
| par-55 | 90.24% | _pending_ | _pending_ |
| kings-quadraphages | 92.00% | _pending_ | _pending_ |
| calla | 92.39% | _pending_ | _pending_ |
| fiar | 93.45% | _pending_ | _pending_ |

## Invariants asserted

For each of the six engines (where applicable):

1. **Non-negative scores / chips / cubes / supply / inventory** under seeded random play.
2. **Legal-move generator soundness** — every generated move/placement is accepted by the corresponding validator (`isValidMove` / `isValidPlacement` / `canSelectPit` / `canMove` / `canPlaceChip`).
3. **Termination under random play within a bound** (when the rules force progress).
4. **State immutability** — move/select APIs do not mutate the prior state object’s scored/board fields.

## Invariant violations / skipped cases

These are **not** scoring/rules bugs introduced by this work; they are documented
limits of the current rule sets under unbounded random play. Tests are
`it.skip` with a `TODO(engine-coverage-2026-10-07)` marker:

| Engine | Invariant | Status | Notes |
| --- | --- | --- | --- |
| kwatro-sinko | Terminates within bound under random play | **SKIPPED** | No draw-by-repetition or forced-progress rule; chips can cycle forever without forming a declarable win. |
| fiar | Terminates within bound under random play | **SKIPPED** | Placement ends, but movement has no repetition rule; random sliding often exceeds any modest bound without a win or no-move draw. |

All other invariants above **passed** for the six engines (see unit test file).

## How to reproduce

```bash
npm run test:unit:coverage
# inspect coverage/coverage-summary.json for src/games/*/rules.ts
npx vitest run tests/unit/engine-coverage-invariants-2026-10-07.test.ts
```
