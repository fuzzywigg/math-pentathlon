# Unit coverage heat map

**Task id:** `q-mp-336` (regenerate after tip `#830` / post830; supersedes `q-mp-311` / `q-mp-286` / `q-mp-261`; wiki visual originally `q-mp-171`)  
**Scope:** Dev / wiki visuals only — no `src/` product edits, no AI timing or player-facing copy changes.  
**Canonical artifacts:** [`docs/dev/coverage-map.md`](../dev/coverage-map.md) + [`docs/dev/coverage-map.svg`](../dev/coverage-map.svg).

Per-directory vitest unit coverage (`json-summary`), sorted by **lines %** ascending so cold spots surface first. Regenerated on tip `cursor/mp-tip-post830` @ `97487de6` from a fresh `npm run test:unit:coverage` (stamp in the SVG title / generated-at line of the dev doc).

## Coldest directories (lines %)

Live tip measurement after regenerate (38 directories under `src/`):

| Directory | Lines % | Branches % | Files |
| --- | ---: | ---: | ---: |
| `src` | 87.25 | 69.64 | 1 |
| `src/games/hex` | 92.83 | 88.16 | 8 |
| `src/games/pent-em-in` | 93.82 | 85.76 | 7 |
| `src/games/queens-guards` | 94.16 | 92.13 | 9 |
| `src/ui/three` | 94.26 | 80.02 | 13 |
| `src/games/fiar` | 94.28 | 85.28 | 10 |
| `src/games/kings-quadraphages` | 94.80 | 88.59 | 11 |
| `src/core` | 95.13 | 87.70 | 12 |

Repo-wide on that run: **96.60%** lines (23072/23882), **90.58%** branches.

## Full heat table (SVG)

![Unit coverage by directory — coldest first](../dev/coverage-map.svg)

## Regenerate

```bash
npm run test:unit:coverage
npm run report:coverage-map
npm run check:dev-docs
```

Under coverage instrumentation, the local AI move-time mid-game bench can still emit **fab-a-diffy** / **fiar** / determinism `hardFlags` flakes. Do **not** change AI timing asserts or thresholds to silence those — note them in the PR instead (Hex Hard stays **450ms**).

## Related

- Dev map + regen notes: [`docs/dev/coverage-map.md`](../dev/coverage-map.md)
- Development commands: [Development](./development.md)
- CI unit budget / AI-bench skips: [CI unit budget](./ci-unit-budget.md)
