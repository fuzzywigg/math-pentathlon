# Unit coverage map (by directory)

Task: `q-mp-075`. Generated `2026-10-09T15:14:47.911Z` from `coverage/coverage-summary.json`.

Per-directory heat table of vitest unit coverage (`json-summary`). Rows are
parent directories under `src/` (for example `src/games/hex` for
`src/games/hex/rules.ts`), sorted by **lines %** ascending so cold spots
surface first. Does not change coverage thresholds or CI.

![Unit coverage by directory](./coverage-map.svg)

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
| `src/core/ai-worker` | 79.66 | 66.67 | 4 |
| `src` | 81.37 | 62.07 | 1 |
| `src/ui/three` | 89.66 | 69.81 | 13 |
| `src/games/kwatro-sinko` | 90.78 | 84.71 | 7 |
| `src/games/juggle` | 91.00 | 85.62 | 6 |
| `src/games/fiar` | 91.29 | 81.62 | 10 |
| `src/ui/owl` | 92.28 | 75.17 | 2 |
| `src/games/pent-em-in` | 92.53 | 85.11 | 7 |

Directories rendered: **38**. Full heat table is in the SVG above.

