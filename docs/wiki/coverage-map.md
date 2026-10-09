# Unit coverage heat map

**Task id:** `q-mp-261` (regenerate after tip `#755`; wiki visual originally `q-mp-171`)  
**Scope:** Dev / wiki visuals only — no `src/` product edits, no AI timing or player-facing copy changes.  
**Canonical artifacts:** [`docs/dev/coverage-map.md`](../dev/coverage-map.md) + [`docs/dev/coverage-map.svg`](../dev/coverage-map.svg).

Per-directory vitest unit coverage (`json-summary`), sorted by **lines %** ascending so cold spots surface first. Regenerated on tip `cursor/mp-tip-post755` @ `74a1596f` from a fresh `npm run test:unit:coverage` (stamp in the SVG title / generated-at line of the dev doc).

## Coldest directories (lines %)

Live tip measurement after regenerate (38 directories under `src/`):

| Directory | Lines % | Branches % | Files |
| --- | ---: | ---: | ---: |
| `src/core/ai-worker` | 79.66 | 66.67 | 4 |
| `src` | 80.88 | 58.93 | 1 |
| `src/ui/three` | 89.07 | 69.06 | 13 |
| `src/ui/owl` | 91.88 | 72.86 | 2 |
| `src/games/hex` | 92.83 | 88.16 | 8 |
| `src/games/pent-em-in` | 93.82 | 85.76 | 7 |
| `src/games/par-55` | 93.88 | 85.75 | 6 |
| `src/games/remainder-islands` | 94.00 | 83.99 | 6 |

Repo-wide on that run: **95.08%** lines (22600/23768), **87.81%** branches.

## Full heat table (SVG)

![Unit coverage by directory — coldest first](../dev/coverage-map.svg)

## Regenerate

```bash
npm run test:unit:coverage
npm run report:coverage-map
npm run check:dev-docs
```

Under coverage instrumentation, the local AI move-time mid-game bench can still emit **fab-a-diffy** / **fiar** `hardFlags` flakes. Do **not** change AI timing asserts or thresholds to silence those — note them in the PR instead (Hex Hard stays **450ms**).

## Related

- Dev map + regen notes: [`docs/dev/coverage-map.md`](../dev/coverage-map.md)
- Development commands: [Development](./development.md)
- CI unit budget / AI-bench skips: [CI unit budget](./ci-unit-budget.md)
