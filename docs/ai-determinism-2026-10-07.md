# AI determinism & seed audit — 2026-10-07

Base tip: `cursor/overnight-fold-coverage-tip-460a` (#466).  
Rules/scoring were **not** changed. Product AI search APIs were not refactored;
only tests + this report were added (no clear `Math.random` leak on seeded
search paths required a production fix).

## Scope

For every game under `src/games/*/ai.ts`, at each difficulty (`easy` /
`medium` / `hard`):

1. **Determinism** — with a fixed seed, the same position always yields the
   same move across **50** mid-game (or decision-surface) states.
2. **Quality ladder** — easy/medium differ from hard in measurable move
   quality (oracle agreement, scored-move means, or quiz accuracy).

Tests live in:

- `tests/unit/ai-determinism-helpers.ts`
- `tests/unit/ai-determinism-2026-10-07.test.ts`

## Seeding model

| Pattern | Games |
| --- | --- |
| Native `options.seed` → `createSeededRng` | `fab-a-diffy`, `fiar`, `hex`, `queens-guards` |
| `Math.random` mocked with `createSeededRng` in tests | All other board/dice AIs |
| Quiz accuracy (`accuracy` config, not board search) | `frac-fact`, `fraction-pinball` |

Anytime/deadline engines (`hex`, `queens-guards`, `fab-a-diffy`) use a
**virtual clock** in tests (`now` advances by a fixed tick) so truncation is
reproducible and not wall-clock dependent.

## Leak audit (seeded engines)

Spy on `Math.random` while calling:

- `hex.getBestMove(..., { seed })`
- `queens-guards.getAIMove(..., { seed })`
- `fab-a-diffy.getAIMove(..., { seed })`
- `fiar.getAIMove(..., { seed })`

**Result: no calls.** Seeded search paths route entropy through
`createSeededRng` only.

Notes (not bugs on the seeded search path):

- `hex.getRandomMove` still uses `Math.random` — separate unseeded helper,
  not used when `options.seed` is passed to `getBestMove` / `searchBestMove`.
- `kwatro-sinko` uses a soft `performance.now()` think budget that can skip
  the randomness branch when evaluation is slow. Two back-to-back calls under
  a mocked RNG still matched in this audit; cross-machine wall-clock variance
  is outside the seed contract.

**No production code changes were required** for clear seeding leaks.

## Determinism results (50 states × 3 difficulties)

| Game | Entry | Seed mechanism | Result |
| --- | --- | --- | --- |
| calla | `getAIMove` | Math.random mock | PASS |
| contig-60 | `getAIPlacement` | Math.random mock | PASS |
| fab-a-diffy | `getAIMove` | `options.seed` + virtual clock | PASS |
| fiar | `getAIMove` | `options.seed` | PASS |
| hex | `getBestMove` | Math.random mock + clock; also `options.seed` API test | PASS |
| hex-a-gone | `getAISelection` / `getAIPlacement` | Math.random mock | PASS |
| juggle | `getAIDieChoice` | Math.random mock | PASS |
| kings-quadraphages | `getAIMove` | Math.random mock (hard has no RNG) | PASS |
| kwatro-sinko | `getAIMove` | Math.random mock | PASS |
| par-55 | `getAIMove` | Math.random mock | PASS |
| pent-em-in | `getAIMove` | Math.random mock | PASS |
| prime-gold | `getAIPlacement` | Math.random mock | PASS |
| queens-guards | `getAIMove` | Math.random mock + clock; also `options.seed` API test | PASS |
| ramrod | `getAIMove` | Math.random mock | PASS |
| remainder-islands | `getAIIslandChoice` | Math.random mock | PASS |
| star-track | `getAIChainChoice` | Math.random mock | PASS |
| stars-bars | `getAIMove` | Math.random mock | PASS |
| sum-dominoes | `getAIMove` | Math.random mock | PASS |
| frac-fact | `getAIAnswer` | Math.random mock | PASS |
| fraction-pinball | `getAIAnswer` | Math.random mock | PASS |

Mid-game generation notes:

- Dice/draw games (`contig-60`, `prime-gold`, `sum-dominoes`, `juggle`,
  `remainder-islands`, `star-track`) sample after a legal roll/draw.
- Opening-rich engines (`fab-a-diffy`, `par-55`, `pent-em-in`, `ramrod`,
  `stars-bars`, `hex-a-gone` selection) use the opening decision surface when
  that is already a multi-option AI choice (still 50 seeded trials).
- Plied mid-boards: `calla`, `hex`, `fiar`, `kings-quadraphages`,
  `kwatro-sinko`, `queens-guards`.

## Quality ladder results

Metric A (most board AIs): agreement with a **hard oracle**
(`Math.random` glued to `0` → never take randomness/teaching branches; hex
jitter then applies a uniform delta so minimax order is preserved). Assert
hard agrees at least as often as easy, and easy/medium diverge from hard on
≥10% of samples **or** easy agrees strictly less often than hard.

Metric B (`calla`): mean `analyzeMoves` score of chosen pits — hard ≥ easy,
with divergence or strict score gap.

Metric C (`kings-quadraphages`): hard always matches `getBestMove` (full
search); easy/medium diverge from hard on ≥10% of samples.

Metric D (quiz): correct-answer rate — `hard > easy` and
`hard ≥ medium`.

| Game | Metric | Result |
| --- | --- | --- |
| calla | B | PASS |
| contig-60 | A | PASS |
| fab-a-diffy | A | PASS |
| fiar | A | PASS |
| hex | A (clock-aligned) | PASS |
| hex-a-gone | A | PASS |
| juggle | A | PASS |
| kings-quadraphages | C | PASS |
| kwatro-sinko | A | PASS |
| par-55 | A | PASS |
| pent-em-in | A | PASS |
| prime-gold | A | PASS |
| queens-guards | A (clock-aligned) | PASS |
| ramrod | A | PASS |
| remainder-islands | A | PASS |
| star-track | A | PASS |
| stars-bars | A | PASS |
| sum-dominoes | A | PASS |
| frac-fact | D | PASS |
| fraction-pinball | D | PASS |

## Config snapshot (reference)

Hard still has small `randomness` on most engines (typically 0.02–0.05);
only **kings-quadraphages hard** is fully RNG-free. Quiz hard accuracy is
0.95 / 0.92 (frac-fact / pinball), not 1.0.

## How to reproduce

```bash
npx vitest run tests/unit/ai-determinism-2026-10-07.test.ts
npm run lint
npx tsc --noEmit
npm run test:unit
npm run test:e2e -- --project=chromium
```
