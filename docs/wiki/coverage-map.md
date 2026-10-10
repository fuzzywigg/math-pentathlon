# Unit coverage heat map

**Task id:** `q-mp-417` (regenerate after tip post865 cut + suite **3210**/3213; supersedes `q-mp-336` / `q-mp-311` / `q-mp-286` / `q-mp-261`; wiki visual originally `q-mp-171`)  
**Scope:** Dev / wiki visuals only — no `src/` product edits, no AI timing or player-facing copy changes.  
**Canonical artifacts:** [`docs/dev/coverage-map.md`](../dev/coverage-map.md) + [`docs/dev/coverage-map.svg`](../dev/coverage-map.svg).

Per-directory vitest unit coverage (`json-summary`), sorted by **lines %** ascending so cold spots surface first. Regenerated on tip `cursor/mp-tip-post865` @ `108c333d` from a fresh `npm run test:unit:coverage` (stamp in the SVG title / generated-at line of the dev doc).

## Coldest directories (lines %)

Live tip measurement after regenerate (38 directories under `src/`):

| Directory | Lines % | Branches % | Files |
| --- | ---: | ---: | ---: |
| `src` | 87.25 | 69.64 | 1 |
| `src/games/queens-guards` | 93.42 | 91.17 | 9 |
| `src/games/pent-em-in` | 93.82 | 85.76 | 7 |
| `src/ui/three` | 94.26 | 80.02 | 13 |
| `src/games/hex` | 94.63 | 92.21 | 8 |
| `src/games/kings-quadraphages` | 94.80 | 88.59 | 11 |
| `src/games/fiar` | 94.86 | 86.04 | 10 |
| `src/core` | 95.26 | 87.96 | 12 |

Repo-wide on that run: **96.86%** lines (23139/23887), **91.26%** branches. Coverage vitest files: **3213** (3211 passed | 2 skipped). Spec cited suite **3210**; live tip after folds is **3213**.

## Full heat table (SVG)

![Unit coverage by directory — coldest first](../dev/coverage-map.svg)

## Regenerate

```bash
npm run test:unit:coverage
npm run report:coverage-map
npm run check:dev-docs
```

Under coverage instrumentation, the local AI move-time mid-game bench can still emit **fab-a-diffy** / **fiar** / determinism `hardFlags` flakes. Do **not** change AI timing asserts or thresholds to silence those — note them in the PR instead (Hex Hard stays **450ms**). This post865 regenerate completed with EXIT 0 (no flakes).

## Related

- Dev map + regen notes: [`docs/dev/coverage-map.md`](../dev/coverage-map.md)
- Development commands: [Development](./development.md)
- CI unit budget / AI-bench skips: [CI unit budget](./ci-unit-budget.md)
