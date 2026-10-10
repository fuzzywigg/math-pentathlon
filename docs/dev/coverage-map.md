# Unit coverage map (by directory)

Task: `q-mp-075`. Generated `2026-10-09T22:06:43.747Z` from `coverage/coverage-summary.json`.

Per-directory heat table of vitest unit coverage (`json-summary`). Rows are
parent directories under `src/` (for example `src/games/hex` for
`src/games/hex/rules.ts`), sorted by **lines %** ascending so cold spots
surface first. Does not change coverage thresholds or CI.

![Unit coverage by directory](./coverage-map.svg)

Wiki visual (coldest-directory heat table): [Unit coverage heat map](../wiki/coverage-map.md).

## Regenerate

```bash
npm run test:unit:coverage
npm run report:coverage-map
```

Or point at an existing summary:

```bash
node scripts/report-coverage-map.mjs path/to/coverage-summary.json
```

No network; reads local coverage JSON only. No new npm dependencies.

## Coldest directories (lines %)

| Directory | Lines % | Branches % | Files |
| --- | ---: | ---: | ---: |
| `src/core/ai-worker` | 81.36 | 72.22 | 4 |
| `src` | 81.37 | 60.71 | 1 |
| `src/ui/owl` | 91.88 | 72.86 | 2 |
| `src/games/hex` | 92.83 | 88.16 | 8 |
| `src/games/pent-em-in` | 93.82 | 85.76 | 7 |
| `src/games/par-55` | 93.88 | 85.75 | 6 |
| `src/ui/three` | 93.90 | 79.20 | 13 |
| `src/games/remainder-islands` | 94.00 | 83.99 | 6 |

Directories rendered: **38**. Full heat table is in the SVG above.

