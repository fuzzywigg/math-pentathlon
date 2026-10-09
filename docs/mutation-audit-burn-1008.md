# Mutation audit — burn-1008-mp-mutation-audit

Report-only mutation measurement for `src/games/*/rules.ts`.

## Harness

Stryker (`@stryker-mutator/core`) was probed via `npx` but not adopted: Vitest multi-project `isolate:false` plus environment/babel engine constraints made a reliable Stryker+Vitest run impractical here. Instead:

```bash
npm run mutation:report
# optional: npm run mutation:report -- --games=hex,fiar --max=30
```

Implementation: `scripts/mutation-report.mjs` (TypeScript AST mutants → focused rules unit tests). **Not wired into CI.**

Mutant operators: comparison/equality flips, arithmetic flips, logical `&&`/`||`, boolean literals, unary `!` removal, small integer ±1. Type-annotation subtrees are skipped.

## Baseline (max 30 mutants / engine)

| Game | Score % | Killed / Ran |
|------|--------:|-------------:|
| frac-fact | 0.0 | 0/30 |
| par-55 | 0.0 | 0/30 |
| ramrod | 20.0 | 6/30 |
| sum-dominoes | 23.3 | 7/30 |
| fraction-pinball | 26.7 | 8/30 |
| queens-guards | 30.0 | 9/30 |
| fiar | 33.3 | 10/30 |
| juggle | 36.7 | 11/30 |
| fab-a-diffy | 43.3 | 13/30 |
| pent-em-in | 46.7 | 14/30 |
| prime-gold | 46.7 | 14/30 |
| remainder-islands | 53.3 | 16/30 |
| stars-bars | 60.0 | 18/30 |
| hex | 63.3 | 19/30 |
| kwatro-sinko | 63.3 | 19/30 |
| star-track | 70.0 | 21/30 |
| contig-60 | 73.3 | 22/30 |
| calla | 80.0 | 24/30 |
| hex-a-gone | 80.0 | 24/30 |
| kings-quadraphages | 100.0 | 30/30 |

Full machine-readable baseline: `docs/mutation-report-rules-baseline.json`.

## Focused modules (weakest 5) — before → after

| Game | Before % | After % | Delta |
|------|--------:|--------:|------:|
| frac-fact | 0.0 | 30.0 | +30.0 |
| par-55 | 0.0 | 100.0 | +100.0 |
| ramrod | 20.0 | 100.0 | +80.0 |
| sum-dominoes | 23.3 | 73.3 | +50.0 |
| fraction-pinball | 26.7 | 60.0 | +33.3 |

After report: `docs/mutation-report-rules-after.json`.

## Surviving mutants (after) — notes

No production rules bugs were confirmed. Remaining survivors are largely:

- **Equivalent / near-equivalent distractor strategies** (Frac Fact / Fraction Pinball): flipping `+1`/`-1`/`*2` inside wrong-answer generators still yields valid non-correct choices under loose uniqueness checks.
- **COMMON_FRACTIONS gaps**: e.g. medium `denominator <= 8` → `<= 9` is equivalent because no denom-9 entries exist in `COMMON_FRACTIONS`.
- **Shuffle-dependent seed slice** (Sum Dominoes): `STARTING_HAND_SIZE * 2` arithmetic mutants often still leave a double-six seed outside both hands under the deterministic `Math.random = 0` shuffle used in tests.

No `it.skip` / `it.todo` bug markers were required.

## Avoided overlap

Draft PRs reviewed for duplication:

- **#482** edge-case suite — not duplicated (different assertions; tip already carries that file).
- **#499** property invariants — merged / already on tip; not duplicated.
- **#465** state round-trip fuzz — already on tip; not duplicated.

New suites are `tests/unit/mutation-*-rules.test.ts` only.
