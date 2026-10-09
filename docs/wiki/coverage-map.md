# Unit coverage heat map

**Task id:** `q-mp-171`  
**Scope:** Dev / wiki visuals only — no `src/` product edits, no AI timing or player-facing copy changes.  
**Canonical artifacts:** [`docs/dev/coverage-map.md`](../dev/coverage-map.md) + [`docs/dev/coverage-map.svg`](../dev/coverage-map.svg).

Per-directory vitest unit coverage (`json-summary`), sorted by **lines %** ascending so cold spots surface first. Regenerated on tip `cursor/mp-tip-post728` from a fresh `npm run test:unit:coverage` (stamp in the SVG title / generated-at line of the dev doc).

## Coldest directories (lines %)

Live tip measurement after regenerate (38 directories under `src/`):

| Directory | Lines % | Branches % | Files |
| --- | ---: | ---: | ---: |
| `src/core/ai-worker` | 79.66 | 66.67 | 4 |
| `src` | 80.88 | 58.93 | 1 |
| `src/ui/three` | 89.00 | 68.98 | 13 |
| `src/games/juggle` | 91.17 | 86.08 | 6 |
| `src/ui/owl` | 91.88 | 73.87 | 2 |
| `src/games/kwatro-sinko` | 91.96 | 85.56 | 7 |
| `src/games/fiar` | 92.62 | 82.55 | 10 |
| `src/games/contig-60` | 92.82 | 86.10 | 6 |

Repo-wide on that run: **94.66%** lines (22356/23616), **87.16%** branches.

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
